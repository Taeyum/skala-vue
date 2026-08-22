import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getWeatherText } from '@/utils/weatherTheme.js'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct'

// 조회 대상 도시 (한글명 ↔ API 조회용 영문명 매핑)
// 17개 시도에 하나씩. 도(道)는 도청 소재지를 기본으로 하되,
// 강릉(기존 id 유지)·목포(무안보다 마커가 덜 겹침)는 예외로 두었다
const CITY_PRESET = [
  { id: 'city_01', name: '서울', query: 'Seoul' },
  { id: 'city_02', name: '수원', query: 'Suwon' },
  { id: 'city_03', name: '부산', query: 'Busan' },
  { id: 'city_04', name: '강릉', query: 'Gangneung' },
  { id: 'city_05', name: '대전', query: 'Daejeon' },
  { id: 'city_06', name: '제주', query: 'Jeju' },
  { id: 'city_07', name: '인천', query: 'Incheon' },
  { id: 'city_08', name: '대구', query: 'Daegu' },
  { id: 'city_09', name: '광주', query: 'Gwangju' },
  { id: 'city_10', name: '울산', query: 'Ulsan' },
  { id: 'city_11', name: '세종', query: 'Sejong' },
  { id: 'city_12', name: '청주', query: 'Cheongju' },
  { id: 'city_13', name: '홍성', query: 'Hongseong' },
  { id: 'city_14', name: '전주', query: 'Jeonju' },
  { id: 'city_15', name: '목포', query: 'Mokpo' },
  { id: 'city_16', name: '안동', query: 'Andong' },
  { id: 'city_17', name: '창원', query: 'Changwon' },
]

// 프리셋 도시는 삭제할 수 없다. id 문자열로 판별하면 city_10 이후가 새는 문제가 있어 목록으로 둔다
const PRESET_IDS = new Set(CITY_PRESET.map((c) => c.id))

export const PRESET_COUNT = CITY_PRESET.length

export const useWeatherStore = defineStore('weather', () => {
  // ── state ──
  const weatherList = ref([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  // ── getters ──
  const hasData = computed(() => weatherList.value.length > 0)

  const hottestCity = computed(
    () => weatherList.value.filter((c) => c.temp !== null).toSorted((a, b) => b.temp - a.temp)[0],
  )

  // ── actions ──

  // 도시 하나의 현재 날씨 조회
  const fetchOne = async (city) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          q: city.query,
          appid: API_KEY,
          units: 'metric',
          lang: 'kr',
        },
      })

      const data = response.data
      return {
        id: city.id,
        name: city.name,
        query: city.query,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        // API 한글 번역이 어색해 기상 코드로 직접 매핑
        status: getWeatherText(data.weather[0].id, data.weather[0].description),
        weatherId: data.weather[0].id,
        icon: data.weather[0].icon,
        main: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        // 바람이 불어오는 방향(도, 진북 기준 시계방향) — 지도 바람 레이어에서 쓴다
        windDeg: data.wind.deg ?? null,
        clouds: data.clouds.all,
        lat: data.coord.lat,
        lon: data.coord.lon,
        // 현지 시각·낮밤 판정용 (UTC 오프셋 초, UTC 타임스탬프)
        timezone: data.timezone,
        sunrise: data.sys?.sunrise ?? null,
        sunset: data.sys?.sunset ?? null,
      }
    } catch (error) {
      console.error(`[weatherStore] ${city.name} 조회 실패:`, error)
      // 한 도시가 실패해도 전체가 무너지지 않도록 빈 데이터로 대체
      return {
        id: city.id,
        name: city.name,
        query: city.query,
        temp: null,
        feelsLike: null,
        status: '조회 실패',
        weatherId: null,
        icon: null,
        main: null,
        humidity: null,
        windSpeed: null,
        windDeg: null,
        clouds: null,
        lat: null,
        lon: null,
        timezone: null,
        sunrise: null,
        sunset: null,
      }
    }
  }

  // 전체 도시를 병렬로 조회
  const fetchAll = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
      // 순차 await이면 도시 수만큼 느려지므로 Promise.all로 동시에 요청
      weatherList.value = await Promise.all(CITY_PRESET.map(fetchOne))
    } catch (error) {
      console.error('[weatherStore] 전체 조회 실패:', error)
      errorMessage.value = '날씨 정보를 불러오지 못했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  // id로 도시 하나 찾기 (상세 페이지용)
  const findById = (cityId) => weatherList.value.find((c) => c.id === cityId)

  // 사용자가 추가한 도시 (검색 → 목록에 편입)
  const addCity = async (keyword) => {
    if (!keyword.trim()) return { ok: false, message: '도시 이름을 입력하세요.' }

    try {
      // 1) Geocoding으로 도시 좌표와 정식 명칭 조회
      const geoRes = await axios.get(GEO_URL, {
        params: { q: keyword, limit: 1, appid: API_KEY },
      })
      const place = geoRes.data?.[0]
      if (!place) {
        return { ok: false, message: `'${keyword}' 에 해당하는 도시를 찾지 못했습니다.` }
      }

      // 2) 중복 확인 (좌표 기준)
      const exists = weatherList.value.some((c) => c.lat === place.lat && c.lon === place.lon)
      if (exists) {
        return { ok: false, message: '이미 목록에 있는 도시입니다.' }
      }

      // 3) 해당 좌표로 현재 날씨 조회
      const newCity = await fetchOne({
        id: `city_${Date.now()}`,
        name: place.local_names?.ko ?? place.name,
        query: place.name,
      })

      weatherList.value.push(newCity)
      return { ok: true, message: `${newCity.name} 을(를) 추가했습니다.` }
    } catch (error) {
      console.error('[weatherStore] 도시 추가 실패:', error)
      return { ok: false, message: '도시 추가 중 오류가 발생했습니다.' }
    }
  }

  const removeCity = (cityId) => {
    weatherList.value = weatherList.value.filter((c) => c.id !== cityId)
  }

  const isPreset = (cityId) => PRESET_IDS.has(cityId)

  return {
    weatherList,
    isLoading,
    errorMessage,
    hasData,
    hottestCity,
    fetchAll,
    findById,
    addCity,
    removeCity,
    isPreset,
  }
})
