import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // state
  const unit = ref('celsius')
  const sortOrder = ref('none') // 'none' | 'desc' | 'asc'

  // getters
  const unitSymbol = computed(() => (unit.value === 'celsius' ? '℃' : '℉'))
  const sortLabel = computed(() => {
    if (sortOrder.value === 'desc') return '🌡️ 기온 높은 순'
    if (sortOrder.value === 'asc') return '🌡️ 기온 낮은 순'
    return '🌡️ 기본 순서'
  })

  // actions 
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  function toggleSort() {
    if (sortOrder.value === 'none') sortOrder.value = 'desc'
    else if (sortOrder.value === 'desc') sortOrder.value = 'asc'
    else sortOrder.value = 'none'
  }

  return { unit, sortOrder, unitSymbol, sortLabel, toggleUnit, toggleSort }
})