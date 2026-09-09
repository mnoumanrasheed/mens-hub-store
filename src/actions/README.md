# Server Actions

Thin, server-only mutation entry points belong here. Every future action must authenticate and authorize independently, validate untrusted input, delegate database work to the data/domain layer, and return a minimal typed result.

No actions are implemented during Phase 1.
