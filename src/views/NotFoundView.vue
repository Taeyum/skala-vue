<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="not-found">
        <p class="emoji">🌤️ ❓</p>
        <h2>페이지를 찾을 수 없습니다.</h2>
        <p class="desc">
            요청하신 주소가 존재하지 않거나,<br />
            아직 개발되지 않았습니다.
        </p>
        <RouterLink to="/" class="btn-home">날씨 메인으로 이동</RouterLink>
    </div>
</template>

<style scoped>
.not-found {
  padding: 60px 20px;
  text-align: center;
  color: #2c3e50;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.emoji {
  font-size: 48px;
  margin: 0 0 12px;
}

.not-found h2 {
  margin: 0 0 12px;
  color: #2c3e50;
}

.desc {
  color: #868e96;
  line-height: 1.6;
}

.btn-home {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 20px;
  background: #3498db;
  color: #fff;
  text-decoration: none;
  font-weight: bold;
}
</style>