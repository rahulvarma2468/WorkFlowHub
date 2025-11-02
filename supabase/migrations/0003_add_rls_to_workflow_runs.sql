/*
# [SECURITY] Add RLS Policies to workflow_runs

This migration secures the `workflow_runs` table by adding Row-Level Security (RLS) policies. This resolves the "RLS Enabled No Policy" advisory and ensures that users can only see and create their own workflow activity logs.

## Query Description:
This script adds two essential security policies to the `workflow_runs` table. Without these policies, no data can be read from or written to the table, rendering the "Recent Activity" feature non-functional. This change is safe and essential for user data privacy.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (by dropping the policies)

## Structure Details:
- Table: `public.workflow_runs`
- Policies Added:
  - "Users can view their own workflow runs." (SELECT)
  - "Users can insert their own workflow runs." (INSERT)

## Security Implications:
- RLS Status: Policies are being added to an RLS-enabled table.
- Policy Changes: Yes. This is the core purpose of the script.
- Auth Requirements: Policies rely on `auth.uid()` to identify the logged-in user.

## Performance Impact:
- Indexes: None.
- Triggers: None- Estimated Impact: Negligible. RLS checks are highly optimized in PostgreSQL.
*/

-- Drop existing policies if they exist to make the script idempotent
DROP POLICY IF EXISTS "Users can view their own workflow runs." ON public.workflow_runs;
DROP POLICY IF EXISTS "Users can insert their own workflow runs." ON public.workflow_runs;


-- 1. Create SELECT policy
-- This policy allows users to view only the workflow runs that they have created.
CREATE POLICY "Users can view their own workflow runs."
ON public.workflow_runs
FOR SELECT
USING (auth.uid() = user_id);


-- 2. Create INSERT policy
-- This policy allows users to insert new workflow runs for themselves.
-- The WITH CHECK clause ensures that a user cannot insert a run on behalf of another user.
CREATE POLICY "Users can insert their own workflow runs."
ON public.workflow_runs
FOR INSERT
WITH CHECK (auth.uid() = user_id);
