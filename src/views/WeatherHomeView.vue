<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore.js'
import { useFavoriteStore } from '@/stores/favoriteStore.js'
import { useWeatherStore } from '@/stores/weatherStore.js'
import { getGradient } from '@/utils/weatherTheme.js'
import WeatherHero from '@/components/exercise/WeatherHero.vue'
import WeatherTile from '@/components/exercise/WeatherTile.vue'
import CityAdder from '@/components/exercise/CityAdder.vue'
import WeatherAnimation from '@/components/exercise/WeatherAnimation.vue'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()
const weatherStore = useWeatherStore()

const searchQuery = ref('')
const selectedId = ref('')

onMounted(async () => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  if (!weatherStore.hasData) {
    await weatherStore.fetchAll()
  }
  // 진입 시 첫 번째 도시를 자동 선택
  if (!selectedId.value && weatherStore.hasData) {
    selectedId.value = weatherStore.weatherList[0].id
  }
})

const filteredList = computed(() =>
  weatherStore.weatherList.filter((item) => item.name.includes(searchQuery.value)),
)

const sortedList = computed(() => {
  const list = filteredList.value
  if (configStore.sortOrder === 'desc') {
    return list.toSorted((a, b) => (b.temp ?? -99) - (a.temp ?? -99))
  }
  if (configStore.sortOrder === 'asc') {
    return list.toSorted((a, b) => (a.temp ?? 99) - (b.temp ?? 99))
  }
  return list
})

const selectedCity = computed(() =>
  weatherStore.weatherList.find((c) => c.id === selectedId.value),
)

const backgroundStyle = computed(() => ({
  background: getGradient(selectedCity.value?.main),
}))

const convertTemp = (celsius) => {
  if (celsius === null || celsius === undefined) return null
  return configStore.unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius
}

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

watch(searchQuery, (newQuery) => {
  router.replace({ query: newQuery ? { search: newQuery } : {} })
})

const handleSelect = (city) => {
  selectedId.value = city.id
}

const handleDetail = (city) => {
  router.push(`/weather/${city.id}`)
}

const handleRemove = (cityId) => {
  weatherStore.removeCity(cityId)
  if (selectedId.value === cityId) {
    selectedId.value = weatherStore.weatherList[0]?.id ?? ''
  }
  if (favoriteStore.isFavorite(cityId)) {
    favoriteStore.toggleFavorite(cityId)
  }
}
</script>

<template>
  <div class="dashboard" :style="backgroundStyle">
    <WeatherAnimation :main="selectedCity?.main" />
    <!-- ① 히어로 -->
    <WeatherHero
      :city="selectedCity"
      :display-temp="convertTemp(selectedCity?.temp)"
      :unit="configStore.unitSymbol"
    />

    <!-- ② 툴바 -->
    <div class="toolbar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          :value="searchQuery"
          @input="(e) => (searchQuery = e.target.value)"
          placeholder="지역 검색"
        />
      </div>

      <CityAdder class="adder" />

      <button class="btn-sort" @click="configStore.toggleSort">
        {{ configStore.sortLabel }}
      </button>
    </div>

    <!-- ③ 상태 표시 -->
    <p v-if="weatherStore.isLoading" class="state-msg">날씨 정보를 불러오는 중입니다...</p>
    <p v-else-if="weatherStore.errorMessage" class="state-msg error">
      {{ weatherStore.errorMessage }}
    </p>

    <!-- ④ 타일 그리드 -->
    <TransitionGroup v-else name="tile" tag="div" class="tile-grid">
      <WeatherTile
        v-for="item in sortedList"
        :key="item.id"
        :city="item"
        :display-temp="convertTemp(item.temp)"
        :unit="configStore.unitSymbol"
        :is-selected="selectedId === item.id"
        :is-favorite="favoriteStore.isFavorite(item.id)"
        :can-remove="!item.id.startsWith('city_0')"
        @select="handleSelect"
        @detail="handleDetail"
        @toggle-favorite="favoriteStore.toggleFavorite"
        @remove="handleRemove"
      />
    </TransitionGroup>

    <p v-if="!weatherStore.isLoading && sortedList.length === 0" class="state-msg">
      검색 결과와 일치하는 지역이 없습니다.
    </p>
  </div>
</template>

<style scoped>
.dashboard {
  position: relative;
  padding: var(--sp-6);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-md);
  transition: background 0.8s ease;
}

/* ── 툴바 ── */
.toolbar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: var(--sp-3);
  margin: var(--sp-5) 0;
}

.search-box {
  flex: 0 0 260px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--fs-body);
}

.search-box input {
  width: 100%;
  padding: 11px 14px 11px 38px;
  border: 1px solid var(--surface-border);
  border-radius: var(--r-md);
  background: var(--surface);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  color: var(--c-text);
  font-size: var(--fs-body);
  box-sizing: border-box;
}

.search-box input:focus {
  outline: none;
  border-color: var(--c-primary);
}

.adder {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.btn-sort {
  margin-left: auto;
  padding: 11px 18px;
  border: 1px solid var(--surface-border);
  border-radius: var(--r-md);
  background: var(--surface);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  color: var(--c-text);
  font-size: var(--fs-body);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-sort:hover {
  background: #fff;
}

/* ── 타일 그리드 ── */
.tile-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--sp-4);
}

/* ── TransitionGroup 애니메이션 ── */
.tile-move,
.tile-enter-active,
.tile-leave-active {
  transition: all 0.45s cubic-bezier(0.55, 0, 0.1, 1);
}

.tile-enter-from,
.tile-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.tile-leave-active {
  position: absolute;
}

.state-msg {
  position: relative;
  z-index: 1;
  padding: var(--sp-10);
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
}

.state-msg.error {
  color: #ffe0e0;
}
</style>
