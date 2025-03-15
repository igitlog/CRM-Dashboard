<template>
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Редактирование пользователя</h1>
  
      <form @submit.prevent="saveUser" class="flex flex-col gap-2">
        <input v-model="user.name" class="border p-2 rounded" placeholder="Имя" />
        <input v-model="user.email" class="border p-2 rounded" placeholder="Email" />
        <button class="bg-blue-500 text-white p-2 rounded" type="submit">Сохранить</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useUserStore } from '~/stores/user';
  
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  
  const user = ref({ name: '', email: '' });
  
  onMounted(() => {
    const userId = Number(route.query.id);
    const existingUser = userStore.users.find((u) => u.id === userId);
    if (existingUser) {
      user.value = { ...existingUser };
    }
  });
  
  const saveUser = () => {
    userStore.updateUser(Number(route.query.id), user.value);
    router.push('/dashboard');
  };
  </script>
  