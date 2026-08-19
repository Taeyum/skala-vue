<script setup>
import { ref } from 'vue'

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

const showDetail = (cityName, status) => {
  window.alert(`${cityName} 현재 날씨는 [${status}] 입니다.`)
}

// 기온을 게이지 너비(%)로 환산 — 한국 기온 범위 -10~40도를 0~100%로 매핑
const tempToWidth = (temp) => ((temp + 10) / 50) * 100 + '%'

const sortByTemp = () => {
  weatherList.value = weatherList.value.toSorted((a, b) => (b.temp ?? -99) - (a.temp ?? -99))
}

const hottestCity = () =>
  weatherList.value.filter((c) => c.temp !== null).toSorted((a, b) => b.temp - a.temp)[0]
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <div class="list-head">
        <h3>🏙️ 지역별 날씨 현황</h3>
        <button class="btn-sort" @click="sortByTemp">🌡️ 기온 높은 순 정렬</button>
      </div>

      <p class="summary">
        오늘 가장 더운 곳: <strong>{{ hottestCity().name }}</strong> ({{ hottestCity().temp }}°C)
      </p>

      <div
        v-for="item in weatherList"
        :key="item.id"
        class="weather-card"
        :class="{
          'is-hot': item.temp >= 25,
          'is-cool': item.temp !== null && item.temp < 25,
          'is-selected': selectedId === item.id,
        }"
        @click="
          selectedId = item.id
          selectedCityInfo = `${item.name}이 선택되었습니다.`
        "
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp ?? '측정 불가' }}{{ item.temp === null ? '' : '°C' }}</p>

        <div v-if="item.temp !== null" class="gauge-track">
          <div class="gauge-fill" :style="{ width: tempToWidth(item.temp) }"></div>
        </div>

        <span v-if="item.temp === null" class="badge unknown">❓ 관측 불가</span>
        <span v-else-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>
    </section>

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

/* 온도 구간별 카드 배경 */
.weather-card.is-hot {
  background: #fff5f4;
  border-color: #ffc9c2;
}

.weather-card.is-cool {
  background: #f4f9ff;
  border-color: #c2dcff;
}

/* 선택된 카드 강조 */
.weather-card.is-selected {
  border-color: #42b883;
  border-width: 2px;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.15);
}

/* 온도 게이지 */
.gauge-track {
  width: 100%;
  height: 8px;
  margin: 8px 0;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.gauge-fill {
  height: 100%;
  background: linear-gradient(90deg, #74b9ff, #ff7675);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.badge.unknown {
  background-color: #b2bec3;
}
</style>
