# Test Pricing Mode

Enable minimal pricing for testing Stripe payments in production with real money.

## Purpose

- Test production Stripe integration without spending much money
- Verify webhooks work in production environment
- Test donations for $1 and memberships for $1 instead of normal pricing

## How It Works

When `ENABLE_TEST_PRICING=true` is set in Netlify:

**Donations:**
- ✅ Test: $1, $50, $100, $150, $200
- ❌ Production: $50, $100, $150, $200

**Memberships (all tiers):**
- ✅ Test: $1 for all tiers (supporter, advocate, partisan, champion, visionary)
- ❌ Production: $50, $100, $150, $200, $250

## Usage

### Enable Test Pricing

1. **Set environment variable in Netlify:**
   ```bash
   netlify env:set PUBLIC_ENABLE_TEST_PRICING true --context production
   netlify env:set ENABLE_TEST_PRICING true --context production
   ```

2. **Deploy to production:**
   ```bash
   netlify deploy --prod
   ```

3. **Test with minimal amounts:**
   - Go to https://fairgo.org.au/donate
   - Select $1 donation
   - Complete with real credit card
   - Costs you $1 instead of $50+

4. **Verify:**
   - Check Stripe Dashboard (Live Mode) → Payments
   - Check webhook fired successfully
   - Check Supabase → transactions table

### Disable Test Pricing (Return to Normal)

1. **Remove environment variables:**
   ```bash
   netlify env:unset PUBLIC_ENABLE_TEST_PRICING --context production
   netlify env:unset ENABLE_TEST_PRICING --context production
   ```

2. **Deploy to production:**
   ```bash
   netlify deploy --prod
   ```

3. **Verify normal pricing restored:**
   - Minimum donation: $50
   - Memberships: $50-$250

## Security

**Why two environment variables?**

- `PUBLIC_ENABLE_TEST_PRICING` - Client-side (shows test amounts in UI)
- `ENABLE_TEST_PRICING` - Server-side (validates amounts)

Both must be set for test pricing to work. Even if someone manipulates the client to send a $1 request when test pricing is disabled, the server will reject it.

## Important Notes

⚠️ **NEVER leave test pricing enabled in production unless actively testing**

- Users should not have access to $1 memberships
- Always disable after testing is complete
- Set reminders to turn it off

⚠️ **This uses LIVE Stripe keys**

- Real credit cards are charged
- Real money is transferred
- Refund yourself if needed in Stripe Dashboard

✅ **Local development uses test keys**

- Your local `.env` has test keys (`sk_test_...`)
- Production Netlify has live keys (`sk_live_...`)
- This env var only affects production pricing, not which Stripe account is used

## Files Modified

1. `/src/lib/config/donations.ts` - Client-side donation amounts
2. `/src/routes/(general)/membership/content.ts` - Client-side membership tiers
3. `/src/routes/api/create-membership-checkout/+server.ts` - Server-side validation

## Testing Workflow

```bash
# 1. Enable test pricing
netlify env:set PUBLIC_ENABLE_TEST_PRICING true --context production
netlify env:set ENABLE_TEST_PRICING true --context production

# 2. Deploy
netlify deploy --prod

# 3. Test donations and memberships with $1

# 4. Verify in Stripe Dashboard and Supabase

# 5. Disable test pricing
netlify env:unset PUBLIC_ENABLE_TEST_PRICING --context production
netlify env:unset ENABLE_TEST_PRICING --context production

# 6. Redeploy
netlify deploy --prod
```

## Future Testing

Whenever you need to test production Stripe integration in the future:
1. Enable test pricing (2 commands)
2. Deploy
3. Test with $1
4. Disable test pricing (2 commands)
5. Redeploy

Total cost per full test cycle: ~$2-3 (one donation + one membership test)
