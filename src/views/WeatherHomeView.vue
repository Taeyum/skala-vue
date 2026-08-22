<script setup>
import { ref, computed, watch, watchEffect, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore.js'
import { useFavoriteStore } from '@/stores/favoriteStore.js'
import { useWeatherStore, PRESET_COUNT } from '@/stores/weatherStore.js'
import { useForecastStore } from '@/stores/forecastStore.js'
import { getGradient } from '@/utils/weatherTheme.js'
import { formatLocalTime, formatStamp, isNightAt, describeSlot } from '@/utils/localTime.js'
import WeatherHero from '@/components/exercise/WeatherHero.vue'
import WeatherTile from '@/components/exercise/WeatherTile.vue'
import CityAdder from '@/components/exercise/CityAdder.vue'
import WeatherAnimation from '@/components/exercise/WeatherAnimation.vue'
import CrossfadeBackground from '@/components/exercise/CrossfadeBackground.vue'
import LifeBriefing from '@/components/exercise/LifeBriefing.vue'
import TimeTravelBar from '@/components/exercise/TimeTravelBar.vue'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()
const weatherStore = useWeatherStore()
const forecastStore = useForecastStore()

const searchQuery = ref('')

// 도시별 예보 { city_01: [...40] } — 타임라인이 타일 전부를 바꿔야 해서 전 도시를 받아 둔다
const forecastMap = ref({})
const loadForecasts = async () => {
  const missing = weatherStore.weatherList.filter((c) => !forecastMap.value[c.id])
  const results = await Promise.all(missing.map((c) => forecastStore.fetchForecast(c.id, c.query)))
  missing.forEach((c, i) => (forecastMap.value[c.id] = results[i]))
}

// ── 시간여행 ──
// -1 = 지금(현재 날씨), 0~39 = 선택 도시 예보의 n번째 3시간 구간
const timeIndex = ref(-1)

// 현지 시각·낮밤 판정의 기준 "지금". 1분마다 갱신해 일몰을 지나면 화면이 따라 바뀐다
const now = ref(Date.now())
let clock = null
onMounted(() => {
  clock = setInterval(() => (now.value = Date.now()), 60 * 1000)
})
onUnmounted(() => clearInterval(clock))

const selectedId = ref('')

onMounted(async () => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  if (!weatherStore.hasData) {
    await weatherStore.fetchAll()
  }
  // 진입 시 첫 번째 도시를 자동 선택
  if (!selectedId.value && weatherStore.hasData) {
    selectedId.value = weatherStore.weatherList[0].id
  }
  loadForecasts()
})

// 도시가 추가되면 그 도시 예보도 받는다
watch(
  () => weatherStore.weatherList.length,
  () => loadForecasts(),
)

const filteredList = computed(() =>
  weatherStore.weatherList.filter((item) => item.name.includes(searchQuery.value)),
)

const sortedList = computed(() => {
  // 정렬 기준 온도는 선택 구간 기준 — 시간을 옮기면 타일이 자리를 바꾸며 미끄러진다
  const list = filteredList.value.map(projectCity)
  if (configStore.sortOrder === 'desc') {
    return list.toSorted((a, b) => (b.temp ?? -99) - (a.temp ?? -99))
  }
  if (configStore.sortOrder === 'asc') {
    return list.toSorted((a, b) => (a.temp ?? 99) - (b.temp ?? 99))
  }
  return list
})

const selectedCity = computed(() => weatherStore.weatherList.find((c) => c.id === selectedId.value))

const selectedForecast = computed(() => forecastMap.value[selectedId.value] ?? [])

// 선택한 구간 (없으면 "지금")
const targetSlot = computed(() =>
  timeIndex.value >= 0 ? (selectedForecast.value[timeIndex.value] ?? null) : null,
)
const targetMs = computed(() => (targetSlot.value ? targetSlot.value.dt * 1000 : now.value))

// 도시 객체에 선택 구간의 예보 값을 덮어씌운 "그 시각의 도시"
// 컴포넌트(WeatherHero·WeatherTile)는 지금인지 예보인지 모른 채 받은 대로 그린다
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

