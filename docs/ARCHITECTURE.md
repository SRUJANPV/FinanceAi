# Architecture overview

The application is a workspace monorepo. The Vite client owns presentation, routing, client cache, and forms. It never stores a refresh token in JavaScript. The Express API is grouped by feature route, controller, service, model, and middleware layers.

```
React UI -> Axios -> Express route -> validation/auth middleware -> controller -> service/model -> MongoDB Atlas
                                            |-> Multer receipt storage
                                            |-> Nodemailer email delivery
                                            |-> node-cron bill reminders
                                            |-> OpenAI structured categorization (optional)
```

Each MongoDB finance record is scoped to the authenticated `user` id. Controllers query with that id directly, preventing cross-account access. The AI service is deliberately request/insight based, not conversational; it only receives minimal transaction descriptions or aggregated financial data needed for the requested feature.
