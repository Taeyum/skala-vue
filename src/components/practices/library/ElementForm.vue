<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const userForm = ref({
  email: '',
  agree: false,
})

const handleRegister = () => {
  if (!userForm.value.email.includes('@')) {
    ElMessage.error('❌ 올바른 이메일 형식이 아닙니다.')
    return
  }
  if (!userForm.value.agree) {
    ElMessage.warning('⚠️ 이용약관에 동의하셔야 합니다.')
    return
  }
  ElMessage.success('🎉 가입 신청이 정상적으로 완료되었습니다!')
}
</script>

<template>
  <div class="practice-section">
    <h2>Element Plus - Form</h2>

    <el-card style="max-width: 480px">
      <template #header>
        <span>📝 회원가입</span>
      </template>

      <el-input
        v-model="userForm.email"
        placeholder="이메일 주소를 입력하세요"
        clearable
      />

      <div class="row">
        <span>이용약관 동의</span>
        <el-switch v-model="userForm.agree" />
      </div>

      <el-button type="primary" @click="handleRegister">회원가입</el-button>

      <template #footer>
        <span class="muted">입력값: {{ userForm.email }} / 동의: {{ userForm.agree }}</span>
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