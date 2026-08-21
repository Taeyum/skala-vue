import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_PEXELS_API_KEY
const BASE_URL = 'https://api.pexels.com/v1/search'

export const usePhotoStore = defineStore('photo', () => {
  // ── state ──
  // 검색어별로 캐싱 { 'rainy window': { url, photographer, link } }
  const photoCache = ref({})
  const isLoading = ref(false)

  // ── actions ──
  const fetchPhoto = async (query) => {
    // 이미 받아둔 검색어면 재호출하지 않는다
    if (photoCache.value[query]) return photoCache.value[query]

    isLoading.value = true
    try {
      const response = await axios.get(BASE_URL, {
        params: { query, per_page: 1, orientation: 'landscape' },
        // Pexels는 쿼리가 아니라 헤더로 인증한다
        headers: { Authorization: API_KEY },
      })

      const photo = response.data.photos?.[0]
      if (!photo) return null

      const result = {
        url: photo.src.large2x,
        photographer: photo.photographer,
        link: photo.url,
      }
      photoCache.value[query] = result
      return result
    } catch (error) {
      console.error('[photoStore] 이미지 조회 실패:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { photoCache, isLoading, fetchPhoto }
})