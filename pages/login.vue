<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-3xl font-bold mb-4">Login</h1>
    <form @submit.prevent="login" class="flex flex-col space-y-2 w-64">
      <input
        v-model="username"
        placeholder="Username"
        class="border p-2 rounded"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="border p-2 rounded"
      />
      <button
        class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        type="submit"
      >
        Login
      </button>
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const login = async () => {
  error.value = ''
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })

    if (!res.ok) {
      error.value = 'Invalid username or password'
      return
    }

    // ✅ Куки ставятся автоматически — ничего сохранять не надо
    await router.push('/')
  } catch (err) {
    error.value = 'Unexpected error'
    console.error('Login error:', err)
  }
}

</script>