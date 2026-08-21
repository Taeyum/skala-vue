<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 상세 화면 전용 Mock Data (7장 Pinia 도입 전까지 임시)
const cityDetails = [
  { id: 'city_01', fullName: '대한민국 서울특별시', temp: 28, status: '맑음', humidity: 55, windSpeed: 2.5 },
  { id: 'city_02', fullName: '대한민국 경기도 수원시', temp: 24, status: '비', humidity: 82, windSpeed: 3.4 },
  { id: 'city_03', fullName: '대한민국 부산광역시', temp: 26, status: '구름', humidity: 63, windSpeed: 4.8 },
  { id: 'city_04', fullName: '대한민국 강원특별자치도 강릉시', temp: 31, status: '맑음', humidity: 38, windSpeed: 1.6 },
  { id: 'city_05', fullName: '대한민국 대전광역시', temp: 22, status: '흐림', humidity: 71, windSpeed: 2.9 },
  { id: 'city_06', fullName: '대한민국 제주특별자치도', temp: null, status: '관측 장애', humidity: null, windSpeed: null },
]

// 선택된 도시 객체
const city = ref(null)

// Mount 시점에 cityId로 Mock Data에서 도시 객체 선택
onMounted(() => {
  const cityId = route.params.cityId
  city.value = cityDetails.find((item) => item.id === cityId) ?? null
})

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="detail-box">
    <h3>📊 지역별 상세 기상 관측 정보</h3>

    <div v-if="city" class="info-panel">
      <p class="location">📍 지정 지역: {{ city.fullName }}</p>
      <p>실시간 기온: {{ city.temp ?? '측정 불가' }}{{ city.temp === null ? '' : '°C' }}</p>
      <p>기상 현황: {{ city.status }}</p>
      <p>대기 습도: {{ city.humidity ?? '-' }}{{ city.humidity === null ? '' : '%' }}</p>
      <p>현재 풍속: {{ city.windSpeed ?? '-' }}{{ city.windSpeed === null ? '' : 'm/s' }}</p>
    </div>

    <div v-else class="info-panel empty">
      <p>'{{ route.params.cityId }}' 에 해당하는 관측 정보를 찾을 수 없습니다.</p>
    </div>

    <button class="btn-back" @click="goBack">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.detail-box {
  padding: 20px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #2c3e50;
}

.detail-box h3,
.detail-box p {
  color: #2c3e50;
}

.info-panel {
  margin: 16px 0;
  padding: 16px;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  line-height: 1.9;
}

.info-panel p {
  margin: 0;
}

.location {
  font-weight: bold;
}

.info-panel.empty {
  color: #868e96;
  text-align: center;
}

.btn-back {
  padding: 8px 14px;
  border: none;
  border-radius: 4px;
  background: #2c3e50;
  color: #fff;
  cursor: pointer;
}
</style>