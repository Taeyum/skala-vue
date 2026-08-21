import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFavoriteStore = defineStore('favorite', () => {
  // state
  const favoriteIds = ref([])

  // getters
  const favoriteCount = computed(() => favoriteIds.value.length)
  const hasFavorite = computed(() => favoriteIds.value.length > 0)

  // actions
  function toggleFavorite(cityId) {
    const index = favoriteIds.value.indexOf(cityId)
    if (index === -1) {
      favoriteIds.value.push(cityId)
    } else {
      favoriteIds.value.splice(index, 1)
    }
  }

  function isFavorite(cityId) {
    return favoriteIds.value.includes(cityId)
  }

  return { favoriteIds, favoriteCount, hasFavorite, toggleFavorite, isFavorite }
})