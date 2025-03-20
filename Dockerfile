# Используем минимальный образ Node.js
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install --only=production

# Копируем весь код и собираем приложение
COPY . .
RUN npm run build

# Открываем порт
EXPOSE 3000

# Запускаем приложение в продакшене
CMD ["npm", "start"]
