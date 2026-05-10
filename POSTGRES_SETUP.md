# 🐘 PostgreSQL Setup Guide

Полная пошаговая инструкция по установке и настройке PostgreSQL для локальной разработки Notes Platform.

---

## 📋 Оглавление

1. [Локальная установка (macOS)](#локальная-установка-macos)
2. [Установка через Docker (универсально)](#установка-через-docker)
3. [Подключение Prisma к PostgreSQL](#подключение-prisma-к-postgresql)
4. [Создание первой миграции](#создание-первой-миграции)
5. [Проверка подключения](#проверка-подключения)
6. [Команды для повседневного использования](#команды-для-повседневного-использования)
7. [Troubleshooting](#troubleshooting)

---

## 🍎 Локальная установка (macOS)

### Вариант 1: Homebrew (рекомендуется)

#### Шаг 1: Установка PostgreSQL

```bash
# Установить PostgreSQL 14
brew install postgresql@14

# Проверить установку
postgres --version
```

#### Шаг 2: Запуск PostgreSQL сервиса

```bash
# Запустить PostgreSQL в фоне (автозапуск при загрузке)
brew services start postgresql@14

# Проверить статус
brew services list | grep postgres

# Должен вывести: postgresql@14 started
```

#### Шаг 3: Создание БД и пользователя

```bash
# Подключиться к PostgreSQL с правами администратора
psql postgres

# Введёте в psql интерпретатор, теперь выполните SQL команды:

# Создать новую БД
CREATE DATABASE notes_app;

# Создать пользователя с паролем
CREATE USER notes_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';

# Дать все права пользователю на БД
GRANT ALL PRIVILEGES ON DATABASE notes_app TO notes_user;

# Выйти из psql
\q
```

#### Шаг 4: Проверка подключения

```bash
# Попробовать подключиться с новым пользователем
psql -U notes_user -d notes_app -h localhost

# Должны увидеть приглашение: notes_app=>

# Проверить, что подключение работает
SELECT current_user, current_database();

# Выйти
\q
```

---

## 🐳 Установка через Docker

### Если у вас уже установлен Docker/Docker Desktop:

#### Шаг 1: Создать docker-compose.dev.yaml для локальной разработки

```bash
cd backend
cat > docker-compose.dev.yaml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: notes_postgres_dev
    environment:
      POSTGRES_DB: notes_app
      POSTGRES_USER: notes_user
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data_dev:/var/lib/postgresql/data
    networks:
      - notes_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U notes_user"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data_dev:
    driver: local

networks:
  notes_network:
    driver: bridge
EOF
```

#### Шаг 2: Запустить PostgreSQL в Docker

```bash
# Запустить контейнер
docker-compose -f docker-compose.dev.yaml up -d

# Проверить, что контейнер запущен
docker-compose -f docker-compose.dev.yaml ps

# Проверить логи
docker-compose -f docker-compose.dev.yaml logs postgres
```

#### Шаг 3: Проверить подключение

```bash
# Подключиться к БД в контейнере
docker exec -it notes_postgres_dev psql -U notes_user -d notes_app

# Проверить
SELECT current_user, current_database();

# Выйти
\q
```

#### Шаг 4: Остановить контейнер (когда закончите разработку)

```bash
# Остановить (данные сохранятся)
docker-compose -f docker-compose.dev.yaml down

# Полностью удалить (включая volume)
docker-compose -f docker-compose.dev.yaml down -v
```

---

## 🔗 Подключение Prisma к PostgreSQL

### Шаг 1: Обновить Prisma schema

```bash
cd backend
```

Отредактировать файл `prisma/schema.prisma`:

```prisma
// БЫЛО:
datasource db {
  provider = "sqlite"
}

// СТАЛО:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Убедиться, что у вас есть User и Note модели
model UserModel {
  id           String   @id @default(uuid())
  email        String   @unique
  name         String
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  notes        NoteModel[]  // Добавить связь

  @@map("users")
}

model NoteModel {
  id        String   @id @default(uuid())
  title     String   @db.VarChar(255)
  content   String   @db.Text
  userId    String
  user      UserModel @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("notes")
  @@index([userId])
}
```

### Шаг 2: Обновить .env файл

```bash
# Отредактировать backend/.env
```

```env
# Database
DATABASE_URL="postgresql://notes_user:your_secure_password_here@localhost:5432/notes_app"

# Auth
JWT_SECRET="your_jwt_secret_key_here"

# Server
PORT=3001
NODE_ENV=development
```

### Шаг 3: Проверить синтаксис Prisma

```bash
# Убедиться, что schema валиден
npx prisma validate

# Должен вывести: Environment variables loaded from .env
# The schema is valid!
```

---

## 🚀 Создание первой миграции

### Шаг 1: Создать миграцию

```bash
# Находиться в папке backend/
cd backend

# Создать миграцию (Prisma сам создаст SQL файл на основе schema)
npx prisma migrate dev --name init

# Будет предложено:
# ✔ Enter a name for the new migration: › init
# ✔ Your database is now in sync with your schema
# ✔ Generated Prisma Client
```

**Что произойдёт:**
1. Prisma создаст папку `prisma/migrations/` (если не существует)
2. Создаст файл с SQL скриптом (например: `20240101120000_init`)
3. Применит миграцию на БД
4. Сгенерирует Prisma Client

### Шаг 2: Проверить, что миграция прошла

```bash
# Подключиться к БД
psql -U notes_user -d notes_app

# Проверить, что таблицы созданы
\dt

# Должны увидеть таблицы: users, notes, _prisma_migrations

# Проверить структуру таблицы notes
\d notes

# Выйти
\q
```

### Шаг 3: Проверить в Prisma Studio

```bash
# Открыть Prisma Studio (веб-интерфейс для просмотра/редактирования БД)
npx prisma studio

# Откроется в браузере: http://localhost:5555
# Здесь можно видеть все таблицы и данные
```

---

## ✅ Проверка подключения

### Вариант 1: Запустить backend и проверить логи

```bash
cd backend

# Запустить dev сервер
npm run dev

# В логах должно быть:
# [Prisma] ✓ Connected to database
# Server is running on http://localhost:3001
```

### Вариант 2: Создать тестовую заметку через API

```bash
# Сначала зарегистрироваться (если не зарегистрированы)
curl -X POST http://localhost:3001/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123"
  }'

# Логин и получить JWT токен
curl -X POST http://localhost:3001/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Скопировать токен из ответа, затем создать заметку
curl -X POST http://localhost:3001/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My first note",
    "content": "This is a test note"
  }'

# Должны получить 201 Created с созданной заметкой
```

### Вариант 3: Проверить прямо в БД

```bash
# Подключиться
psql -U notes_user -d notes_app

# Проверить пользователей
SELECT * FROM users;

# Проверить заметки
SELECT * FROM notes;

# Выйти
\q
```

---

## 📖 Команды для повседневного использования

### Создание новой миграции

```bash
cd backend

# После изменения schema.prisma выполнить:
npx prisma migrate dev --name describe_your_changes

# Например:
npx prisma migrate dev --name add_note_tags
```

### Просмотр миграций

```bash
# Посмотреть историю миграций в БД
npx prisma migrate status
```

### Откат миграции (осторожно!)

```bash
# Откатить последнюю миграцию (только на dev)
npx prisma migrate resolve --rolled-back "migration_name"

# Потом пересоздать миграцию
npx prisma migrate dev
```

### Генерировать Prisma Client

```bash
# Если вручную редактировали schema, обновить Client
npx prisma generate
```

### Открыть Prisma Studio

```bash
# Веб-интерфейс для БД
npx prisma studio

# Откроется на http://localhost:5555
```

### PostgreSQL команды (psql)

```bash
# Подключиться к БД
psql -U notes_user -d notes_app

# Внутри psql интерпретатора:

# Список таблиц
\dt

# Описание таблицы
\d table_name

# Список всех БД
\l

# Список пользователей
\du

# Выйти из psql
\q
```

---

## 🔧 Troubleshooting

### ❌ Проблема: "FATAL: Ident authentication failed for user"

**Решение:**

```bash
# Отредактировать pg_hba.conf (файл конфигурации PostgreSQL)
# На macOS (Homebrew):
nano /usr/local/var/postgres/pg_hba.conf

# Найти строку:
local   all             all                                     ident

# Заменить на:
local   all             all                                     trust

# Перезагрузить PostgreSQL
brew services restart postgresql@14
```

---

### ❌ Проблема: "Error: connect ECONNREFUSED 127.0.0.1:5432"

**Решение:**

```bash
# PostgreSQL не запущен

# Проверить статус:
brew services list | grep postgres

# Если не запущен:
brew services start postgresql@14

# Или если используете Docker:
docker-compose -f docker-compose.dev.yaml up -d postgres
```

---

### ❌ Проблема: "database "notes_app" does not exist"

**Решение:**

```bash
# Создать БД вручную
psql postgres -U notes_user

# Внутри psql:
CREATE DATABASE notes_app;

# Выйти
\q
```

---

### ❌ Проблема: "permission denied for schema public"

**Решение:**

```bash
# Дать права пользователю
psql postgres -U postgres

# Внутри psql (как администратор):
GRANT ALL PRIVILEGES ON SCHEMA public TO notes_user;
GRANT ALL PRIVILEGES ON DATABASE notes_app TO notes_user;

# Выйти
\q
```

---

### ❌ Проблема: Prisma миграции конфликтуют

**Решение:**

```bash
# Если локальная миграция конфликтует с удалённой
npx prisma migrate resolve --rolled-back migration_name

# Или сбросить БД (только на dev!)
npx prisma migrate reset

# Подтвердить, что хотите удалить БД и пересоздать
```

---

## 📊 Полезные скрипты package.json

Убедиться, что в `backend/package.json` есть:

```json
{
  "scripts": {
    "dev": "ts-node --project tsconfig.json src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write \"src/**/*.ts\"",
    "db:migrate": "prisma migrate dev",
    "db:reset": "prisma migrate reset",
    "db:studio": "prisma studio"
  }
}
```

Тогда можно использовать:
```bash
npm run db:migrate    # Создать миграцию
npm run db:reset      # Сбросить БД (dev only)
npm run db:studio     # Открыть Prisma Studio
```

---

## ✨ Рекомендуемый workflow

### На начало разработки каждого дня:

```bash
# 1. Проверить, что PostgreSQL запущен (локально или Docker)
brew services list | grep postgres

# 2. Запустить backend
cd backend
npm run dev

# 3. Проверить, что миграции применены
npx prisma migrate status

# 4. Если были изменения в schema, создать миграцию
npx prisma migrate dev --name describe_changes

# 5. Открыть Prisma Studio для просмотра данных (опционально)
npx prisma studio

# 6. В другом терминале запустить фронтенд (когда будет готов)
cd frontend
npm run dev
```

### На конец разработки:

```bash
# 1. Закоммитить все изменения
git add .
git commit -m "Implement Notes feature"

# 2. Если используете Docker:
docker-compose -f docker-compose.dev.yaml down

# 3. Если используете Homebrew, можно оставить запущенным
# (он автоматически запустится при перезагрузке)
```

---

## 📝 Переменные окружения

Полный пример `backend/.env`:

```env
# Database
DATABASE_URL="postgresql://notes_user:postgres@localhost:5432/notes_app"

# JWT
JWT_SECRET="your_super_secret_jwt_key_12345"

# Server
PORT=3001
NODE_ENV=development

# Optional: для production
# DATABASE_URL_PROD="postgresql://..."
# NODE_ENV=production
```

Пример `backend/.env.example` для git:

```env
# Database
DATABASE_URL="postgresql://notes_user:PASSWORD@localhost:5432/notes_app"

# JWT
JWT_SECRET="your_jwt_secret_key"

# Server
PORT=3001
NODE_ENV=development
```

---

## 🎯 Дальнейшие шаги

После успешной настройки PostgreSQL:

1. ✅ Убедиться, что БД подключена и миграции применены
2. ✅ Начать разработку Notes модуля (ФАЗА 1)
3. ✅ Написать тесты (используя тестовую БД)
4. ✅ Подготовить docker-compose для production

---

**Последнее обновление**: 2026  
**Статус**: ✅ Готово к использованию
