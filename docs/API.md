# API reference

Base URL: `/api/v1`. Authenticated routes require `Authorization: Bearer <access-token>`. Refresh credentials are kept in the `refreshToken` HTTP-only cookie.

| Area | Endpoint | Method | Purpose |
| --- | --- | --- | --- |
| Health | `/health` | GET | Service status |
| Auth | `/auth/register`, `/auth/login` | POST | Account creation and sign-in |
| Auth | `/auth/refresh`, `/auth/logout` | POST | Rotate or revoke refresh token |
| Auth | `/auth/verify-email`, `/auth/forgot-password`, `/auth/reset-password` | POST | Email lifecycle |
| Profile | `/auth/me` | GET/PATCH | Current profile |
| Dashboard | `/dashboard` | GET | Monthly financial summary |
| Transactions | `/transactions` | GET/POST | List/create; GET supports `page`, `limit`, `search`, `type`, `category`, `from`, `to` |
| Transactions | `/transactions/:id` | PATCH/DELETE | Update/delete an owned record |
| Budgets | `/budgets` | GET/POST | Monthly category budgets; GET supports `month=YYYY-MM` |
| Budgets | `/budgets/:id` | PATCH/DELETE | Update/delete an owned budget |
| Bills | `/bills` | GET/POST | Recurring bill management |
| Bills | `/bills/:id` | PATCH/DELETE | Update/delete an owned bill |
| AI | `/ai/categorize` | POST | Categorize `{ "description": "..." }` |
| AI | `/ai/insights` | GET | Budget and spending insights |

Transaction create example:

```json
{ "amount": 450, "type": "expense", "category": "Food & dining", "paymentMethod": "upi", "description": "Lunch", "date": "2026-07-19" }
```

Error responses use `{ "success": false, "message": "..." }`; successful responses use `{ "success": true, "data": { ... } }`.
