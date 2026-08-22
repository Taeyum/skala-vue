<script setup>
import { PROVINCES, VIEW_W, VIEW_H } from '@/utils/koreaMap.js'

defineProps({
  // { [시도코드]: '#rrggbb' } — 없으면 기본 색으로 그린다
  fills: { type: Object, default: () => ({}) },
  // 강조할 시도 코드
  activeCode: { type: String, default: '' },
})
</script>

<template>
  <div class="stage">
    <!-- 바닥: 시도 경계. 구멍(전남 안의 광주)은 evenodd가 처리한다 -->
    <svg
      class="layer layer-land"
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

    <!-- 지도 위에 얹을 것들 (마커·화살표 등) -->
    <slot></slot>
  </div>
</template>

<style scoped>
.stage {
  position: relative;
  width: 100%;
  /* viewBox와 같은 비율로 고정한다.
     레터박스가 0이 되어야 마커의 % 좌표가 viewBox 단위와 1:1로 맞는다 */
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
</style>
