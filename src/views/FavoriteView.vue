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
  gap: var(--sp-4);
}

.card {
  padding: var(--sp-6);
  border: 1px solid var(--surface-border);
  border-radius: var(--r-lg);
  background: var(--surface);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  box-shadow: var(--shadow-md);
  color: var(--c-text);
}

.head h1 {
  margin: 0 0 var(--sp-1);
  font-size: var(--fs-h1);
  font-weight: 700;
  color: var(--c-text);
}

.head p {
  margin: 0;
  color: var(--c-text-sub);
  font-size: var(--fs-sm);
}

.tile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--sp-4);
}

.empty {
  text-align: center;
  padding: var(--sp-10) var(--sp-6);
}

.empty .empty-icon {
  margin: 0 0 var(--sp-3);
  font-size: 48px;
  color: var(--c-text-muted);
}

.empty p {
  margin: 0;
  color: var(--c-text-sub);
  font-size: var(--fs-body);
}

.link-btn {
  margin-top: var(--sp-5);
  display: inline-block;
  padding: 10px var(--sp-5);
  border: none;
  border-radius: var(--r-md);
  background: var(--c-primary);
  color: #fff;
  text-decoration: none;
  font-size: var(--fs-body);
  font-weight: 600;
  transition:
    background 0.2s,
    transform 0.2s;
}

.link-btn:hover {
  background: #2e86c1;
  transform: translateY(-2px);
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
