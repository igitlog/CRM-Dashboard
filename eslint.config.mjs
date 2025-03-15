// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  rules: {
    'vue/multi-word-component-names': 'off', // Разрешаем односоставные имена компонентов
    'no-console': 'warn', // Разрешаем console.log, но с предупреждением
    'no-unused-vars': 'warn', // Предупреждение о неиспользуемых переменных
    'vue/require-default-prop': 'off' // Отключаем обязательное указание default в props
  }
});
