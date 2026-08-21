<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})

const TABS = [
  { key: 'temp', label: '날씨', unit: '°' },
  { key: 'pop', label: '강수', unit: '%' },
  { key: 'windSpeed', label: '바람', unit: 'm/s' },
  { key: 'humidity', label: '습도', unit: '%' },
]

const activeTab = ref('temp')

const currentTab = computed(() => TABS.find((t) => t.key === activeTab.value))

// 현재 탭의 값 배열
const values = computed(() => props.list.map((item) => item[activeTab.value]))

// 값의 범위를 잡아 y좌표(0~40)로 환산
const points = computed(() => {
  if (values.value.length === 0) return ''
  const min = Math.min(...values.value)
  const max = Math.max(...values.value)
  const range = max - min || 1 // 모두 같은 값일 때 0으로 나누기 방지

  return values.value
    .map((v, i) => {
      const x = i * 60 + 30 // 칸 너비 60, 가운데 정렬
      const y = 40 - ((v - min) / range) * 32 // 위쪽이 높은 값
      return `${x},${y}`
    })
    .join(' ')
})

const chartWidth = computed(() => props.list.length * 60)

const formatHour = (dtTxt) => {
  // "2026-08-24 15:00:00" → "15시"
  const hour = dtTxt.split(' ')[1].slice(0, 2)
  return `${Number(hour)}시`
}

const isNewDay = (dtTxt) => dtTxt.split(' ')[1].startsWith('00')

const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}.png`
</script>

<template>
  <div class="forecast">
    <!-- 탭 -->
    <div class="tabs">
      <button
        v-for="tab in TABS"
        :key="tab.key"
        class="tab"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 차트 -->
    <div v-if="list.length" class="chart-scroll">
      <div class="chart" :style="{ width: chartWidth + 'px' }">
        <!-- 값 라벨 -->
        <div class="row labels">
          <span v-for="(item, i) in list" :key="item.dt" class="cell">
            {{ values[i] }}{{ currentTab.unit }}
          </span>
        </div>

        <!-- 꺾은선 -->
        <svg class="line" :viewBox="`0 0 ${chartWidth} 40`" preserveAspectRatio="none">
          <polyline :points="points" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" />
        </svg>

        <!-- 아이콘 -->
        <div class="row icons">
          <span v-for="item in list" :key="item.dt" class="cell">
            <img :src="iconUrl(item.icon)" :alt="item.status" />
          </span>
        </div>

        <!-- 시각 -->
        <div class="row times">
          <span
            v-for="item in list"
            :key="item.dt"
            class="cell"
            :class="{ 'new-day': isNewDay(item.dtTxt) }"
          >
            {{ isNewDay(item.dtTxt) ? '내일' : formatHour(item.dtTxt) }}
          </span>
        </div>
      </div>
    </div>

    <p v-else class="empty">예보 정보를 불러오는 중입니다...</p>
  </div>
</template>

<style scoped>
.forecast {
  position: relative;
  z-index: 1;
  min-width: 0;
  padding: 12px 0;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  backdrop-filter: blur(6px);
}

.tabs {
  display: flex;
  gap: 6px;
  padding: 0 12px 10px;
}

.tab {
  padding: 4px 14px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 16px;
  background: transparent;
  color: rgba(255, 255, 255, 0.75);
  font-size: 12px;
  cursor: pointer;
}

.tab.active {
  border-color: #fff;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: 700;
}

.chart-scroll {
  overflow-x: auto;
  min-width: 0;
  padding: 0 12px;
}

.chart {
  position: relative;
}

.row {
  display: flex;
}

.cell {
  flex: 0 0 60px;
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
}

.labels .cell {
  font-weight: 700;
}

.line {
  display: block;
  width: 100%;
  height: 40px;
}

.icons img {
  width: 36px;
  height: 36px;
}

.times .cell.new-day {
  color: #74b9ff;
  font-weight: 700;
}

.empty {
  padding: 20px;
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}
</style>