const shownCity = computed(() => projectCity(selectedCity.value))
const shownList = sortedList

// 브리핑은 선택 구간부터의 예보로 계산 (지금이면 전체)
const shownForecast = computed(() =>
  timeIndex.value >= 0 ? selectedForecast.value.slice(timeIndex.value) : selectedForecast.value,
)

const heroLabel = computed(() => {
  if (!targetSlot.value) return '현재 선택한 지역'
  const d = describeSlot(targetSlot.value.dt, selectedCity.value?.timezone ?? 0, now.value)
  return `${d.day} ${d.time} 예보`
})

// 낮밤은 "그 시각" 기준 — 일몰 뒤 구간으로 드래그하면 화면이 밤이 된다
const selectedIsNight = computed(() =>
  isNightAt(selectedCity.value?.sunrise, selectedCity.value?.sunset, targetMs.value),
)
const tileIsNight = (city) => isNightAt(city?.sunrise, city?.sunset, targetMs.value)

const backgroundGradient = computed(() => getGradient(shownCity.value?.main, selectedIsNight.value))

const convertTemp = (celsius) => {
  if (celsius === null || celsius === undefined) return null
  return configStore.unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius
}

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

watch(searchQuery, (newQuery) => {
  router.replace({ query: newQuery ? { search: newQuery } : {} })
})

const handleSelect = (city) => {
  selectedId.value = city.id
}

const handleDetail = (city) => {
  router.push(`/weather/${city.id}`)
}

const handleRemove = (cityId) => {
  weatherStore.removeCity(cityId)
  if (selectedId.value === cityId) {
    selectedId.value = weatherStore.weatherList[0]?.id ?? ''
  }
  if (favoriteStore.isFavorite(cityId)) {
    favoriteStore.toggleFavorite(cityId)
  }
}
</script>

<template>
  <div class="dashboard">
    <CrossfadeBackground :background="backgroundGradient" />
    <WeatherAnimation :main="shownCity?.main" :night="selectedIsNight" />
    <!-- ① 히어로 — 도시가 바뀔 때만 스왑, 시간여행은 key가 같아 숫자만 흐른다 -->
    <Transition name="hero-swap" mode="out-in">
      <div v-if="weatherStore.isLoading" class="skel skel-hero"></div>
      <WeatherHero
        v-else
        :key="selectedId"
        :city="shownCity"
        :display-temp="convertTemp(shownCity?.temp)"
        :unit="configStore.unitSymbol"
        :label="heroLabel"
        :local-time="formatLocalTime(selectedCity?.timezone, targetMs)"
        :sunrise="formatStamp(selectedCity?.sunrise, selectedCity?.timezone)"
        :sunset="formatStamp(selectedCity?.sunset, selectedCity?.timezone)"
        :night="selectedIsNight"
      >
        <template #extra>
          <LifeBriefing :city="shownCity" :forecast="shownForecast" mode="hero" />
        </template>
        <!-- 시간여행 스트립: 히어로 카드 하단 -->
        <template #footer>
          <TimeTravelBar
            v-model="timeIndex"
            :slots="selectedForecast"
            :timezone="selectedCity?.timezone ?? 0"
            :current="selectedCity"
            :convert-temp="convertTemp"
          />
        </template>
      </WeatherHero>
    </Transition>

    <!-- ② 툴바 -->
    <div class="toolbar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          :value="searchQuery"
          @input="(e) => (searchQuery = e.target.value)"
          placeholder="지역 검색"
        />
      </div>

      <CityAdder class="adder" />

      <button class="btn-sort" @click="configStore.toggleSort">
        {{ configStore.sortLabel }}
      </button>
    </div>

    <!-- ③ 상태 표시 — 로딩 중에는 실물 크기의 스켈레톤으로 자리를 잡아 둔다 -->
    <div v-if="weatherStore.isLoading" class="tile-grid">
      <div v-for="n in PRESET_COUNT" :key="n" class="skel skel-tile"></div>
    </div>
    <p v-else-if="weatherStore.errorMessage" class="state-msg error">
      {{ weatherStore.errorMessage }}
    </p>

    <!-- ④ 타일 그리드 -->
    <TransitionGroup v-else name="tile" tag="div" class="tile-grid" appear>
      <WeatherTile
        v-for="item in shownList"
        :key="item.id"
        :city="item"
        :display-temp="convertTemp(item.temp)"
        :unit="configStore.unitSymbol"
        :is-selected="selectedId === item.id"
        :is-favorite="favoriteStore.isFavorite(item.id)"
        :night="tileIsNight(item)"
        :can-remove="!weatherStore.isPreset(item.id)"
        @select="handleSelect"
        @detail="handleDetail"
        @toggle-favorite="favoriteStore.toggleFavorite"
        @remove="handleRemove"
      />
    </TransitionGroup>

    <p v-if="!weatherStore.isLoading && sortedList.length === 0" class="state-msg">
      검색 결과와 일치하는 지역이 없습니다.
    </p>
  </div>
