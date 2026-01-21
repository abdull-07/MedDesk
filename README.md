# MedDesk 💻


MedDesk is a full-stack doctor appointment booking web application designed to connect patients with doctors efficiently. It supports role-based access for Admin, Doctors, and Patients, and provides seamless user experience through features like profile management, doctor availability scheduling, and appointment tracking.

---

## 🔍 Features

* 🧑‍⚕️ Doctor registration & profile management
* 👤 Patient registration & booking interface
* 📅 Appointment booking, cancelation & rescheduling
* 📬 Email notifications (optional SMTP support)
* 🔐 JWT authentication with role-based access (Admin, Doctor, Patient)
* 💳 Payment gateway integration (e.g., JazzCash / Stripe)
* 📊 Admin dashboard to manage users, appointments, and reports
* ⚙️ Secure backend with MongoDB for data storage

---

## 🧰 Tech Stack

---

### 🎨 Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

### ⚙️ Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

---

### 🔐 Auth & Middleware

![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

---

### 💳 Payments

![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)



## 🛠️ Installation & Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/abdull-07/MedDesk.git
cd MedDesk
```

---

### 2. Setup Backend

📁 Navigate to backend directory:

```bash
cd backend
```

📦 Install dependencies:

```bash
npm install
```

🛠️ Create .env file:

Create a .env file in the backend directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

# Admin Credentials for first-time login
ADMIN_EMAIL=testadmin@gmail.com
ADMIN_PASSWORD=securepassword

# SMTP (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
SMTP_FROM=noreply@meddesk.com

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

▶️ Start the server:

```bash
npm run dev
```

This will start the backend on [http://localhost:5000](http://localhost:5000)

---

### 3. Setup Frontend

📁 Navigate to frontend (root):

```bash
cd ../frontend
```

📦 Install dependencies:

```bash
npm install
```

⚙️ Create .env.local file:

```env
NEXT_PUBLIC_API_BASE=http://localhost:5000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

▶️ Start development server:

```bash
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:3000)

---

## ✨ Folder Structure

* backend/

  * controllers/
  * models/
  * routes/
  * middleware/
  * services/
  * utils/
  * .env
  * server.js
* frontend/

  * app/
  * components/
  * hooks/
  * utils/
  * styles/
  * public/
  * .env.local
  * tailwind.config.js
  * next.config.js

---

## 👥 Roles

* Admin: Full access to users, doctors, appointments
* Doctor: Manages schedule, views appointments & patients
* Patient: Books appointments, views history

---

## ✅ Coming Soon

* Email & SMS notifications
* Admin reporting dashboard (appointments, revenue, etc.)
* Doctor verification system ✅

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to fork this repo and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

## Live Demo
https://med-desk-one.vercel.app/

## Mobile APP
https://github.com/abdull-07/MedDesk-Mobile-APP
