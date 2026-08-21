<script setup>
defineProps({
  width: {
    type: String,
    default: '0%',
  },
})
</script>

<template>
  <div class="gauge-track">
    <div class="gauge-fill" :style="{ width }"></div>
  </div>
</template>

<style scoped>
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
</style>