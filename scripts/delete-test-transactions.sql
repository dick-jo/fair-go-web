-- Delete test transactions for a specific user
-- WARNING: This deletes payment records! Only use for test data.
-- Usage: Replace 'your-test-email@example.com' with your test user's email

-- Show transactions before deletion (verify you're deleting the right ones)
SELECT
  t.id,
  t.transaction_type,
  t.amount / 100.0 as amount_dollars,
  t.currency,
  t.status,
  t.created_at,
  u.email
FROM public.transactions t
LEFT JOIN auth.users u ON t.user_id = u.id
WHERE u.email = 'your-test-email@example.com'
ORDER BY t.created_at DESC;

-- Uncomment the line below to actually delete (commented for safety)
-- DELETE FROM public.transactions WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-test-email@example.com');
