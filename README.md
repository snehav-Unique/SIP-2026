
  # Create professional dashboard

  This is a code bundle for Create professional dashboard. The original project is available at https://www.figma.com/design/UiYHyZ717oGiCTGmvhCKiM/Create-professional-dashboard.

  ## Local setup

  1. Install dependencies

  ```bash
  npm install
  ```

  2. Firebase

  - In Firebase Console, create or use project `sip-2026-154e0`.
  - Enable **Authentication → Sign-in method → Google**.
  - Add `http://localhost:5173` (or your dev host/port) to **Authorized domains**.

  Configuration is read from environment variables (Vite) using the `VITE_` prefix.
  Copy `.env.example` to `.env` and fill in the values before starting the dev server.

  3. Allowed dean emails

  - Add comma-separated dean emails to `VITE_ALLOWED_DEANS` in your `.env`.

  4. Emergency password

  - Set the emergency password in `VITE_EMERGENCY_PASSWORD` in your `.env` (defaults to `rvce-sip-2025` if empty).

  5. Run dev server

  ```bash
  npm run dev
  ```

  6. Useful URLs

  - Student announcements: http://localhost:5173/announcements
  - Secret login: http://localhost:5173/sipannouncements/secretlogin
  - Admin dashboard: http://localhost:5173/sipannouncements/admin

  ## Notes

  - Announcements persist to `localStorage` key `rvce_announcements`.
  -
  