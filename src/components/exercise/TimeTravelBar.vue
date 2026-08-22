<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { describeSlot } from '@/utils/localTime.js'

const props = defineProps({
  // 선택 도시의 3시간 예보 (dt 오름차순, 최대 40개)
  slots: { type: Array, default: () => [] },
  // 현지 라벨용 UTC 오프셋(초)
  timezone: { type: Number, default: 0 },
  // 선택 인덱스. -1 = 지금(현재 날씨)
  modelValue: { type: Number, default: -1 },
  // "지금" 슬롯에 보여줄 현재 날씨 { icon, temp }
  current: { type: Object, default: null },
  // 온도 표시용
  convertTemp: { type: Function, default: (t) => t },
})

const emit = defineEmits(['update:modelValue'])

const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}.png`

// 슬롯을 날짜별로 묶는다 [{ day: '내일', items: [{ index, time, icon, temp }] }]
const groups = computed(() => {
  const out = []
  props.slots.forEach((s, index) => {
    const d = describeSlot(s.dt, props.timezone)
    const item = { index, time: d.time, hour: d.hour, icon: s.icon, temp: s.temp, pop: s.pop }
    const last = out[out.length - 1]
    if (last && last.diff === d.diff) last.items.push(item)
    else out.push({ day: d.day, diff: d.diff, items: [item] })
  })
  return out
})

const select = (index) => emit('update:modelValue', index)

// ← → 로 한 구간씩 이동
const onKey = (e) => {
  if (e.key === 'ArrowRight') select(Math.min(props.modelValue + 1, props.slots.length - 1))
  if (e.key === 'ArrowLeft') select(Math.max(props.modelValue - 1, -1))
}

// 선택한 슬롯이 보이도록 스크롤
const strip = ref(null)
watch(
  () => props.modelValue,
  async (v) => {
    await nextTick()
    const el = strip.value?.querySelector(`[data-index="${v}"]`)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', inline: 'center', block: 'nearest' })
  },
)
</script>

<template>
  <div v-if="slots.length" class="timeline">
    <!-- 헤더: 제목 + 시간여행 중일 때만 "지금으로" -->
    <div class="head">
      <span class="head-title">시간별 예보</span>
      <span class="head-hint">칩을 누르면 그 시각의 날씨로 바뀝니다</span>
      <Transition name="fade">
        <button v-if="modelValue >= 0" class="reset" @click="select(-1)">↺ 지금으로</button>
      </Transition>
    </div>

    <div
      ref="strip"
      class="strip"
      role="listbox"
      aria-label="예보 시각 선택"
      tabindex="0"
      @keydown="onKey"
    >
      <!-- 날짜별 그룹: 위에 요일, 아래에 3시간 슬롯. "지금"은 첫 그룹의 첫 칩 -->
      <div v-for="(g, gi) in groups" :key="g.diff" class="group" :class="{ first: gi === 0 }">
        <div class="group-head">{{ g.day }}</div>
        <div class="group-row">
          <button
            v-if="gi === 0"
            class="slot"
            :class="{ active: modelValue < 0 }"
            :data-index="-1"
            role="option"
            :aria-selected="modelValue < 0"
            @click="select(-1)"
          >
            <span class="slot-time">지금</span>
            <img v-if="current?.icon" class="slot-icon" :src="iconUrl(current.icon)" alt="" />
            <span v-else class="slot-icon"></span>
            <span class="slot-temp">{{ convertTemp(current?.temp) ?? '--' }}°</span>
          </button>
          <button
            v-for="it in g.items"
            :key="it.index"
            class="slot"
            :class="{ active: modelValue === it.index, night: it.hour < 6 || it.hour >= 19 }"
            :data-index="it.index"
            role="option"
            :aria-selected="modelValue === it.index"
            @click="select(it.index)"
          >
            <span class="slot-time">{{ it.time }}</span>
            <img class="slot-icon" :src="iconUrl(it.icon)" alt="" />
            <span class="slot-temp">{{ convertTemp(it.temp) }}°</span>
            <span v-if="it.pop >= 30" class="slot-pop">{{ it.pop }}%</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  min-height: 26px;
  margin-bottom: var(--sp-1);
}

.head-title {
  font-size: var(--fs-xs);
  font-weight: 700;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.85);
}

.head-hint {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.reset {
  margin-left: auto;
  padding: 4px 12px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: var(--fs-xs);
  font-weight: 700;
  cursor: pointer;
  transition:
    background var(--dur-2) var(--ease-out),
    color var(--dur-2) var(--ease-out);
}

.reset:hover {
  background: #fff;
  color: var(--c-text);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--dur-2) var(--ease-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.strip {
  display: flex;
  align-items: stretch;
  gap: var(--sp-3);
  overflow-x: auto;
  padding: 2px 2px var(--sp-2);
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  outline: none;
}

.strip::-webkit-scrollbar {
  height: 4px;
}

.strip::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.3);
}

.strip:focus-visible {
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.6);
  border-radius: var(--r-md);
}

.slot {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 56px;
  padding: var(--sp-2) 6px;
  border: 1px solid transparent;
  border-radius: var(--r-md);
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  transition:
    background var(--dur-2) var(--ease-out),
    border-color var(--dur-2) var(--ease-out),
    transform var(--dur-2) var(--ease-out);
}

.slot:hover {
  background: rgba(255, 255, 255, 0.12);
}

.slot:active {
  transform: scale(0.94);
  transition-duration: var(--dur-1);
}

.slot.active {
  background: #fff;
  color: var(--c-text);
  box-shadow: var(--shadow-sm);
  transform: translateY(-2px);
}

.slot.night:not(.active) {
  color: rgba(255, 255, 255, 0.6);
}

.slot-time {
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.slot-icon {
  width: 30px;
  height: 30px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.slot.active .slot-icon {
  filter: none;
}

.slot-temp {
  font-size: var(--fs-sm);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.slot-pop {
  font-size: 10px;
  color: #74b9ff;
  font-weight: 600;
}

.slot.active .slot-pop {
  color: var(--c-primary);
}

/* 날짜 그룹 — 위에 요일 헤더, 아래 슬롯 행 */
.group {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: var(--sp-3);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.group-head {
  padding: 0 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.65);
}

.group-row {
  display: flex;
  gap: 2px;
}

.group.first {
  padding-left: 0;
  border-left: none;
}
</style>
