<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useWeatherStore } from '@/stores/weatherStore.js'
import { useConfigStore } from '@/stores/configStore.js'
import { usePhotoStore } from '@/stores/photoStore.js'
import { useVideoStore } from '@/stores/videoStore.js'
import { getPexelsQuery } from '@/utils/weatherTheme.js'
import { formatLocalTime, formatLocalDate, getSunPhase } from '@/utils/localTime.js'
import { useForecastStore } from '@/stores/forecastStore.js'
import { useAirStore } from '@/stores/airStore.js'
import ForecastChart from '@/components/exercise/ForecastChart.vue'
import WeatherAnimation from '@/components/exercise/WeatherAnimation.vue'
import LifeBriefing from '@/components/exercise/LifeBriefing.vue'

const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()
const configStore = useConfigStore()
const photoStore = usePhotoStore()
const photo = ref(null)
const videoStore = useVideoStore()
// 배경 영상 레이어 목록. 새 영상은 재생 준비가 끝난 뒤 이전 영상 위로 페이드인하고,
// 전환이 끝나면 아래 레이어를 지운다 (도시 전환 시 사진이 끼어드는 깜빡임 방지)
const videoLayers = ref([])
const currentVideo = computed(() => videoLayers.value.findLast((l) => l.ready) ?? null)
const forecastStore = useForecastStore()
const forecastList = ref([])
const airStore = useAirStore()
const air = ref(null)

// 홈에서 이미 받아둔 데이터를 스토어에서 조회 (7장 Pinia)
const city = computed(() => weatherStore.findById(route.params.cityId))

