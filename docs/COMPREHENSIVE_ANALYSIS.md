# FairGo For Australians - Comprehensive Application Analysis

## Project Overview
SvelteKit + Supabase application for political party membership management with Stripe integration for donations and membership payments.

---

## 1. DATABASE SCHEMA

### Core Tables

#### **profiles**
User membership and personal information.

**Columns:**
- `id` (string, primary) - Auth user ID
- `first_name` (string | null)
- `last_name` (string | null)
- `email` (from auth, not in table)
- `date_of_birth` (date | null)
- `phone` (string | null)
- `street_address` (string | null)
- `suburb` (string | null)
- `postcode` (string | null) - Australian 4-digit postcode
- `state` (string | null)

**Membership Fields:**
- `is_member` (boolean, default: false)
- `is_volunteer` (boolean, default: false)
- `membership_tier` (string | null) - One of: supporter, advocate, partisan, champion, visionary
- `membership_paid_at` (datetime | null) - When payment was processed
- `membership_expires_at` (datetime | null) - 365 days from paid_at
- `stripe_customer_id` (string | null)
- `stripe_membership_subscription_id` (string | null) - For recurring membership

**Consent Fields (ISO datetime timestamps):**
- `pledge_accepted_at` (datetime | null) - Party commitment pledge
- `party_exclusivity_confirmed_at` (datetime | null) - No other party affiliation
- `aec_data_sharing_consent_at` (datetime | null) - Electoral Commission verification

**Metadata:**
- `created_at` (datetime)
- `updated_at` (datetime)

#### **transactions**
Record of all donations and membership payments.

**Columns:**
- `id` (string, primary)
- `user_id` (string | null) - Nullable for anonymous donors
- `transaction_type` (string) - 'donation' or 'membership'
- `amount` (number) - In cents (e.g., 5000 = $50)
- `currency` (string, default: 'aud')
- `status` (string | null) - 'succeeded', 'failed', 'pending', etc.
- `stripe_payment_id` (string | null) - Checkout session ID
- `stripe_subscription_id` (string | null) - For recurring payments
- `donor_metadata` (JSON | null) - Donor info: email, firstName, lastName, phone, streetAddress, suburb, postcode
- `created_at` (datetime)

#### **subscribers**
Newsletter subscription list (anonymous users included).

**Columns:**
- `id` (string, primary)
- `email` (string, unique)
- `email_opt_in` (boolean, default: true)
- `user_id` (string | null) - Links to auth user if authenticated
- `source` (string | null) - Where subscription came from
- `upgraded_at` (datetime | null) - When they became a member
- `unsubscribed_at` (datetime | null)
- `created_at` (datetime)

#### **Other Tables** (Content Management)
- `news_articles` - Blog posts
- `policy_content` - Policy pages
- `philosophy_content` - Philosophy/values pages
- `team_members` - Staff profiles
- `authors` - Article authors
- `carousel_items` - Homepage carousel

---

## 2. AUTHENTICATION FLOW

### Magic Link Authentication (Passwordless)

**Location:** `/src/lib/server/auth.ts`

#### A. Sign Up Flow
```
USER SUBMITS SIGNUP FORM
├─ Email, First Name, Last Name, Postcode required
├─ Data validated (email format, postcode = 4 digits)
└─ SENDS MAGIC LINK via Supabase
   ├─ Metadata embedded in OTP (first_name, last_name, postcode, source)
   ├─ Redirect URL: /auth/callback
   └─ Supabase trigger creates profile + subscriber record
```

**Function:** `createUserWithMagicLink()`
- Route: `/auth` (GET) or `/membership` (GET)
- Form: `?/signup` action
- Validates email, names, postcode
- Sends OTP to email with redirect metadata
- Rate limiting handled by Supabase

#### B. Login Flow
```
EXISTING USER SUBMITS LOGIN FORM
├─ Email only
├─ Validates email format
└─ SENDS MAGIC LINK via Supabase
   ├─ Redirect URL: /auth/callback or /auth/callback?next=/membership
   ├─ shouldCreateUser: false (doesn't create if doesn't exist)
   └─ User authenticates via token
```

