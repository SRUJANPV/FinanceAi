# Deployment guide

## Environment

Set the values in `.env.example` in your hosting provider. Use long, unique `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` values. Set `NODE_ENV=production`, `CLIENT_URL` to the deployed frontend URL, and use a MongoDB Atlas connection string restricted to the API host network.

## API

Deploy `server` to a Node 20+ service and run `npm run start --workspace server`. Mount persistent storage or replace local receipt storage with S3/Cloudinary before horizontally scaling. Configure SMTP for verification, recovery, and bill reminders. node-cron must run in exactly one worker instance; use a dedicated scheduler process in multi-instance deployments.

## Client

Set `VITE_API_URL=https://your-api.example/api/v1`, then run `npm run build --workspace client`. Serve `client/dist` from a static host, with SPA fallback to `index.html`.

## Production checklist

- Enable HTTPS and set `CLIENT_URL` exactly.
- Configure MongoDB backups, least-privilege credentials, and alerts.
- Set SMTP and OpenAI keys only in secret storage.
- Replace disk receipt uploads with object storage.
- Add an external job scheduler/worker and monitoring before multi-replica deployment.
- Run API integration tests against a separate test database before release.
