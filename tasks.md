# ✅ Task List - Notes Platform

Отслеживание прогресса выполнения всех задач проекта с Repository паттерном, Clean Architecture и FSD.

---

## 📌 ФАЗА 1: Notes Module (Backend) + Repository Pattern + Tests

### 1.1 Обновить Prisma Schema - ✅ DONE (Date: 2026-05-11, Branch: feature/task-1.1-prisma-schema)

- [x] Добавить модель `Note` с полями: `id`, `title`, `content`, `userId`, `createdAt`, `updatedAt`
- [x] Добавить связь `@relation` между `Note` и `User` (с onDelete: Cascade)
- [x] Добавить `@@map("notes")` для правильного имени таблицы
- [x] Добавить индекс `@@index([userId])` для оптимизации запросов
- [x] Проверить синтаксис Prisma schema (`npx prisma validate`)

**Status**: ✅ DONE (Date: 2026-05-11, Branch: feature/task-1.1-prisma-schema)  
**Link**: `backend/prisma/schema.prisma`

---

### 1.2 Создать Domain Entity и Interface

#### 1.2.1 Создать Note Domain Entity
- [ ] Файл `backend/src/notes/note.entity.ts`
- [ ] Чистый TypeScript класс/интерфейс для Note: `{ id, title, content, userId, createdAt, updatedAt }`
- [ ] **Важно**: НЕ импортируй типы из `@prisma/client` здесь (Decoupling)

**Status**: ⬜ NOT STARTED  
**Link**: `backend/src/notes/note.entity.ts`

#### 1.2.2 Создать Note Interface
- [ ] Файл `backend/src/notes/note.interface.ts`
- [ ] Контракты для взаимодействия (например, интерфейс для сервиса/репозитория)

**Status**: ⬜ NOT STARTED  
**Link**: `backend/src/notes/note.interface.ts`

---

### 1.3 Создать Repository слой (Data Access)

#### 1.3.1 Создать NoteRepository Interface
- [ ] Файл `backend/src/notes/note.repository.interface.ts`
- [ ] Метод `create(userId: string, title: string, content: string): Promise<Note>`
- [ ] Метод `findById(id: string): Promise<Note | null>`
- [ ] Метод `findByUserId(userId: string, skip: number, take: number): Promise<Note[]>`
- [ ] Метод `findByUserIdCount(userId: string): Promise<number>`
- [ ] Метод `update(id: string, title?: string, content?: string): Promise<Note>`
- [ ] Метод `delete(id: string): Promise<void>`

**Status**: ⬜ NOT STARTED  
**Link**: `backend/src/notes/note.repository.interface.ts`

#### 1.3.2 Реализовать NoteRepository
- [ ] Файл `backend/src/notes/note.repository.ts`
- [ ] Внедри `PrismaService` через constructor
- [ ] Реализуй маппинг: Prisma Model -> Domain Entity
- [ ] Методы работают ТОЛЬКО с `prisma.note`
- [ ] Не должно быть бизнес-логики, только CRUD и маппинг

**Status**: ⬜ NOT STARTED  
**Link**: `backend/src/notes/note.repository.ts`

#### 1.3.3 Написать Unit тесты для Repository
- [ ] Файл `backend/tests/notes/note.repository.spec.ts`
- [ ] Mock Prisma Client
- [ ] Проверить корректность маппинга данных

**Status**: ⬜ NOT STARTED  
**Link**: `backend/tests/notes/note.repository.spec.ts`

---

### 1.4 Создать Service слой (Business Logic)

#### 1.4.1 Создать NoteService Interface
- [ ] Файл `backend/src/notes/note.service.interface.ts`

**Status**: ⬜ NOT STARTED

#### 1.4.2 Реализовать NoteService
- [ ] Файл `backend/src/notes/note.service.ts`
- [ ] Внедри `NoteRepository`
- [ ] **createNote()**: бизнес-валидация, создание
- [ ] **getNoteById()**: проверка владельца (403 Forbidden если не свой)
- [ ] Остальные методы CRUD с проверкой прав доступа

**Status**: ⬜ NOT STARTED

#### 1.4.3 Написать Unit тесты для Service
- [ ] Файл `backend/tests/notes/note.service.spec.ts`
- [ ] Mock NoteRepository
- [ ] Тесты на бизнес-логику и права доступа (403 Forbidden)

**Status**: ⬜ NOT STARTED

---

