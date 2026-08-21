import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getWeatherText } from '@/utils/weatherTheme.js'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast'

export const useForecastStore = defineStore('forecast', () => {
  // 도시별로 캐싱 { city_01: [...40개] }
  const forecastCache = ref({})
  const isLoading = ref(false)

  const fetchForecast = async (cityId, query) => {
    if (forecastCache.value[cityId]) return forecastCache.value[cityId]

    isLoading.value = true
    try {
      const response = await axios.get(BASE_URL, {
        params: { q: query, appid: API_KEY, units: 'metric', lang: 'kr' },
      })
      // 40개(5일 × 8슬롯) 전부 저장. 차트는 앞 12개만, 타임라인은 전체를 쓴다
      const list = response.data.list.map((item) => ({
        dt: item.dt,
        dtTxt: item.dt_txt,
        temp: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        clouds: item.clouds?.all ?? null,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        pop: Math.round(item.pop * 100),
        icon: item.weather[0].icon,
        main: item.weather[0].main,
        status: getWeatherText(item.weather[0].id, item.weather[0].description),
      }))
      forecastCache.value[cityId] = list
      return list
    } catch (error) {
      console.error('[forecastStore] 예보 조회 실패:', error)
      return []
    } finally {
      isLoading.value = false
    }
  }

  return { forecastCache, isLoading, fetchForecast }
})
