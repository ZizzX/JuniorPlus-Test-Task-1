# Project Instructions & Standards

## 🌍 Localization & Internationalization (i18n)

Все новые текстовые данные в интерфейсе ОБЯЗАТЕЛЬНО должны проходить через систему локализации. Мы поддерживаем три языка: **RU (дефолт)**, **EN**, **KK**.

### 1. Структура файлов
Локализация организована в слое `Shared` согласно FSD:
- Конфигурация: `frontend/src/shared/lib/i18n/index.ts`
- Файлы переводов: `frontend/src/shared/lib/i18n/locales/{ru|en|kk}.json`

### 2. Правила именования ключей
Используйте иерархическую структуру (nested JSON) для группировки по модулям и контексту:
- `{module}.{feature|screen}.{element}` — например: `auth.login.submit`
- `common.{element}` — для переиспользуемых слов (save, cancel, loading)
- `{module}.validation.{rule}` — для сообщений об ошибках

### 3. Использование в компонентах
1. **Script setup**:
   ```typescript
   import { useI18n } from 'vue-i18n';
   const { t } = useI18n();
   
   const message = t('auth.login.error');
   ```
2. **Template**:
   ```html
   <template>
     <UiButton>{{ t('common.save') }}</UiButton>
     <!-- Для простых строк без логики в script можно использовать $t напрямую -->
     <span>{{ $t('notes.empty') }}</span>
   </template>
   ```

### 4. Динамические данные
Всегда используйте интерполяцию для дат, чисел и переменных:
- JSON: `"updated": "Обновлено: {date}"`
- Code: `t('notes.updated', { date: formatDate(note.updatedAt) })`

### 5. Порядок добавления новой строки
1. Добавить ключ и текст в `ru.json` (основной язык).
2. Добавить переводы в `en.json` и `kk.json`.
3. Заменить хардкод в компоненте на вызов `t()`.
4. Проверить отображение на всех трех языках.