### 1.5 Создать DTO и Валидацию

#### 1.5.1 Создать CreateNoteDto и UpdateNoteDto
- [ ] Файл `backend/src/notes/dto/create-note.dto.ts`
- [ ] Файл `backend/src/notes/dto/update-note.dto.ts`
- [ ] Использовать `class-validator` декораторы

**Status**: ⬜ NOT STARTED

---

### 1.6 Создать Controller слой (HTTP Handlers)

#### 1.6.1 Реализовать NoteController
- [ ] Файл `backend/src/notes/note.controller.ts`
- [ ] Используй `inversify` для DI
- [ ] Эндпоинты: POST /notes, GET /notes, GET /notes/:id, PATCH /notes/:id, DELETE /notes/:id
- [ ] Применить `AuthGuard` ко всем маршрутам

**Status**: ⬜ NOT STARTED

---

### 1.7-1.10 Интеграция, Swagger, Интеграционные тесты

- [ ] 1.7 Зарегистрировать в DI контейнере (`main.ts`, `app.ts`)
- [ ] 1.8 Добавить Swagger документацию
- [ ] 1.9 Написать Integration тесты (полный API flow)
- [ ] 1.10 Финальная проверка (lint, build, coverage)

**Status**: ⬜ NOT STARTED

---

## 📌 ФАЗА 2: PostgreSQL Setup & Database Migration

### 2.1 Настройка БД
- [ ] Настроить PostgreSQL (локально или Docker)
- [ ] Обновить `DATABASE_URL` в `.env`
- [ ] Переключить Prisma provider на `postgresql`

**Status**: ⬜ NOT STARTED

### 2.2 Миграции
- [ ] Создать и применить первую миграцию (`prisma migrate dev`)

**Status**: ⬜ NOT STARTED

---

## 📌 ФАЗА 3: Frontend (Vue 3) - Feature-Sliced Design

### 3.1 Инициализация и Структура
- [ ] Инициализировать Vue 3 + TS + Vite
- [ ] Настроить Tailwind CSS
- [ ] Создать структуру папок по FSD (`app`, `pages`, `widgets`, `features`, `entities`, `shared`)

**Status**: ⬜ NOT STARTED

### 3.2 Слой Shared (API, UI Kit)
- [ ] Настроить API клиент (Axios) с JWT interceptor
- [ ] Создать базовые UI компоненты (Button, Input, Card)

**Status**: ⬜ NOT STARTED

### 3.3 Слой Entities (Notes, User)
- [ ] Создать типы и интерфейсы сущностей
- [ ] Реализовать Pinia сторы (`notes.store.ts`, `auth.store.ts`)

**Status**: ⬜ NOT STARTED

### 3.4 Слой Features (Auth, CreateNote, NoteActions)
- [ ] Реализовать формы логина/регистрации
- [ ] Реализовать компоненты создания, редактирования и удаления заметки

**Status**: ⬜ NOT STARTED

### 3.5 Слой Widgets и Pages
- [ ] Собрать Widgets (NavBar, NoteList)
- [ ] Реализовать Pages (Dashboard, NoteEditor, Login, Register)
- [ ] Настроить Vue Router с Guards

**Status**: ⬜ NOT STARTED

---

## 📌 ФАЗА 4: Docker Compose Integration

- [ ] Создать `docker-compose.yaml` (PostgreSQL, Backend, Frontend)
- [ ] Настроить сети и переменные окружения

**Status**: ⬜ NOT STARTED

---

## 📌 ФАЗА 5: Final Polish

- [ ] Финальное тестирование всей системы
- [ ] Обновление README.md
- [ ] Удаление неиспользуемого кода и файлов

**Status**: ⬜ NOT STARTED

---

## 📊 Progress Summary

### Completed
- ✅ Backend infrastructure (Express, DI, Auth, Logging)
- ✅ User module (Registration, Login, JWT)

### In Progress
- ⬜ None

### TODO (Prioritized)
- ❌ **NEXT**: 1.1 Обновить Prisma Schema
- ❌ 1.2 - 1.10 Backend Notes Module
- ❌ ФАЗА 2 - Database Setup
- ❌ ФАЗА 3 - Frontend (FSD)
- ❌ ФАЗА 4 - Docker Compose

---

**Last Updated**: 2026
**Total Tasks**: ~50
**Completed**: 2
**Remaining**: ~48
**Completion %**: ~4%
