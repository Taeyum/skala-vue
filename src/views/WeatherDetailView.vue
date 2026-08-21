<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useWeatherStore } from '@/stores/weatherStore.js'
import { useConfigStore } from '@/stores/configStore.js'
import { usePhotoStore } from '@/stores/photoStore.js'
import { getPexelsQuery } from '@/utils/weatherTheme.js'
import { useForecastStore } from '@/stores/forecastStore.js'
import { useAirStore } from '@/stores/airStore.js'
import ForecastChart from '@/components/exercise/ForecastChart.vue'

const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()
const configStore = useConfigStore()
const photoStore = usePhotoStore()
const photo = ref(null)
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

// 오늘 날짜와 현재 시각
const today = computed(() => {
  const now = new Date()
  const date = now.toLocaleDateString('ko-KR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
  const time = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  return `${date} · ${time}`
})

const goDetail = (cityId) => {
  router.push({ name: 'WeatherDetail', params: { cityId } })
}

// 도시가 바뀌면 날씨에 맞는 배경 이미지를 다시 조회
watch(
  () => city.value?.main,
  async (main) => {
    if (!main) return
    photo.value = await photoStore.fetchPhoto(getPexelsQuery(main))
  },
  { immediate: true },
)

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
      <div class="hero-overlay"></div>
      <WeatherAnimation :main="city?.main" />

      <div class="hero-top">
        <RouterLink to="/" class="brand">← 대시보드</RouterLink>
      </div>

      <div v-if="city" class="hero-bottom">
        <div class="temp-row">
          <span class="temp-big">{{ displayTemp ?? '--' }}<span class="deg">°</span></span>
          <div class="city-info">
            <h2>{{ city.name }}</h2>
            <p class="date">{{ today }}</p>
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

      <!-- Pexels 가이드라인: 사진작가 크레딧 표기 -->
      <a v-if="photo" :href="photo.link" target="_blank" rel="noopener" class="credit">
        Photo by {{ photo.photographer }} on Pexels
      </a>
    </section>

    <!-- ── 우측: 정보 패널 ── -->
    <aside class="panel">
      <div class="panel-block">
        <h3 class="panel-title">다른 지역 보기</h3>
        <ul class="city-list">
          <li
            v-for="item in weatherStore.weatherList"
            :key="item.id"
            :class="{ active: item.id === route.params.cityId }"
            @click="goDetail(item.id)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>

      <div v-if="city" class="panel-block">
        <h3 class="panel-title">Weather Details</h3>
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
  border-radius: 12px;
  overflow: hidden;
  background: #2c3e50;
}

/* ── 좌측 히어로 ── */
.hero {
  position: relative;
  flex: 1 1 62%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: linear-gradient(160deg, #4a5568, #2d3748);
  background-size: cover;
  background-position: center;
  transition: background-image 0.5s ease;
  color: #fff;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.15));
  pointer-events: none;
}

.hero-top,
.hero-bottom {
  position: relative;
  z-index: 1;
  margin-top: auto;
}

.brand {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-weight: bold;
  font-size: 14px;
}

.temp-row {
  display: flex;
  align-items: flex-end;
  gap: 16px;
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
  margin: 4px 0 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
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
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
}

.not-found {
  color: rgba(255, 255, 255, 0.8);
}

.credit {
  position: absolute;
  right: 12px;
  bottom: 8px;
  z-index: 1;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
}

.credit:hover {
  color: rgba(255, 255, 255, 0.9);
}

/* ── 우측 패널 ── */
.panel {
  flex: 0 0 38%;
  padding: 24px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 24px;
  
}

.panel-title {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}

.city-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.city-list li {
  padding: 8px 0;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: color 0.2s;
}

.city-list li:hover {
  color: #fff;
}

.city-list li.active {
  color: #fff;
  font-weight: 700;
}

.detail-list {
  margin: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.detail-row dt {
  color: rgba(255, 255, 255, 0.8);
}

.detail-row dd {
  margin: 0;
  font-weight: 700;
}
.forecast-area {
  margin-top: 16px;
}
.air-badge {
  display: inline-block;
  margin-bottom: 8px;
  padding: 4px 14px;
  border-radius: 14px;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}
</style>