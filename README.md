# Men’s Hub

Production-oriented Next.js catalogue and private administration application for Men’s Hub — Style Made for Men. Orders are prepared as WhatsApp inquiries; the website has no payment gateway and no customer accounts.

Authoritative contacts: Taha Soni / Shahzaib Soni, `03081000025`, WhatsApp `923081000025`, and `mens.hub919@gmail.com`. No address, map, store timing, or social account is published until an administrator supplies verified information.

## Local setup

Requirements: Node.js 20.9 or newer, npm, and PostgreSQL.

1. Copy `.env.example` to `.env.local`.
2. Fill every required variable. Keep `.env.local` private.
3. Install dependencies: `npm install`.
4. Generate the Prisma client: `npm run prisma:generate`.
5. Apply the existing migrations: `npm run prisma:deploy`.
6. Seed settings, taxonomy, content scaffolding, and the initial administrator: `npm run prisma:seed`.
7. Start development: `npm run dev`.
8. Open `http://localhost:3000`; admin sign-in is at `/admin/login`.

The seed is idempotent and creates no products, prices, or SKUs. `ADMIN_SEED_PASSWORD` must be at least 12 characters. Running the seed again deliberately resets the seeded administrator’s password to that environment value.

## Database and Prisma

Use a pooled PostgreSQL URL for `DATABASE_URL` at runtime. Where the provider supplies one, use an unpooled/direct URL for `DIRECT_URL` when running migrations.

- Create a migration during local schema development: `npm run prisma:migrate -- --name descriptive_name`
- Format the schema: `npm run prisma:format`
- Validate configuration: `npm run prisma:validate`
- Apply committed migrations in staging/production: `npm run prisma:deploy`
- Run the controlled seed: `npm run prisma:seed`

Never use `prisma migrate dev`, `prisma db push`, or a database reset against production. Production releases use `prisma migrate deploy`.

## Admin creation

There is no registration route. Set `ADMIN_SEED_EMAIL` and a strong private `ADMIN_SEED_PASSWORD`, then run `npm run prisma:seed`. The seed creates or updates that administrator. Rotate or remove the seed password from deployment configuration after controlled provisioning if your operational process does not need repeat seeds.

Admin routes are guarded by the Next.js proxy and independently authorized by the protected layout and every mutation. Sessions are signed with `SESSION_SECRET` and stored in an HttpOnly cookie.

## Cloudinary

1. Create or select a Cloudinary cloud owned by the business.
2. Add its cloud name, API key, and API secret to the server environment.
3. Do not prefix these variables with `NEXT_PUBLIC_`.
4. Redeploy after changing the cloud name because the Next.js image allowlist is built from it.

Uploads accept signature-checked JPG, PNG, or WebP files up to 5 MB and use the managed `mens-hub/` namespace. Do not manually reuse public IDs across environments.

## Environment variables

See `.env.example` for the complete list. Required values are `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD` when seeding, all three `CLOUDINARY_*` credentials for uploads, and the exact public canonical origin in `NEXT_PUBLIC_SITE_URL`. `DIRECT_URL` is optional when the database provider does not distinguish migration and pooled URLs.

## Development and verification

Run `npm run dev` for local development. Before release, run:

```bash
npm run prisma:format
npm run prisma:validate
npm run typecheck
npm run lint
npm run test
npm run build
```

Run the production build locally with `npm run build`, then preview it with `npm run start`. Full Vercel release instructions are in `docs/DEPLOYMENT.md`; administrator operating guidance is in `docs/ADMIN_GUIDE.md`.
