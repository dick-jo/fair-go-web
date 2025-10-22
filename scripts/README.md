# Database Testing Utility Scripts

SQL scripts to help with testing and development. **Only use on test data!**

## Quick Reference

### Reset Test User's Membership

**Use case:** You want to test membership signup again with the same user account.

```bash
# Edit the script first to set your test email
code scripts/reset-test-membership.sql

# Run it
supabase db execute --file scripts/reset-test-membership.sql
```

Or use the Supabase web GUI: Dashboard → SQL Editor → paste script contents.

### View Test User Status

**Use case:** Check if a user's membership data is correct.

```bash
# Edit the script first to set your test email
code scripts/view-test-user.sql

# Run it
supabase db execute --file scripts/view-test-user.sql
```

### Delete Test Transactions

**Use case:** Clean up test payment records (be careful!).

```bash
# Edit the script first to set your test email
code scripts/delete-test-transactions.sql

# Run it (shows transactions but doesn't delete by default)
supabase db execute --file scripts/delete-test-transactions.sql

# To actually delete, uncomment the DELETE line in the script
```

## Using MCP Supabase Tool (Alternative)

You can also run these queries directly using Claude Code's Supabase integration:

```
Hey Claude, reset membership for test-user@example.com
```

## Safety Notes

- ⚠️ **Never run these on production data**
- ⚠️ Your local `.env` points to the production Supabase instance
- ✅ These scripts are safe because they target specific test emails
- ✅ Always double-check the email before running

## Common Testing Workflow

1. **Sign up test user** via magic link (one-time setup)
2. **Test membership flow** (complete signup)
3. **Reset membership** with `reset-test-membership.sql`
4. **Test again** with same user (no new magic link needed!)
5. **Clean up transactions** periodically with `delete-test-transactions.sql`

## Pro Tips

### Create a Personal Test Email Alias

Instead of `your-test-email@example.com`, use an alias:
- Gmail: `yourname+test1@gmail.com`, `yourname+test2@gmail.com`
- These go to the same inbox but count as different emails in the database

### Quick Reset from Terminal

Create a bash alias in your `~/.zshrc` or `~/.bashrc`:

```bash
alias reset-membership="supabase db execute --file ~/project-local/fair-go-web/scripts/reset-test-membership.sql"
```

Then just run: `reset-membership`

### Use Environment Variables for Test Email

Edit the SQL scripts to use a variable:

```sql
-- Instead of hardcoded email:
WHERE email = 'your-test-email@example.com';

-- Use a variable (if your SQL tool supports it):
WHERE email = :'TEST_EMAIL';
```

Then run:
```bash
psql -v TEST_EMAIL='test@example.com' -f scripts/reset-test-membership.sql
```
