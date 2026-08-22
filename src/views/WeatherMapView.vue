<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWeatherStore } from '@/stores/weatherStore.js'
import { useConfigStore } from '@/stores/configStore.js'
import { useForecastStore } from '@/stores/forecastStore.js'
import { getTempColor, getWindColor } from '@/utils/weatherTheme.js'
import { isNightAt, formatLocalTime, describeSlot } from '@/utils/localTime.js'
import {
  projectX,
  projectY,
  getMapPoint,
  PROVINCE_BY_CITY,
  ARROW_CELLS,
  VIEW_W,
  VIEW_H,
} from '@/utils/koreaMap.js'
import { toScreenVector, toBearing, speedOf, sampleWind } from '@/utils/windField.js'
import KoreaMapStage from '@/components/exercise/KoreaMapStage.vue'
import MapLegend from '@/components/exercise/MapLegend.vue'
import TimeTravelBar from '@/components/exercise/TimeTravelBar.vue'
import RollingNumber from '@/components/exercise/RollingNumber.vue'

const router = useRouter()
const weatherStore = useWeatherStore()
const configStore = useConfigStore()
const forecastStore = useForecastStore()

const selectedId = ref('')

// 낮·밤 판정 기준이 되는 "지금". 1분마다 갱신해 일몰을 지나면 지도가 따라 어두워진다
const now = ref(Date.now())
let clock = null

// 도시별 예보. 시간여행이 지도 전체를 바꿔야 하므로 전 도시를 미리 받아 둔다
// (forecastStore가 도시별로 캐싱하므로 홈을 거쳐 왔다면 추가 호출이 없다)
const forecastMap = ref({})
const loadForecasts = async () => {
  const missing = weatherStore.weatherList.filter((c) => !forecastMap.value[c.id])
  const results = await Promise.all(missing.map((c) => forecastStore.fetchForecast(c.id, c.query)))
  missing.forEach((c, i) => (forecastMap.value[c.id] = results[i]))
}

// -1 = 지금(현재 날씨), 0~39 = 선택 도시 예보의 n번째 3시간 구간
const timeIndex = ref(-1)

onMounted(async () => {
  if (!weatherStore.hasData) {
    await weatherStore.fetchAll()
  }
  if (!selectedId.value && weatherStore.hasData) {
    selectedId.value = weatherStore.weatherList[0].id
  }
  clock = setInterval(() => (now.value = Date.now()), 60 * 1000)
  loadForecasts()
})
onUnmounted(() => clearInterval(clock))

watch(
  () => weatherStore.weatherList.length,
  () => loadForecasts(),
)

const convertTemp = (celsius) => {
  if (celsius === null || celsius === undefined) return null
  return configStore.unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius
}

const selectedCity = computed(() => weatherStore.weatherList.find((c) => c.id === selectedId.value))
const selectedForecast = computed(() => forecastMap.value[selectedId.value] ?? [])

// 선택한 구간 (없으면 "지금")
const targetSlot = computed(() =>
  timeIndex.value >= 0 ? (selectedForecast.value[timeIndex.value] ?? null) : null,
)
const targetMs = computed(() => (targetSlot.value ? targetSlot.value.dt * 1000 : now.value))

// 도시 객체에 선택 구간의 예보를 덮어씌운 "그 시각의 도시".
// lat·lon·timezone은 그대로 남으므로 마커 위치가 흔들리지 않는다
const projectCity = (city) => {
  if (!city || !targetSlot.value) return city
  const slot = (forecastMap.value[city.id] ?? []).find((f) => f.dt === targetSlot.value.dt)
  if (!slot) return city
  return {
    ...city,
    temp: slot.temp,
    feelsLike: slot.feelsLike,
    status: slot.status,
    icon: slot.icon,
    main: slot.main,
    humidity: slot.humidity,
    windSpeed: slot.windSpeed,
    windDeg: slot.windDeg ?? city.windDeg,
    clouds: slot.clouds ?? city.clouds,
  }
}

