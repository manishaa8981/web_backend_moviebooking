# 🎬 Movie Ticket Booking Application 🎟️
## 📌 Overview
This Movie Ticket Booking Application is a full-stack web application that allows users to browse movies, select showtimes, book seats, and make payments securely using Stripe. The system includes user authentication, an admin panel for managing movies, halls, and showtimes, and a dashboard for analytics.

## 🚀 Features
### 🔹 User Features
🎟️ Browse Movies – View a list of movies with descriptions, posters, and showtimes.
🎥 Movie Booking – Select a movie, pick a showtime, and book seats.
🏛️ Hall & Seat Selection – View seat layout and choose preferred seats.
💳 Secure Payments – Process payments using Stripe.
🎫 Booking Confirmation – Receive a digital ticket after payment.
📜 My Bookings – Users can track their booking history.
🔐 Authentication – Register, login, reset password, and manage user profiles.
### 🔹 Admin Features
🎬 Manage Movies – Add, update, and remove movies.
🏛️ Manage Halls & Showtimes – Configure halls, seats, and schedules.
🎟️ View Bookings – Track user reservations and payments.
📊 Dashboard – View revenue, occupancy rates, and analytics.
## 🛠️ Tech Stack
### Frontend
React (with Vite)
React Router
TailwindCSS & DaisyUI
Axios (API Requests)
Stripe.js (Payment Processing)
Lucide React (Icons)
Framer Motion (Animations)
### Backend
Node.js (Express Framework)
MongoDB (Mongoose ODM)
JWT Authentication
Stripe API (Secure Payments)
Multer (Image Uploads)
Nodemailer (Email Services)
## ⚙️ Installation & Setup
### 1️⃣ Clone the Repository
git clone https://github.com/manishaa8981/web_backend_moviebooking.git
cd movie-ticket-booking
### 2️⃣ Backend Setup
cd web_backend_moviebooking
npm install
### 📌 Setup .env file for backend
PORT=4011
MONGO_URI=mongodb://localhost:27017/movie_ticket_booking
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
FRONTEND_URL=http://localhost:4000
### Run the Backend
npm start
## 🎯 Future Enhancements
📃 Printable Tickets 
📊 Admin Dashboard Analytics
🛍️ Promo Codes & Discounts
🏆 Loyalty Program for Frequent Users
