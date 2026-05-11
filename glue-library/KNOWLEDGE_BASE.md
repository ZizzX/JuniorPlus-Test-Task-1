# 🛠 Knowledge Base & Troubleshooting

## 🐘 Prisma PostgreSQL Connection (Adapter Fix)
**Date:** 2026-05-11
**Issue:** `PrismaClientInitializationError` when switching from SQLite to PostgreSQL, or invalid connection string errors due to special characters in passwords.

**Solution:**
1. **URL Encoding:** All special characters in the `DATABASE_URL` password (like `!`, `@`, `#`) MUST be URL-encoded (e.g., `%21`, `%40`, `%23`).
2. **PostgreSQL Adapter:** Use `@prisma/adapter-pg` to ensure compatibility between Prisma and PostgreSQL drivers.
3. **PrismaService Implementation:**
   ```typescript
   import { PrismaPg } from '@prisma/adapter-pg';
   import { Pool } from 'pg';

   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
   const adapter = new PrismaPg(pool);
   this.client = new PrismaClient({ adapter });
   ```
4. **Migration Cleanup:** When switching providers, delete the `prisma/migrations` folder to avoid provider mismatch errors (`P3019`).

---