// 표시 온도 (자료 p.212 형태)
const displayTemp = computed(() => {
  const rawTemp = city.value?.temp
  if (rawTemp === null || rawTemp === undefined) return null
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

const iconUrl = computed(() =>
  city.value?.icon ? `https://openweathermap.org/img/wn/${city.value.icon}@2x.png` : null,
)

// 기준 "지금" — 1분마다 갱신해 현지 시각·일몰 카운트다운이 움직이게 한다
const now = ref(Date.now())
let clock = null
onMounted(() => {
  clock = setInterval(() => (now.value = Date.now()), 60 * 1000)
})
onUnmounted(() => clearInterval(clock))

// 도시 현지 날짜·시각 (내 PC 시각이 아니라 그 도시의 시각)
const today = computed(() => {
  const tz = city.value?.timezone
  const date = formatLocalDate(tz, now.value)
  const time = formatLocalTime(tz, now.value)
  return date && time ? `${date} · ${time}` : ''
})

// 해·달 상태: 낮/밤, 다음 이벤트까지 남은 시간, 궤적 진행률
const sun = computed(() =>
  getSunPhase(city.value?.sunrise, city.value?.sunset, city.value?.timezone, now.value),
)
const night = computed(() => sun.value?.night ?? false)

const goDetail = (cityId) => {
  router.push({ name: 'WeatherDetail', params: { cityId } })
}

// "다른 지역 보기" — 도시가 늘어나도 목록이 길어지지 않도록 6개씩 페이지로 나눈다
const PAGE_SIZE = 6
const cityPage = ref(0)
const pageCount = computed(() =>
  Math.max(1, Math.ceil(weatherStore.weatherList.length / PAGE_SIZE)),
)
const pagedCities = computed(() =>
  weatherStore.weatherList.slice(cityPage.value * PAGE_SIZE, (cityPage.value + 1) * PAGE_SIZE),
)
const prevPage = () => {
  cityPage.value = (cityPage.value - 1 + pageCount.value) % pageCount.value
}
const nextPage = () => {
  cityPage.value = (cityPage.value + 1) % pageCount.value
}

// 현재 도시가 있는 페이지를 자동으로 펼친다 (도시 전환·새로고침 직후 포함)
watch(
  [() => route.params.cityId, () => weatherStore.weatherList.length],
  () => {
    const idx = weatherStore.weatherList.findIndex((c) => c.id === route.params.cityId)
    if (idx >= 0) cityPage.value = Math.floor(idx / PAGE_SIZE)
  },
  { immediate: true },
)

// 도시가 바뀌면 날씨에 맞는 배경 이미지·영상을 다시 조회
// 이미지를 먼저 띄우고, 영상은 준비되는 대로 그 위에 페이드인한다
watch(
  [() => city.value?.main, night],
  async ([main, isNightNow]) => {
    if (!main) return
    const query = getPexelsQuery(main, isNightNow)
    // 이미지와 영상은 서로 의존이 없으므로 동시에 요청
    const [nextPhoto, nextVideo] = await Promise.all([
      photoStore.fetchPhoto(query),
      videoStore.fetchVideo(query),
    ])
    photo.value = nextPhoto

    // 영상이 없는 날씨면 이전 영상을 걷어내고 이미지만 보여준다
    if (!nextVideo) {
      videoLayers.value = []
      return
    }
    // 같은 영상이면 끊지 않고 계속 재생
    if (videoLayers.value.at(-1)?.url === nextVideo.url) return
    videoLayers.value.push({ ...nextVideo, ready: false })
  },
  { immediate: true },
)

// 재생 준비가 끝난 레이어만 페이드인
const onVideoReady = (layer) => {
  layer.ready = true
}

// 페이드인이 끝나면 그 아래 깔려 있던 이전 레이어를 제거
const pruneBelow = (layer) => {
  const idx = videoLayers.value.indexOf(layer)
  if (idx > 0) videoLayers.value.splice(0, idx)
}

// 도시가 바뀌면 예보를 다시 조회
watch(
  () => city.value?.id,
  async (id) => {
    if (!id) return
    forecastList.value = await forecastStore.fetchForecast(id, city.value.query)
    air.value = await airStore.fetchAir(id, city.value.lat, city.value.lon)
  },
  { immediate: true },
)

// 배경 스타일
const heroStyle = computed(() =>
  photo.value ? { backgroundImage: `url(${photo.value.url})` } : {},
)

// 새로고침으로 상세 페이지에 직접 진입한 경우 데이터가 없으므로 조회
onMounted(() => {
  if (!weatherStore.hasData) {
    weatherStore.fetchAll()
  }
})
</script>

<template>
  <div class="detail-layout">
    <!-- ── 좌측: 히어로 영역 ── -->
    <section class="hero" :style="heroStyle">
      <!-- 배경 영상: 이미지 위에 깔리고 재생 준비되면 페이드인 -->
      <video
        v-for="layer in videoLayers"
        :key="layer.url"
        :src="layer.url"
        class="hero-video"
        :class="{ 'is-ready': layer.ready }"
        autoplay
        muted
        loop
        playsinline
        @canplay="onVideoReady(layer)"
        @transitionend="pruneBelow(layer)"
      ></video>
      <div class="hero-overlay"></div>
      <WeatherAnimation :main="city?.main" :night="night" />

      <RouterLink to="/" class="back-btn">
        <span class="back-arrow" aria-hidden="true">←</span>
        대시보드
      </RouterLink>

      <div v-if="city" class="hero-bottom">
        <div class="temp-row">
          <span class="temp-big">{{ displayTemp ?? '--' }}<span class="deg">°</span></span>
          <div class="city-info">
            <h2>{{ city.name }}</h2>
            <p class="date">{{ today }}</p>
            <div v-if="sun" class="sun-phase" :class="{ night: sun.night }">
              <div class="sun-track">
                <span class="sun-marker" :style="{ left: sun.progress * 100 + '%' }">
                  {{ sun.night ? '🌙' : '☀️' }}
                </span>
              </div>
              <span class="sun-text">
                {{ sun.nextEvent === 'sunset' ? '일몰' : '일출' }}까지 {{ sun.remaining }}
              </span>
            </div>
          </div>
          <div class="icon-box">
            <img v-if="iconUrl" :src="iconUrl" alt="" />
            <p class="status">{{ city.status }}</p>
          </div>
        </div>
      </div>

      <div v-else class="hero-bottom">
        <p class="not-found">해당 지역의 관측 정보를 찾을 수 없습니다.</p>
      </div>

      <!-- 시간별 예보 -->
      <ForecastChart v-if="city" :list="forecastList" class="forecast-area" />

      <!-- Pexels 가이드라인: 크레딧 표기 (영상이 재생 중이면 영상 제작자, 아니면 사진작가) -->
      <a
        v-if="currentVideo"
        :href="currentVideo.link"
        target="_blank"
        rel="noopener"
        class="credit"
      >
        Video by {{ currentVideo.author }} on Pexels
      </a>
      <a v-else-if="photo" :href="photo.link" target="_blank" rel="noopener" class="credit">
        Photo by {{ photo.photographer }} on Pexels
      </a>
    </section>

    <!-- ── 우측: 정보 패널 ── -->
    <aside class="panel">
      <div class="panel-block">
        <div class="panel-head">
          <h3 class="panel-title">다른 지역 보기</h3>
          <div v-if="pageCount > 1" class="pager">
            <button class="pager-btn" aria-label="이전" @click="prevPage">‹</button>
            <span class="pager-info">{{ cityPage + 1 }} / {{ pageCount }}</span>
            <button class="pager-btn" aria-label="다음" @click="nextPage">›</button>
          </div>
        </div>
        <ul class="city-list">
          <li
            v-for="item in pagedCities"
            :key="item.id"
            :class="{ active: item.id === route.params.cityId }"
            @click="goDetail(item.id)"
          >
            <span class="city-name">{{ item.name }}</span>
            <span class="city-temp">{{ item.temp ?? '--' }}°</span>
          </li>
        </ul>
      </div>

      <div v-if="city" class="panel-block">
        <h3 class="panel-title">생활 브리핑</h3>
        <LifeBriefing :city="city" :forecast="forecastList" :air="air" />
      </div>

      <div v-if="city" class="panel-block">
        <h3 class="panel-title">상세 정보</h3>
        <dl class="detail-list">
          <div class="detail-row">
            <dt>기온</dt>
            <dd>{{ displayTemp ?? '--' }}{{ configStore.unitSymbol }}</dd>
          </div>
          <div class="detail-row">
            <dt>날씨</dt>
            <dd>{{ city.status }}</dd>
          </div>
          <div class="detail-row">
            <dt>구름</dt>
            <dd>{{ city.clouds ?? '--' }}%</dd>
          </div>
          <div class="detail-row">
            <dt>습도</dt>
            <dd>{{ city.humidity ?? '--' }}%</dd>
          </div>
          <div class="detail-row">
            <dt>풍속</dt>
            <dd>{{ city.windSpeed ?? '--' }}m/s</dd>
          </div>
          <div v-if="sun" class="detail-row">
            <dt>일출</dt>
            <dd>{{ sun.sunriseText }}</dd>
          </div>
          <div v-if="sun" class="detail-row">
            <dt>일몰</dt>
            <dd>{{ sun.sunsetText }}</dd>
          </div>
        </dl>
      </div>
      <div v-if="air" class="panel-block">
        <h3 class="panel-title">대기질</h3>
        <div class="air-badge" :style="{ background: air.color }">
          {{ air.label }}
        </div>
        <dl class="detail-list">
          <div class="detail-row">
            <dt>미세먼지 (PM10)</dt>
            <dd>{{ air.pm10 }}㎍/㎥</dd>
          </div>
          <div class="detail-row">
            <dt>초미세먼지 (PM2.5)</dt>
            <dd>{{ air.pm25 }}㎍/㎥</dd>
          </div>
        </dl>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.detail-layout {
  display: flex;
  min-height: 560px;
  border-radius: var(--r-lg);
  overflow: hidden;
  background: #2c3e50;
  box-shadow: var(--shadow-md);
}

/* ── 좌측 히어로 ── */
.hero {
  position: relative;
  flex: 1 1 62%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: var(--sp-6);
  background: linear-gradient(160deg, #4a5568, #2d3748);
  background-size: cover;
  background-position: center;
  transition: background-image 0.5s ease;
  color: #fff;
}

.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.8s ease;
  pointer-events: none;
}

.hero-video.is-ready {
  opacity: 1;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.15));
  pointer-events: none;
}

