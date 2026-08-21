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
  margin: 0 0 var(--sp-2);
  color: var(--c-text);
}

.input-row {
  display: flex;
  gap: var(--sp-2);
}

.input-row input {
  flex: 1;
  padding: 11px 14px;
  border: 1px solid var(--surface-border);
  border-radius: var(--r-md);
  background: var(--surface);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  color: var(--c-text);
  font-size: var(--fs-body);
}

.input-row input:focus {
  outline: none;
  border-color: var(--c-primary);
}

.btn-add {
  padding: 11px 18px;
  border: none;
  border-radius: var(--r-md);
  background: var(--c-primary);
  color: #fff;
  font-size: var(--fs-body);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add:hover:not(:disabled) {
  background: #2e86c1;
}

.btn-add:disabled {
  opacity: 0.6;
  cursor: default;
}

.msg {
  position: absolute;
  margin: var(--sp-1) 0 0;
  font-size: var(--fs-xs);
  color: #fff;
}

.msg.error {
  color: var(--c-danger);
}
</style>
