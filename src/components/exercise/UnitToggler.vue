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
  font-size: 13px;
  color: #7f8c8d;
}

.btn-unit {
  padding: 4px 12px;
  border: 1px solid #3498db;
  border-radius: 20px;
  background: #fff;
  color: #3498db;
  font-weight: bold;
  cursor: pointer;
}

.btn-unit:hover {
  background: #3498db;
  color: #fff;
}
</style>