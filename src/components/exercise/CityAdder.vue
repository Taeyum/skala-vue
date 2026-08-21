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
    <h3>➕ 도시 추가</h3>
    <div class="input-row">
      <input
        type="text"
        :value="keyword"
        @input="(e) => (keyword = e.target.value)"
        @keyup.enter="handleAdd"
        placeholder="영문 도시명 입력 (예: Tokyo, London)"
        :disabled="isAdding"
      />
      <button class="btn-add" @click="handleAdd" :disabled="isAdding">
        {{ isAdding ? '조회 중...' : '추가' }}
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
  padding: 8px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.btn-add {
  padding: 8px 16px;
  border: 1px solid #42b883;
  border-radius: 4px;
  background: #42b883;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}

.btn-add:disabled {
  opacity: 0.6;
  cursor: default;
}

.msg {
  margin: 8px 0 0;
  font-size: 13px;
  color: #2c3e50;
}

.msg.error {
  color: #e74c3c;
}
</style>