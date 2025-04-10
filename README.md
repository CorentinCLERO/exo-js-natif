# Movie Booker Application

This repository contains the source code for a Movie Booker application, allowing users to browse movies, register, log in, and book movie sessions.

The application is composed of two main parts:

1.  **Frontend:** A React application built with Vite and TypeScript, located in the `cinema-app/` directory.
2.  **Backend:** A NestJS API built with TypeScript, located in the `hello-world/` directory.

## Deployed Application

The application is deployed on Render and can be accessed here:

[**<< INSERT RENDER URL HERE >>**](<< INSERT RENDER URL HERE >>)

## Running Locally

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)
*   [Bun](https://bun.sh/) (for the frontend)
*   [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for the database)

### 1. Backend Setup (`hello-world/`)

The backend is a NestJS application responsible for handling API requests, user authentication, movie data fetching (from TMDB), and reservations.

**a. Database Setup:**

The application uses a PostgreSQL database managed via Docker Compose.

```bash
cd hello-world
docker-compose up -d
cd ..
```

This command will start a PostgreSQL container in the background.

**b. Environment Variables:**

The backend requires several environment variables. Create a `.env` file in the `hello-world/` directory and populate it with the following variables. Adjust values as necessary, especially for the database connection if you didn't use the default `docker-compose.yml` settings.

```dotenv
# hello-world/.env

# Database Configuration (match docker-compose.yml)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres # Default from docker-compose.yml
DB_PASSWORD=postgres # Default from docker-compose.yml
DB_DATABASE=moovieBooker # Default from docker-compose.yml

# JWT Configuration
JWT_SECRET=your_strong_secret_key # Change this to a secure random string

# TMDB API Configuration
# Obtain an API key from https://www.themoviedb.org/settings/api
TMDB_API_KEY=your_tmdb_api_key
```

**c. Install Dependencies:**

```bash
cd hello-world
npm install
cd ..
```

**d. Run the Backend:**

```bash
cd hello-world
npm run start:dev
```

The backend API should now be running, typically on `http://localhost:3000`.

### 2. Frontend Setup (`cinema-app/`)

The frontend is a React application built with Vite, TypeScript, and Shadcn UI.

**a. Environment Variables:**

The frontend needs to know the URL of the backend API. Create a `.env.local` file in the `cinema-app/` directory:

```dotenv
# cinema-app/.env.local

VITE_API_URL=http://localhost:3000
```

*(Note: Adjust the port if your backend runs on a different one)*

**b. Install Dependencies:**

```bash
cd cinema-app
bun install
cd ..
```

**c. Run the Frontend:**

```bash
cd cinema-app
bun run dev
```

The frontend application should now be running, typically on `http://localhost:5173` (Vite will indicate the exact URL). Open this URL in your browser.

## Project Structure

*   `cinema-app/`: Contains the frontend React application.
*   `hello-world/`: Contains the backend NestJS application.
*   `exo-js-natif/`: Contains standalone JavaScript exercises (likely not part of the main app).
*   `README.md`: This file.
```
