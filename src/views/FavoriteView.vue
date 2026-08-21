<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoriteStore } from '@/stores/favoriteStore.js'

const router = useRouter()
const favoriteStore = useFavoriteStore()

// 도시 이름 조회용 (홈과 동일 데이터 — Pinia 도입 전 임시)
const cityNames = ref({
  city_01: '서울',
  city_02: '수원',
  city_03: '부산',
  city_04: '강릉',
  city_05: '대전',
  city_06: '제주',
})

// favoriteList의 참조 대상 변경
const favoriteList = computed(() =>
  favoriteStore.favoriteIds.map((id) => ({ id, name: cityNames.value[id] ?? '알 수 없는 지역' })),
)

const goDetail = (id) => {
  router.push({ name: 'WeatherDetail', params: { cityId: id } })
}
</script>

<template>
  <div class="fav-box">
    <h3>⭐ 즐겨찾기한 지역</h3>

    <p v-if="favoriteList.length === 0" class="empty">
      아직 즐겨찾기한 지역이 없습니다. 대시보드에서 ☆ 버튼을 눌러보세요.
    </p>

    <ul v-else class="fav-list">
      <li v-for="item in favoriteList" :key="item.id">
        <span class="name" @click="goDetail(item.id)">{{ item.name }}</span>
        <button class="btn-remove" @click="favoriteStore.toggleFavorite(item.id)">해제</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.fav-box {
  padding: 20px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #2c3e50;
}

.fav-box h3,
.fav-box p {
  color: #2c3e50;
}

.empty {
  padding: 30px;
  text-align: center;
  color: #868e96;
}

.fav-list {
  list-style: none;
  padding: 0;
}

.fav-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  margin-bottom: 8px;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
}

.name {
  cursor: pointer;
  font-weight: bold;
}

.name:hover {
  color: #3498db;
}

.btn-remove {
  padding: 4px 10px;
  border: 1px solid #f7b731;
  border-radius: 4px;
  background: #fff;
  color: #f7b731;
  cursor: pointer;
}
</style>