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
  padding: var(--sp-10) var(--sp-6);
  text-align: center;
  padding: var(--sp-6);
  border: 1px solid var(--surface-border);
  border-radius: var(--r-lg);
  background: var(--surface);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  box-shadow: var(--shadow-md);
  color: var(--c-text);
}

.emoji {
  margin: 0 0 var(--sp-3);
  font-size: 48px;
}

.not-found h2 {
  margin: 0 0 var(--sp-3);
  font-size: var(--fs-h1);
  font-weight: 700;
  color: var(--c-text);
}

.desc {
  color: var(--c-text-sub);
  font-size: var(--fs-body);
  line-height: 1.6;
}

.btn-home {
  margin-top: var(--sp-5);
  display: inline-block;
  padding: 10px var(--sp-5);
  border: none;
  border-radius: var(--r-md);
  background: var(--c-primary);
  color: #fff;
  text-decoration: none;
  font-size: var(--fs-body);
  font-weight: 600;
  transition:
    background 0.2s,
    transform 0.2s;
}

.btn-home:hover {
  background: #2e86c1;
  transform: translateY(-2px);
}
</style>
