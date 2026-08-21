<script setup>
import { useConfigStore } from '@/stores/configStore.js'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span class="label">온도 단위</span>
    <button class="btn-unit" @click="configStore.toggleUnit">
      {{ configStore.unitSymbol }}
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 6px;
}

.label {
  font-size: var(--fs-sm);
  color: var(--c-text-sub);
}

.btn-unit {
  padding: var(--sp-1) var(--sp-3);
  border: 1px solid var(--c-primary);
  border-radius: var(--r-pill);
  background: #fff;
  color: var(--c-primary);
  font-size: var(--fs-sm);
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}

.btn-unit:hover {
  background: var(--c-primary);
  color: #fff;
}
</style>
