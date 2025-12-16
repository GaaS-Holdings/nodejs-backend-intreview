# Node.js Backend Interview Project

## Technical Task
https://link.excalidraw.com/l/AhWi3ozBSB2/4BPt0gs1dov

## Database Schema

### Shops Table
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(255))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Posts Table
- `id` (SERIAL PRIMARY KEY)
- `shop_id` (INTEGER, FOREIGN KEY)
- `likes_count` (INTEGER)
- `comment_count` (INTEGER)
- `image_url` (VARCHAR(500))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development without Docker)

## Getting Started

### Using Docker (Recommended)

1. Clone the repository and navigate to the project directory
```bash
cp .env.example .env
```

2. Start the services:
```bash
docker compose up --build
```

3. In a new terminal, run migrations:
```bash
docker compose exec app npm run migrate
```

4. Seed the database:
```bash
docker compose exec app npm run seed
```

5. The API will be available at `http://localhost:3000`

### Local Development (Without Docker)

1. Install dependencies:
```bash
npm install
```

2. Create a PostgreSQL database named `shop_app`

3. Copy `.env` file and update database credentials if needed

4. Run migrations:
```bash
npm run migrate
```

5. Seed the database:
```bash
npm run seed
```

6. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```