const cityIsNight = (city) => isNightAt(city?.sunrise, city?.sunset, targetMs.value)

// 지도에 올릴 도시 — MAP_POINTS에 없는 도시(사용자가 검색으로 추가한 곳)는 제외한다
const mapCities = computed(() =>
  weatherStore.weatherList.filter((c) => getMapPoint(c.id) && c.lat !== null).map(projectCity),
)

const shownCity = computed(() => projectCity(selectedCity.value))

const timeLabel = computed(() => {
  if (!targetSlot.value) return '지금'
  const d = describeSlot(targetSlot.value.dt, selectedCity.value?.timezone ?? 0, now.value)
  return `${d.day} ${d.time}`
})

const activeCode = computed(() => PROVINCE_BY_CITY[selectedId.value] ?? '')

const markers = computed(() =>
  mapCities.value.map((city) => {
    const pt = getMapPoint(city.id)
    return {
      id: city.id,
      name: city.name,
      x: projectX(city.lon),
      y: projectY(city.lat),
      dx: pt.offset[0],
      dy: pt.offset[1],
      temp: convertTemp(city.temp),
      icon: city.icon,
      selected: city.id === selectedId.value,
      night: cityIsNight(city),
    }
  }),
)

// 시도 채색 — 17개 지점뿐이라 각 시도에 그 시도 대표 도시의 온도를 그대로 칠한다
const fills = computed(() => {
  const map = {}
  for (const city of mapCities.value) {
    map[PROVINCE_BY_CITY[city.id]] = getTempColor(city.temp, cityIsNight(city))
  }
  return map
})

const ranking = computed(() =>
  mapCities.value.toSorted((a, b) => (b.temp ?? -99) - (a.temp ?? -99)),
)

// ── 바람 ──
const showWind = ref(true)

// 관측 지점을 화면 벡터로 미리 바꿔 둔다.
// 이후 계산에서는 삼각함수를 다시 쓰지 않는다
const stations = computed(() =>
  mapCities.value
    .filter((c) => c.windSpeed !== null && c.windDeg !== null)
    .map((c) => ({
      x: projectX(c.lon),
      y: projectY(c.lat),
      ...toScreenVector(c.windSpeed, c.windDeg),
    })),
)

const arrows = computed(() => {
  if (!showWind.value || stations.value.length === 0) return []
  return ARROW_CELLS.map((cell) => {
    const { sx, sy } = sampleWind(stations.value, cell.x, cell.y)
    return {
      x: cell.x,
      y: cell.y,
      bearing: toBearing(sx, sy),
      color: getWindColor(speedOf(sx, sy)),
    }
  })
})

// 선택 도시의 풍향 — 화살표와 같은 규칙으로 돌려야 둘이 어긋나지 않는다
const selectedWind = computed(() => {
  const c = shownCity.value
  if (!c || c.windSpeed === null || c.windDeg === null) return null
  const v = toScreenVector(c.windSpeed, c.windDeg)
  return { bearing: toBearing(v.sx, v.sy), speed: c.windSpeed }
})

const select = (cityId) => (selectedId.value = cityId)
const goDetail = () => selectedId.value && router.push(`/weather/${selectedId.value}`)
</script>

