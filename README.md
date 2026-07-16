# 📊 Asset Portfolio Manager

> A modern offline-first application for managing digital assets across multiple wallets.

![Version](https://img.shields.io/badge/version-v0.10-blue)
![Status](https://img.shields.io/badge/status-in%20development-orange)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📖 About

Asset Portfolio Manager is a personal project built to manage digital assets distributed across multiple wallets.

The application is designed with an **offline-first** philosophy, storing all data locally using **IndexedDB (Dexie)**.

The main goals of this project are:

- Manage multiple wallets
- Track deposits, withdrawals and transfers
- Monitor portfolio performance
- Set daily and weekly goals
- Learn and apply modern React architecture

---

## ✨ Features

### ✅ Dashboard

- Portfolio overview
- Balance cards
- Performance charts
- Portfolio distribution
- Recent transactions
- Quick actions

### ✅ Wallets

- Create wallets
- Edit wallets
- Archive wallets
- Delete wallets
- Wallet statistics
- Wallet history
- Global activity
- Search and filters

### 🚧 Planned

- Goals
- Transactions
- Settings
- Reports
- Insights

---

## 🛠️ Tech Stack

### Frontend

- React 19
- TypeScript 5
- Vite
- Tailwind CSS v4

### Database

- IndexedDB
- Dexie.js

### Charts

- Recharts

### Utilities

- date-fns
- uuid

---

## 📁 Project Structure

```text
src/
├── components/
├── context/
├── database/
├── features/
├── hooks/
├── layouts/
├── pages/
├── repositories/
├── services/
├── types/
└── utils/
```

---

## 🏛️ Architecture

The project follows a layered architecture.

```text
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
Dexie (IndexedDB)
```

Business rules are isolated from persistence, making the application easier to maintain and evolve.

---

## 📚 Documentation

Project documentation is available in the `docs` folder.

```text
docs/
├── ROADMAP.md
├── ARCHITECTURE.md
└── DECISIONS.md
```

---

## 🚀 Getting Started

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Build for production

```bash
npm run build
```

---

## 🎯 Roadmap

Current version:

**v0.10**

Completed

- ✅ Dashboard
- ✅ Wallets

In Progress

- 🚧 Goals
- 🚧 Transactions

Future versions will introduce:

- Settings
- Reports
- Insights
- Backup & Restore
- Themes
- Notifications

---

## 🎓 Learning Goals

This project was created not only as a portfolio application, but also as a way to practice:

- React
- TypeScript
- Repository Pattern
- Service Layer
- Clean Architecture
- Offline-first development
- Design Systems

---

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ using React + TypeScript.