**Function:** `sendLoginMagicLink()`
- Route: `/auth` (GET) or `/membership` (GET)
- Form: `?/login` or `?/magiclink` action
- Returns error if user doesn't exist

#### C. Auth Callback
**Location:** `/auth/callback` (POST via Supabase redirect)

Supabase handles:
1. Verifies OTP token from magic link
2. Creates auth user (if signup) with metadata
3. Postgres trigger creates profile record
4. Redirects to `?next=` parameter or dashboard

### Key Validation Rules
- Email: Standard email format
- Postcode: Exactly 4 digits (Australian)
- Names: Non-empty strings, trimmed
- All OTP rate-limited by Supabase (per-email limits)

### Session Management
**Location:** `/src/hooks.server.ts`

- `safeGetSession()` - Validates JWT before returning session
- Auth tokens stored in cookies
- Routes protected: `/private/*` requires authentication
- `/auth` redirects to `/private` if already authenticated

---

## 3. MEMBERSHIP ONBOARDING

### Multi-Step Process (5 Steps)
**Location:** `/src/routes/(general)/membership/+page.svelte` & `/+page.server.ts`

#### Step 0: Authentication
```
USER ENTERS (logged in or not)
├─ IF LOGGED IN: Show overlay "Welcome back, [Name]"
│  └─ Button: "Let's begin"
└─ IF NOT LOGGED IN: Show login/signup forms
   ├─ Form 1: Login (email only)
   └─ Form 2: Sign Up (first name, last name, email, postcode)
```

**Action:** `?/login` or `?/signup`
- Uses `sendLoginMagicLink()` or `createUserWithMagicLink()`
- Redirect URL includes `?next=/membership`
- After auth, returns to membership page at Step 1

#### Step 1: Membership Tier Selection
```
FEE SELECTOR (Interactive Slider)
├─ 5 Tiers: Supporter ($50) → Visionary ($250)
├─ Display: Annual Fee, Membership Level
└─ User can select tier
   └─ Stored in component state (not DB yet)
```

**Tiers:** (from `/src/routes/(general)/membership/content.ts`)
- supporter: $50
- advocate: $100
- partisan: $150
- champion: $200
- visionary: $250

#### Step 2: Electoral Roll Details
```
FORM COLLECTS DETAILS FOR AEC VERIFICATION
├─ Date of Birth (date picker)
├─ Phone (tel input, validates Australian format)
├─ Street Address
├─ Suburb
└─ Post Code
```

**Action:** `?/updateElectoralRollDetails`
- Server-side validation: Australian phone, 4-digit postcode
- Updates profile with sanitized data
- No change detection required (multi-step allows skipping)
- Null values stored for empty fields

**Function:** `updateProfile()` (/src/lib/server/profiles.ts)
- Sanitizes empty strings to null
- Validates phone and postcode formats
- Checks for actual changes (optional in membership context)

#### Step 3: Consent & Pledge
```
CHECKBOXES MUST BOTH BE CHECKED
├─ Pledge: "I commit to FairGo objectives, rules, and exclusivity"
│  └─ Sets: pledge_accepted_at + party_exclusivity_confirmed_at
└─ Electoral Consent: "I'm enrolled to vote, consent to AEC data sharing"
   └─ Sets: aec_data_sharing_consent_at
```

**Action:** `?/updateConsent`
- Server-side validation: BOTH must be checked
- Updates profile with ISO timestamps (new Date().toISOString())
- Requires changes (prevents skipping)

#### Step 4: Payment Confirmation
```
PAYMENT SUMMARY & OPTIONS
├─ Display selected tier and annual fee
├─ Checkbox: "Renew membership automatically each year"
│  └─ Stored in component state (paymentRecurringEnabled)
└─ Button: "Proceed to Payment"
   └─ Calls /api/create-membership-checkout
```

**Action:** Direct API call (not form action)
```javascript
POST /api/create-membership-checkout
Body: {
  tier: "supporter",
  amount: 5000,     // cents
  recurring: true   // boolean
}
Response: { url: "https://checkout.stripe.com/..." }
```

