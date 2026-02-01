# QuickChat Backend Engineering Guide

> Technical documentation for the QuickChat Node.js Server.

## ⚡ Overview

The QuickChat backend is a robust RESTful API and WebSocket server built with **Node.js** and **Express**. It handles authentication, data persistence via **MongoDB**, and real-time event broadcasting using **Socket.io**.

## 🏗 Architecture

### Design Pattern
The backend follows the standard **MVC (Model-View-Controller)** pattern, adapted for an API-first approach (where "View" is replaced by JSON responses).

```
backend/src/
├── controllers/    # Business logic & Request handling
├── models/         # Mongoose Schemas (Data Layer)
├── routes/         # API Endpoint definitions
├── middlewares/    # Auth, Validation, & Error handling
├── socket/         # Real-time Event Handlers
├── libs/           # External service configurations (DB, Cloudinary, Email)
└── utils/          # Helper functions
```

### Key Components

*   **Authentication**: Implemented using **JWT (JSON Web Tokens)** stored in HTTP-only cookies for security, coupled with **Bcrypt** for password hashing.
*   **Real-time Layer**: A singleton `Socket.io` instance manages active connections. Authentication is enforced via a socket middleware that verifies the JWT before allowing connection.
*   **File Uploads**: Uses **Multer** (memory storage) to handle multipart form data and streams files directly to **Cloudinary**.

## 🔌 API Documentation

### Base URL: `/api`

#### Authentication Routes (`/auth`)
*   `POST /signup`: Register a new user.
*   `POST /login`: Authenticate and receive a cookie.
*   `POST /logout`: Clear the auth cookie.
*   `POST /refresh-token`: (Optional) Rotate access tokens.

#### User Routes (`/users`)
*   `GET /me`: Get current user profile.
*   `PUT /update-profile`: Update avatar or status.
*   `GET /search`: Search users by name/email.

#### Conversation Routes (`/conversations`)
*   `GET /`: Retrieve all conversations for the user.
*   `POST /`: Create a new 1-on-1 or group chat.
*   `PUT /:id/read`: Mark messages in a conversation as read.

#### Message Routes (`/messages`)
*   `GET /:conversationId`: Fetch message history with pagination.
*   `POST /:conversationId`: Send a new message (Text/Image).

## 📡 Socket.io Events

The server listens and emits the following events:

| Event Name | Direction | Description |
| :--- | :--- | :--- |
| `connection` | client -> server | Triggered on handshake. Validates Auth Token. |
| `online-users` | server -> client | Emits list of currently active user IDs. |
| `join-conversation` | client -> server | Joins a socket room for a specific chat ID. |
| `new-message` | server -> client | Broadcasts a new message payload to the room. |
| `typing` | client <-> server | (Implied) signals typing status to room participants. |
| `disconnect` | client -> server | Updates `lastSeen` timestamp in DB. |

## 🛠 Technology Stack

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB + Mongoose ODM
*   **Real-time**: Socket.io v4
*   **Security**: Helmet, CORS, Cookie-Parser, JSONWebToken
*   **Services**: Cloudinary (Images), Nodemailer (Emails)

## 🚀 Development Setup

### 1. Environment Variables
Create a `.env` file in the `backend` root:

```env
PORT=5001
CLIENT_URL=http://localhost:5173
MONGODB_CONNECTIONSTRING=mongodb+srv://...
ACCESS_TOKEN_SECRET=complex_secret_string
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Dev Server
Uses `nodemon` for auto-restarts:
```bash
npm run dev
```

### 4. Run Production
```bash
npm start
```

## 👤 Author

**Huy & PhD Mentor**
*   **Philosophy**: Functional Programming, Memory Efficiency, and "Embedded Systems" mindset in Node.js.