<template>
  <div class="map-page">
    <header class="head">
      <h1 class="title">전국 날씨 지도</h1>
      <p class="caption">시도별 대표 1지점 기준</p>
      <span class="stamp">기준 {{ timeLabel }}</span>
      <button class="toggle" :class="{ on: showWind }" :aria-pressed="showWind" @click="showWind = !showWind">
        바람
      </button>
    </header>

    <div class="body">
      <div class="map-wrap">
        <KoreaMapStage
          :fills="fills"
          :markers="markers"
          :unit="configStore.unitSymbol"
          :arrows="arrows"
          :active-code="activeCode"
          @select="select"
        />

        <MapLegend
          :unit="configStore.unitSymbol"
          :convert-temp="convertTemp"
          :show-wind="showWind"
          class="legend-row"
        />
      </div>

      <aside class="panel">
        <section v-if="shownCity" class="card summary">
          <p class="sum-label">선택한 지역</p>
          <div class="sum-top">
            <h2 class="sum-name">{{ shownCity.name }}</h2>
            <span class="sum-temp">
              <RollingNumber :value="convertTemp(shownCity.temp)" />
              <span class="sum-unit">{{ configStore.unitSymbol }}</span>
            </span>
          </div>
          <p class="sum-status">
            {{ shownCity.status }}
            <span class="dot">·</span>
            {{ cityIsNight(shownCity) ? '🌙' : '☀️' }}
            현지 {{ formatLocalTime(shownCity.timezone, targetMs) }}
          </p>

          <dl class="sum-stats">
            <div><dt>체감</dt><dd><RollingNumber :value="convertTemp(shownCity.feelsLike)" />{{ configStore.unitSymbol }}</dd></div>
            <div><dt>습도</dt><dd><RollingNumber :value="shownCity.humidity" />%</dd></div>
            <div><dt>풍속</dt><dd><RollingNumber :value="shownCity.windSpeed" />m/s</dd></div>
          </dl>

          <!-- 지도 화살표와 같은 각도를 쓰므로 둘이 늘 같은 방향을 가리킨다 -->
          <div v-if="selectedWind" class="wind-row">
            <svg class="compass" viewBox="-14 -14 28 28" aria-hidden="true">
              <circle r="12" fill="none" stroke="rgba(255,255,255,0.25)" />
              <g :style="{ transform: `rotate(${selectedWind.bearing}deg)` }" class="needle">
                <path d="M0,-8 L0,7" stroke="#fff" stroke-width="1.8" stroke-linecap="round" />
                <path d="M-3,-4 L0,-9 L3,-4" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round" />
              </g>
            </svg>
            <span class="wind-text">바람이 가는 방향 · {{ Math.round(selectedWind.speed) }}m/s</span>
          </div>

          <button class="btn-detail" @click="goDetail">상세보기 →</button>
        </section>

        <section class="card rank">
          <h3 class="rank-title">기온 순위</h3>
          <ul class="rank-list">
            <li
              v-for="(city, i) in ranking"
              :key="city.id"
              :class="{ selected: city.id === selectedId }"
              @click="select(city.id)"
            >
              <span class="rank-no">{{ i + 1 }}</span>
              <span class="rank-swatch" :style="{ background: getTempColor(city.temp, cityIsNight(city)) }"></span>
              <span class="rank-name">{{ city.name }}</span>
              <span class="rank-temp">
                <RollingNumber :value="convertTemp(city.temp)" />{{ configStore.unitSymbol }}
              </span>
            </li>
          </ul>
        </section>
      </aside>
    </div>

    <!-- 시간여행: 칩을 고르면 지도 전체가 그 시각의 예보로 바뀐다 -->
    <TimeTravelBar
      v-model="timeIndex"
      :slots="selectedForecast"
      :timezone="selectedCity?.timezone ?? 0"
      :current="selectedCity"
      :convert-temp="convertTemp"
      class="travel"
    />
  </div>
</template>

<style scoped>
.map-page {
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
  padding: var(--sp-6);
  border-radius: var(--r-lg);
  /* 어두운 배경 위에서 카드가 떠 보이도록 검정이 아니라 흰색을 옅게 얹는다 */
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  box-shadow: var(--shadow-md);
}

.head {
  display: flex;
  align-items: baseline;
  gap: var(--sp-3);
}

.title {
  margin: 0;
  font-size: var(--fs-h1);
  font-weight: 700;
  color: #fff;
}

.caption {
  margin: 0;
  font-size: var(--fs-xs);
  color: rgba(255, 255, 255, 0.6);
}

