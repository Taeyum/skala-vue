<script setup>
// 자식에 어떤 값들을 받을지 정의 해놈 (부모로 부터 검색어를 받음)
defineProps({
    query: {
        type: String,
        required: true,
    },
})

// 입력이 바뀐다면 부모에게 알린다
const emit = defineEmits(['update-query'])
</script>

<template>
    <h3>🔍 도시 검색</h3>
    <input
        type="text"
        :value="query"
        @input="(e) => emit('update-query', e.target.value)"
        placeholder="검색할 도시 이름 입력"
    />
    <p>
        검색 중인 도시: <strong>{{ query }}</strong>
    </p>
</template>

<style scoped>
input {
  padding: 8px;
  width: 90%;
  font-size: 14px;
}

h3,
p {
  color: #2c3e50;
}
</style>
