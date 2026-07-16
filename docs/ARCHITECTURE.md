# 🏗️ Architecture

> Asset Portfolio Manager follows a feature-based architecture with clear separation of responsibilities.
>
> The application is **offline-first**, using IndexedDB (Dexie) as its local database and React as the presentation layer.

---

# Philosophy

The architecture is built around a few simple principles:

- Single Responsibility
- Separation of Concerns
- Offline First
- Feature-based Organization
- Reusable Components
- Predictable Data Flow

Every layer has a single responsibility.

No layer should know more than necessary.

---

# High Level Architecture

```text
                    React UI
                        │
                        ▼
                Custom Hooks
                        │
                        ▼
                 React Context
                        │
                        ▼
                   Services
                        │
                        ▼
                 Repositories
                        │
                        ▼
               Dexie (IndexedDB)
```

The application always communicates with the database through this flow.

No shortcuts.

---

# Layer Responsibilities

---

## UI

Location

```
src/components
src/pages
```

Responsibilities

- Render interface
- Display data
- Handle user interactions
- No business logic
- No database access

Examples

- Button
- WalletCard
- TransactionTable
- GoalCard

---

## Hooks

Location

```
src/hooks
```

Responsibilities

- Reusable state logic
- Data loading
- Event handling
- Connect components with Context

Examples

```
useWallets()

useTransactions()

useGoals()
```

Hooks never access the database directly.

---

## Context

Location

```
src/context
```

Responsibilities

- Global state
- Share data
- Cache loaded entities
- Coordinate UI updates

Examples

```
WalletContext

TransactionContext

SettingsContext
```

Context should never contain persistence logic.

---

## Services

Location

```
src/services
```

Responsibilities

- Business rules
- Validation
- Calculations
- Coordination between repositories

Examples

```
WalletService

TransactionService

GoalService
```

Examples of responsibilities

- Calculate balances
- Validate transfers
- Create automatic records
- Update related entities

Services know the business.

---

## Repository

Location

```
src/repositories
```

Responsibilities

- Read database
- Write database
- CRUD operations
- Queries

Examples

```
WalletRepository

AssetRepository

TransactionRepository
```

Repositories never calculate business rules.

---

## Database

Location

```
src/database
```

Technology

```
Dexie
```

Responsibilities

- Persist entities
- Define schema
- Seeds
- Database migrations

Database knows nothing about React.

---

# Data Flow

Every action follows the same flow.

```
User clicks button

↓

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

↓

Repository

↓

Service

↓

Context

↓

Hook

↓

Component updates
```

The flow is always unidirectional.

---

# Project Structure

```
src/

assets/

components/

context/

database/

features/

hooks/

layouts/

pages/

repositories/

services/

types/

utils/
```

---

# Feature Structure

Each feature is isolated.

Example

```
wallet/

components/

hooks/

services/

repository/

utils/

pages/

types/

index.ts
```

A feature should contain everything related to itself.

---

# Component Organization

Components are divided into two groups.

## Shared Components

Reusable across the application.

Examples

```
Button

Input

Card

Modal

Badge

Tooltip
```

Location

```
components/ui
```

---

## Feature Components

Specific to a module.

Examples

```
WalletCard

GoalProgress

TransactionRow

AssetChart
```

Location

```
features/.../components
```

---

# Folder Responsibilities

## pages/

Application screens.

Example

```
Dashboard

Wallets

Goals

Transactions
```

---

## layouts/

Application layouts.

Example

```
AppLayout

DashboardLayout
```

---

## components/

Reusable UI.

---

## features/

Business modules.

---

## repositories/

Persistence layer.

---

## services/

Business layer.

---

## hooks/

Reusable logic.

---

## types/

Shared TypeScript models.

---

## utils/

Pure helper functions.

Example

```
formatCurrency()

formatDate()

generateId()
```

---

# Dependency Rules

Allowed

```
UI

↓

Hooks

↓

Context

↓

Services

↓

Repositories

↓

Dexie
```

Not allowed

```
UI

↓

Dexie
```

---

```
Repository

↓

Context
```

---

```
Service

↓

Component
```

---

```
Database

↓

React
```

Each layer only knows the layer immediately below it.

---

# State Management

Global state

```
React Context
```

Local state

```
useState
```

Derived state

```
useMemo
```

Side effects

```
useEffect
```

---

# Database Strategy

The database stores only persistent data.

Examples

- Wallets
- Assets
- Transactions
- Goals
- Settings

The database does NOT store:

- Calculated balances
- Statistics
- Dashboard totals
- Charts
- Percentages

Those values are calculated when needed.

---

# Error Handling

Errors are handled by Services.

Repositories only throw errors.

Components only display errors.

---

# Adding a New Feature

Every new feature follows the same checklist.

## 1

Create TypeScript types.

```
types/
```

---

## 2

Create Repository.

```
repositories/
```

---

## 3

Create Service.

```
services/
```

---

## 4

Create Context.

```
context/
```

---

## 5

Create Hook.

```
hooks/
```

---

## 6

Create Components.

```
components/
```

---

## 7

Create Page.

```
pages/
```

---

## 8

Register routes.

---

## 9

Update navigation.

---

## 10

Update ROADMAP.

---

# Naming Convention

Components

```
PascalCase
```

Example

```
WalletCard
```

Hooks

```
camelCase

useSomething
```

Example

```
useWallets
```

Repositories

```
SomethingRepository
```

Services

```
SomethingService
```

Contexts

```
SomethingContext
```

Types

```
PascalCase
```

Enums

```
PascalCase
```

Files

```
kebab-case
```

---

# Future Architecture

The project is prepared to replace Dexie without affecting the UI.

Future

```
Dexie

↓

SQLite

↓

PostgreSQL

↓

REST API

↓

GraphQL
```

Only the Repository layer should require changes.

The rest of the application should remain unchanged.

---

# Summary

Architecture Principles

✅ Offline First

✅ Feature Based

✅ Repository Pattern

✅ Service Layer

✅ Separation of Concerns

✅ Reusable Components

✅ Predictable Data Flow

✅ Strong TypeScript Models

✅ Single Responsibility
