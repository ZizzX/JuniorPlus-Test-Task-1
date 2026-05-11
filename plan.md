# 📋 Notes Platform - Project Plan

## 🎯 Общее видение

Создание полнофункциональной платформы для управления личными заметками с современным стеком:
- **Backend**: TypeScript + Express + Prisma ORM
- **Frontend**: Vue 3 (TypeScript) с Pinia state management
- **Database**: PostgreSQL с миграциями
- **DevOps**: Docker + Docker Compose для одного команды запуска

**Целевое время выполнения**: ~1 день (согласно требованиям Junior+ тестовой работы)

---

## 🏗️ Архитектура Backend (Clean Architecture)

Для работы с данными используется **Repository Pattern** — как и в модуле Users:

```
HTTP Request
    ↓
Controller (HTTP handlers)
    ↓
Service (Business Logic, Validation, Authorization)
    ↓
Repository (Data Access Layer)
    ↓
Prisma Client (ORM)
    ↓
PostgreSQL (Database)
```

### Слои приложения:

1. **Domain Entity** (`note.entity.ts`)
   - Чистый TypeScript класс/интерфейс, описывающий бизнес-сущность.
   - **Важно**: Отделен от Prisma-модели для предотвращения утечки деталей ORM в бизнес-логику (Decoupling).

2. **Repository** (`note.repository.ts` + `note.repository.interface.ts`)
   - Абстракция для работы с БД.
   - Выполняет маппинг между Prisma-моделями и Domain Entities.
   - CRUD операции: create, findById, findByUserId, update, delete.
   - Инкапсуляция всей логики Prisma.

3. **Service** (`note.service.ts` + `note.service.interface.ts`)
   - Бизнес-логика заметок. Работает только с Domain Entities.
   - Валидация входных данных и бизнес-правил.
   - Проверка прав доступа (авторизация).

4. **Controller** (`note.controller.ts` + `note.controller.interface.ts`)
   - HTTP endpoints, парсинг request/response.
   - Вызов соответствующего сервиса.

5. **DTO** (`dto/create-note.dto.ts`, `dto/update-note.dto.ts`)
   - Data Transfer Objects для валидации входящих данных через `class-validator`.

6. **Tests**
   - Unit тесты для каждого слоя (Mocking зависимостей).
   - Integration тесты для проверки полного цикла API.

---

## 📊 Проект состоит из 5 фаз

### **ФАЗА 1: Notes Module (Backend) — 40% проекта**

**Цель**: Реализовать полный CRUD для заметок с Repository паттерном, разделением сущностей и тестами.

**Архитектура Notes модуля**:
```
backend/src/notes/
├── note.entity.ts                    # Domain Entity (Чистый TS)
├── note.interface.ts                 # TS Интерфейсы
├── note.repository.interface.ts      # Контракт репозитория
├── note.repository.ts                # Реализация (Mapping Prisma -> Entity)
├── note.service.interface.ts         # Контракт сервиса
├── note.service.ts                   # Бизнес-логика
├── note.controller.interface.ts      # Контракт контроллера
├── note.controller.ts                # HTTP endpoints
├── dto/
│   ├── create-note.dto.ts           # DTO для создания
│   └── update-note.dto.ts           # DTO для обновления
└── tests/
    ├── note.repository.spec.ts      # Unit тесты Repository
    ├── note.service.spec.ts         # Unit тесты Service
    ├── note.controller.spec.ts      # Unit тесты Controller
    └── note.integration.spec.ts     # Integration тесты
```

**Описание работ**:
- Обновить Prisma schema (модель `Note`).
- Создать Domain Entity и настроить маппинг в Repository.
- Реализовать Service и Controller с DI (Inversify).
- Покрыть все слои тестами (Unit + Integration).
- Обновить Swagger документацию.

**Status**: ❌ TODO

---

### **ФАЗА 2: Database Setup & Migration — 10% проекта**

**Цель**: Настроить PostgreSQL локально и в Docker, создать миграции.

**Описание**:
- Установить PostgreSQL локально (macOS: Homebrew или Docker)
- Создать БД `notes_app` и пользователя
- Настроить Prisma на работу с PostgreSQL
- Создать первую миграцию (`prisma migrate dev --name init`)
- Проверить подключение локально
- Подготовить docker-compose для PostgreSQL в docker

**Статус**: ❌ TODO
**Link**: `POSTGRES_SETUP.md` — подробная инструкция

---

### **ФАЗА 3: Frontend (Vue 3) — 40% проекта**

**Цель**: Создать полнофункциональный веб-интерфейс для работы с заметками с использованием FSD архитектуры.

**Рефакторинг серверного состояния (Vue Query)**:
- Интеграция `@tanstack/vue-query` для управления серверным состоянием.
- Устранение Race Conditions и избыточных запросов через кеширование.
- Автоматическая инвалидация данных после мутаций.
- Разделение ответственности: Pinia для UI-состояния, Vue Query для данных из API.

