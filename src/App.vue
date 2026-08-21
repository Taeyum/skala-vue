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
  top: var(--sp-3);
  z-index: 100;
  max-width: 1400px;
  margin: var(--sp-3) auto 0;
  padding: 0 var(--sp-4);
}

.header-inner {
  display: flex;
  align-items: center;
  gap: var(--sp-8);
  padding: var(--sp-3) var(--sp-6);
  border: 1px solid var(--surface-border);
  border-radius: var(--r-lg);
  background: var(--surface);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  box-shadow: var(--shadow-md);
}

.logo {
  font-size: 18px;
  font-weight: 700;
  color: var(--c-text);
  text-decoration: none;
}

.nav {
  display: flex;
  gap: var(--sp-6);
  flex: 1;
}

.nav-item {
  position: relative;
  padding: var(--sp-1) 0;
  color: var(--c-text-sub);
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: color 0.2s;
}

.nav-item:hover {
  color: var(--c-text);
}

.nav-item.router-link-exact-active {
  color: var(--c-primary);
}

.nav-item.router-link-exact-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 2px;
  border-radius: 2px;
  background: var(--c-primary);
}

.badge-count {
  display: inline-block;
  min-width: 18px;
  padding: 1px 6px;
  border-radius: var(--r-pill);
  background: var(--c-accent);
  color: #fff;
  font-size: var(--fs-xs);
  line-height: 1.4;
}

.app-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--sp-4) var(--sp-8) var(--sp-8);
}
</style>
