# SmartSpend AI

SmartSpend AI is a full-stack personal-finance workspace with secure authentication, transaction tracking, budgets, bills, AI-assisted categorization, and actionable financial insights.

## Stack

- Client: React 19, Vite, Tailwind CSS, React Router, React Hook Form, TanStack Query, Framer Motion, Chart.js-ready foundation, React Toastify.
- API: Express, MongoDB Atlas/Mongoose, JWT rotation, bcrypt, Express Validator, Multer, Nodemailer, node-cron, Helmet, CORS, and rate limiting.

## Quick start

1. Copy `.env.example` to `.env` and fill in MongoDB, JWT, and optional SMTP/OpenAI values.
2. Run `npm install` at the repository root.
3. Run `npm run dev`.
4. Open `http://localhost:5173`; the API health endpoint is at `http://localhost:5000/api/v1/health`.

`OPENAI_API_KEY` is optional. Without it, categorization remains available through safe local rules and insight generation uses transaction data only.

## Repository layout

```
client/               React application
server/src/config/    environment and database setup
server/src/models/    MongoDB schemas
server/src/controllers/ request handlers
server/src/services/  tokens, email, AI intelligence
server/src/middlewares/ auth, validation, uploads, errors
server/src/jobs/      scheduled automation
server/src/routes/    versioned API endpoints
docs/                 API, architecture, and deployment guides
```

## Security model

Passwords are bcrypt-hashed. Access JWTs are short lived; refresh tokens are HTTP-only cookies, stored hashed in MongoDB, and rotated on refresh. Protected endpoints validate the bearer token and account state. All API input is validated, and global Helmet, CORS, payload limits, rate limiting, and centralized error handling are enabled.

See [API documentation](docs/API.md), [architecture](docs/ARCHITECTURE.md), and [deployment guide](docs/DEPLOYMENT.md).
