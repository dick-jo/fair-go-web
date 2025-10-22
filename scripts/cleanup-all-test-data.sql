-- COMPREHENSIVE TEST DATA CLEANUP
-- This preserves today's legitimate $1 donations and cleans everything else
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/cejoaoqhphkhwbdagzib/sql

-- ============================================
-- STEP 1: Identify what we're KEEPING
-- ============================================
-- Show today's legitimate transactions (the $1 donations)
SELECT
  id,
  user_id,
  transaction_type,
  amount,
  created_at,
  'KEEPING - Today''s legitimate transaction' as note
FROM public.transactions
WHERE created_at >= CURRENT_DATE  -- Today or later
ORDER BY created_at DESC;

-- ============================================
-- STEP 2: Show what we're DELETING
-- ============================================
-- Show old test transactions that will be deleted
SELECT
  id,
  user_id,
  transaction_type,
  amount,
  created_at,
  'WILL DELETE - Old test data' as note
FROM public.transactions
WHERE created_at < CURRENT_DATE  -- Before today
ORDER BY created_at DESC;

-- ============================================
-- STEP 3: DELETE old test transactions
-- ============================================
-- Uncomment the line below after reviewing the above queries
-- DELETE FROM public.transactions WHERE created_at < CURRENT_DATE;

-- ============================================
-- STEP 4: Reset both test user accounts
-- ============================================
-- Reset jones.rrw@gmail.com
UPDATE public.profiles
SET
  is_member = false,
  membership_tier = null,
  membership_expires_at = null,
  stripe_customer_id = null,
  stripe_membership_subscription_id = null,
  updated_at = now()
WHERE id = (SELECT id FROM auth.users WHERE email = 'jones.rrw@gmail.com');

-- Reset milkenmintle@gmail.com
UPDATE public.profiles
SET
  is_member = false,
  membership_tier = null,
  membership_expires_at = null,
  stripe_customer_id = null,
  stripe_membership_subscription_id = null,
  updated_at = now()
WHERE id = (SELECT id FROM auth.users WHERE email = 'milkenmintle@gmail.com');

-- ============================================
-- STEP 5: Verify cleanup
-- ============================================
-- Check both test accounts are clean
SELECT
  u.email,
  p.is_member,
  p.membership_tier,
  p.stripe_customer_id,
  p.stripe_membership_subscription_id,
  (SELECT COUNT(*) FROM public.transactions WHERE user_id = p.id) as transaction_count
FROM auth.users u
JOIN public.profiles p ON p.id = u.id
WHERE u.email IN ('jones.rrw@gmail.com', 'milkenmintle@gmail.com')
ORDER BY u.email;

-- Show all remaining transactions (should only be today's if you uncommented the DELETE)
SELECT
  t.id,
  u.email,
  t.transaction_type,
  t.amount,
  t.created_at
FROM public.transactions t
LEFT JOIN auth.users u ON u.id = t.user_id
ORDER BY t.created_at DESC
LIMIT 20;
