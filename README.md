# Fair Go Web

Official website and member platform for Fair Go - a political party's primary web presence for member onboarding, donations, content publishing, and advocacy.

**Live Site**: [fairgo.org.au](https://fairgo.org.au)

---

## Overview

This is a full-stack SvelteKit application serving as the primary digital funnel for:
- Member onboarding and management
- Email collection and communications
- Payment processing (donations & subscriptions)
- Content publishing (news, policy positions, team bios)
- User dashboard and account management

---

## Tech Stack

### Frontend
- **SvelteKit 2** - Meta-framework for Svelte
- **Svelte 5** - UI framework with runes syntax
- **TypeScript** - Type safety
- **Vite** - Build tooling

### Backend & Services
- **Supabase** - Authentication, database (PostgreSQL), and API
- **Stripe** - Payment processing (subscriptions & one-time payments)
- **Netlify** - Hosting, serverless functions, and deployment

### Development Tools
- **ESLint + Prettier** - Code formatting and linting
- **Claude Code** - AI-assisted development (recommended)

---

## Prerequisites

- **Node.js** 24.x or higher (see `.nvmrc`)
- **npm** or **pnpm**
- **Supabase account** - [supabase.com](https://supabase.com)
- **Stripe account** - [stripe.com](https://stripe.com)
- **Netlify account** - [netlify.com](https://netlify.com)

### Optional (for AI-assisted workflow)
- **Supabase CLI** - For type generation
- **Netlify CLI** - For local deployment testing
- **Claude Code** - Enhanced development experience with MCP servers

---

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd fair-go-web
npm install
```

### 2. Environment Setup

Copy the example environment file:
```bash
cp .env.example .env
```

Fill in your credentials in `.env`:

```bash
# Supabase (get from https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api)
PUBLIC_SUPABASE_URL="https://yourproject.supabase.co/"
PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Security Note**:
- Never commit `.env` to git (already in `.gitignore`)
- Use test keys (`sk_test_`) for development
- Production keys are managed in Netlify environment variables

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

---

## Environment Variables

| Variable | Type | Description | Where to Get |
|----------|------|-------------|--------------|
| `PUBLIC_SUPABASE_URL` | Public | Supabase project URL | Supabase Dashboard → Settings → API |
| `PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anon/public key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Supabase service role key (bypasses RLS) | Supabase Dashboard → Settings → API |
| `STRIPE_SECRET_KEY` | Secret | Stripe API secret key | Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Secret | Stripe webhook signing secret | Stripe Dashboard → Webhooks |

**Public vs Secret**:
- `PUBLIC_*` variables are safe for client-side code (bundled into browser JavaScript)
- Other variables are server-only (used in `+server.ts` and `+page.server.ts` files)

See [`docs/SECURITY_AUDIT_REPORT.md`](./docs/SECURITY_AUDIT_REPORT.md) for security details.

---

## Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run dev -- --open    # Start dev server and open browser

# Type Checking & Linting
npm run check            # Run all checks (prettier, eslint, svelte-check)
npm run format           # Format code with Prettier
npm run lint             # Check code formatting

# Building
npm run build            # Production build
npm run preview          # Preview production build locally

# Supabase (requires Supabase CLI)
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/types/database.types.ts
```

---

## AI-Assisted Development with Claude Code

This project is optimized for development with **Claude Code** using Model Context Protocol (MCP) servers.

### What is Claude Code?

Claude Code is an AI-powered CLI that integrates with your development workflow, providing:
- Direct database access and management via Supabase MCP (no credentials in config needed)
- Automatic type generation from your Supabase schema
- Deployment assistance via Netlify CLI integration
- Real-time Svelte 5 documentation access via Svelte MCP
- Code review, security audits, and AI-assisted development

### Setup for Claude Code Users

#### 1. Install CLIs

```bash
# Supabase CLI (for type generation)
brew install supabase/tap/supabase

# Netlify CLI (for deployment)
brew install netlify-cli
```

#### 2. Configure MCP Servers

**Svelte MCP** (Already configured):
- Located in `.mcp.json` (project-level)
- Provides Svelte 5 documentation access
- No additional setup required

**Supabase MCP** (User-level setup):
- Installed globally via: `claude mcp add --transport http supabase "https://mcp.supabase.com/mcp"`
- Stored in your user `~/.claude.json` (not in project)
- No credentials needed in config files
- Authentication happens via browser OAuth when you run `/mcp` in Claude Code
- See [Supabase MCP Docs](https://supabase.com/docs/guides/getting-started/mcp) for details

#### 3. Authenticate Services

```bash
# Netlify
netlify login
netlify link

# Verify
netlify status
```

### Using Claude Code

Once configured, you can ask Claude to:

```
"Regenerate my Supabase types"
"Show me all tables in the database"
"Apply a migration to add an index"
"Deploy to Netlify preview"
"Check deployment status"
"Explain how the membership payment flow works"
"Review my code for security issues"
"Get security and performance advisors for my database"
```

**Verify MCP Setup:**
Run `/mcp` in Claude Code to authenticate with Supabase (one-time browser OAuth). After that, Claude will have full access to manage your database, apply migrations, and generate types.

See [`.claude.md`](./.claude.md) for project-specific context that Claude uses.

---

## Project Structure

```
src/
├── lib/
│   ├── components/      # Reusable UI components (one per directory)
│   ├── server/          # Server-side utilities
│   ├── client/          # Client-side utilities
│   ├── services/        # Business logic (toaster, etc.)
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript types (including database.types.ts)
│   ├── config/          # Configuration files
│   ├── style/           # Global CSS and design tokens
│   └── assets/          # Static assets
└── routes/
    ├── (general)/       # Public routes (marketing, content)
    │   ├── +layout.svelte
    │   ├── +page.svelte
    │   ├── auth/        # Authentication flows
    │   ├── donate/      # Donation pages
    │   ├── membership/  # Membership signup
    │   ├── news/        # News articles
    │   └── our-plan/    # Policy content
    ├── (private)/       # Authenticated routes (user dashboard)
    │   └── private/
    │       ├── +layout.svelte
    │       ├── membership/      # Membership management
    │       └── transactions/    # Transaction history
    └── api/             # API endpoints (Stripe, webhooks)
        ├── stripe-webhook/
        ├── create-donation-checkout/
        └── create-membership-checkout/
```

### Key Conventions

- **Components**: One component per directory (`Button/Button.svelte`)
- **Server files**: `+server.ts` for API routes, `+page.server.ts` for page data
- **Styling**: Component-scoped CSS with local variables (`--loc-*`)
- **Types**: Generated from Supabase schema (religiously updated)

---

## Deployment

### Netlify (Production)

The site auto-deploys from the `master` branch to Netlify.

**Manual deploy via CLI**:
```bash
# Preview deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

**Environment variables** are managed in the Netlify dashboard under:
Settings → Environment Variables

### Build Configuration

See `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  SECRETS_SCAN_OMIT_PATHS = ".netlify/server/**,.svelte-kit/output/server/**"
```

The `SECRETS_SCAN_OMIT_PATHS` tells Netlify to ignore environment variables in server-side bundles (which is safe and expected for SvelteKit SSR).

---

## Database & Types

### Supabase Setup

1. Database schema is managed via Supabase Dashboard
2. Row Level Security (RLS) policies protect user data
3. The service role key bypasses RLS (used only in server-side code)

### Type Generation

After any database schema changes:

```bash
supabase gen types typescript --project-id cejoaoqhphkhwbdagzib > src/lib/types/database.types.ts
```

**With Claude Code**:
```
"Regenerate my Supabase types"
```

Claude will automatically run the command and update the types file.

---

## Payment Processing

### Stripe Integration

**Test Mode** (development):
- Use test API keys (`sk_test_...`)
- Test cards: `4242 4242 4242 4242` (any future date, any CVC)

**Webhooks** (required for subscriptions):
1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Forward webhooks locally:
   ```bash
   stripe listen --forward-to localhost:5173/api/stripe-webhook
   ```
3. Copy the webhook secret to `.env` as `STRIPE_WEBHOOK_SECRET`

**Production**:
- Webhook endpoint: `https://fairgo.org.au/api/stripe-webhook`
- Configure in Stripe Dashboard → Webhooks
- Events to listen for:
  - `checkout.session.completed`
  - `invoice.payment_succeeded`
  - `customer.subscription.deleted`

---

## Contributing

### For New Developers

1. Read [`.claude.md`](./.claude.md) for project context and conventions
2. Review [`docs/SECURITY_AUDIT_REPORT.md`](./docs/SECURITY_AUDIT_REPORT.md) for security practices
3. Install Claude Code for the best development experience (optional but recommended)
4. Follow existing patterns (component structure, CSS conventions, etc.)

### Code Style

- **TypeScript** for all new code
- **Svelte 5 runes** syntax (`$state`, `$derived`, `$effect`)
- **Semantic HTML** elements
- **Component-scoped CSS** with design tokens
- **Server/client separation** - use `$env/static/private` for secrets

Run checks before committing:
```bash
npm run check
```

---

## Documentation

- [`.claude.md`](./.claude.md) - Project context for Claude Code
- [`docs/SECURITY_AUDIT_REPORT.md`](./docs/SECURITY_AUDIT_REPORT.md) - Security best practices
- [`docs/NEW_SESSION_INSTRUCTIONS.md`](./docs/NEW_SESSION_INSTRUCTIONS.md) - Claude Code setup guide

---

## Support

For issues or questions:
- Check existing documentation in `/docs`
- Review code comments in complex files
- Ask Claude Code (if using): "Explain how [feature] works"

---

## License

[Specify your license here]

---

**Built with ❤️ for Fair Go**

*Powered by SvelteKit, Supabase, Stripe, and Claude Code*
