# 🎨 Frontend Architecture: Feature-Sliced Design (FSD)

## 🎯 Approach
The frontend follows the **Feature-Sliced Design (FSD)** methodology for high scalability and modularity.

## 🧱 Layers (Bottom to Top)
1. **Shared:** Reusable components (UI Kit), API clients, helpers, constants. (No business logic).
2. **Entities:** Domain-specific data and logic (e.g., User, Note). Contains types and Pinia stores.
3. **Features:** User interactions with business value (e.g., `LoginUser`, `CreateNote`, `DeleteNote`).
4. **Widgets:** Complex compositions of features and entities (e.g., `Header`, `NoteList`).
5. **Pages:** Full views of the application.
6. **App:** Global initialization (Providers, Router, Global styles).

## 🛠 Tools & Standards
- **Vue 3 (Composition API):** Framework.
- **TypeScript:** Typed code everywhere.
- **Vite:** Build tool.
- **Tailwind CSS:** Utility-first styling.
- **Pinia:** State management (located in Entities).
- **Axios:** API communication (located in Shared).

## 📐 Style
- Public API: Every slice must have an `index.ts` to export its public parts.
- No cross-imports: Features cannot depend on other features. Components in Shared cannot depend on higher layers.
