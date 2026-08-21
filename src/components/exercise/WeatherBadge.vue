<script setup>
defineProps({
  temp: {
    type: [Number, null],
    default: null,
  },
})
</script>

<template>
  <span v-if="temp === null" class="badge unknown">❓ 관측 불가</span>
  <span v-else-if="temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
  <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: #fff;
}

.hot {
  background-color: #ff7675;
}

.cool {
  background-color: #74b9ff;
}

.unknown {
  background-color: #b2bec3;
}
</style>