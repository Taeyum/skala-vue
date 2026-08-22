<script setup>
import { PROVINCES, SEA_PATH, VIEW_W, VIEW_H } from '@/utils/koreaMap.js'
import RollingNumber from '@/components/exercise/RollingNumber.vue'

defineProps({
  // { [시도코드]: '#rrggbb' }
  fills: { type: Object, default: () => ({}) },
  // 부모가 좌표·온도까지 계산해 넘긴다. 이 컴포넌트는 그리기만 한다
  // { id, name, x, y, dx, dy, temp, icon, selected, night }
  markers: { type: Array, default: () => [] },
  // { x, y, bearing, color } — 방향 계산은 부모(windField)가 끝내서 넘긴다
  arrows: { type: Array, default: () => [] },
  unit: { type: String, default: '℃' },
  activeCode: { type: String, default: '' },
})

defineEmits(['select'])

const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}.png`
</script>

<template>
  <div class="stage">
    <!-- 바닥: 시도 경계. 전남 안의 광주 같은 구멍은 evenodd가 처리한다 -->
    <svg
      class="layer"
      :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path
        v-for="p in PROVINCES"
        :key="p.code"
        :d="p.d"
        class="province"
        :class="{ active: p.code === activeCode }"
        :fill="fills[p.code] ?? '#39465c'"
        fill-rule="evenodd"
      />
    </svg>

    <!-- 입자 흐름 캔버스. 마스킹 없이 통째로 그리고 바로 아래 바다 마스크로 가린다 -->
    <slot name="flow"></slot>

    <!-- 바다 마스크 + 바람 화살표.
         화살표 글리프를 북쪽으로 그려 두고 rotate만 걸면
         SVG 회전(시계방향)과 나침반 방위각이 같은 규칙이라 방향이 맞는다 -->
    <svg
      class="layer"
      :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <!-- 육지가 뚫린 마스크. 바다로 나간 입자를 덮는다 -->
      <path :d="SEA_PATH" fill="#0e1622" fill-rule="evenodd" />

      <g
        v-for="(a, i) in arrows"
        :key="i"
        class="arrow"
        :transform="`translate(${a.x} ${a.y}) rotate(${a.bearing})`"
      >
        <path d="M0,-9 L0,7" :stroke="a.color" stroke-width="1.6" stroke-linecap="round" />
        <path
          d="M-3.4,-4.4 L0,-9.4 L3.4,-4.4"
          :stroke="a.color"
          stroke-width="1.6"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>

    <!-- 지시선과 관측 지점. 칩은 비켜 놓지만 점은 실제 좌표에 남는다 -->
    <svg
      class="layer"
      :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g v-for="m in markers" :key="m.id">
        <line
          class="leader"
          :class="{ selected: m.selected }"
          :x1="m.x"
          :y1="m.y"
          :x2="m.x + m.dx"
          :y2="m.y + m.dy"
        />
        <circle class="dot" :class="{ selected: m.selected }" :cx="m.x" :cy="m.y" r="4" />
      </g>
    </svg>

    <!-- 마커 칩: SVG가 아니라 HTML이라 글자가 축척에 눌리지 않고 버튼으로 동작한다 -->
    <div class="layer layer-markers">
      <button
        v-for="m in markers"
        :key="m.id"
        class="chip"
        :class="{ selected: m.selected }"
        :style="{
          left: ((m.x + m.dx) / VIEW_W) * 100 + '%',
          top: ((m.y + m.dy) / VIEW_H) * 100 + '%',
        }"
        :aria-label="`${m.name} ${m.temp ?? '관측 없음'}${unit}`"
        @click="$emit('select', m.id)"
      >
        <img v-if="m.icon" :src="iconUrl(m.icon)" alt="" class="chip-icon" />
        <span class="chip-temp"><RollingNumber :value="m.temp" />{{ unit }}</span>
        <span class="chip-name">{{ m.name }}<span v-if="m.night"> 🌙</span></span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.stage {
  position: relative;
  width: 100%;
  /* viewBox와 같은 비율로 고정해야 레터박스가 0이 되고,
     칩의 % 좌표가 viewBox 단위와 1:1로 맞는다 */
  aspect-ratio: 800 / 866;
  border-radius: var(--r-md);
  overflow: hidden;
  background: #0e1622;
}

.layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.layer-markers {
  pointer-events: none;
}

.province {
  stroke: rgba(255, 255, 255, 0.28);
  stroke-width: 1.2;
  stroke-linejoin: round;
  transition: fill var(--dur-3) var(--ease-in-out);
}

.province.active {
  stroke: rgba(255, 255, 255, 0.95);
  stroke-width: 2.4;
}

.arrow {
  transition: transform var(--dur-3) var(--ease-in-out);
}

.leader {
  stroke: rgba(255, 255, 255, 0.45);
  stroke-width: 1;
}

.leader.selected {
  stroke: rgba(255, 255, 255, 0.9);
}

.dot {
  fill: #fff;
  stroke: rgba(0, 0, 0, 0.45);
  stroke-width: 1;
}

.dot.selected {
  fill: var(--c-primary);
  stroke: #fff;
  stroke-width: 2;
}

.chip {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 3px 7px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: var(--r-pill);
  background: rgba(12, 18, 30, 0.72);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  color: #fff;
  font-size: var(--fs-xs);
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  pointer-events: auto;
  transition:
    transform var(--dur-2) var(--ease-out),
    background var(--dur-2) var(--ease-out),
    border-color var(--dur-2) var(--ease-out);
}

.chip:hover {
  transform: translate(-50%, -50%) scale(1.08);
  background: rgba(20, 30, 48, 0.9);
}

.chip:active {
  transform: translate(-50%, -50%) scale(0.96);
  transition-duration: var(--dur-1);
}

.chip.selected {
  border-color: var(--c-primary);
  background: var(--c-primary);
}

.chip:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.chip-icon {
  width: 20px;
  height: 20px;
  margin: -4px -2px -4px -4px;
}

.chip-temp {
  font-variant-numeric: tabular-nums;
}

/* 도시명은 평소엔 숨기고 선택·호버 때만 편다. 17개 칩이 이름까지 달면 서로 덮는다 */
.chip-name {
  max-width: 0;
  overflow: hidden;
  opacity: 0;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  transition:
    max-width var(--dur-2) var(--ease-out),
    opacity var(--dur-2) var(--ease-out),
    margin-left var(--dur-2) var(--ease-out);
}

.chip:hover .chip-name,
.chip.selected .chip-name,
.chip:focus-visible .chip-name {
  max-width: 80px;
  margin-left: 3px;
  opacity: 1;
}
</style>
