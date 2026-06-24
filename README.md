# RVCE Student Induction Programme (SIP) 2026 Portal

A modern, highly dynamic, and responsive web application built for the RV College of Engineering First-Year Student Induction Programme. 

This portal serves as the central hub for students to view real-time announcements, the induction schedule, campus maps, and dynamic dashboard metrics. It also features a secure, hidden dashboard exclusively for Deans to manage live announcements and file attachments.

## 🌟 Key Features

*   **Dynamic Student Dashboard**: Live metrics, upcoming events, and important dates automatically sync with real-time Firebase data.
*   **Secret Dean Dashboard**: A hidden administrative route protected by Google Sign-In (with an emergency password fallback) for authorized personnel to create, edit, and delete announcements.
*   **File Attachments**: Seamlessly upload PDFs, PNGs, and JPGs to announcements via Firebase Storage.
*   **Interactive UI**: Features an intuitive Material UI Clock view for Time Pickers, dynamic chronological sorting, and sleek TailwindCSS glassmorphism styling.
*   **Intuitive Navigation**: Single-click the RVCE logo to instantly return home, with a hidden 5-click easter egg to access the Secret Dean Login.
*   **Mobile-First Design**: The entire application is 100% responsive, utilizing Tailwind breakpoints to snap perfectly into mobile, tablet, and desktop views.

## 🛠 Tech Stack

*   **Frontend**: React 18, Vite, TypeScript
*   **Styling**: Tailwind CSS, Lucide React (Icons), Material UI (Date/Time Pickers)
*   **Backend & DB**: Firebase (Authentication, Firestore Database, Storage)
*   **Routing**: React Router
*   **Hosting**: Vercel

---

## 🚀 Local Setup

1. **Clone & Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory and copy the contents of `.env.example` into it. Fill in your Firebase configuration keys.
   *Ensure you define `VITE_ALLOWED_DEANS` (comma-separated emails) to authorize specific Google accounts for admin access.*

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

---

## 🔥 Firebase Configuration

To set up your own Firebase environment for this project:

1.  **Authentication**: Enable **Google Sign-In**. Make sure to add `localhost` (and your Vercel domain later) to the **Authorized domains** list.
2.  **Firestore Database**: Create a database. Check the `FIRESTORE_RULES.md` file in this repository for the exact security rules to paste into the Firebase console.
3.  **Storage**: Enable Firebase Storage for file attachments. Ensure your Storage rules allow authenticated Deans to read/write, or use test-mode rules during development.

---

## 🚢 Deployment (Vercel)

This application is fully optimized for Vercel deployment.

1.  Push your code to a GitHub repository.
2.  Log into **Vercel** and import your repository.
3.  **Crucial Step**: In the Vercel project settings, navigate to **Environment Variables** and paste all the variables from your local `.env` file.
4.  Click **Deploy**.
5.  *Note: The included `vercel.json` file automatically handles React Router rewrites to prevent 404 errors on page refresh.*

---

## 🧭 Navigation & Routes

*   **Home / Student Dashboard**: `/`
*   **Announcements**: `/announcements`
*   **Schedule**: `/schedule` (Cycle-specific chronological sorting)
*   **Campus Map**: `/map`
*   **Secret Dean Login**: `/sipannouncements/secretlogin` (Accessible via URL or by clicking the RVCE Logo 5 times rapidly)
*   **Dean Dashboard**: `/sipannouncements/admin` (Protected Route)