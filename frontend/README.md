# QuickChat Frontend Engineering Guide

> Technical documentation for the QuickChat React client application.

## ⚡ Overview

The QuickChat frontend is a high-performance **Single Page Application (SPA)** built with **React 19** and **Vite**. It prioritizes type safety, component modularity, and real-time responsiveness. The accessible UI is constructed using **Radix UI** primitives and styled with **TailwindCSS v4**, while global state is managed via **Zustand**.

## 🏗 Architecture & Design

### Directory Structure

```
frontend/src/
├── components/         # Feature-based & UI Components
│   ├── ui/             # Reusable Atoms (Buttons, Inputs, Dialogs) - utilizing Shadcn/Radix
│   ├── auth/           # Authentication Forms (Login, Register)
│   ├── chat/           # Chat Interface (MessageList, Input, Bubble)
│   ├── sidebar/        # Navigation & User Lists
│   └── profile/        # User Settings & Profile View
├── stores/             # Global State Managers (Zustand)
├── services/           # API Integration Layer (Axios instances)
├── hooks/              # Custom React Hooks
├── types/              # TypeScript Definitions & Interfaces
└── pages/              # Route Controllers (Pages)
```

### State Management Strategy (Zustand)
We strictly separate concerns by domain areas using Zustand stores:

*   **`useAuthStore`**: Manages user session, JWT checks, login/signup actions, and socket connection initialization.
*   **`useChatStore`**: Handles message history, selected conversation, typing indicators, and real-time message blending.
*   **`useFriendStore`**: Manages friend lists, pending requests, and online status updates.
*   **`useSocketStore`**: Encapsulates the Socket.io client instance and connection status.
*   **`useThemeStore`**: Controls dark/light mode preferences.

### Real-time Communication
The `useSocketStore` maintains a singleton Socket.io connection. Listeners are attached within individual components (using `useEffect`) or centrally in stores to react to events like `newMessage`, `typing`, or `onlineUsers`.

## 🛠 Technology Stack

*   **Core**: React 19, TypeScript, Vite
*   **Styling**: TailwindCSS 4, Tailwind Merge, CLSX, Lucide React (Icons)
*   **Deep UI**: Radix UI (Dialog, Popover, Tooltip, Avatar, etc.)
*   **State**: Zustand v5
*   **Forms**: React Hook Form + Zod (Schema Validation)
*   **Network**: Axios (HTTP), Socket.io-client (WebSocket)
*   **UX**: Sonner (Toast Notifications), Emoji Mart (Picker)

## 🚀 Development Setup

### 1. Environment Variables
Create a `.env` file in the `frontend` root.
*(Note: Vite exposes variables prefixed with `VITE_`)*

```env
VITE_API_URL=http://localhost:5001/api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Running Locally
Start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

### 4. Build for Production
Type-check and build the optimized assets:
```bash
npm run build
```

### 5. Linting
Run ESLint to check for code quality issues:
```bash
npm run lint
```

## 🧩 Component Guidelines

*   **Atomic Design**: Place generic UI elements (buttons, inputs) in `components/ui`.
*   **Feature Isolation**: Place complex logic-heavy components in their respective feature folders (e.g., `components/chat`).
*   **Composition**: Prefer passing `children` or using slots over complex prop drilling.
*   **Hooks**: Extract reusable logic (e.g., specific event listeners) into `hooks/`.

## 🎨 Styling Guide

*   Use `tailwind-merge` (`cn` utility) when accepting `className` props to allow overrides.
*   Stick to the defined color palette in `index.css` (CSS Variables).
*   Ensure all interactive elements have accessible labels (via `aria-label` or visible text).
