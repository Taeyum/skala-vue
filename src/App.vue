<script setup>
import './assets/exercise.css'
import { RouterLink, RouterView } from 'vue-router'
import { useFavoriteStore } from '@/stores/favoriteStore.js'
import UnitToggler from '@/components/exercise/UnitToggler.vue'

const favoriteStore = useFavoriteStore()
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-inner">
        <RouterLink to="/" class="logo">🌤️ Weather</RouterLink>

        <nav class="nav">
          <RouterLink to="/" class="nav-item">대시보드</RouterLink>
          <RouterLink to="/favorites" class="nav-item">
            즐겨찾기
            <span v-if="favoriteStore.hasFavorite" class="badge-count">
              {{ favoriteStore.favoriteCount }}
            </span>
          </RouterLink>
          <RouterLink to="/practice" class="nav-item">실습</RouterLink>
          <RouterLink to="/about" class="nav-item">소개</RouterLink>
        </nav>

        <UnitToggler />
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 12px;
  z-index: 100;
  max-width: 1400px;
  margin: 12px auto 0;
  padding: 0 16px;
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 12px 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.logo {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 24px;
  flex: 1;
}

.nav-item {
  position: relative;
  padding: 4px 0;
  color: #7f8c8d;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: color 0.2s;
}

.nav-item:hover {
  color: #2c3e50;
}

.nav-item.router-link-exact-active {
  color: #3498db;
}

.nav-item.router-link-exact-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;      /* -15px → -4px */
  height: 2px;
  border-radius: 2px;
  background: #3498db;
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

.app-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 32px 32px;
}
</style>