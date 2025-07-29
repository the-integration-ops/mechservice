# MechService

MechService is a full-stack web application for managing car services, users, mechanics, shops, and service reminders.

## Features

- User registration and login (mechanic or regular user)
- Mechanics can manage shops and view overdue service reminders
- Users can add cars and view their service history
- Service management (add, view, and track services)
- Reminders for overdue car services

## Tech Stack

- **Backend:** Node.js, Express, Sequelize, MySQL
- **Frontend:** HTML, Tailwind CSS, Vanilla JS

## Getting Started

### Prerequisites

- Node.js >= 16
- MySQL server

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd mechService
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure your database in `backend/models/index.js` and environment variables in `.env`.

### Database Setup & Seeding

- To initialize and seed the database with sample data:
  ```sh
  npm run seed
  ```

### Running the Application

- Start the backend server:
  ```sh
  npm run dev
  ```
- Open `public/index.html` in your browser for the frontend.

## Project Structure

```
backend/
  server.js
  models/
  routes/
  seeder/
public/
  index.html
  js/
```

## Scripts

- `npm run dev` — Start backend server with nodemon
- `npm run seed` — Seed the database with sample data

## License

ISC