User redirected to Stripe checkout → payment → webhook

---

## 4. STRIPE INTEGRATION

### Membership Checkout
**Location:** `/src/routes/api/create-membership-checkout/+server.ts`

```
ENDPOINT: POST /api/create-membership-checkout

VALIDATION:
├─ User must be authenticated
├─ User cannot already be a member (is_member = false required)
├─ Tier must be in ALLOWED_TIERS
└─ Amount must match tier (5000, 10000, 15000, 20000, 25000)

TIER MAPPING:
const ALLOWED_TIERS = {
  supporter: 5000,    // $50
  advocate: 10000,    // $100
  partisan: 15000,    // $150
  champion: 20000,    // $200
  visionary: 25000    // $250
}

STRIPE CHECKOUT SESSION:
├─ Mode: 'subscription' (if recurring) or 'payment' (one-time)
├─ line_items:
│  └─ price_data:
│     ├─ currency: 'aud'
│     ├─ product_data: { name: 'FairGo Supporter Membership', ... }
│     └─ unit_amount: amount (cents)
│        └─ recurring: { interval: 'year' } (if recurring)
├─ client_reference_id: user.id
├─ customer_email: user.email
├─ metadata:
│  ├─ user_id: user.id
│  ├─ payment_type: 'membership'
│  ├─ membership_tier: tier
│  └─ is_recurring: 'true' | 'false'
├─ success_url: /membership/success?session_id={CHECKOUT_SESSION_ID}
└─ cancel_url: /membership

RESPONSE:
{ url: "https://checkout.stripe.com/..." }
```

### Donation Checkout
**Location:** `/src/routes/api/create-donation-checkout/+server.ts`

```
ENDPOINT: POST /api/create-donation-checkout

BODY:
{
  amount: 1000,  // cents
  donorInfo: {
    email: string,
    firstName: string,
    lastName: string,
    phone?: string,
    streetAddress?: string,
    suburb?: string,
    postcode?: string
  }
}

VALIDATION:
├─ isValidDonationAmount(amount) checks allowed amounts
├─ Required: email, firstName, lastName
└─ Optional: phone, address fields

STRIPE CHECKOUT SESSION:
├─ Mode: 'payment' (one-time only)
├─ line_items: Donation to FairGo For Australians
├─ client_reference_id: user.id (if authenticated, optional)
├─ metadata:
│  ├─ payment_type: 'donation'
│  ├─ donor_email, donor_first_name, donor_last_name
│  ├─ donor_phone, donor_street_address
│  ├─ donor_suburb, donor_postcode
│  └─ (All stored for webhook processing)
├─ success_url: /donate/success?session_id={CHECKOUT_SESSION_ID}
└─ cancel_url: /donate

RESPONSE:
{ url: "https://checkout.stripe.com/..." }
```

### Stripe Webhook Handler
**Location:** `/src/routes/api/stripe-webhook/+server.ts`

**Events Handled:**

#### 1. `checkout.session.completed`
```
PAYMENT SUCCEEDED - Handles both donations and memberships

IF donation (payment_type === 'donation'):
├─ Create transaction record:
│  ├─ user_id: client_reference_id (or null for anonymous)
│  ├─ transaction_type: 'donation'
│  ├─ amount: session.amount_total
│  ├─ status: 'succeeded'
│  └─ donor_metadata: { email, firstName, lastName, ... }
└─ No profile update

IF membership:
├─ Extract: tier, recurring status, customer_id, subscription_id
├─ Calculate expiry: now + 365 days
├─ Update profile:
│  ├─ is_member: true
│  ├─ membership_tier: tier
│  ├─ membership_paid_at: now
│  ├─ membership_expires_at: now + 365 days
│  ├─ stripe_customer_id: session.customer
│  └─ stripe_membership_subscription_id: session.subscription (if recurring)
└─ IF one-time payment (not recurring):
   └─ Create transaction record:
      ├─ user_id: client_reference_id
      ├─ transaction_type: 'membership'
      ├─ amount: session.amount_total
      ├─ status: 'succeeded'
      └─ (No transaction for recurring - handled by invoice event)
```

