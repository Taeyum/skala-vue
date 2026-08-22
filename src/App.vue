<script setup>
import './assets/exercise.css'
import { ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useFavoriteStore } from '@/stores/favoriteStore.js'
import UnitToggler from '@/components/exercise/UnitToggler.vue'

const favoriteStore = useFavoriteStore()

// 라우트 depth를 비교해 전환 방향을 정한다 — 깊어지면 오른쪽에서, 얕아지면 왼쪽에서
const route = useRoute()
const transitionName = ref('route-fade')
let prevDepth = route.meta.depth ?? 0
watch(
  () => route.meta.depth,
  (d) => {
    const nextDepth = d ?? 0
    transitionName.value =
      nextDepth > prevDepth ? 'route-fwd' : nextDepth < prevDepth ? 'route-back' : 'route-fade'
    prevDepth = nextDepth
  },
)
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-inner">
        <RouterLink to="/" class="logo"><span class="logo-mark">🌤️</span>날씨 대시보드</RouterLink>

        <nav class="nav">
          <RouterLink to="/" class="nav-item">대시보드</RouterLink>
          <RouterLink to="/map" class="nav-item">지도</RouterLink>
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
      <RouterView v-slot="{ Component }">
        <Transition :name="transitionName" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
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
  /* 바탕이 짙은 남색이라 헤더도 어두운 유리 — 스크롤하면 히어로 그라디언트가 비친다 */
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--r-lg);
  background: rgba(15, 20, 30, 0.55);
  backdrop-filter: blur(16px) saturate(1.3);
  -webkit-backdrop-filter: blur(16px) saturate(1.3);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.25);
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: #fff;
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
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  font-weight: 600;
  font-size: var(--fs-body);
  transition:
    color 0.2s,
    background 0.2s;
}

.nav-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.nav-item.router-link-exact-active {
  color: #fff;
  background: rgba(255, 255, 255, 0.16);
}

.nav-item:focus-visible,
.logo:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.8);
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

<!-- 라우트 전환 클래스는 각 뷰의 루트 요소에 붙으므로 scoped로는 닿지 않는다 -->
<style>
.route-fwd-enter-active,
.route-back-enter-active {
  transition:
    opacity var(--dur-3) var(--ease-emphasized),
    transform var(--dur-3) var(--ease-emphasized);
}

.route-fwd-leave-active,
.route-back-leave-active,
.route-fade-leave-active {
  transition:
    opacity var(--dur-2) var(--ease-in-out),
    transform var(--dur-2) var(--ease-in-out);
}

.route-fade-enter-active {
  transition: opacity var(--dur-3) var(--ease-out);
}

.route-fwd-enter-from {
  opacity: 0;
  transform: translateX(28px);
}

.route-fwd-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.route-back-enter-from {
  opacity: 0;
  transform: translateX(-28px);
}

.route-back-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.route-fade-enter-from,
.route-fade-leave-to {
  opacity: 0;
}
</style>
