# 🏗 Backend Architecture: Node.js Clean Architecture

## 🎯 Approach
The backend follows **Clean Architecture** principles with a focus on **Decoupling**, **Inversion of Control (IoC)**, and **Testability**.

## 🧱 Layers
1. **Domain Entities:** Pure TypeScript classes or interfaces representing the core business models (e.g., `user.entity.ts`). No external dependencies (like Prisma types).
2. **Repositories:** Encapsulate data access logic. Return Domain Entities, NOT database-specific models.
3. **Services:** Contain business logic. Orchestrate repositories and other services.
4. **Controllers:** Handle HTTP requests, DTO validation, and response formatting.

## 🛠 Tools & Standards
- **InversifyJS:** Used for Dependency Injection.
- **Prisma:** ORM for database interaction (encapsulated in repositories).
- **Class-Validator:** Used in DTOs for incoming request validation.
- **Jest:** All business logic (Services) and data access (Repositories) MUST have unit tests. Controllers should have integration tests.

## 📐 Style
- Use **Interface-based programming** (e.g., `INoteService`, `INoteRepository`).
- Maintain a clear folder structure per module (e.g., `src/users`, `src/notes`).
