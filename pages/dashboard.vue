<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">CRM Dashboard</h1>

    <!-- Форма добавления пользователя -->
    <div class="bg-white-500 shadow-md rounded-lg p-4 mb-6">
      <h2 class="text-xl font-semibold mb-3 text-gray-700">Добавить пользователя</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input 
          v-model="newUser.name" 
          placeholder="Имя"
          class="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <input 
          v-model="newUser.email" 
          placeholder="Email"
          class="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <button 
          class="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-transform transform hover:scale-105 active:scale-95"
          @click="addUser"
        >
          ➕ Добавить
        </button>
      </div>
    </div>

    <!-- Таблица с пользователями -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-blue-500 text-white">
            <th class="p-4">Имя</th>
            <th class="p-4">Email</th>
            <th class="p-4 text-center">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="user in users" 
            :key="user.id"
            class="hover:bg-gray-100 transition-all"
          >
            <td class="p-4 border">{{ user.username }}</td>
            <td class="p-4 border">{{ user.email }}</td>
            <td class="p-4 border text-center">
              <button 
                class="bg-yellow-500 text-white px-3 py-2 rounded-lg transition-transform transform hover:scale-105 active:scale-95"
                @click="editUser(user.id)"
              >
                ✏️
              </button>
              <button 
                class="bg-red-500 text-white px-3 py-2 rounded-lg ml-2 transition-transform transform hover:scale-105 active:scale-95"
                @click="deleteUser(user.id)"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const newUser = ref({ username: '', email: '' });

const users = ref([]);

onMounted(() => {
  userStore.fetchUsers();
  users.value = userStore.users;
});

watch(() => userStore.users, (newUsers) => {
  users.value = newUsers;
});

const addUser = () => {
  if (!newUser.value.username || !newUser.value.email) return;
  userStore.addUser({ ...newUser.value });
  newUser.value = { username: '', email: '' };
};

const editUser = (id) => {
  router.push(`/edit-user?id=${id}`);
};

const deleteUser = (id) => {
  userStore.deleteUser(id);
};
</script>