.hero-bottom {
  position: relative;
  z-index: 1;
  margin-top: auto;
}

/* 좌상단 뒤로가기 — 사진 밝기와 무관하게 보이도록 유리 pill 형태 */
.back-btn {
  position: absolute;
  top: var(--sp-4);
  left: var(--sp-4);
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: var(--sp-2) 14px var(--sp-2) var(--sp-3);
  border: 1px solid var(--surface-dark-border);
  border-radius: var(--r-pill);
  background: var(--surface-dark);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  color: #fff;
  font-size: var(--fs-sm);
  font-weight: 600;
  text-decoration: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  transition:
    background 0.2s,
    transform 0.2s;
}

.back-btn:hover {
  background: rgba(0, 0, 0, 0.55);
  transform: translateX(-2px);
}

.back-arrow {
  font-size: 15px;
  line-height: 1;
}

.temp-row {
  display: flex;
  align-items: flex-end;
  gap: var(--sp-4);
}

.temp-big {
  font-size: 96px;
  font-weight: 700;
  line-height: 1;
}

.deg {
  font-size: 48px;
  font-weight: 300;
}

.city-info h2 {
  margin: 0;
  font-size: 40px;
  font-weight: 400;
  color: #fff;
}

.date {
  margin: var(--sp-1) 0 0;
  font-size: var(--fs-sm);
  color: rgba(255, 255, 255, 0.75);
}

