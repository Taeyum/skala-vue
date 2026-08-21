<script setup>
import { ref } from 'vue'

const productQuantity = ref(1) // 수량 카운터 기본값
const productRate = ref(4) // 별점 기본값 (별 4개)
</script>

<template>
  <div class="practice-section">
    <h2>Element Plus - Data Input</h2>

    <el-card style="max-width: 480px">
      <template #header>
        <span>🛒 상품 주문</span>
      </template>

      <div class="row">
        <span>구매 수량</span>
        <el-input-number v-model="productQuantity" :min="1" :max="10" />
      </div>

      <div class="row">
        <span>상품 평점</span>
        <el-rate v-model="productRate" show-score />
      </div>

      <template #footer>
        <span class="muted">수량 {{ productQuantity }}개 / 평점 {{ productRate }}점</span>
      </template>
    </el-card>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
}

.muted {
  font-size: 12px;
  color: #909399;
}
</style>