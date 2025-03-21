import { defineStore } from 'pinia';
import { ref } from 'vue';

// Определяем интерфейс для пользователя
interface User {
  id: number;
  name: string;
  email: string;
}

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]); // Указываем, что users - это массив пользователей

  // Функция для загрузки пользователей с API
  const fetchUsers = async (): Promise<void> => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      users.value = data || [];
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const addUser = async (user: User): Promise<void> => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error(`Failed to add user: ${response.statusText}`);
      }

      // После успешного добавления, обновляем список пользователей
      await fetchUsers();
    } catch (error) {
      console.error('Add user error:', error);
    }
  };

  const deleteUser = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`/api/users?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }

      // После успешного удаления, обновляем список пользователей
      await fetchUsers();
    } catch (error) {
      console.error('Delete user error:', error);
    }
  };

  const updateUser = async (userId, updatedUser) => {
    try {
      console.log('Updating user:', userId, updatedUser);

      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, username: updatedUser.name, email: updatedUser.email }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
      }

      const updatedUserFromServer = await response.json();
      const index = users.value.findIndex(user => user.id === userId);
      if (index !== -1) {
        users.value[index] = updatedUserFromServer;
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  return { users, fetchUsers, addUser, deleteUser, updateUser };
});