#### 2. `invoice.payment_succeeded`
```
RECURRING SUBSCRIPTION PAYMENT

Handles annual membership renewals

├─ Find profile by:
│  ├─ First try: stripe_membership_subscription_id match
│  └─ Fallback: stripe_customer_id match
├─ Update profile:
│  ├─ membership_paid_at: now
│  └─ membership_expires_at: now + 365 days
└─ Create transaction record:
   ├─ user_id: profile.id
   ├─ transaction_type: 'membership'
   ├─ stripe_subscription_id: subscription_id
   ├─ stripe_payment_id: invoice_id
   ├─ amount: invoice.amount_paid
   └─ status: 'succeeded'
```

#### 3. `customer.subscription.deleted`
```
SUBSCRIPTION CANCELLED

├─ Find profile by: stripe_membership_subscription_id
└─ Update profile:
   ├─ is_member: false
   └─ stripe_membership_subscription_id: null
```

**Signature Verification:**
```javascript
event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
// Throws error if signature doesn't match
```

**Admin Supabase Client:**
- Uses SUPABASE_SERVICE_ROLE_KEY
- Can update profiles without row-level security restrictions
- Required for webhook processing

---

## 5. KEY FLOWS - SUMMARY

### Complete Membership Signup Flow
```
1. User visits /membership
   └─ If not authenticated:

2. Step 0: Login or Sign Up
   ├─ Sends magic link
   └─ Waits for email click

3. User clicks magic link
   └─ Redirected to /auth/callback
   └─ Supabase creates auth user + profile record
   └─ Redirected back to /membership

4. Step 1: Select Membership Tier
   └─ Stores selection in component state

5. Step 2: Electoral Details Form
   └─ POST ?/updateElectoralRollDetails
   └─ Updates: date_of_birth, phone, street_address, suburb, postcode

6. Step 3: Consent Checkboxes
   └─ POST ?/updateConsent
   └─ Updates: pledge_accepted_at, party_exclusivity_confirmed_at, aec_data_sharing_consent_at

7. Step 4: Payment Review
   └─ Option to enable recurring billing
   └─ Click "Proceed to Payment"

8. POST /api/create-membership-checkout
   ├─ Validates tier + amount
   └─ Creates Stripe checkout session
   └─ Returns session URL

9. User redirected to Stripe checkout.stripe.com
   └─ Enters payment details
   └─ Completes payment

10. Stripe sends webhook: checkout.session.completed
    └─ /api/stripe-webhook receives event
    └─ Updates profile:
       ├─ is_member: true
       ├─ membership_tier: tier
       ├─ membership_expires_at: +365 days
       ├─ stripe_customer_id, stripe_membership_subscription_id
    └─ Creates transaction record

11. Stripe redirects user to /membership/success?session_id=...
    └─ Displays payment confirmation
```

### Complete Donation Flow
```
1. User visits /donate
   └─ If not authenticated, can still donate (anonymous)

2. Form: Enter amount + donor info
   ├─ email, firstName, lastName (required)
   ├─ phone, address fields (optional)
   └─ If authenticated, profile is updated with new info

3. Click "Donate"
   └─ POST ?/donate action
   └─ Validates amount (isValidDonationAmount)
   └─ Updates profile if authenticated
   └─ Calls /api/create-donation-checkout

4. POST /api/create-donation-checkout
   └─ Creates Stripe checkout session
   └─ Stores donor info in metadata

5. User redirected to Stripe checkout
   └─ Completes payment

6. Webhook: checkout.session.completed (payment_type === 'donation')
   └─ Creates transaction record:
      ├─ user_id: user.id or null
      ├─ transaction_type: 'donation'
      ├─ donor_metadata: { email, firstName, lastName, ... }

7. Redirects to /donate/success?session_id=...
   └─ Displays donation confirmation
```

---

## 6. DATABASE UTILITY PATTERNS

