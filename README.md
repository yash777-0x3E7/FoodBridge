# 🍎 FoodBridge — Real-Time Surplus Food Rescue

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-success?logo=vercel&style=for-the-badge)](https://foodbridge-app.vercel.app)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**FoodBridge** connects hotels, restaurants, and event venues with NGOs, shelters, and individuals in need. Our mission is to ensure that surplus food reaches people before it goes to waste, in real-time.

---

## ✨ Key Features

### 🏢 For Donors (Hotels, Restaurants, Caterers)
- **Batch Donations**: Publish multiple food items (e.g., Rice, Curry, Dessert) in a single, streamlined form.
- **Real-Time Tracking**: See exactly when your food is claimed and by whom.
- **Simple Management**: Monitor active listings and track your total impact (people served).

### 🤝 For Receivers (NGOs, Shelters, Volunteers)
- **Live Feed**: Browse available food nearby with real-time updates.
- **Instant Claiming**: Claim food with one click and get instant donor contact details.
- **Smart Filtering**: Sort by expiry time or distance to prioritize the most urgent rescues.

---

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) with [TanStack Router](https://tanstack.com/router) for lightning-fast SPA navigation.
- **Backend/Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore) for real-time data synchronization.
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth) with secure role-based access control.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom professional design system.
- **Deployment**: [Vercel](https://vercel.com/) for high-performance global delivery.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Local Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yash777-0x3E7/FoodBridge.git
   cd food-connect-hub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

---

## 🌎 Deployment

The app is optimized for **Vercel**. 

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **SPA Support**: Configured via `vercel.json` to handle client-side routing.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📬 Contact

**Yashas R S** - [Email](yashasrs999@gmail.com)

Project Link: [https://github.com/yash777-0x3E7/FoodBridge](https://github.com/yash777-0x3E7/FoodBridge)

---
<p align="center">
  <i>Reduce food waste, feed more people. Together with FoodBridge.</i>
</p>
