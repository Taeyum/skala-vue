<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useConfigStore } from '@/stores/configStore.js'
import { useFavoriteStore } from '@/stores/favoriteStore';
import { useWeatherStore } from '@/stores/weatherStore';
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue';
import SearchBar from '@/components/exercise/SearchBar.vue';
import WeatherCard from '@/components/exercise/WeatherCard.vue';
import { getGradient } from '@/utils/weatherTheme.js'
import CityAdder from '@/components/exercise/CityAdder.vue'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()
const weatherStore = useWeatherStore()

const searchQuery = ref('')

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  if (!weatherStore.hasData) {
    weatherStore.fetchAll()
  }
})

const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const selectedId = ref('')


const filteredWeatherList = computed(() => {
    return weatherStore.weatherList.filter((item) => item.name.includes(searchQuery.value))
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

const backgroundStyle = computed(() => {
  const selected = weatherStore.weatherList.find((c) => c.id === selectedId.value)
  return { background: getGradient(selected?.main) }
})

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

const handleRemoveCard = (cityId) => {
  weatherStore.removeCity(cityId)
  // 삭제한 도시가 선택 상태였다면 초기화
  if (selectedId.value === cityId) {
    selectedId.value = ''
    selectedCityInfo.value = '카드를 클릭하거나 검색해 보세요.'
  }
  if (favoriteStore.isFavorite(cityId)) {
  favoriteStore.toggleFavorite(cityId)
  } 
}
</script>

<template>
  <div class="dashboard-wrapper" :style="backgroundStyle">
    <BaseDashboardCard>
      <SearchBar :query="searchQuery" @update-query="handleUpdateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <CityAdder />
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

      <p v-if="weatherStore.isLoading" class="state-msg">날씨 정보를 불러오는 중입니다...</p>
        <p v-else-if="weatherStore.errorMessage" class="state-msg error">
          {{ weatherStore.errorMessage }}
        </p>  

      <p class="summary" v-if="weatherStore.hottestCity">
        오늘 가장 더운 곳: <strong>{{ weatherStore.hottestCity.name }}</strong>
        ({{ convertTemp(weatherStore.hottestCity.temp) }}{{ configStore.unitSymbol }})
      </p>

      <WeatherCard
        v-for="item in sortedWeatherList"
        :key="item.id"
        :city="item"
        :display-temp="convertTemp(item.temp)"
        :unit="configStore.unitSymbol"
        :icon="item.icon"
        :gauge-width="item.temp !== null ? tempToWidth(item.temp) : '0%'"
        :is-selected="selectedId === item.id"
        :is-favorite="favoriteStore.isFavorite(item.id)"
        :can-remove="!item.id.startsWith('city_0')"
        @select-card="handleSelectCard"
        @click-detail="handleClickDetail"
        @toggle-favorite="favoriteStore.toggleFavorite"
        @remove-card="handleRemoveCard"
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

.state-msg {
  padding: 20px;
  text-align: center;
  color: #868e96;
}

.state-msg.error {
  color: #e74c3c;
}
.dashboard-wrapper {
  padding: 20px;
  border-radius: 12px;
  transition: background 0.6s ease;
}
.status-bar {
  background: rgba(232, 245, 233, 0.8);
}
</style>