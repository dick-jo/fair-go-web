-- Reset membership data for jones.rrw@gmail.com
-- Run this via Supabase SQL Editor: https://supabase.com/dashboard/project/cejoaoqhphkhwbdagzib/sql

-- 1. Reset membership fields
UPDATE public.profiles
SET
  is_member = false,
  membership_tier = null,
  membership_expires_at = null,
  stripe_customer_id = null,
  stripe_membership_subscription_id = null,
  updated_at = now()
WHERE id = (SELECT id FROM auth.users WHERE email = 'jones.rrw@gmail.com');

-- 2. Show updated profile (verify it worked)
SELECT
  p.id,
  u.email,
  p.first_name,
  p.last_name,
  p.is_member,
  p.membership_tier,
  p.membership_expires_at,
  p.stripe_customer_id,
  p.stripe_membership_subscription_id
FROM auth.users u
JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'jones.rrw@gmail.com';
