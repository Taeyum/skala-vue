<script setup>
import './assets/exercise.css'
import { RouterLink, RouterView } from 'vue-router';
import { useFavoriteStore } from './stores/favoriteStore';
import UnitToggler from '@/components/exercise/UnitToggler.vue';

const favoriteStore = useFavoriteStore()
</script>

<template>
  <div class="app-container">
    <h1>🌤️ 과제 5: Pinia 적용</h1>
    <hr />

    <div class="nav-row">
      <nav class="navigation-bar">
        <RouterLink to="/" class="nav-item">🌤️ 날씨 대시보드</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/favorites" class="nav-item">
          ⭐ 즐겨찾기
          <span v-if="favoriteStore.hasFavorite" class="badge-count">{{ favoriteStore.favoriteCount }}</span>
        </RouterLink>   
        <span class="divider">|</span>
        <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
      </nav>

      <UnitToggler />
    </div>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.badge-count {
  display: inline-block;
  min-width: 18px;
  padding: 1px 6px;
  border-radius: 10px;
  background: #f7b731;
  color: #fff;
  font-size: 11px;
}
</style>