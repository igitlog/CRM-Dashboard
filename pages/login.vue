<template>
    <div class="flex flex-col items-center justify-center min-h-screen">
      <h1 class="text-3xl font-bold mb-4">Login</h1>
      <form @submit.prevent="login" class="flex flex-col space-y-2">
        <input v-model="username" placeholder="Username" class="border p-2 rounded" />
        <input v-model="password" type="password" placeholder="Password" class="border p-2 rounded" />
        <button class="bg-blue-500 text-white p-2 rounded" type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const username = ref('');
  const password = ref('');
  const router = useRouter();
  
  const login = () => {
    if (username.value === 'admin' && password.value === 'admin') {
      router.push('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };
  </script>
  