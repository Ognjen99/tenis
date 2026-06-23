# Teniska liga

Next.js aplikacija za upravljanje teniskom ligom sa berijanskim takmičenjem.

## Tehnologije

- Next.js App Router
- Prisma ORM + PostgreSQL
- iron-session admin prijava
- Tailwind CSS

## Lokalno pokretanje

1. Napravite besplatnu PostgreSQL bazu na [Neon](https://neon.tech) ili lokalno.
2. Kopirajte `.env.example` u `.env` i popunite vrednosti.
3. Pokrenite:

```bash
npm install
npm run prisma:migrate
npm run dev
```

Aplikacija: `http://localhost:3000`  
Admin prijava: `http://localhost:3000/admin/login`

## Deploy na Vercel

### 1. PostgreSQL baza (Neon)

1. Idite na [neon.tech](https://neon.tech) i napravite projekat.
2. Kopirajte connection string (PostgreSQL URL).

### 2. Vercel projekat

1. Importujte repo: [github.com/Ognjen99/tenis](https://github.com/Ognjen99/tenis)
2. Dodajte environment variables:

| Variable | Value |
|---|---|
| `DATABASE_URL` | `postgresql://...?sslmode=require` |
| `ADMIN_PASSWORD` | jaka admin lozinka |
| `SESSION_SECRET` | najmanje 32 random karaktera |
| `BLOB_READ_WRITE_TOKEN` | dodaje se pri kreiranju Blob store-a (opciono) |
| `BLOB_STORE_ID` | dodaje se kada povežete Blob store sa projektom |

3. Build command (već podešen u `package.json`):

```bash
prisma migrate deploy && next build
```

4. Deploy.

Migracije se automatski primenjuju tokom build-a.

## Fotografije igrača (Vercel Blob)

Na Vercelu filesystem je read-only, pa se slike ne mogu čuvati u `public/uploads`.

1. U Vercel dashboard-u otvorite projekat.
2. Idite na **Storage** → **Create Database** → **Blob**.
3. Povežite Blob store sa projektom (**Storage → vaš store → Connect to Project**). Vercel dodaje `BLOB_STORE_ID` i koristi OIDC autentifikaciju na deploy-u.

Lokalno, slike se i dalje čuvaju u `public/uploads/players/` ako nemate `BLOB_READ_WRITE_TOKEN`. Za testiranje Blob upload-a lokalno, pokrenite `vercel env pull`.

## Korisne komande

```bash
npm run dev
npm run build
npm run lint
npm test
npm run prisma:migrate
npm run prisma:deploy
```
