import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/air_pollution'

// AQI 1~5에 대응하는 등급
const AQI_LEVEL = {
  1: { label: '좋음', color: '#00b894' },
  2: { label: '보통', color: '#74b9ff' },
  3: { label: '나쁨', color: '#fdcb6e' },
  4: { label: '매우 나쁨', color: '#e17055' },
  5: { label: '위험', color: '#d63031' },
}

export const useAirStore = defineStore('air', () => {
  const airCache = ref({})

  const fetchAir = async (cityId, lat, lon) => {
    if (airCache.value[cityId]) return airCache.value[cityId]
    if (lat === null || lon === null) return null

    try {
      const response = await axios.get(BASE_URL, {
        params: { lat, lon, appid: API_KEY },
      })
      const item = response.data.list[0]
      const aqi = item.main.aqi

      const result = {
        aqi,
        label: AQI_LEVEL[aqi]?.label ?? '알 수 없음',
        color: AQI_LEVEL[aqi]?.color ?? '#95a5a6',
        pm25: Math.round(item.components.pm2_5),
        pm10: Math.round(item.components.pm10),
      }
      airCache.value[cityId] = result
      return result
    } catch (error) {
      console.error('[airStore] 대기질 조회 실패:', error)
      return null
    }
  }

  return { airCache, fetchAir }
})