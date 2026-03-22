# CA Firm — Full-Stack Web Application

A complete, production-ready web application for a Chartered Accountant firm built with **React**, **Node.js/Express**, and **MongoDB**.

---

## 🚀 Features

| Feature | Details |
|---------|---------|
| **Public Website** | Home, About, Services (5 detailed pages), Blog, Contact |
| **Lead Generation** | Contact form with MongoDB storage + email notification |
| **Appointment Booking** | 3-step wizard, time slot conflict prevention |
| **WhatsApp Integration** | Floating button with pre-filled service messages |
| **Blog System** | SEO-optimized with rich editor, tags, meta description |
| **Admin Dashboard** | JWT auth, manage leads/appointments/blogs |
| **SEO Ready** | Meta tags, canonical URLs, SEO preview |
| **Responsive** | Mobile-first design with Tailwind CSS |

---

## 📁 Project Structure

```
ca-firm/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── config/           # Database connection
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/        # Auth (JWT), error handler
│   │   ├── models/           # Mongoose schemas (Admin, Lead, Appointment, Blog)
│   │   ├── routes/           # Express routers
│   │   ├── utils/            # Email sender, DB seed
│   │   └── server.js         # Entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/                 # React application
    ├── src/
    │   ├── components/
    │   │   ├── layout/       # Navbar, Footer, AdminLayout
    │   │   └── common/       # LeadForm, WhatsAppButton, SEO, Spinner
    │   ├── context/          # AuthContext (JWT state)
    │   ├── data/             # Services, testimonials, FAQs data
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── About.js
    │   │   ├── Services.js
    │   │   ├── Blog.js / BlogPost.js
    │   │   ├── Contact.js
    │   │   ├── BookAppointment.js
    │   │   ├── services/     # ServiceDetail.js
    │   │   └── admin/        # Login, Dashboard, Leads, Appointments, Blogs, BlogEditor
    │   ├── utils/            # Axios API client
    │   └── App.js            # Routes
    ├── .env.example
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** or yarn

---

## 🛠️ Setup Instructions

### 1. Clone / Download

```bash
# If using git
git clone <repo-url>
cd ca-firm
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file and fill in values
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, email credentials

# Seed database (creates admin + sample blogs)
npm run seed
# ✅ Admin: admin@cafirm.com / Admin@123456

# Start development server
npm run dev
# API running at http://localhost:5000
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit REACT_APP_WHATSAPP_NUMBER with your number

# Start React development server
npm start
# App running at http://localhost:3000
```

### 4. Open in Browser

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Public website |
| `http://localhost:3000/admin/login` | Admin login |
| `http://localhost:5000/health` | API health check |

---

## 🔐 Admin Credentials (after seeding)

```
Email:    admin@cafirm.com
Password: Admin@123456
```

> ⚠️ Change the password immediately after first login via Settings.

---

## 📡 API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/leads` | Submit lead/enquiry |
| GET | `/api/appointments/slots?date=YYYY-MM-DD` | Get available slots |
| POST | `/api/appointments` | Book appointment |
| GET | `/api/blogs` | List published blogs |
| GET | `/api/blogs/:slug` | Get single blog |

### Admin Endpoints (requires JWT Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Current admin profile |
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/leads` | List all leads |
| PUT | `/api/admin/leads/:id` | Update lead status |
| DELETE | `/api/admin/leads/:id` | Delete lead |
| GET | `/api/admin/appointments` | List appointments |
| PUT | `/api/admin/appointments/:id` | Update appointment |
| GET | `/api/admin/blogs` | List all blogs (incl. drafts) |
| POST | `/api/admin/blogs` | Create blog post |
| PUT | `/api/admin/blogs/:id` | Update blog post |
| DELETE | `/api/admin/blogs/:id` | Delete blog post |

---

## 🎨 Customisation Guide

### Update Contact Info
Edit `frontend/src/components/layout/Navbar.js` and `Footer.js`

### Update Services
Edit `frontend/src/data/index.js` → `SERVICES` array

### Update WhatsApp Number
Set `REACT_APP_WHATSAPP_NUMBER=91XXXXXXXXXX` in `frontend/.env`

### Update Google Maps
In `frontend/src/pages/Contact.js`, replace the `src` in the `<iframe>` with your embed URL from [Google Maps](https://maps.google.com)

### Add Email Notifications
Fill in the email fields in `backend/.env`:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

---

## 🚢 Production Deployment

### Backend (Railway / Render / VPS)

```bash
cd backend
# Set NODE_ENV=production in your hosting env vars
# Set MONGODB_URI to your Atlas connection string
# Set FRONTEND_URL to your deployed frontend URL
npm start
```

### Frontend (Vercel / Netlify)

```bash
cd frontend
# Set REACT_APP_API_URL=https://your-backend-url.com/api
npm run build
# Deploy the /build folder
```

---

## 🛡️ Security Features

- **JWT authentication** with 7-day expiry
- **bcryptjs** password hashing (12 rounds)
- **Helmet.js** HTTP security headers
- **CORS** restricted to frontend URL
- **Rate limiting** ready (install `express-rate-limit`)
- **Input validation** with `express-validator`
- **MongoDB injection** prevention via Mongoose

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcryptjs |
| Email | Nodemailer |
| SEO | react-helmet-async |

---

## 🐛 Troubleshooting

**MongoDB connection error**
- Ensure MongoDB is running locally: `mongod --dbpath /data/db`
- Or use MongoDB Atlas and paste the connection string in `.env`

**CORS error in browser**
- Verify `FRONTEND_URL` in backend `.env` matches your React dev server URL

**Admin login fails**
- Run `npm run seed` in the backend directory first

**Emails not sending**
- Gmail requires an App Password (not your regular password)
- Go to Google Account → Security → 2-Step Verification → App Passwords

---

## 📄 License

MIT — Free to use and modify for commercial projects.

---

*Built with ❤️ for Indian CA Firms*