### Safe Profile Updates
```typescript
// Use updateProfile() from /src/lib/server/profiles.ts
await updateProfile(supabase, userId, {
  first_name: 'John',
  phone: '0420 123 456',  // Validates Australian format
  postcode: '5000'        // Validates 4 digits
})

// Handles:
// - Trimming whitespace
// - Converting empty strings to null
// - Validating phone/postcode
// - Checking for actual changes
```

### Creating Transactions
```typescript
// Via webhook (most common)
await supabaseAdmin.from('transactions').insert({
  user_id: userId,
  transaction_type: 'donation',
  amount: 1000,
  currency: 'aud',
  status: 'succeeded',
  stripe_payment_id: paymentId,
  donor_metadata: { email, firstName, ... }
})
```

### Membership Status Queries
```typescript
// Check if user is member
const { data: profile } = await supabase
  .from('profiles')
  .select('is_member, membership_expires_at')
  .eq('id', userId)
  .single()

// Check expiry
if (profile.membership_expires_at < new Date()) {
  // Membership expired
}
```

### Subscription Management
```typescript
// Cancel subscription (keeps access until period end)
await stripe.subscriptions.update(subscriptionId, {
  cancel_at_period_end: true
})
// Webhook: customer.subscription.deleted fires at end of period
// Then profile.is_member = false
```

---

## 7. ENVIRONMENT & SECRETS

**Required .env variables:**
```
PUBLIC_SUPABASE_URL=https://...supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Never commit:**
- `.env` (has secrets)
- `.env.local`
- `.env.*.local`

---

## 8. CRITICAL NOTES FOR DATABASE UTILITIES

### Important Considerations

1. **Use Service Role for Webhooks**
   - `/api/stripe-webhook` uses `SUPABASE_SERVICE_ROLE_KEY`
   - Bypasses RLS policies
   - Never expose this key to client

2. **Sanitization is Essential**
   - `updateProfile()` trims and converts empty strings to null
   - Prevents PostgreSQL errors from empty date strings
   - Always use this function, don't raw SQL

3. **Transaction Isolation**
   - Membership payments create both profile update + transaction record
   - Both use same timestamp (now.toISOString())
   - Webhook is idempotent - safe to replay

4. **Concurrent Updates Risk**
   - Two users can theoretically hit same profile simultaneously
   - But Supabase/PostgreSQL handles via row locking
   - Webhook processing is sequential

5. **Magic Link Metadata**
   - Embedded in OTP, not stored until profile created
   - Supabase trigger creates profile on first login
   - No profile pre-exists at signup confirmation

6. **Member Status Logic**
   - `is_member = true` AND `membership_expires_at > now()` = Active
   - If expiry passed but webhook not yet fired, they're technically still in DB as member
   - Webhook eventual consistency (should be <1 second)

7. **Recurring vs One-Time**
   - One-time: Single transaction record at checkout.session.completed
   - Recurring: Transaction records created on invoice.payment_succeeded (annual)
   - Subscription deletion happens at period_end after cancellation

---

## FILE REFERENCE MAP

**Authentication:**
- `/src/lib/server/auth.ts` - Magic link functions
- `/src/lib/client/auth.ts` - Sign out function
- `/src/hooks.server.ts` - Session handling
- `/src/app.d.ts` - Type definitions

**Routes:**
- `/src/routes/(general)/auth/+page.server.ts` - Auth page
- `/src/routes/(general)/membership/+page.server.ts` - Membership actions
- `/src/routes/(general)/donate/+page.server.ts` - Donation actions
- `/src/routes/(general)/membership/+page.svelte` - Membership UI (5 steps)

**Database Functions:**
- `/src/lib/server/profiles.ts` - Profile updates
- `/src/lib/server/subscribers.ts` - Newsletter management

**Stripe API:**
- `/src/routes/api/create-membership-checkout/+server.ts`
- `/src/routes/api/create-donation-checkout/+server.ts`
- `/src/routes/api/stripe-webhook/+server.ts`
- `/src/routes/api/cancel-subscription/+server.ts`

**Types:**
- `/src/lib/types/database.types.ts` - Generated Supabase types

