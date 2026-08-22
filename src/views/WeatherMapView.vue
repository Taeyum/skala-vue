<script setup>
import { onMounted } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore.js'
import KoreaMapStage from '@/components/exercise/KoreaMapStage.vue'

const weatherStore = useWeatherStore()

onMounted(() => {
  if (!weatherStore.hasData) {
    weatherStore.fetchAll()
  }
})
</script>

<template>
  <div class="map-page">
    <header class="head">
      <h1 class="title">전국 날씨 지도</h1>
      <p class="caption">시도별 대표 1지점 기준</p>
    </header>

    <div class="map-wrap">
      <KoreaMapStage />
    </div>
  </div>
</template>

<style scoped>
.map-page {
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
  padding: var(--sp-6);
  border-radius: var(--r-lg);
  background: var(--surface-dark);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  border: 1px solid var(--surface-dark-border);
  box-shadow: var(--shadow-md);
}

.head {
  display: flex;
  align-items: baseline;
  gap: var(--sp-3);
}

.title {
  margin: 0;
  font-size: var(--fs-h1);
  font-weight: 700;
  color: #fff;
}

.caption {
  margin: 0;
  font-size: var(--fs-xs);
  color: rgba(255, 255, 255, 0.6);
}

.map-wrap {
  max-width: 560px;
}
</style>
