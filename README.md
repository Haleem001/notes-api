# Notes API

A simple NestJS + MongoDB backend for user authentication and personal note management.

Users can:
- sign up
- log in
- create notes
- view only their own notes
- update their own notes
- delete their own notes

## stack used

- NestJS
- MongoDB with Mongoose
- JWT authentication with Passport
- class-validator and class-transformer
- Jest and Supertest

## Requirements

- Node.js 20+
- npm
- MongoDB

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/notes-app
JWT_SECRET=replace_with_a_strong_random_secret
FRONTEND_ORIGIN=http://localhost:5173
```

3. Start the app:

```bash
npm run start:dev
```

The API runs on `http://localhost:3000` by default.

## Environment Variables

- `PORT`: Port for the API. Defaults to `3000`.
- `MONGODB_URI`: MongoDB connection string. Defaults to `mongodb://127.0.0.1:27017/notes-app` if not set.
- `JWT_SECRET`: Secret used to sign JWTs. Required for normal app usage.
- `FRONTEND_ORIGIN`: Allowed frontend origin for CORS. You can provide multiple origins as a comma-separated list.

Example:

```env
FRONTEND_ORIGIN=http://localhost:3000,http://localhost:5173
```

## API Summary

### Health Check

- `GET /`

Response:

```json
{
  "status": "ok"
}
```

### Authentication

#### Sign Up

- `POST /auth/signup`

Request body:

```json
{
  "name": "Haleem",
  "email": "Haleem@example.com",
  "password": "Password123"
}
```

#### Log In

- `POST /auth/login`

Request body:

```json
{
  "email": "Haleem@example.com",
  "password": "Password123"
}
```

Successful auth response:

```json
{
  "accessToken": "<jwt>",
  "user": {
    "id": "user_id",
    "name": "Haleem",
    "email": "Haleem@example.com"
  }
}
```

### Notes

All notes routes require a bearer token:

```http
Authorization: Bearer <accessToken>
```

#### Get Current User's Notes

- `GET /notes`

#### Create Note

- `POST /notes`

Request body:

```json
{
  "title": "My note",
  "content": "Optional content"
}
```

#### Update Note

- `PATCH /notes/:id`

Request body:

```json
{
  "title": "Updated title",
  "content": "Updated content"
}
```

Both fields are optional in updates.

#### Delete Note

- `DELETE /notes/:id`

## Validation Rules

### Auth

- `name` is required for sign up
- `email` must be a valid email
- `password` must be at least 6 characters

### Notes

- `title` is required when creating a note
- `title` must not be more than 150 characters
- `content` is optional
- `content` must not be more than 5000 characters

## Scripts

```bash
npm run build
npm run lint
npm run test
npm run test:e2e
npm run test:cov
```
