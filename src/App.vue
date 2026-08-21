<script setup>
import './assets/exercise.css'
import { ref, provide, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router';

// 즐겨찾기 상태를 앱 최상위로 승격 (라우트 간 공유를 위해)
const favoriteIds = ref([])

const toggleFavorite = (cityId) => {
  const index = favoriteIds.value.indexOf(cityId)
  if (index === -1) {
    favoriteIds.value.push(cityId)
  } else {
    favoriteIds.value.splice(index, 1)
  }
}

watch(
  favoriteIds,
  (newVal) => {
    console.log(`[watch] 즐겨찾기 변경! 현재 ${newVal.length}개:`, newVal.join(', '))
  },
  { deep: true },
)

// 하위 모든 컴포넌트에서 inject 가능
provide('favoriteIds', favoriteIds)
provide('toggleFavorite', toggleFavorite)
</script>

<template>
  <div class="app-container">
    <h1> 과제 4: 라우터 적용 </h1>
    <hr />

    <nav class="navigation-bar">
      <RouterLink to="/" class="nav-item">날씨 대시보드</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/favorites" class="nav-item">즐겨 찾기</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/about" class="nav-item">서비스 소개</RouterLink>
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>