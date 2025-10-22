-- COMPLETE RESET for jones.rrw@gmail.com
-- This clears ALL test data: memberships, transactions, and Stripe references
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/cejoaoqhphkhwbdagzib/sql

-- 1. Delete all test transactions
DELETE FROM public.transactions
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'jones.rrw@gmail.com');

-- 2. Reset membership fields (completely clean slate)
UPDATE public.profiles
SET
  is_member = false,
  membership_tier = null,
  membership_expires_at = null,
  stripe_customer_id = null,
  stripe_membership_subscription_id = null,
  updated_at = now()
WHERE id = (SELECT id FROM auth.users WHERE email = 'jones.rrw@gmail.com');

-- 3. Verify the reset worked
SELECT
  p.id,
  u.email,
  p.is_member,
  p.membership_tier,
  p.stripe_customer_id,
  p.stripe_membership_subscription_id,
  (SELECT COUNT(*) FROM public.transactions WHERE user_id = p.id) as transaction_count
FROM auth.users u
JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'jones.rrw@gmail.com';

-- Expected result:
-- is_member: false
-- membership_tier: null
-- stripe_customer_id: null
-- stripe_membership_subscription_id: null
-- transaction_count: 0
