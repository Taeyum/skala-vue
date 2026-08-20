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
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #e9ecef;
}
</style>