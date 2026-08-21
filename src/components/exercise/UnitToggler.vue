<script setup>
import { useConfigStore } from '@/stores/configStore.js'

// props·emits 없이 스토어를 직접 사용 (과제 5 요구사항 1)
const configStore = useConfigStore()

const UNITS = [
  { value: 'celsius', symbol: '℃' },
  { value: 'fahrenheit', symbol: '℉' },
]

// 이미 선택된 단위를 누르면 아무 일도 하지 않는다
const select = (value) => {
  if (configStore.unit !== value) configStore.toggleUnit()
}
</script>

<template>
  <div class="unit-toggler" role="group" aria-label="온도 단위">
    <button
      v-for="u in UNITS"
      :key="u.value"
      class="seg"
      :class="{ active: configStore.unit === u.value }"
      :aria-pressed="configStore.unit === u.value"
      @click="select(u.value)"
    >
      {{ u.symbol }}
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  padding: 3px;
  border-radius: var(--r-pill);
  background: rgba(44, 62, 80, 0.08);
}

.seg {
  min-width: 38px;
  padding: 5px 10px;
  border: none;
  border-radius: var(--r-pill);
  background: transparent;
  color: var(--c-text-sub);
  font-size: var(--fs-sm);
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s,
    box-shadow 0.2s;
}

.seg:hover {
  color: var(--c-text);
}

.seg.active {
  background: #fff;
  color: var(--c-primary);
  box-shadow: var(--shadow-sm);
}

.seg:focus-visible {
  outline: 2px solid var(--c-primary);
  outline-offset: 1px;
}
</style>