.stamp {
  margin-left: auto;
  padding: 4px 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.08);
  font-size: var(--fs-xs);
  font-weight: 600;
  color: #fff;
}

.body {
  display: flex;
  gap: var(--sp-6);
  align-items: flex-start;
}

.map-wrap {
  flex: 0 0 520px;
  min-width: 0;
}

.legend-row {
  margin-top: var(--sp-3);
}

.toggle {
  padding: 4px 12px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: var(--r-pill);
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--fs-xs);
  font-weight: 600;
  cursor: pointer;
  transition:
    background var(--dur-2) var(--ease-out),
    color var(--dur-2) var(--ease-out),
    border-color var(--dur-2) var(--ease-out);
}

.toggle.on {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}

.toggle:active {
  transform: scale(0.96);
  transition-duration: var(--dur-1);
}

.wind-row {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin-bottom: var(--sp-4);
  font-size: var(--fs-xs);
  color: rgba(255, 255, 255, 0.75);
}

.compass {
  width: 30px;
  height: 30px;
  flex: none;
}

.needle {
  transform-origin: center;
  transition: transform var(--dur-3) var(--ease-in-out);
}

.travel {
  padding: var(--sp-3) var(--sp-4) var(--sp-2);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: var(--r-md);
  background: rgba(0, 0, 0, 0.22);
}

.panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.card {
  padding: var(--sp-5);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--r-md);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.sum-label {
  margin: 0;
  font-size: var(--fs-xs);
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 1px;
}

.sum-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--sp-3);
  margin: var(--sp-1) 0 var(--sp-1);
}

.sum-name {
  margin: 0;
  font-size: var(--fs-h1);
  font-weight: 700;
}

.sum-temp {
  font-size: 40px;
  font-weight: 700;
  line-height: 1;
}

.sum-unit {
  font-size: 20px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.75);
}

.sum-status {
  margin: 0 0 var(--sp-4);
  font-size: var(--fs-sm);
  color: rgba(255, 255, 255, 0.85);
}

.dot {
  margin: 0 4px;
  color: rgba(255, 255, 255, 0.45);
}

.sum-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-3);
  margin: 0 0 var(--sp-4);
}

.sum-stats dt {
  font-size: var(--fs-xs);
  color: rgba(255, 255, 255, 0.6);
}

.sum-stats dd {
  margin: 2px 0 0;
  font-size: var(--fs-h2);
  font-weight: 700;
}

.btn-detail {
  width: 100%;
  padding: 9px;
  border: none;
  border-radius: var(--r-sm);
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  font-size: var(--fs-sm);
  font-weight: 600;
  cursor: pointer;
  transition:
    background var(--dur-2) var(--ease-out),
    transform var(--dur-2) var(--ease-out);
}

.btn-detail:hover {
  background: rgba(255, 255, 255, 0.24);
}

.btn-detail:active {
  transform: scale(0.98);
  transition-duration: var(--dur-1);
}

.rank-title {
  margin: 0 0 var(--sp-3);
  font-size: var(--fs-h2);
  font-weight: 700;
}

.rank-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rank-list li {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 5px var(--sp-2);
  border-radius: var(--r-sm);
  font-size: var(--fs-sm);
  cursor: pointer;
  transition: background var(--dur-2) var(--ease-out);
}

.rank-list li:hover {
  background: rgba(255, 255, 255, 0.1);
}

.rank-list li.selected {
  background: rgba(52, 152, 219, 0.32);
}

.rank-no {
  width: 18px;
  font-size: var(--fs-xs);
  color: rgba(255, 255, 255, 0.5);
  font-variant-numeric: tabular-nums;
}

.rank-swatch {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  transition: background var(--dur-3) var(--ease-in-out);
}

.rank-name {
  flex: 1;
}

.rank-temp {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 900px) {
  .body {
    flex-direction: column;
  }

  .map-wrap {
    flex: 1 1 auto;
    width: 100%;
    max-width: 520px;
  }
}
</style>
