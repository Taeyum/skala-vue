<script setup>
import './assets/exercise.css'
import { ref } from 'vue'
import WeatherMockup from './components/exercise/WeatherMockup.vue'
import PracticeIndex from './components/practices/PracticeIndex.vue'
import WeatherParent from './components/exercise/weather/WeatherParent.vue'

const page = ref('main')
</script>

<template>
  <header class="app-header">
    <h1>Skala-Vue</h1>
    <nav class="app-nav">
      <button :class="{ active: page === 'main' }" @click="page = 'main'">
        과제1,2 (Weather Mockup)
      </button>
      <button :class="{ active: page === 'weather3' }" @click="page = 'weather3'">
        과제3 (Component 분리)
      </button>
      <button :class="{ active: page === 'practice' }" @click="page = 'practice'">
        실습으로 이동 →
      </button>
    </nav>
  </header>

  <main class="app-main">
    <WeatherMockup v-if="page === 'main'" />
    <WeatherParent v-else-if="page === 'weather3'" />
    <PracticeIndex v-else />
  </main>
</template>

<style scoped>
.app-header {
  padding-bottom: 12px;
  border-bottom: 2px solid #42b883;
}

.app-nav {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.app-nav button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

.app-nav button.active {
  border-color: #42b883;
  background-color: #42b883;
  color: #fff;
  font-weight: bold;
}

.app-main {
  padding-top: 20px;
}
</style>
