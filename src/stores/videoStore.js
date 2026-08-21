import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_PEXELS_API_KEY
const BASE_URL = 'https://api.pexels.com/videos/search'

// 배경용이라 이 폭을 넘는 파일은 고르지 않는다 (용량 절약)
const MAX_WIDTH = 1280

export const useVideoStore = defineStore('video', () => {
  // ── state ──
  // 검색어별로 캐싱 { 'rainy window': { url, author, link } }
  const videoCache = ref({})
  const isLoading = ref(false)

  // ── actions ──
  // video_files 중 MAX_WIDTH 이하인 mp4 가운데 가장 큰 것을 고른다
  const pickFile = (files) => {
    const candidates = files
      .filter((f) => f.file_type === 'video/mp4' && f.width && f.width <= MAX_WIDTH)
      .toSorted((a, b) => b.width - a.width)
    return candidates[0] ?? null
  }

  // 후보 중 가장 긴 영상을 고른다
  // 짧은 클립은 핸드헬드 촬영이 많아 흔들리고, loop 재시작 지점도 자주 돌아온다
  const pickVideo = (videos) => {
    const candidates = videos.filter((v) => pickFile(v.video_files ?? []))
    return candidates.toSorted((a, b) => b.duration - a.duration)[0] ?? null
  }

  const fetchVideo = async (query) => {
    // 이미 받아둔 검색어면 재호출하지 않는다
    if (videoCache.value[query]) return videoCache.value[query]

    isLoading.value = true
    try {
      const response = await axios.get(BASE_URL, {
        params: { query, per_page: 10, orientation: 'landscape' },
        // Pexels는 쿼리가 아니라 헤더로 인증한다
        headers: { Authorization: API_KEY },
      })

      const video = pickVideo(response.data.videos ?? [])
      const file = video ? pickFile(video.video_files ?? []) : null
      if (!file) return null

      const result = {
        url: file.link,
        author: video.user?.name ?? 'Unknown',
        link: video.url,
      }
      videoCache.value[query] = result
      return result
    } catch (error) {
      console.error('[videoStore] 영상 조회 실패:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { videoCache, isLoading, fetchVideo }
})
