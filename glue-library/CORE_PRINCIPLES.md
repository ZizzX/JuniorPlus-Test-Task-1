# 🛠 Core Principles

1. **Glue Library First:** The agent MUST read `glue-library/INDEX.md` and related files at the start of every session to refresh its context on architectural decisions and troubleshooting history.
2. **Document Every Decision:** Any critical architectural choice, fix for a non-trivial bug, or new project-wide tool addition MUST be documented in `glue-library/KNOWLEDGE_BASE.md`.
3. **Strict Conformity:** Code implementations MUST strictly follow the patterns described in `BACKEND_ARCHITECTURE.md` and `FRONTEND_ARCHITECTURE.md`.
4. **Knowledge Evolution:** The agent is encouraged to propose updates to the Glue Library when better practices are discovered or when current documentation becomes obsolete.
5. **No Blind Coding:** If a task seems to contradict established patterns in the library, the agent MUST ask for clarification before proceeding.