**Структура проекта (Feature-Sliced Design)**:
- `app/` — Инициализация приложения, провайдеры, глобальные стили, роутер.
- `pages/` — Страницы (Login, Register, Dashboard, NoteEditor).
- `widgets/` — Самостоятельные блоки интерфейса (NavBar, NoteList).
- `features/` — Пользовательские сценарии (Авторизация, Создание/Удаление заметки).
- `entities/` — Бизнес-сущности (Модели пользователя и заметки, Pinia сторы).
- `shared/` — Переиспользуемый код (UI-kit, API клиенты, хуки, утилиты).

**Описание работ**:
- Инициализировать Vue 3 проект с TypeScript, Pinia, Router.
- Установить зависимости (axios, tailwind).
- Выстроить структуру приложения по методологии FSD.
- Реализовать API клиент в `shared/` с автоматической инъекцией JWT токена.
- Создать Entities и Stores для управления данными.
- Реализовать интерактивные Features и Widgets.
- Настроить Vue Router с route guards.

**Status**: ❌ TODO

---

### **ФАЗА 4: Docker Compose Integration — 10% проекта**

**Цель**: Создать единый docker-compose файл для запуска всей системы.

**Описание**:
- Создать полный `docker-compose.yaml` на корневом уровне проекта
- Сервисы: PostgreSQL, Backend, Frontend
- Настроить зависимости между сервисами (depends_on)
- Создать `.env.example` с необходимыми переменными
- Убедиться, что backend дожидается инициализации БД

**Status**: ⚙️ IN PROGRESS (частично сделано)

---

### **ФАЗА 5: Final Polish & Testing — опционально (10% проекта)**

**Цель**: Покрыть код тестами, документацией и финальной полировкой.

**Описание**:
- Unit тесты для Service и Repository (уже в ФАЗЕ 1)
- Integration тесты для API (уже в ФАЗЕ 1)
- Проверить код на качество (lint, format, build)
- Запустить полный flow в docker-compose
- Создать скриншот модели БД
- Обновить README с инструкциями

**Status**: ❌ TODO

---

### **ФАЗА 6: Localization (Vue I18n) — 10% проекта**

**Цель**: Добавить поддержку мультиязычности (RU, EN, KK) для всего интерфейса приложения.

**Описание работ**:
- Установить и настроить `vue-i18n` (Vue 3 version).
- Организовать структуру файлов локализации в соответствии с FSD.
- Перевести все текстовые константы на три языка.
- Реализовать механизм переключения языков.

**Status**: ✅ DONE (Date: 2026-05-12, Branch: feature/task-3.10-localization-ru)

---

## 📅 Timeline

| Фаза | Компонент | Приоритет | Estimated | Status |
|------|-----------|-----------|-----------|--------|
| 1 | Notes CRUD Backend + Tests | P0 | 3-4h | ✅ DONE |
| 2 | PostgreSQL Setup + Migrations | P0 | 1-2h | ✅ DONE |
| 3 | Vue 3 Frontend (FSD) | P1 | 3-4h | ✅ DONE |
| 4 | Docker Compose | P2 | 1h | ✅ DONE |
| 5 | Tests & Polish | P3 | 1-2h | ✅ DONE |
| 6 | Localization (Vue I18n) | P4 | 2h | ✅ DONE |

**Total ETA**: ~11-14 часов

---

## 🛠️ Технологический стек

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js + Inversify (DI)
- **Architecture**: Clean Architecture / Repository Pattern
- **ORM**: Prisma (PostgreSQL)
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: Vue 3 + Vite
- **Architecture**: **Feature-Sliced Design (FSD)**
- **State**: Pinia
- **Styling**: Tailwind CSS

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Database**: PostgreSQL 14
- **Environment**: Node.js 18 + npm/bun

---

## ✅ Definition of Done

Проект считается завершенным когда:

1. ✅ **Backend**:
   - [ ] CRUD реализован с четким разделением на Domain Entity и Prisma Model.
   - [ ] Все слои тестированы (Repository, Service, Controller).
   - [ ] Integration тесты покрывают полный flow.
   - [ ] Swagger документация полная и актуальная.

2. ✅ **Frontend**:
   - [ ] Структура проекта строго следует **FSD**.
   - [ ] Реализован полный цикл CRUD заметок и авторизация.
   - [ ] UI респонсивен и удобен.
   - [ ] Все запросы к API корректно обработаны.

3. ✅ **Database**:
   - [ ] PostgreSQL работает локально
   - [ ] Миграции создаются и применяются автоматически
   - [ ] Данные сохраняются между перезапусками контейнера

4. ✅ **DevOps**:
   - [ ] `docker-compose up` запускает всю систему за одну команду
   - [ ] Все сервисы доступны на правильных портах
   - [ ] `.env.example` содержит все необходимые переменные

5. ✅ **Documentation**:
   - [ ] `POSTGRES_SETUP.md` с полной инструкцией
   - [ ] README содержит инструкции по запуску
   - [ ] Swagger API документация полная
   - [ ] Скриншот модели БД приложен

---

## 📝 Notes

- **Архитектура**: Используй Repository паттерн, как в Users модуле
- **Tests**: Тесты обязательны для Repository, Service и Controller
- **Database**: Все инструкции по PostgreSQL в `POSTGRES_SETUP.md`
- **Миграции**: Никогда не редактируй файлы миграций руками после их применения

---

**Последнее обновление**: 2026
**Статус проекта**: 🚀 В РАЗРАБОТКЕ
