<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue';
import SearchBar from './SearchBar.vue';
import WeatherCard from './WeatherCard.vue';

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '강릉', temp: 31, status: '맑음' },
  { id: 'city_05', name: '대전', temp: 22, status: '흐림' },
  { id: 'city_06', name: '제주', temp: null, status: '관측 장애' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const selectedId = ref('')
const unit = ref('C')
const favoriteIds = ref([])

const toggleFavorite = (cityId) => {
    const index = favoriteIds.value.indexOf(cityId)
    if(index === -1) {
        favoriteIds.value.push(cityId)
    } else {
        favoriteIds.value.splice(index, 1)
    }
}

const filteredWeatherList = computed(() => {
    return weatherList.value.filter((item) => item.name.includes(searchQuery.value))
})

watch(selectedCityInfo, (newInfo, oldInfo) => {
    console.log(`[watch] 상태바 변경: "${oldInfo}" => "${newInfo}"`)
})

watchEffect(() => {
    console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

watch(unit, (newUnit, oldUnit) => {
    console.log(`[watch] 온도 단위 변경: ${oldUnit} -> ${newUnit}`)
})

watch(
    favoriteIds,
    (newVal) => {
        console.log(`[watch] 즐겨찾기 변경! 현재 ${newVal.length}개:`, newVal.join(', '))
    },
    { deep: true },
)

const tempToWidth = (temp) => ((temp + 10) / 50) * 100 + '%'

const convertTemp = (celsius) => {
    if (celsius === null) return null
    return unit.value === 'F' ? Math.round((celsius * 9) / 5 + 32) : celsius
}

const sortByTemp = () => {
  weatherList.value = weatherList.value.toSorted((a, b) => (b.temp ?? -99) - (a.temp ?? -99))
}

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
  window.alert(`${city.name} 현재 날씨는 [${city.status}] 입니다.`)
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
          <button class="btn-sort" @click="sortByTemp">🌡️ 기온 높은 순 정렬</button>
          <button class="btn-sort" @click="unit = unit === 'C' ? 'F' : 'C'">
            {{ unit === 'C' ? '°F로 보기' : '°C로 보기' }}
          </button>
        </div>
      </div>

      <p class="summary">
        오늘 가장 더운 곳: <strong>{{ hottestCity.name }}</strong>
        ({{ convertTemp(hottestCity.temp) }}°{{ unit }})
      </p>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city="item"
        :display-temp="convertTemp(item.temp)"
        :unit="unit"
        :gauge-width="item.temp !== null ? tempToWidth(item.temp) : '0%'"
        :is-selected="selectedId === item.id"
        :is-favorite="favoriteIds.includes(item.id)"
        @select-card="handleSelectCard"
        @click-detail="handleClickDetail"
        @toggle-favorite="toggleFavorite"
      />

      <p v-if="filteredWeatherList.length === 0" class="no-result">
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
.dashboard-wrapper h4,
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