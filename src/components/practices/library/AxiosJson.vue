<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 💡 1. 백엔드 공용 주소
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

// 💡 2. 반응형 상태 데이터
const items = ref([]) // 서버에서 받아온 데이터 배열 박스
const textInput = ref('') // 입력창과 연결된 글자 데이터 박스

// [READ] GET : 데이터 가져오기
const handleRead = async () => {
  try {
    // 공부용으로 딱 3개만 들고 옵니다.
    const response = await axios.get(BASE_URL, { params: { _limit: 3 } })
    items.value = response.data
    console.log('GET 성공:', response.data)
  } catch (error) {
    console.error('GET 실패:', error)
  }
}

// [CREATE] POST : 데이터 추가
const handleCreate = async () => {
  if (!textInput.value) return
  try {
    const response = await axios.post(BASE_URL, {
      title: textInput.value,
      body: '새로 등록한 내용',
      userId: 1,
    })
    console.log('POST 성공:', response.data)
    // JSONPlaceholder는 실제로 저장하지 않으므로 화면에만 반영
    items.value.unshift(response.data)
    textInput.value = ''
  } catch (error) {
    console.error('POST 실패:', error)
  }
}

// [UPDATE] PUT : 데이터 수정
const handleUpdate = async (item) => {
  try {
    const response = await axios.put(`${BASE_URL}/${item.id}`, {
      title: `${item.title} (수정됨)`,
      body: item.body,
    })
    console.log('PUT 성공:', response.data)
    const index = items.value.findIndex((i) => i.id === item.id)
    items.value[index] = { ...items.value[index], title: response.data.title }
  } catch (error) {
    console.error('PUT 실패:', error)
  }
}

// [DELETE] DELETE : 데이터 삭제
const handleDelete = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`)
    console.log('DELETE 성공: id =', id)
    items.value = items.value.filter((i) => i.id !== id)
  } catch (error) {
    console.error('DELETE 실패:', error)
  }
}

// 화면이 뜨는 시점에 목록을 한 번 불러온다 (5장 onMounted)
onMounted(handleRead)
</script>

<template>
  <div class="practice-section">
    <h2>⚡ Axios CRUD 프로토타입 훈련</h2>

    <div class="input-row">
      <input v-model="textInput" placeholder="저장할 텍스트를 입력하세요" @keyup.enter="handleCreate" />
      <button class="btn-post" @click="handleCreate">POST (추가)</button>
    </div>

    <div v-for="item in items" :key="item.id" class="item-card">
      <div class="item-text">
        <p class="item-id">ID: {{ item.id }}</p>
        <p>{{ item.title }}</p>
      </div>
      <div class="item-buttons">
        <button class="btn-put" @click="handleUpdate(item)">PUT (수정)</button>
        <button class="btn-del" @click="handleDelete(item.id)">DEL (삭제)</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.practice-section p {
  color: #2c3e50;
}

.input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.input-row input {
  flex: 1;
  padding: 8px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.item-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  margin-bottom: 8px;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
}

.item-id {
  margin: 0 0 4px;
  font-size: 12px;
  color: #868e96;
}

.item-text p {
  margin: 0;
}

.item-buttons {
  display: flex;
  gap: 6px;
}

.item-buttons button,
.btn-post {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.btn-post {
  background: #20c997;
}

.btn-put {
  background: #f7b731;
}

.btn-del {
  background: #ff7675;
}
</style>