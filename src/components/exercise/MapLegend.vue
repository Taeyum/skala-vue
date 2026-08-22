<script setup>
import { computed } from 'vue'
import { TEMP_STOPS, WIND_LEVELS } from '@/utils/weatherTheme.js'

const props = defineProps({
  unit: { type: String, default: '℃' },
  // 눈금 숫자도 화면 단위를 따라야 해서 부모의 변환 함수를 받는다
  convertTemp: { type: Function, default: (t) => t },
  showWind: { type: Boolean, default: false },
})

const MIN = TEMP_STOPS[0][0]
const MAX = TEMP_STOPS.at(-1)[0]

// 그라디언트 정지점을 온도 범위에 대한 비율로 환산 (과제 1의 게이지 환산과 같은 방식)
const gradientStops = computed(() =>
  TEMP_STOPS.map(([t, color]) => ({ offset: ((t - MIN) / (MAX - MIN)) * 100, color })),
)

const TICKS = [-10, 0, 10, 20, 30]
const ticks = computed(() =>
  TICKS.map((t) => ({ left: ((t - MIN) / (MAX - MIN)) * 100, label: props.convertTemp(t) })),
)
</script>

<template>
  <div class="legend">
    <div class="temp">
      <span class="cap">기온</span>
      <div class="bar-wrap">
        <svg class="bar" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="tempScale" x1="0" y1="0" x2="1" y2="0">
              <stop
                v-for="s in gradientStops"
                :key="s.offset"
                :offset="`${s.offset}%`"
                :stop-color="s.color"
              />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="100" height="8" fill="url(#tempScale)" rx="1" />
        </svg>
        <div class="ticks">
          <span v-for="t in ticks" :key="t.label" class="tick" :style="{ left: t.left + '%' }">
            {{ t.label }}{{ unit }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="showWind" class="wind">
      <span class="cap">바람</span>
      <span v-for="l in WIND_LEVELS" :key="l.label" class="wind-item">
        <span class="swatch" :style="{ background: l.color }"></span>
        {{ l.label }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.legend {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-6);
  flex-wrap: wrap;
  color: rgba(255, 255, 255, 0.85);
  font-size: var(--fs-xs);
}

.temp {
  flex: 1 1 260px;
  display: flex;
  align-items: flex-start;
  gap: var(--sp-2);
}

.cap {
  padding-top: 1px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
}

.bar-wrap {
  flex: 1;
  min-width: 0;
}

.bar {
  display: block;
  width: 100%;
  height: 8px;
  border-radius: 2px;
}

.ticks {
  position: relative;
  height: 14px;
  margin-top: 2px;
}

.tick {
  position: absolute;
  transform: translateX(-50%);
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
}

.wind {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}

.wind-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.swatch {
  width: 16px;
  height: 3px;
  border-radius: 2px;
}
</style>
