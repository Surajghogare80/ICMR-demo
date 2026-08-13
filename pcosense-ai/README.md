# PRABHA 🩺

> **AI-Based PMOS Prediction Web Application**  
> A production-ready MERN Stack healthcare platform with AI integration-ready architecture.

---

## 🏗️ Project Structure (Monorepo)

```
pmosense-ai/
├── frontend/          # React 19 + Vite + Material UI
├── backend/           # Node.js + Express + MongoDB Atlas
├── docs/              # API docs & architecture notes
└── README.md
```

---

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | Core UI framework |
| Material UI | Component library |
| React Router DOM | Client-side routing |
| Axios | HTTP client |
| React Hook Form + Yup | Form handling & validation |
| TanStack Query | Server state management |
| Framer Motion | Animations |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB Atlas + Mongoose | Database & ODM |
| JWT + bcrypt | Authentication & security |
| Helmet | HTTP security headers |
| Morgan | Request logging |
| express-rate-limit | Rate limiting |
| Compression | Response compression |
| express-validator | Input validation |

---

## 📦 Collections (MongoDB)

| Collection | Description |
|---|---|
| `users` | Registered user accounts |
| `personalmetrics` | Step 1: Age, weight, height, BMI |
| `menstrualhistories` | Step 2: Cycle data |
| `clinicalsymptoms` | Step 3: Physical symptoms |
| `lifestylehabits` | Step 4: Lifestyle habits |
| `predictions` | Prediction results with references |
| `activitylogs` | Admin audit trail |

---

## 🔐 Authentication

- JWT Access Tokens
- bcrypt Password Hashing
- Role-Based Access Control (`user` | `admin`)
- Protected Routes (Frontend & Backend)

---

## 📋 API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PUT    /api/auth/profile

POST   /api/predictions
GET    /api/predictions
GET    /api/predictions/:id
DELETE /api/predictions/:id

GET    /api/admin/users          (Admin only)
DELETE /api/admin/users/:id      (Admin only)
GET    /api/admin/stats          (Admin only)
GET    /api/admin/logs           (Admin only)
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # Fill in your credentials
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🤖 AI Integration (Future Phase)

The prediction endpoint (`POST /api/predictions`) currently returns structured dummy JSON.  
To integrate a real AI/ML model, simply replace the `predictionService.generatePrediction()` method — no other code changes required.

---

## 📄 License

MIT © PRABHA Team
