# Matthew Johnson — Portfolio

Personal portfolio site with an AI recruiter assistant powered by retrieval-augmented generation (RAG). Recruiters can ask questions about Matthew's experience, projects, skills, and certifications — the assistant retrieves relevant content from a vector database and responds with cited sources.

Live site: [matthew-johnson-portfolio.netlify.app](https://matthew-johnson-portfolio.netlify.app)

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **AI:** OpenAI (embeddings + chat), Vercel AI SDK
- **Database:** Supabase (pgvector for semantic search)
- **Rate limiting:** Upstash Redis
- **Testing:** Playwright
- **CI:** GitHub Actions

## Getting started

### Prerequisites

- Node.js 20+
- Accounts and keys for OpenAI, Supabase, and Upstash (for the AI chat feature)

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env.local` file in the project root:

```env
# OpenAI
OPENAI_API_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Upstash (chat rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Optional email alerts for completed AI chat interactions (Mailgun)
MAILGUN_API_KEY=
MAILGUN_DOMAIN=mg.your-domain.com
# Use https://api.eu.mailgun.net if the Mailgun sending domain is in the EU region.
MAILGUN_API_BASE_URL=https://api.mailgun.net
CHAT_USAGE_NOTIFICATION_FROM="Portfolio Alerts <alerts@mg.your-domain.com>"
CHAT_USAGE_NOTIFICATION_TO=matthewisaacjohnson@gmail.com

# Optional: GitHub Actions API token (server-side only)
GITHUB_TOKEN=
```

The AI chat endpoint requires OpenAI, Supabase, and Upstash. Other pages work without them. Usage email alerts also require a Mailgun domain sending key, a sending domain, and a sender address accepted by Mailgun; without those values, chat continues normally and no email is sent. Use Mailgun's domain-scoped sending key for least privilege and match `MAILGUN_API_BASE_URL` to the region where the domain is configured.

### Reviewing AI chat transcripts

Apply `supabase/migrations/20261016000000_chat_transcripts.sql` in the Supabase SQL Editor. Each interaction stores only its latest user question, the assistant response, status, duration, and a broad failure category. The table is unavailable to browser roles; review rows in the Supabase dashboard. Rows are marked to expire after 90 days. To enforce deletion automatically, enable `pg_cron` in Supabase and run the commented `cron.schedule` statement at the end of the migration.

Set `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `CHAT_USAGE_NOTIFICATION_FROM`, and `CHAT_USAGE_NOTIFICATION_TO` in the deployment environment to receive one content-free email after each successfully stored answer. Set `MAILGUN_API_BASE_URL` for EU domains; US domains use `https://api.mailgun.net`. The alert contains the completion time and request ID, not the transcript. Failed and interrupted interactions are stored but do not send an email alert.

## Knowledge base

Portfolio content for the AI assistant lives in markdown files under `knowledge/`. Each file can include YAML frontmatter for metadata:

```yaml
---
sourceType: project
sourceTitle: PopChoice
sourceUrl: /singleProject?dataFile=.%2Fapp%2Fdata%2FPollyGlot.json
keywords:
  - project
  - embeddings
  - rag
---
```

### Ingesting knowledge into Supabase

After adding or updating knowledge files, re-ingest them into the vector database:

```bash
npm run ingest:knowledge
```

This script:

1. Reads all `.md` files under `knowledge/`
2. Splits them into sections by heading
3. Generates embeddings with OpenAI `text-embedding-3-small`
4. Replaces all rows in the `portfolio_documents` Supabase table

Run this whenever you change knowledge content or add new pages (like certificates) that the AI should know about.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run ingest:knowledge` | Ingest knowledge base into Supabase |

## Testing

Playwright smoke tests cover page navigation and static content. They start a local development server automatically:

```bash
npx playwright test
```

## Project structure

```
app/                  # Next.js App Router pages and API routes
  api/chat/           # RAG-powered AI chat endpoint
  api/getProjectData/ # Project detail data API
components/           # React components (navbar, AI assistant, etc.)
knowledge/            # Markdown knowledge base for RAG
  projects/           # Per-project documentation
  interview/          # Interview prep content
  philosophy/         # Engineering philosophy
lib/                  # Shared utilities (rate limiting)
public/               # Static assets (images, certificates, icons)
scripts/              # Knowledge ingestion script
tests/                # Playwright smoke tests
```

## Deployment

The site is deployed on Netlify. Pushes to `master` trigger GitHub Actions for build verification and Playwright smoke tests against production.
