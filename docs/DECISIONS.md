# 📜 Technical Decisions

> This document records the architectural and technical decisions adopted by the project.
>
> Every important decision should be documented here, together with its motivation.
>
> New decisions should be added rather than replacing old ones whenever possible.

---

# DEC-001

## Balance is Never Persisted

**Status**

✅ Accepted

---

### Decision

Wallet balances are never stored in the database.

Balances are always calculated from transactions.

---

### Why

Storing calculated values introduces inconsistencies.

If a transaction is edited or deleted, persisted balances could become incorrect.

The source of truth should always be the transaction history.

---

### Consequences

Advantages

- Better data integrity
- Easier validation
- No synchronization issues

Disadvantages

- More calculations
- Slightly more processing

Accepted.

---

# DEC-002

## UI Never Accesses Dexie

**Status**

✅ Accepted

---

### Decision

React components must never communicate directly with IndexedDB.

---

### Why

Components should only display information.

Persistence belongs to the Repository layer.

---

### Allowed

```
Component

↓

Hook

↓

Context

↓

Service

↓

Repository

↓

Dexie
```

---

### Forbidden

```
Component

↓

Dexie
```

---

# DEC-003

## Every Financial Change Creates a Transaction

**Status**

✅ Accepted

---

### Decision

Every financial modification must generate a transaction.

Examples

- Deposit
- Withdraw
- Transfer
- Reward
- Manual Adjustment

---

### Why

The transaction history is the application's source of truth.

Every balance calculation depends on it.

---

### Consequences

The history becomes complete and auditable.

---

# DEC-004

## CRUD Operations Must Go Through Services

**Status**

✅ Accepted

---

### Decision

Repositories should never be called directly from UI or Context.

All write operations pass through Services.

---

### Why

Business rules belong to Services.

Repositories only persist data.

---

### Example

Correct

```
Component

↓

Hook

↓

Context

↓

WalletService

↓

WalletRepository
```

Wrong

```
Component

↓

WalletRepository
```

---

# DEC-005

## UI Contains No Business Logic

**Status**

✅ Accepted

---

### Decision

React components should only render the interface.

---

### Allowed

- formatting
- rendering
- animations
- local interactions

---

### Forbidden

- balance calculations
- validations
- financial rules
- persistence

---

# DEC-006

## Offline First

**Status**

✅ Accepted

---

### Decision

The application works without an internet connection.

---

### Why

This project is designed as a local desktop application.

Internet should never be required.

---

### Consequences

- Fast
- Private
- Reliable
- Independent

---

# DEC-007

## Repository Pattern

**Status**

✅ Accepted

---

### Decision

Every entity owns its own Repository.

Examples

- WalletRepository
- TransactionRepository
- AssetRepository
- GoalRepository

---

### Why

Repositories isolate persistence.

Future database migrations become easier.

---

# DEC-008

## Business Logic Lives in Services

**Status**

✅ Accepted

---

### Decision

Every financial rule belongs to Services.

Examples

- Transfer validation
- Goal calculation
- Statistics
- Balance calculation

---

### Why

Business rules should not be duplicated.

---

# DEC-009

## One Responsibility per Layer

**Status**

✅ Accepted

---

### Decision

Each layer has only one responsibility.

UI

Displays data.

Hooks

Reusable state logic.

Context

Global state.

Services

Business logic.

Repositories

Persistence.

Database

Storage.

---

# DEC-010

## Feature-Based Organization

**Status**

✅ Accepted

---

### Decision

Features should be grouped together.

Example

```
wallet/

components/

hooks/

services/

repository/

types/
```

---

### Why

Makes the project easier to scale.

---

# DEC-011

## Statistics Are Derived Data

**Status**

✅ Accepted

---

### Decision

Statistics are never persisted.

Examples

- Total Balance
- Weekly Profit
- Wallet Percentage
- Dashboard Cards

---

### Why

Statistics depend on transactions.

They can always be recalculated.

---

# DEC-012

## IDs Are Immutable

**Status**

✅ Accepted

---

### Decision

Entity identifiers never change.

Names may change.

IDs never do.

---

# DEC-013

## Soft Delete Whenever Possible

**Status**

✅ Accepted

---

### Decision

Wallets should preferably be archived instead of deleted.

---

### Why

Deleting historical data can invalidate reports.

---

# DEC-014

## Strong TypeScript Typing

**Status**

✅ Accepted

---

### Decision

Avoid using `any`.

Prefer explicit models.

---

### Why

Type safety improves maintainability.

---

# DEC-015

## Components Must Be Reusable

**Status**

✅ Accepted

---

### Decision

UI components should be generic whenever possible.

Example

Good

```
Button

Card

Modal

Badge
```

Avoid

```
WalletPurpleButton
```

---

# DEC-016

## Keep Business Rules Independent from React

**Status**

✅ Accepted

---

### Decision

Business rules should not depend on React.

---

### Why

Makes migration to another UI framework easier.

---

# DEC-017

## Prefer Composition over Duplication

**Status**

✅ Accepted

---

### Decision

Reuse components and logic instead of copying code.

---

# DEC-018

## Database Can Be Replaced

**Status**

✅ Accepted

---

### Decision

Dexie is an implementation detail.

Repositories hide the persistence layer.

---

### Future Possibilities

Dexie

↓

SQLite

↓

PostgreSQL

↓

REST API

↓

GraphQL

No UI changes should be required.

---

# Future Decisions

This document should evolve as the project grows.

Every major architectural decision must be documented here before implementation.

Examples

- Cloud synchronization
- Authentication
- Plugin system
- Desktop version
- Multi-user support
- Encryption
