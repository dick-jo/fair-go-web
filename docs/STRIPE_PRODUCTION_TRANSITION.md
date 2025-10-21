# Stripe Production Transition Guide

**Status**: Pre-transition checklist for moving from personal test account to stakeholders' production Stripe account.

**Date**: October 21, 2025

---

## Overview

You're transitioning from a personal sandbox Stripe account to the stakeholders' official Stripe account. This guide walks you through:
1. Understanding test vs production modes
2. Getting the new keys
3. Testing thoroughly with test mode
4. Deploying to production safely
5. Verifying everything works

**Don't panic!** We'll test everything in test mode before touching production. 🧪

---

## Understanding Stripe Test vs Production

### Every Stripe Account Has TWO Modes

**Test Mode** (for development):
- Keys start with `sk_test_...` and `whsec_test_...`
- Uses test credit cards (4242 4242 4242 4242)
- No real money changes hands
- Perfect for development and testing

**Production Mode** (for real payments):
- Keys start with `sk_live_...` and `whsec_live_...`
- Uses real credit cards
- Real money is charged
- Only use after thorough testing

### Your Current Setup (Personal Account)

```bash
# Local .env (test mode)
STRIPE_SECRET_KEY=sk_test_OLD_PERSONAL_ACCOUNT
STRIPE_WEBHOOK_SECRET=whsec_test_OLD_PERSONAL_ACCOUNT

# Netlify (also test mode - good!)
STRIPE_SECRET_KEY=sk_test_OLD_PERSONAL_ACCOUNT
STRIPE_WEBHOOK_SECRET=whsec_OLD_PERSONAL_ACCOUNT
```

### Target Setup (Stakeholders' Account)

```bash
# Local .env (test mode for development)
STRIPE_SECRET_KEY=sk_test_NEW_STAKEHOLDER_ACCOUNT
STRIPE_WEBHOOK_SECRET=whsec_test_NEW_STAKEHOLDER_ACCOUNT

# Netlify Production (live mode for real payments)
STRIPE_SECRET_KEY=sk_live_NEW_STAKEHOLDER_ACCOUNT
STRIPE_WEBHOOK_SECRET=whsec_NEW_STAKEHOLDER_ACCOUNT
```

---

## Step 1: Get Access to New Stripe Account

### Ask Stakeholders For

1. **Invite you as a team member**
   - Go to: Stripe Dashboard → Settings → Team members
   - They should invite your email with "Developer" role
   - You'll get an email to accept

2. **Or get the API keys directly** (less ideal but works)
   - Test mode keys (for your local .env)
   - Production keys (for Netlify deployment)

---

## Step 2: Get the New Keys

### Once You Have Access

1. **Log in to the new Stripe account**: https://dashboard.stripe.com

2. **Toggle to Test Mode** (top right corner - should say "Test mode")

3. **Get Test Keys**:
   - Go to: Developers → API Keys
   - Copy:
     - **Publishable key** (starts with `pk_test_...`) - Not currently used but good to have
     - **Secret key** (starts with `sk_test_...`) - Click "Reveal test key"

4. **Get Production Keys** (for later):
   - Toggle to "Live mode" (top right)
   - Go to: Developers → API Keys
   - Copy:
     - **Publishable key** (starts with `pk_live_...`)
     - **Secret key** (starts with `sk_live_...`)
   - ⚠️ **KEEP THESE SAFE** - Store in password manager

---

## Step 3: Configure Webhooks (Test Mode First)

### Why Webhooks Matter

Your app needs webhooks for:
- Confirming donations completed
- Activating memberships after payment
- Handling subscription renewals
- Cancelling memberships when subscriptions end

### Configure Test Webhook (Local Development)

**Option A: Using Stripe CLI** (Recommended for local testing)

1. **Install Stripe CLI**:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Login to Stripe CLI**:
   ```bash
   stripe login
   ```
   This opens browser to connect to your Stripe account.

3. **Forward webhooks to local dev server**:
   ```bash
   # Start your dev server first
   npm run dev

   # In another terminal, forward webhooks
   stripe listen --forward-to localhost:5173/api/stripe-webhook
   ```

4. **Copy the webhook signing secret**:
   The CLI will output something like:
   ```
   > Ready! Your webhook signing secret is whsec_xxxxx
   ```
   Copy this to your local `.env` as `STRIPE_WEBHOOK_SECRET`.

