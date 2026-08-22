<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWeatherStore } from '@/stores/weatherStore.js'
import { useConfigStore } from '@/stores/configStore.js'
import { getTempColor } from '@/utils/weatherTheme.js'
import { isNightAt, formatLocalTime } from '@/utils/localTime.js'
import { projectX, projectY, getMapPoint, PROVINCE_BY_CITY } from '@/utils/koreaMap.js'
import KoreaMapStage from '@/components/exercise/KoreaMapStage.vue'
import RollingNumber from '@/components/exercise/RollingNumber.vue'

const router = useRouter()
const weatherStore = useWeatherStore()
const configStore = useConfigStore()

const selectedId = ref('')

// 낮·밤 판정 기준이 되는 "지금". 1분마다 갱신해 일몰을 지나면 지도가 따라 어두워진다
const now = ref(Date.now())
let clock = null

onMounted(async () => {
  if (!weatherStore.hasData) {
    await weatherStore.fetchAll()
  }
  if (!selectedId.value && weatherStore.hasData) {
    selectedId.value = weatherStore.weatherList[0].id
  }
  clock = setInterval(() => (now.value = Date.now()), 60 * 1000)
})
onUnmounted(() => clearInterval(clock))

const convertTemp = (celsius) => {
  if (celsius === null || celsius === undefined) return null
  return configStore.unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius
}

const cityIsNight = (city) => isNightAt(city?.sunrise, city?.sunset, now.value)

// 지도에 올릴 도시 — MAP_POINTS에 없는 도시(사용자가 검색으로 추가한 곳)는 제외한다
const mapCities = computed(() =>
  weatherStore.weatherList.filter((c) => getMapPoint(c.id) && c.lat !== null),
)

const selectedCity = computed(() => weatherStore.weatherList.find((c) => c.id === selectedId.value))

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

const select = (cityId) => (selectedId.value = cityId)
const goDetail = () => selectedId.value && router.push(`/weather/${selectedId.value}`)
</script>

<template>
  <div class="map-page">
    <header class="head">
      <h1 class="title">전국 날씨 지도</h1>
      <p class="caption">시도별 대표 1지점 기준</p>
    </header>

    <div class="body">
      <div class="map-wrap">
        <KoreaMapStage
          :fills="fills"
          :markers="markers"
          :unit="configStore.unitSymbol"
          :active-code="activeCode"
          @select="select"
        />
      </div>

      <aside class="panel">
        <section v-if="selectedCity" class="card summary">
          <p class="sum-label">선택한 지역</p>
          <div class="sum-top">
            <h2 class="sum-name">{{ selectedCity.name }}</h2>
            <span class="sum-temp">
              <RollingNumber :value="convertTemp(selectedCity.temp)" />
              <span class="sum-unit">{{ configStore.unitSymbol }}</span>
            </span>
          </div>
          <p class="sum-status">
            {{ selectedCity.status }}
            <span class="dot">·</span>
            {{ cityIsNight(selectedCity) ? '🌙' : '☀️' }}
            현지 {{ formatLocalTime(selectedCity.timezone, now) }}
          </p>

          <dl class="sum-stats">
            <div><dt>체감</dt><dd><RollingNumber :value="convertTemp(selectedCity.feelsLike)" />{{ configStore.unitSymbol }}</dd></div>
            <div><dt>습도</dt><dd><RollingNumber :value="selectedCity.humidity" />%</dd></div>
            <div><dt>풍속</dt><dd><RollingNumber :value="selectedCity.windSpeed" />m/s</dd></div>
          </dl>

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

.body {
  display: flex;
  gap: var(--sp-6);
  align-items: flex-start;
}

.map-wrap {
  flex: 0 0 520px;
  min-width: 0;
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
