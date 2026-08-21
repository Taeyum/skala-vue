<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useConfigStore } from '@/stores/configStore.js'
import { useFavoriteStore } from '@/stores/favoriteStore';
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue';
import SearchBar from '@/components/exercise/SearchBar.vue';
import WeatherCard from '@/components/exercise/WeatherCard.vue';

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '강릉', temp: 31, status: '맑음' },
  { id: 'city_05', name: '대전', temp: 22, status: '흐림' },
  { id: 'city_06', name: '제주', temp: null, status: '관측 장애' },
])

const searchQuery = ref('')

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
})

const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const selectedId = ref('')


const filteredWeatherList = computed(() => {
    return weatherList.value.filter((item) => item.name.includes(searchQuery.value))
})

watch(selectedCityInfo, (newInfo, oldInfo) => {
    console.log(`[watch] 상태바 변경: "${oldInfo}" => "${newInfo}"`)
})

watchEffect(() => {
    console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

// 검색어 변경을 주소창에 동기화 (히스토리를 더럽히지 않도록 replace 사용)
watch(searchQuery, (newQuery) => {
  router.replace({
    query: newQuery ? { search: newQuery } : {},
  })
})

const tempToWidth = (temp) => ((temp + 10) / 50) * 100 + '%'

const convertTemp = (celsius) => {
    if (celsius === null) return null
    return configStore.unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius

}

const sortedWeatherList = computed(() => {
  const list = filteredWeatherList.value
  if (configStore.sortOrder === 'desc') {
    return list.toSorted((a, b) => (b.temp ?? -99) - (a.temp ?? -99))
  }
  if (configStore.sortOrder === 'asc') {
    return list.toSorted((a, b) => (a.temp ?? 99) - (b.temp ?? 99))
  }
  return list
})

const hottestCity = computed(() =>
  weatherList.value.filter((c) => c.temp !== null).toSorted((a, b) => b.temp - a.temp)[0],
)

// 자식이 emit 으로 올려보낸 이벤트를 처리하는 핸들러
const handleUpdateQuery = (value) => {
  searchQuery.value = value
}

const handleSelectCard = (city) => {
  selectedId.value = city.id
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
}

const handleClickDetail = (city) => {
  router.push(`/weather/${city.id}`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar :query="searchQuery" @update-query="handleUpdateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <div class="list-head">
        <h3>🏙️ 지역별 날씨 현황</h3>
        <div class="head-buttons">
          <button class="btn-sort" @click="configStore.toggleSort">
            {{ configStore.sortLabel }}
          </button>
        </div>
      </div>

      <p class="summary" v-if="hottestCity">
        오늘 가장 더운 곳: <strong>{{ hottestCity.name }}</strong>
        ({{ convertTemp(hottestCity.temp) }}{{ configStore.unitSymbol }})
      </p>

      <WeatherCard
        v-for="item in sortedWeatherList"
        :key="item.id"
        :city="item"
        :display-temp="convertTemp(item.temp)"
        :unit="configStore.unitSymbol"
        :gauge-width="item.temp !== null ? tempToWidth(item.temp) : '0%'"
        :is-selected="selectedId === item.id"
        :is-favorite="favoriteStore.isFavorite(item.id)"
        @select-card="handleSelectCard"
        @click-detail="handleClickDetail"
        @toggle-favorite="favoriteStore.toggleFavorite"
      />

      <p v-if="sortedWeatherList.length === 0" class="no-result">
        검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper h3,
.dashboard-wrapper p {
  color: #2c3e50;
}

.list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.head-buttons {
  display: flex;
  gap: 8px;
}

.btn-sort {
  padding: 6px 12px;
  border: 1px solid #42b883;
  border-radius: 4px;
  background: #fff;
  color: #42b883;
  cursor: pointer;
}

.summary {
  margin: 8px 0 12px;
  font-size: 14px;
}

.no-result {
  padding: 20px;
  text-align: center;
  color: #868e96;
}
</style>