**Option B: ngrok/Webhook.site** (Alternative)

If you prefer not to use Stripe CLI, you can use ngrok or similar to expose your local server.

### Configure Production Webhook (For Netlify)

1. **In Stripe Dashboard** (Live mode):
   - Go to: Developers → Webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://fairgo.org.au/api/stripe-webhook`

2. **Select events to listen to**:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`

3. **Copy the webhook signing secret**:
   - After creating, click the webhook
   - Click "Reveal" under "Signing secret"
   - Copy this for Netlify environment variables

---

## Step 4: Update Local Environment

### Update `.env`

```bash
# Supabase (unchanged)
PUBLIC_SUPABASE_URL="https://cejoaoqhphkhwbdagzib.supabase.co/"
PUBLIC_SUPABASE_ANON_KEY="your-existing-anon-key"
SUPABASE_SERVICE_ROLE_KEY=your-existing-service-role-key

# Stripe - NEW TEST KEYS from stakeholders' account
STRIPE_SECRET_KEY=sk_test_NEW_KEY_FROM_STAKEHOLDERS_ACCOUNT
STRIPE_WEBHOOK_SECRET=whsec_FROM_STRIPE_CLI_OR_TEST_WEBHOOK
```

### Restart Your Dev Server

```bash
npm run dev
```

---

## Step 5: Test Thoroughly (Test Mode)

### Testing Checklist

Use Stripe test cards: https://stripe.com/docs/testing

**Test Card Numbers:**
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, any ZIP code.

### Test Each Flow

#### ✅ One-Time Donation

1. **Go to donation page**: http://localhost:5173/donate
2. **Fill in donor info**
3. **Choose amount** (e.g., $50)
4. **Complete checkout** with test card `4242 4242 4242 4242`
5. **Verify**:
   - [ ] Redirects to success page
   - [ ] Check Stripe Dashboard → Payments (should see test payment)
   - [ ] Check your database (Supabase → transactions table)
   - [ ] Webhook fired successfully (check terminal logs)

#### ✅ One-Time Membership

1. **Create account / Sign in**: http://localhost:5173/auth
2. **Go to membership page**: http://localhost:5173/membership
3. **Choose tier** (e.g., Supporter - $50)
4. **Select "One-time payment"**
5. **Complete checkout** with test card
6. **Verify**:
   - [ ] Redirects to success page
   - [ ] Profile updated to `is_member: true` in database
   - [ ] `membership_tier` is correct
   - [ ] `membership_expires_at` is set to 1 year from now
   - [ ] Transaction recorded in transactions table
   - [ ] Webhook fired

#### ✅ Recurring Membership (Subscription)

1. **Sign in**
2. **Go to membership page**
3. **Choose tier**
4. **Select "Recurring annual"**
5. **Complete checkout** with test card
6. **Verify**:
   - [ ] Subscription created in Stripe Dashboard
   - [ ] Profile updated with `stripe_membership_subscription_id`
   - [ ] `is_member: true`
   - [ ] Webhook fired for checkout.session.completed

#### ✅ Test Subscription Renewal

1. **In Stripe Dashboard** (Test mode):
   - Go to Subscriptions → find your test subscription
   - Click "..." → "Update subscription"
   - Click "Send invoice" to simulate renewal

2. **Verify**:
   - [ ] `invoice.payment_succeeded` webhook fires
   - [ ] `membership_expires_at` updated to +1 year
   - [ ] New transaction recorded

#### ✅ Test Subscription Cancellation

1. **Cancel subscription in app**: http://localhost:5173/private/membership
2. **Or manually** in Stripe Dashboard → Cancel subscription
3. **Verify**:
   - [ ] `customer.subscription.deleted` webhook fires
   - [ ] `is_member` set to false
   - [ ] `stripe_membership_subscription_id` set to null

---

## Step 6: Deploy to Production

### Update Netlify Environment Variables

1. **Go to Netlify Dashboard**: https://app.netlify.com
2. **Navigate to**: Site → Settings → Environment variables
3. **Update Stripe variables**:

   ```bash
   STRIPE_SECRET_KEY=sk_live_NEW_STAKEHOLDER_KEY
   STRIPE_WEBHOOK_SECRET=whsec_PRODUCTION_WEBHOOK_SECRET
   ```

4. **Keep existing variables**:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

5. **Save and redeploy**:
   ```bash
   netlify deploy --prod
   ```

   Or push to master branch (auto-deploys).

---

## Step 7: Verify Production

### ⚠️ Test with REAL MONEY (Small Amount)

**Before asking stakeholders to test**, verify yourself:

1. **Make a small test donation** ($5 or whatever minimum)
2. **Use a REAL credit card** (it will charge you)
3. **Verify**:
   - [ ] Payment appears in Stripe Dashboard (Live mode)
   - [ ] Webhook fires
   - [ ] Transaction recorded in database
   - [ ] You can refund yourself in Stripe Dashboard if needed

### Then Ask Stakeholders to Test

Once you've verified it works, ask a stakeholder to:
- [ ] Make a small donation
- [ ] Sign up for membership (they can cancel immediately after)
- [ ] Verify they receive confirmation emails (if configured)

---

## Common Issues & Solutions

### Webhook Not Firing

**Problem**: Payment succeeds but database doesn't update.

**Solutions**:
1. **Check webhook endpoint is correct**: `https://fairgo.org.au/api/stripe-webhook`
2. **Check webhook events** are selected:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
3. **Check webhook logs** in Stripe Dashboard → Developers → Webhooks
4. **Verify signing secret** matches in Netlify environment variables

