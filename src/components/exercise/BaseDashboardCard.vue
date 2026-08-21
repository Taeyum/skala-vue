<script setup>
// slot 으로 받음
</script>

<template>
    <section class="dashboard-card">
        <slot />
    </section>
</template>

<style scoped>
.dashboard-card {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(8px);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid rgba(255, 255, 255, 0.5);
}
</style>