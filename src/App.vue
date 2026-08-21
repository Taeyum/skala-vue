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
        <RouterLink to="/" class="logo"><span class="logo-mark">🌤️</span>날씨 대시보드</RouterLink>

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
  padding: 0 var(--sp-8); /* 본문(.app-main)과 좌우 정렬 */
}

.header-inner {
  display: flex;
  align-items: center;
  gap: var(--sp-10) 48px;
  padding: 10px var(--sp-5) 10px var(--sp-6);
  border: 1px solid var(--surface-border);
  border-radius: var(--r-lg);
  background: var(--surface);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  box-shadow: var(--shadow-md);
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: var(--c-text);
  text-decoration: none;
  white-space: nowrap;
}

.logo-mark {
  font-size: 22px;
  line-height: 1;
}

.nav {
  display: flex;
  gap: var(--sp-1);
  flex: 1;
}

.nav-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: var(--r-pill);
  color: var(--c-text-sub);
  text-decoration: none;
  font-weight: 600;
  font-size: var(--fs-body);
  transition:
    color 0.2s,
    background 0.2s;
}

.nav-item:hover {
  color: var(--c-text);
  background: rgba(44, 62, 80, 0.06);
}

.nav-item.router-link-exact-active {
  color: var(--c-primary);
  background: var(--c-primary-soft);
}

.nav-item:focus-visible,
.logo:focus-visible {
  outline: 2px solid var(--c-primary);
  outline-offset: 2px;
}

.badge-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: var(--r-pill);
  background: var(--c-accent);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

.app-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--sp-4) var(--sp-8) var(--sp-8);
}
</style>
