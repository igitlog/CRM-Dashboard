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
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { PrismaClient } from '@prisma/client';
  
  const prisma = new PrismaClient();
  
  export default defineComponent({
    data() {
      return {
        username: '',
        password: '',
      };
    },
    methods: {
      async login() {
        const user = await prisma.user.findUnique({
          where: { username: this.username },
        });
  
        if (user && user.password === this.password) {
          // Логика успешного входа
          console.log('Login successful');
        } else {
          // Логика неудачного входа
          console.log('Invalid credentials');
        }
      },
    },
  });
  </script>
  