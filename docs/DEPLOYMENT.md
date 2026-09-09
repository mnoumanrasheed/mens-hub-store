# Men’s Hub deployment

This application targets Vercel with PostgreSQL and Cloudinary. Never put credentials in source control, build logs, screenshots, or client-prefixed environment variables.

## 1. Prepare services

1. Create separate PostgreSQL databases for production and preview deployments. Enable connection pooling for application traffic.
2. Obtain the pooled runtime URL and, when available, a direct/unpooled migration URL.
3. Create separate Cloudinary credentials or isolated clouds/folders for production and preview use.
4. Decide the final production domain. `NEXT_PUBLIC_SITE_URL` must be its exact HTTPS origin with no path, for example `https://your-domain.example`.

## 2. Configure Vercel

1. Import this repository and set the Root Directory to `mens-hub-web` if the repository root is one level above the app.
2. Keep Framework Preset as Next.js, Install Command as `npm install`, and Build Command as `npm run build`.
3. Add these variables in Project Settings → Environment Variables:
   - `DATABASE_URL`: pooled PostgreSQL runtime URL.
   - `DIRECT_URL`: direct migration URL when supplied by the provider; otherwise omit it.
   - `SESSION_SECRET`: unique random value of at least 32 characters.
   - `ADMIN_SEED_EMAIL`: `mens.hub919@gmail.com` for initial controlled provisioning.
   - `ADMIN_SEED_PASSWORD`: a strong temporary provisioning password of at least 12 characters.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: server-only Cloudinary credentials.
   - `NEXT_PUBLIC_SITE_URL`: the exact canonical origin for that environment.
4. Scope production credentials only to Production. Use isolated database and media credentials for Preview and Development.

## 3. Apply database migrations

Run migrations from a trusted terminal or CI release job using the target environment’s URLs:

```bash
npm ci
npm run prisma:generate
npm run prisma:deploy
```

`npm run prisma:deploy` executes `prisma migrate deploy`, which applies committed migrations without generating destructive development migrations. Never run `prisma migrate dev`, `prisma db push`, or `prisma migrate reset` against production.

For first deployment only, provision baseline settings and the administrator after migrations:

```bash
npm run prisma:seed
```

The seed creates no catalogue products. Because repeat seeding resets the seeded administrator password from the environment, run it only as a controlled operation.

## 4. Deploy and verify

1. Trigger a Vercel production deployment after migrations succeed.
2. Verify `/`, `/shop`, a real product page, `/robots.txt`, and `/sitemap.xml` on the production domain.
3. Confirm product HTML contains the production canonical URL and correct Cloudinary Open Graph image.
4. Confirm `/admin` redirects unauthenticated visitors to `/admin/login`, then sign in and test a non-destructive edit.
5. Test product and cart WhatsApp handoffs. The destination must be `923081000025`; prices, stock, options, and product URLs must reflect current database data. The message must not claim payment or confirmation.
6. Verify `/admin/analytics` records inquiry clicks as `WHATSAPP_CLICK`, not sales.
7. Check response headers for CSP, HSTS, frame denial, referrer policy, and permissions policy.
8. Test at 320 px width and with keyboard-only navigation.

## 5. Release and rollback discipline

Back up PostgreSQL before material schema or content changes. Database migrations are forward-applied; reverting a Vercel deployment does not automatically revert the database. If a migration needs reversal, prepare and review a new corrective migration. Retain the previous Vercel deployment for application rollback and keep Cloudinary assets until database references are safely migrated.
