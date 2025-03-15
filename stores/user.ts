import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const users = ref([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ]);

  const addUser = (user) => {
    user.id = Date.now();
    users.value.push(user);
  };

  const deleteUser = (id) => {
    users.value = users.value.filter((user) => user.id !== id);
  };

  const updateUser = (id, updatedUser) => {
    const index = users.value.findIndex((user) => user.id === id);
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updatedUser };
    }
  };

  return { users, addUser, deleteUser, updateUser };
});
