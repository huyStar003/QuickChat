# QuickChat — Ứng dụng nhắn tin thời gian thực (MERN + Socket.io)

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![React](https://img.shields.io/badge/react-19.2.0-blue.svg)

## 1. Phân tích

QuickChat là hệ thống chat thời gian thực gồm hai miền: REST API (Express) và WebSocket (Socket.io) chạy chung một HTTP server. Backend sử dụng MongoDB/Mongoose, xác thực JWT, và lưu media qua Cloudinary. Frontend dùng React 19 + TypeScript (Vite), quản lý state bằng Zustand, giao tiếp qua Axios với cơ chế refresh token tự động.

Mục tiêu README:
1. Chuẩn hoá cách chạy dự án cục bộ theo chuẩn kỹ sư.
2. Liệt kê biến môi trường tối thiểu để hệ thống hoạt động ổn định.
3. Làm rõ kiến trúc, điểm entry, và các tuyến API chính.

## 2. Kiến trúc tổng quan

```
React (Vite + TS)
      │  HTTP (Axios)
      ▼
Express REST API  +  Socket.io (Realtime)
      │
      ▼
MongoDB (Mongoose)
```

Điểm entry quan trọng:
- Backend: `backend/src/server.js` khởi tạo middleware, router, swagger, DB và server Socket.io. @backend/src/server.js#1-53
- Socket: `backend/src/socket/index.js` tạo `app`, `server`, và `io`. @backend/src/socket/index.js#1-59
- Frontend: `frontend/src/main.tsx`. @frontend/src/main.tsx#1-10

API docs: `http://<HOST>:<PORT>/api-docs` đọc từ `backend/src/swagger.json`.

## 3. Công nghệ chính

- Backend: Node.js (ESM), Express 5, Mongoose, Socket.io, JWT, Multer, Cloudinary, Swagger UI.
- Frontend: React 19, TypeScript (strict), Vite, TailwindCSS, Zustand, Axios, Socket.io-client.

## 4. Yêu cầu hệ thống

- Node.js >= 18 (khuyến nghị LTS).
- MongoDB (local hoặc Atlas).
- Cloudinary account (nếu dùng upload ảnh).

## 5. Cài đặt & chạy nhanh

### 5.1 Backend

```bash
npm install
npm run dev
```

Tạo `backend/.env`:

```env
# Server
PORT=5001
CLIENT_URL=http://localhost:5173

# MongoDB
MONGODB_CONNECTIONSTRING=mongodb+srv://<user>:<pass>@cluster.mongodb.net/quickchat

# JWT
ACCESS_TOKEN_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email (tuỳ chọn, dùng cho quên mật khẩu)
EMAIL_SERVICE=gmail
EMAIL_USER=you@example.com
EMAIL_PASSWORD=app_password
```

### 5.2 Frontend

```bash
npm install
npm run dev
```

Tạo `frontend/.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

## 6. Biến môi trường (tóm tắt tối thiểu)

- `PORT`: cổng backend (mặc định 5001).
- `CLIENT_URL`: dùng cho CORS + Socket.io.
- `MONGODB_CONNECTIONSTRING`: connection string MongoDB.
- `ACCESS_TOKEN_SECRET`: khoá ký JWT.
- `CLOUDINARY_*`: cấu hình upload ảnh.
- `EMAIL_*`: dịch vụ gửi mail (tuỳ chọn).

## 7. API chính (tóm tắt)

Các route đều có prefix `/api`:

- Auth: `/auth/signup`, `/auth/signin`, `/auth/signout`, `/auth/refresh`, `/auth/forgot-password`, `/auth/reset-password`. @backend/src/routes/authRoute.js#1-25
- User: `/users/me`, `/users/search`, `/users/uploadAvatar`, `/users/:id`. @backend/src/routes/userRoute.js#1-17
- Friends: `/friends/requests`, `/friends/requests/:requestId/accept`, `/friends/requests/:requestId/decline`, `/friends`. @backend/src/routes/friendRoute.js#1-21
- Conversations: `/conversations`, `/conversations/:conversationId/messages`, `/conversations/:conversationId/seen`, `/conversations/:conversationId/members`. @backend/src/routes/conversationRoute.js#1-19
- Messages: `/messages/direct`, `/messages/group`. @backend/src/routes/messageRoute.js#1-16

Swagger: `backend/src/swagger.json` là nguồn sự thật cho schema/API.

## 8. Cấu trúc thư mục

```
backend/
  src/
    controllers/
    libs/
    middlewares/
    models/
    routes/
    socket/
    swagger.json
    server.js
frontend/
  src/
    components/
    lib/
    pages/
    stores/
    services/
```

## 9. Lệnh thường dùng

- Backend dev: `npm run dev`
- Backend start: `npm start`
- Frontend dev: `npm run dev`
- Frontend build: `npm run build`

## 10. Ghi chú kỹ sư

- Axios interceptor tự refresh token khi access token hết hạn (tối đa 4 lần retry). @frontend/src/lib/axios.ts#4-55
- Socket.io xác thực tại middleware `socketAuthMiddleware` và cập nhật `lastSeen` khi disconnect. @backend/src/socket/index.js#4-55

## 11. License

ISC (tham chiếu `backend/package.json`).
