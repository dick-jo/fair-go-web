# Stripe Testing Checklist

Quick reference checklist for testing Stripe integration before production deployment.

**Test Card**: `4242 4242 4242 4242` (any future date, any CVC, any ZIP)

---

## Pre-Testing Setup

- [ ] Stripe CLI installed: `brew install stripe/stripe-cli/stripe`
- [ ] Stripe CLI authenticated: `stripe login`
- [ ] Webhook forwarding running: `stripe listen --forward-to localhost:5173/api/stripe-webhook`
- [ ] Webhook secret copied to `.env` as `STRIPE_WEBHOOK_SECRET`
- [ ] Dev server running: `npm run dev`
- [ ] Stripe Dashboard open in Test mode

---

## Test 1: One-Time Donation

### Steps
1. Navigate to: http://localhost:5173/donate
2. Fill in donor information
3. Select amount (e.g., $50)
4. Click "Donate"
5. Complete Stripe checkout with test card
6. Should redirect to success page

### Verify
- [ ] Success page displays
- [ ] Payment in Stripe Dashboard → Payments (Test mode)
- [ ] Terminal shows webhook fired: `checkout.session.completed`
- [ ] Database: Check `transactions` table for new donation record
- [ ] Database: `transaction_type` = 'donation'
- [ ] Database: `amount` matches donation
- [ ] Database: `donor_metadata` contains donor info

**Notes:**
_________________________________________________

---

## Test 2: One-Time Membership

### Steps
1. Sign in or create account: http://localhost:5173/auth
2. Navigate to: http://localhost:5173/membership
3. Choose tier (e.g., Supporter - $50)
4. Select "One-time payment"
5. Click "Get Membership"
6. Complete Stripe checkout with test card
7. Should redirect to success page

### Verify
- [ ] Success page displays
- [ ] Payment in Stripe Dashboard
- [ ] Terminal shows webhook: `checkout.session.completed`
- [ ] Database: `profiles` table → `is_member` = true
- [ ] Database: `membership_tier` matches selection
- [ ] Database: `membership_paid_at` = current timestamp
- [ ] Database: `membership_expires_at` = ~1 year from now
- [ ] Database: `stripe_customer_id` populated
- [ ] Database: `transactions` table has membership record
- [ ] User dashboard shows active membership

**Notes:**
_________________________________________________

---

## Test 3: Recurring Membership (Subscription)

### Steps
1. Sign in as new user (or use different email)
2. Navigate to: http://localhost:5173/membership
3. Choose tier (e.g., Advocate - $100)
4. Select "Recurring annual"
5. Complete checkout
6. Should redirect to success page