### "Signature Verification Failed"

**Problem**: Webhook receives request but signature doesn't match.

**Solution**: Webhook secret in Netlify doesn't match Stripe Dashboard.
1. Go to Stripe Dashboard → Webhooks → Click your webhook
2. Reveal signing secret
3. Copy to Netlify exactly

### Payment Succeeds but User Not Updated

**Problem**: Webhook fires but database doesn't update.

**Solution**: Check server logs for errors:
```bash
netlify functions:log stripe-webhook
```

Common causes:
- Wrong user ID in `client_reference_id`
- Supabase service role key incorrect
- RLS policy blocking update

### Test Card Declined

**Problem**: Test card is declined in test mode.

**Solution**:
- Ensure you're in TEST mode in Stripe Dashboard
- Use correct test card: `4242 4242 4242 4242`
- Check you didn't accidentally use a "declined" test card

---

## Rollback Plan

If something goes wrong in production:

### Quick Rollback

1. **Revert to old Stripe account**:
   ```bash
   # In Netlify, change environment variables back
   STRIPE_SECRET_KEY=sk_test_OLD_ACCOUNT
   STRIPE_WEBHOOK_SECRET=whsec_OLD_ACCOUNT
   ```

2. **Redeploy**:
   ```bash
   netlify deploy --prod
   ```

3. **Update webhook** in old Stripe account to point to production

---

## Post-Transition Checklist

After successful transition:

- [ ] Update `.env.example` with placeholder for new account
- [ ] Document Stripe account details in password manager
- [ ] Remove old Stripe account webhooks (if you have access)
- [ ] Update README.md with new Stripe account details (if relevant)
- [ ] Test subscription renewal (can simulate in Dashboard)
- [ ] Set up Stripe email notifications (optional)
- [ ] Configure payout schedule in Stripe (stakeholders)

---

## Testing Tools

### Stripe CLI Commands

```bash
# Listen for webhooks
stripe listen --forward-to localhost:5173/api/stripe-webhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger invoice.payment_succeeded
stripe trigger customer.subscription.deleted

# View events
stripe events list

# View specific event
stripe events retrieve evt_xxxxx
```

### Useful Stripe Dashboard Links

- **Test Payments**: Dashboard → Payments (Test mode)
- **Test Subscriptions**: Dashboard → Subscriptions (Test mode)
- **Webhook Logs**: Developers → Webhooks → Click webhook → "Logs"
- **Test Cards**: https://stripe.com/docs/testing
- **API Logs**: Developers → Events

---

## Security Reminders

- ✅ **Never commit live keys** to git
- ✅ **Use test mode** for all development
- ✅ **Store production keys** in password manager
- ✅ **Webhook signatures** verify requests are from Stripe
- ✅ **Environment variables** keep secrets out of code

---

## Need Help?

Ask Claude Code:
- "Walk me through testing Stripe donations"
- "Check my Stripe webhook handler for issues"
- "Verify my Stripe configuration is correct"
- "Show me how to refund a payment"

---

**You've got this!** Take it step by step, test thoroughly in test mode, and production will be smooth. 🚀
