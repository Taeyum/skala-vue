<script setup>
import { ref } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore.js'

const weatherStore = useWeatherStore()

const keyword = ref('')
const message = ref('')
const isOk = ref(true)
const isAdding = ref(false)

const handleAdd = async () => {
  isAdding.value = true
  const result = await weatherStore.addCity(keyword.value)
  isOk.value = result.ok
  message.value = result.message
  if (result.ok) keyword.value = ''
  isAdding.value = false
}
</script>

<template>
  <div class="city-adder">
    <div class="input-row">
      <input
        type="text"
        :value="keyword"
        @input="(e) => (keyword = e.target.value)"
        @keyup.enter="handleAdd"
        placeholder="도시 추가 (예: 서울, Tokyo)"
        :disabled="isAdding"
      />
      <button class="btn-add" @click="handleAdd" :disabled="isAdding">
        {{ isAdding ? '조회 중' : '추가' }}
      </button>
    </div>
    <p v-if="message" class="msg" :class="{ error: !isOk }">{{ message }}</p>
  </div>
</template>

<style scoped>
.city-adder h3 {
  margin: 0 0 8px;
  color: #2c3e50;
}

.input-row {
  display: flex;
  gap: 8px;
}

.input-row input {
  flex: 1;
  padding: 11px 14px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  color: #2c3e50;
  font-size: 14px;
}

.btn-add {
  padding: 11px 18px;
  border: none;
  border-radius: 12px;
  background: #3498db;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.btn-add:disabled {
  opacity: 0.6;
  cursor: default;
}

.msg {
  position: absolute;
  margin: 4px 0 0;
  font-size: 12px;
  color: #fff;
}

.msg.error {
  color: #e74c3c;
}
</style>