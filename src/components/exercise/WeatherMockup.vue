<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

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

// 온도 표시 단위 ('C' 또는 'F')
const unit = ref('C')

// 즐겨 찾기
const favoriteIds = ref([])

// splice(위치, 1)으로 해당 배열에서 하나 제거
const toggleFavorite = (cityId) => {
    const index = favoriteIds.value.indexOf(cityId)
    if (index === -1) {
        favoriteIds.value.push(cityId)
    } else {
        favoriteIds.value.splice(index, 1)
    }
}

// 검색어가 도시 이름에 포함된 항목만 걸러낸 목록 
// [computed(() => { return 값 })] 기본 형태, filter : true 인 항목만 모아 새 배열을 반환
// item 을 돌며, 검색한 값이 존재하는 지 본다 , 빈 문자열이면 모두 포함된 걸로 봄
const filteredWeatherList = computed(() => {
    return weatherList.value.filter((item) => item.name.includes(searchQuery.value))
})

// 상태바 문구가 바뀔 때마다 콘솔 로그
// watch(감시대상, 콜백) 기본 형태, watch는 변수를 그대로 넘김
// .value 를 붙이면 문자열 값이 그대로 넘어가서 감시대상이 아니라 그냥 문자열이 됨
watch(selectedCityInfo, (newInfo, oldInfo) => {
    console.log(`[watch] 상태바 변경: "${oldInfo}" => "${newInfo}"`)
})

// 검색어를 타이핑 할때마다 추적 (최초 1회 즉시 실행)
// 감시 대상을 적지 않음 Vue가 콜백 내부를 읽어 알아서 감시 목록에 등록
watchEffect(() => {
    console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

// 온도 단위가 바뀔 때마다 로그
watch(unit, (newUnit, oldUnit) => {
    console.log(`[watch] 온도 단위 변경: ${oldUnit} -> ${newUnit}`)
})

// deep 없이 - watch가 잡을까?, 예상은 안잡을 것
// 실제로 잡히지 않았음, deep 추가 후 잡는 것을 확인
watch(favoriteIds, (newVal) => {
    console.log(`[watch] 즐겨찾기 변경! 현재 ${newVal.length}개:`, newVal.join(', '))
}, {deep: true},
)

const showDetail = (cityName, status) => {
  window.alert(`${cityName} 현재 날씨는 [${status}] 입니다.`)
}

// 기온을 게이지 너비(%)로 환산 — 한국 기온 범위 -10~40도를 0~100%로 매핑
const tempToWidth = (temp) => ((temp + 10) / 50) * 100 + '%'

// 섭씨 원본값을 현재 단위에 맞춰 변환
// null 체크는 관측 불가 때문
const convertTemp = (celsius) => {
  if (celsius === null) return null
  return unit.value === 'F' ? Math.round((celsius * 9) / 5 + 32) : celsius
}

const sortByTemp = () => {
  weatherList.value = weatherList.value.toSorted((a, b) => (b.temp ?? -99) - (a.temp ?? -99))
}

// 일반 함수는 리렌더링 마다 재실행
// computed : weatherList가 바뀔 떄만 재계산함
const hottestCity = computed(() =>
  weatherList.value.filter((c) => c.temp !== null).toSorted((a, b) => b.temp - a.temp)[0],
)
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
        <div class="head-buttons">
            <button class="btn-sort" @click="sortByTemp">🌡️ 기온 높은 순 정렬</button>
            <button class="btn-sort" @click="unit = unit === 'C' ? 'F' : 'C'">
                {{ unit === 'C' ? '°F로 보기' : '°C로 보기' }}
            </button>
        </div>
    </div>

      <p class="summary">
        오늘 가장 더운 곳: <strong>{{ hottestCity.name }}</strong> ({{ convertTemp(hottestCity.temp) }}°{{unit}})
      </p>

      <div
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
        :class="{
          'is-hot': item.temp >= 25,
          'is-cool': item.temp !== null && item.temp < 25,
          'is-selected': selectedId === item.id,
        }"
        @click="
          selectedId = item.id;
          selectedCityInfo = `${item.name}이 선택되었습니다.`
        "
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ convertTemp(item.temp) ?? '측정 불가' }}{{ item.temp === null ? '' : `°${unit}` }}</p>

        <div v-if="item.temp !== null" class="gauge-track">
          <div class="gauge-fill" :style="{ width: tempToWidth(item.temp) }"></div>
        </div>

        <span v-if="item.temp === null" class="badge unknown">❓ 관측 불가</span>
        <span v-else-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>
        
        <button class="btn-fav" :class="{ active: favoriteIds.includes(item.id) }" @click.stop="toggleFavorite(item.id)">
            {{ favoriteIds.includes(item.id) ? '★' : '☆' }}
        </button>
            
        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>
      <p v-if="filteredWeatherList.length === 0" class="no-result">
        검색 결과와 일치하는 도시가 없습니다.
      </p>
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
.no-result {
  padding: 20px;
  text-align: center;
  color: #868e96;
}
.head-buttons {
  display: flex;
  gap: 8px;
}
.btn-fav {
  position: absolute;
  right: 90px;
  top: 15px;
  padding: 4px 8px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: #fff;
  font-size: 16px;
  cursor: pointer;
}

.btn-fav.active {
  border-color: #f7b731;
  color: #f7b731;
}
</style>
