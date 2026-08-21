<script setup>
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter.js'

const counterStore = useCounterStore()

// 🟢 올바른 방법
const { count, doubleCount } = storeToRefs(counterStore)
const { increment } = counterStore

// ❌ 잘못된 방법 — 반응형이 끊겨서 화면이 안 바뀜
const { count: brokenCount } = counterStore
</script>

<template>
  <div class="practice-section">
    <h2>Counter Store 활용 실습</h2>
    <p>원본 카운트 데이터(state): <strong>{{ count }}</strong></p>
    <p>2배 연산 데이터(getters): <span>{{ doubleCount }}</span></p>
    <p>❌ 일반 구조분해: <span>{{ brokenCount }}</span> (버튼을 눌러도 안 바뀝니다)</p>
    <button @click="increment">숫자 1 증가 (actions)</button>
  </div>
</template>