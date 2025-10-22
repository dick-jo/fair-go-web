-- View test user's current membership status
-- Usage: Replace 'your-test-email@example.com' with your test user's email

SELECT
  p.id,
  u.email,
  p.first_name,
  p.last_name,
  p.is_member,
  p.membership_tier,
  p.membership_expires_at,
  p.stripe_customer_id,
  p.stripe_membership_subscription_id,
  p.created_at,
  p.updated_at
FROM auth.users u
JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'your-test-email@example.com';
