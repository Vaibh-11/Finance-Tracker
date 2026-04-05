# 💰 Finance Tracker (MERN Stack)

A full-stack Finance Tracker web application built using the MERN stack (MongoDB, Express, React, Node.js).
Users can securely register, login, manage transactions, and track expenses.

---

## 🚀 Features

* 🔐 User Authentication (Login / Signup with OTP)
* 📧 Email OTP Verification (using Brevo / Resend)
* 🍪 Cookie-based authentication
* 💸 Add / Delete / View transactions
* 📊 Dashboard for all transactions
* 🔄 Persistent login (Redux Toolkit)
* 🌐 Fully deployed (Frontend + Backend)

---

## 🛠️ Tech Stack

**Frontend:**

* React
* Redux Toolkit
* React Router
* Tailwind CSS / DaisyUI

**Backend:**

* Node.js
* Express.js
* MongoDB Atlas
* JWT Authentication
* Axios

**Email Service:**

* Brevo / Resend API

---

## 📂 Project Structure

```
finance-tracker/
│
├── frontend/        # React app
│   ├── components/
│   ├── redux/
│   ├── utils/
│
├── backend/         # Node + Express API
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── config/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/finance-tracker.git
cd finance-tracker
```

---

## 🔧 Backend Setup

```
cd backend
npm install
```

### Create `.env` file:

```
PORT=4000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
BREVO_API_KEY=your_api_key
```

### Run backend:

```
npm start
```

---

## 💻 Frontend Setup

```
cd frontend
npm install
```

### Run frontend:

```
npm run dev
```

---

## 🌐 Environment Variables

### Backend (`.env`)

* `PORT` → server port
* `MONGO_URI` → MongoDB Atlas connection string
* `JWT_SECRET` → JWT secret key
* `BREVO_API_KEY` → Email API key

---

## 🔑 API Endpoints

### Auth

* `POST /user/signup`
* `POST /user/login`
* `POST /user/logout`
* `POST /user/verify-otp`

### Transactions

* `GET /transaction`
* `POST /transaction/add`
* `DELETE /transaction/:id`

---

## 📦 Deployment

* Frontend → Vercel
* Backend → Railway
* Database → MongoDB Atlas

---

## 🧪 Running the App

1. Start backend server
2. Start frontend
3. Open browser:

```
http://localhost:5173
```

---

## 👨‍💻 Author

**Vaibhav**

---

## ⭐ Future Improvements

* 📊 Charts & analytics
* 📱 Mobile responsiveness
* 🔐 Role-based authentication
* 🔔 Notifications
* 📈 Budget tracking

---

## 📝 License

This project is open-source and free to use.
