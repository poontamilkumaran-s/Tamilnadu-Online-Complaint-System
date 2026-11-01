Project Report : https://drive.google.com/drive/folders/1x2lVQ74AoJeJAMU3y0rzMk3EV4k70CJf?usp=sharing

# Tamilnadu Online Complaint System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application designed to streamline complaint resolution, enforce role-based access security, enable real-time user-agent communication, and provide interactive operational analytics for admins.

---

## 🌟 Key Features

1. **Role-Based Authentication & Authorization**
   - **User**: Register, submit complaints with priority & category tags, view live timeline progress, chat in real-time with assigned agents, submit 1-5 star ratings & feedback.
   - **Agent**: Manage assigned ticket queue, update statuses (`In Progress`, `Resolved`, `Rejected`), log resolution summaries, direct chat with ticket creators.
   - **Admin**: Full complaints control center, manual & auto agent assignment, user role management, system analytics dashboard (KPIs, resolution rates, category stats, agent ranking leaderboard).

2. **Zero-Setup Database Connection**
   - Intelligent connection handler with automatic fallback to `mongodb-memory-server` if local MongoDB is not active.
   - Auto-seeding on startup with sample users, agents, complaints, chat histories, and feedback.

3. **Modern High-End Design System**
   - Custom Vanilla CSS design with glassmorphism panels, vibrant glowing status badges, responsive drawer layouts, smooth micro-animations, and 1-Click Demo Login shortcuts.

---

## 🚀 Quick Start Instructions

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Run Backend API Server

```bash
cd backend
npm run dev
```
*Backend runs at: `http://localhost:5000`*

### 3. Run Frontend Application

```bash
cd frontend
npm run dev
```
*Frontend runs at: `http://localhost:3000`*

---

## 🔑 Demo Login Credentials

The application is pre-seeded with demo accounts. You can also use the 1-Click Demo Login buttons on the Login page:

| Role | Email | Password | Department |
|---|---|---|---|
| **Admin** | `admin@complaintpro.com` | `Admin@123` | General |
| **Agent (Tech)** | `agent.tech@complaintpro.com` | `Agent@123` | Technical |
| **Agent (Billing)** | `agent.billing@complaintpro.com` | `Agent@123` | Billing |
| **User (John)** | `john.doe@example.com` | `User@123` | General |
| **User (Jane)** | `jane.smith@example.com` | `User@123` | General |

---

## 📡 API Endpoint Summary

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `GET /api/auth/users`
- **Complaints**: `POST /api/complaints`, `GET /api/complaints`, `GET /api/complaints/:id`, `PUT /api/complaints/:id/status`, `PUT /api/complaints/:id/assign`, `DELETE /api/complaints/:id`
- **Chat**: `GET /api/chat/:complaintId`, `POST /api/chat/:complaintId`
- **Feedback**: `POST /api/feedback`, `GET /api/feedback`
- **Analytics**: `GET /api/analytics/dashboard`