### Verify
- [ ] Success page displays
- [ ] Stripe Dashboard → Subscriptions shows active subscription
- [ ] Terminal shows webhook: `checkout.session.completed`
- [ ] Database: `profiles` → `is_member` = true
- [ ] Database: `stripe_membership_subscription_id` populated
- [ ] Database: `membership_paid_at` = current timestamp
- [ ] Database: `membership_expires_at` = ~1 year from now
- [ ] Database: `transactions` table has NO entry (subscriptions don't create transaction on first payment)
- [ ] User dashboard shows subscription status

**Notes:**
_________________________________________________

---

## Test 4: Subscription Renewal

### Steps
1. In Stripe Dashboard (Test mode):
   - Go to: Subscriptions
   - Find your test subscription
   - Click "..." menu → "Update subscription"
   - Scroll down → "Send test invoice now"
2. Check terminal for webhook

### Verify
- [ ] Terminal shows webhook: `invoice.payment_succeeded`
- [ ] Database: `membership_expires_at` extended by 1 year
- [ ] Database: New record in `transactions` table
- [ ] Database: `transaction_type` = 'membership'
- [ ] Database: `stripe_subscription_id` populated

**Notes:**
_________________________________________________

---

## Test 5: Subscription Cancellation

### Steps
1. Navigate to: http://localhost:5173/private/membership
2. Click "Cancel Subscription" (or cancel in Stripe Dashboard)
3. Confirm cancellation

### Verify
- [ ] Terminal shows webhook: `customer.subscription.deleted`
- [ ] Database: `profiles` → `is_member` = false
- [ ] Database: `stripe_membership_subscription_id` = null
- [ ] User dashboard shows cancelled status
- [ ] Stripe Dashboard shows subscription status = "Canceled"

**Notes:**
_________________________________________________

---

## Test 6: Anonymous Donation

### Steps
1. Log out (if logged in)
2. Navigate to: http://localhost:5173/donate
3. Fill in donor info
4. Select amount
5. Complete checkout

### Verify
- [ ] Success page displays
- [ ] Payment in Stripe Dashboard
- [ ] Terminal shows webhook
- [ ] Database: `transactions` → `user_id` = null (anonymous)
- [ ] Database: `donor_metadata` contains info

**Notes:**
_________________________________________________

---

## Test 7: Error Handling - Declined Card

### Steps
1. Go to donation or membership page
2. Use declined test card: `4000 0000 0000 0002`
3. Attempt checkout

### Verify
- [ ] Stripe shows decline message
- [ ] User returned to form (not charged)
- [ ] NO webhook fired
- [ ] NO database entry created

**Notes:**
_________________________________________________

---

## Test 8: Error Handling - 3D Secure Required

### Steps
1. Go to donation or membership page
2. Use 3D Secure card: `4000 0025 0000 3155`
3. Complete authentication

### Verify
- [ ] Authentication modal appears
- [ ] After auth, payment succeeds
- [ ] Webhook fires
- [ ] Database updated correctly

**Notes:**
_________________________________________________

---

## Production Verification (Real Money!)

### Before Going Live
- [ ] All above tests passed in test mode
- [ ] Webhook endpoint configured in Stripe (Live mode): `https://fairgo.org.au/api/stripe-webhook`
- [ ] Webhook events selected: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`
- [ ] Netlify environment variables updated with LIVE keys
- [ ] Production deployment complete

### Small Real Payment Test
- [ ] Make $5 donation with real card
- [ ] Payment appears in Stripe (Live mode)
- [ ] Webhook fires (check Netlify logs)
- [ ] Database updated
- [ ] Refund processed successfully

### Stakeholder Test
- [ ] Stakeholder makes small donation
- [ ] Stakeholder signs up for membership
- [ ] All webhooks fire correctly
- [ ] Database updates correctly
- [ ] Stakeholder can access member area

**Notes:**
_________________________________________________

---

## Troubleshooting

### Webhook Not Firing
1. Check Stripe CLI is running: `stripe listen --forward-to localhost:5173/api/stripe-webhook`
2. Check webhook secret matches in `.env`
3. Check terminal for errors

### Database Not Updating
1. Check server logs for errors
2. Verify Supabase service role key in `.env`
3. Check webhook handler code for bugs
4. Verify RLS policies allow updates

### Payment Succeeds but Webhook Fails
1. Check Stripe Dashboard → Developers → Events
2. Look for failed webhook attempts
3. Check response code (should be 200)
4. Check webhook signing secret

---

## Quick Commands

```bash
# Start webhook forwarding
stripe listen --forward-to localhost:5173/api/stripe-webhook

# Trigger test webhooks
stripe trigger checkout.session.completed
stripe trigger invoice.payment_succeeded
stripe trigger customer.subscription.deleted

# View webhook logs
stripe events list --limit 10

# Check dev server
npm run dev
```

---

## Test Cards Reference

| Scenario | Card Number | Result |
|----------|-------------|--------|
| Success | 4242 4242 4242 4242 | Payment succeeds |
| Decline | 4000 0000 0000 0002 | Payment declined |
| 3D Secure | 4000 0025 0000 3155 | Requires authentication |
| Insufficient funds | 4000 0000 0000 9995 | Declined (insufficient funds) |

**All cards**: Use any future expiry date, any 3-digit CVC, any ZIP code

---

**Print this checklist and check off each item as you test!** ✅
