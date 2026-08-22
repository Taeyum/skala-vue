<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  value: { type: [Number, String], default: null },
  duration: { type: Number, default: 450 },
})

const text = ref('--')
let rafId = null
// 마지막으로 화면에 그린 실수값 — 트윈 도중 새 값이 오면 이 지점부터 방향만 바꿔 이어간다
let shown = null

const decimalsOf = (v) => {
  const s = String(v)
  const i = s.indexOf('.')
  return i === -1 ? 0 : s.length - i - 1
}

watch(
  () => props.value,
  (nv) => {
    cancelAnimationFrame(rafId)
    const to = Number(nv)
    if (nv === null || nv === undefined || nv === '' || Number.isNaN(to)) {
      text.value = '--'
      shown = null
      return
    }
    const decimals = decimalsOf(nv)
    const from = shown
    // 최초 표시와 '--'에서의 복귀는 스냅 — 없던 값이 0부터 굴러오면 거짓 연속성이 된다
    if (from === null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      shown = to
      text.value = to.toFixed(decimals)
      return
    }
    const start = performance.now()
    const step = (t) => {
      const p = Math.min((t - start) / props.duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      shown = from + (to - from) * eased
      text.value = shown.toFixed(decimals)
      if (p < 1) rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)
  },
  { immediate: true },
)

onUnmounted(() => cancelAnimationFrame(rafId))
</script>

<template>
  <span class="rolling">{{ text }}</span>
</template>

<style scoped>
.rolling {
  /* 트윈 중 자릿수가 흔들려도 폭이 일정해야 리플로우가 없다 */
  font-variant-numeric: tabular-nums;
}
</style>