</template>

<style scoped>
.dashboard {
  position: relative;
  /* 배경 레이어(z-index: -1)가 이 카드 뒤로 빠지지 않게 스태킹 컨텍스트를 고정 */
  isolation: isolate;
  padding: var(--sp-6);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-md);
}

/* ── 툴바 ── */
.toolbar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: var(--sp-3);
  margin: var(--sp-5) 0;
}

.search-box {
  flex: 0 0 260px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--fs-body);
}

/* 필터용 입력 — 도시 추가(강한 입력)와 구분되도록 테두리 없이 낮은 톤 */
.search-box input {
  width: 100%;
  padding: 11px 14px 11px 38px;
  border: 1px solid transparent;
  border-radius: var(--r-md);
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  color: var(--c-text);
  font-size: var(--fs-body);
  box-sizing: border-box;
  transition:
    background 0.2s,
    border-color 0.2s;
}

.search-box input::placeholder {
  color: rgba(44, 62, 80, 0.55);
}

.search-box input:hover {
  background: rgba(255, 255, 255, 0.6);
}

.search-box input:focus {
  outline: none;
  background: var(--surface);
  border-color: var(--c-primary);
}

.adder {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.btn-sort {
  margin-left: auto;
  padding: 11px 18px;
  border: 1px solid var(--surface-border);
  border-radius: var(--r-md);
  background: var(--surface);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  color: var(--c-text);
  font-size: var(--fs-body);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-sort:hover {
  background: #fff;
}

/* ── 타일 그리드 ── */
.tile-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--sp-4);
}

/* ── 로딩 스켈레톤 ── */
.skel {
  position: relative;
  overflow: hidden;
  border-radius: var(--r-lg);
  background: rgba(255, 255, 255, 0.14);
}

/* 반짝임은 transform만 사용 — layout 비용 없음 */
.skel::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.22), transparent);
  animation: shimmer 1.4s var(--ease-in-out) infinite;
}

@keyframes shimmer {
  to {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .skel::after {
    animation: none;
  }
}

/* 실물 높이와 맞춰 데이터 도착 시 레이아웃 점프를 막는다 */
.skel-hero {
  min-height: 515px;
}

.skel-tile {
  height: 281px;
}

/* ── 히어로 스왑: 이전 도시는 위로 짧게 물러나고, 새 도시는 아래에서 길게 안착 ── */
.hero-swap-leave-active {
  transition:
    opacity var(--dur-2) var(--ease-in-out),
    transform var(--dur-2) var(--ease-in-out);
}

.hero-swap-enter-active {
  transition:
    opacity var(--dur-3) var(--ease-emphasized),
    transform var(--dur-3) var(--ease-emphasized);
}

.hero-swap-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.99);
}

.hero-swap-enter-from {
  opacity: 0;
  transform: translateY(14px) scale(0.985);
}

/* ── TransitionGroup 애니메이션 ── */
.tile-move,
.tile-enter-active,
.tile-leave-active {
  transition:
    transform var(--dur-3) var(--ease-in-out),
    opacity var(--dur-3) var(--ease-in-out);
}

.tile-enter-from,
.tile-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.tile-leave-active {
  position: absolute;
}

.state-msg {
  position: relative;
  z-index: 1;
  padding: var(--sp-10);
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
}

.state-msg.error {
  color: #ffe0e0;
}
</style>
