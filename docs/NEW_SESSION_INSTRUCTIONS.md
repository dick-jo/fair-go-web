# Fair Go Web - Setup Complete! 🎉

Your development environment has been configured to work seamlessly with Claude Code.

---

## What Was Set Up

✅ **Supabase CLI** - For generating database types
✅ **Netlify CLI** - For deployment management
✅ **Supabase MCP Server** - User-level (via `~/.claude.json`), authenticated via browser OAuth
✅ **Svelte MCP Server** - Project-level (in `.mcp.json`), provides Svelte 5 documentation
✅ **`.claude.md`** - Project context file
✅ **Database types generated** - `src/lib/types/database.types.ts`

---

## Next Steps (Do these now!)

### 1. Set Up Supabase MCP (First Time Only)

If you haven't already added the Supabase MCP server, run:

```bash
claude mcp add --transport http supabase "https://mcp.supabase.com/mcp"
```

Then authenticate by running `/mcp` in Claude Code, which will open your browser for OAuth login. This is a **one-time setup** stored in your `~/.claude.json` (user-level, not project-level).

**Already set up?** Skip to step 2.

### 2. Authenticate with Netlify

Run this command in your terminal:

```bash
netlify login
```

This will:

- Open your browser for authentication
- Save your credentials locally
- Allow Claude to help with deployments

After logging in, verify it worked:

```bash
netlify status
```

### 3. Link to your Netlify site

```bash
cd /Users/dickjones/project-local/fair-go-web
netlify link
```

Choose your existing Fair Go site from the list.

### 4. Restart Claude Code (If You Just Added Supabase MCP)

**IMPORTANT**: The Supabase MCP server won't activate until you restart Claude Code.

After restart, the MCP server will load and I'll be able to help you with:

- Database queries and schema inspection
- Table creation and modifications
- Data analysis
- All without you leaving the chat!

---

## Testing in Your New Session

After restarting Claude Code, try these to verify everything works:

### Test 1: Supabase MCP (Database Access)

Ask Claude:

> "Show me all the tables in my database"

Claude should be able to query your Supabase database directly and list tables like `authors`, `carousel_items`, etc.

### Test 2: Supabase Type Generation

Ask Claude:

> "Regenerate my Supabase types"

Claude should run:

```bash
supabase gen types typescript --project-id cejoaoqhphkhwbdagzib > src/lib/types/database.types.ts
```

### Test 3: Netlify CLI

Ask Claude:

> "Check my Netlify deployment status"

Claude should run `netlify status` and tell you about your site.

### Test 4: Svelte MCP

Ask Claude:

> "Show me the Svelte 5 documentation for $state"

Claude should fetch the official Svelte 5 runes documentation.

---

## Common Workflows

### When you change the database schema:

1. Make changes in Supabase dashboard (or ask Claude to help via MCP)
2. Ask Claude: "Regenerate my database types"
3. Claude runs the type generation command automatically
4. Use the new types in your code

### When you want to deploy:

Ask Claude:

> "Deploy to Netlify preview"

Claude will run `netlify deploy` for you.

### When you need database info:

Instead of opening Supabase dashboard, just ask Claude:

> "What columns are in the authors table?"
> "Show me the last 5 news articles"
> "Create a new table for campaign events"

---

## Troubleshooting

### MCP server not working?

1. Make sure you restarted Claude Code after setup
2. Run `/mcp` in Claude Code to authenticate with Supabase via browser OAuth
3. Check that Supabase MCP was added to `~/.claude.json` (user-level, not project-level)
4. Verify Svelte MCP is in project's `.mcp.json`

### Netlify commands failing?

1. Make sure you ran `netlify login`
2. Make sure you ran `netlify link` to connect to your site
3. Try `netlify status` to verify authentication

### Types generation failing?

1. Check your Supabase project ID is correct in `.claude.md`
2. Verify you have internet connection
3. Check Supabase is not having an outage

---

## Pro Tips

1. **Ask Claude to help with schema changes** - No more switching to the web dashboard
2. **Use the type generation frequently** - After every schema change
3. **Let Claude handle deployments** - Just ask "deploy to production"
4. **Reference `.claude.md`** - It has all the project context Claude needs

---

## Files Created/Modified

- `.claude.md` - Project documentation and conventions
- `.mcp.json` - Svelte MCP server configuration (project-level, no secrets)
- `~/.claude.json` - Supabase MCP configuration (user-level, managed by `claude mcp add`)
- `src/lib/types/database.types.ts` - Supabase types (auto-generated)
- `docs/NEW_SESSION_INSTRUCTIONS.md` - This file

**Note**: Supabase MCP is user-level (not in this repo) and requires no credentials in config files. Authentication happens via browser OAuth when you run `/mcp`.

---

Happy coding! Your workflow just got a LOT smoother. 🚀

P.S. You can delete this file after you've completed the setup steps.