/* 해·달 궤적 — 일출에서 일몰(밤엔 일몰에서 일출)까지 어디쯤인지 */
.sun-phase {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.sun-track {
  position: relative;
  width: 120px;
  height: 2px;
  border-radius: 1px;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.7),
    rgba(255, 255, 255, 0.2)
  );
}

.sun-marker {
  position: absolute;
  top: 50%;
  font-size: 13px;
  line-height: 1;
  transform: translate(-50%, -50%);
  filter: drop-shadow(0 0 4px rgba(255, 230, 150, 0.8));
  transition: left 1s ease;
}

.sun-phase.night .sun-marker {
  filter: drop-shadow(0 0 4px rgba(220, 230, 255, 0.8));
}

.sun-text {
  font-size: var(--fs-xs);
  color: rgba(255, 255, 255, 0.75);
  font-variant-numeric: tabular-nums;
}

.icon-box {
  text-align: center;
}

.icon-box img {
  width: 64px;
  height: 64px;
}

.status {
  margin: 0;
  font-size: var(--fs-body);
  color: rgba(255, 255, 255, 0.85);
}

.not-found {
  color: rgba(255, 255, 255, 0.8);
}

.credit {
  position: absolute;
  right: var(--sp-3);
  bottom: var(--sp-2);
  z-index: 1;
  font-size: var(--fs-xs);
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
}

.credit:hover {
  color: rgba(255, 255, 255, 0.9);
}

/* ── 우측 패널 ── */
.panel {
  flex: 0 0 38%;
  padding: var(--sp-6);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
}

.panel-title {
  margin: 0 0 var(--sp-3);
  font-size: var(--fs-h2);
  font-weight: 700;
  color: #fff;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-3);
}

.panel-head .panel-title {
  margin: 0;
}

.pager {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
}

.pager-btn {
  width: 24px;
  height: 24px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}

.pager-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.pager-info {
  min-width: 36px;
  text-align: center;
  font-size: var(--fs-xs);
  color: rgba(255, 255, 255, 0.6);
  font-variant-numeric: tabular-nums;
}

.city-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.city-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  border-radius: var(--r-sm);
  color: rgba(255, 255, 255, 0.8);
  font-size: var(--fs-sm);
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}

.city-list li:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.city-list li.active {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-weight: 700;
}

.city-temp {
  font-size: var(--fs-xs);
  color: rgba(255, 255, 255, 0.6);
  font-variant-numeric: tabular-nums;
}

.city-list li.active .city-temp {
  color: #fff;
}

.detail-list {
  margin: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: var(--fs-body);
}

.detail-row dt {
  color: rgba(255, 255, 255, 0.8);
}

.detail-row dd {
  margin: 0;
  font-weight: 700;
}

.forecast-area {
  margin-top: var(--sp-4);
}

.air-badge {
  display: inline-block;
  margin-bottom: var(--sp-2);
  padding: var(--sp-1) 14px;
  border-radius: var(--r-pill);
  color: #fff;
  font-size: var(--fs-sm);
  font-weight: 700;
}
</style>
