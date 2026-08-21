<script setup>
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useWeatherStore } from '@/stores/weatherStore.js'
import { useFavoriteStore } from '@/stores/favoriteStore.js'
import { useConfigStore } from '@/stores/configStore.js'
import WeatherTile from '@/components/exercise/WeatherTile.vue'

const router = useRouter()
const weatherStore = useWeatherStore()
const favoriteStore = useFavoriteStore()
const configStore = useConfigStore()

const favoriteList = computed(() =>
  weatherStore.weatherList.filter((c) => favoriteStore.isFavorite(c.id)),
)

const convertTemp = (celsius) => {
  if (celsius === null || celsius === undefined) return null
  return configStore.unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius
}

const handleDetail = (city) => router.push(`/weather/${city.id}`)
</script>

<template>
  <div class="fav-page">
    <header class="card head">
      <h1>⭐ 즐겨찾기</h1>
      <p>{{ favoriteStore.favoriteCount }}개 지역을 즐겨찾기했습니다.</p>
    </header>

    <div v-if="favoriteList.length" class="card">
      <TransitionGroup name="tile" tag="div" class="tile-grid">
        <WeatherTile
          v-for="item in favoriteList"
          :key="item.id"
          :city="item"
          :display-temp="convertTemp(item.temp)"
          :unit="configStore.unitSymbol"
          :is-favorite="true"
          @select="handleDetail"
          @detail="handleDetail"
          @toggle-favorite="favoriteStore.toggleFavorite"
        />
      </TransitionGroup>
    </div>

    <div v-else class="card empty">
      <p class="empty-icon">☆</p>
      <p>아직 즐겨찾기한 지역이 없습니다.</p>
      <RouterLink to="/" class="link-btn">대시보드로 이동</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.fav-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  padding: 24px;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  background: #fff;
  color: #2c3e50;
}

.head h1 {
  margin: 0 0 4px;
  font-size: 24px;
  color: #2c3e50;
}

.head p {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
}

.tile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.empty {
  text-align: center;
  padding: 60px 24px;
}

.empty-icon {
  margin: 0 0 12px !important;
  font-size: 48px;
  color: #dfe6e9;
}

.empty p {
  margin: 0;
  color: #7f8c8d;
}

.link-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 10px;
  background: #3498db;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}

.tile-move,
.tile-enter-active,
.tile-leave-active {
  transition: all 0.45s cubic-bezier(0.55, 0, 0.1, 1);
}

.tile-enter-from,
.tile-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.tile-leave-active {
  position: absolute;
}
</style>