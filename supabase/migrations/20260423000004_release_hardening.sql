-- Migration: 20260423000004_release_hardening.sql
-- Status: PENDING APPLICATION (Statically reviewed; not applied to hosted database)
--
-- PREFLIGHT VERIFICATION INSTRUCTIONS:
-- Existing production rows may violate newly added check constraints or triggers.
-- Run the following read-only preflight queries against target database BEFORE applying this migration:
--
-- 1. Check for negative contract values:
--    SELECT id, project_code, contract_value FROM public.projects WHERE contract_value < 0;
-- 2. Check for invalid project date ordering:
--    SELECT id, project_code, start_date, target_end_date FROM public.projects WHERE target_end_date IS NOT NULL AND start_date IS NOT NULL AND target_end_date < start_date;
-- 3. Check for negative invoice amounts or taxes:
--    SELECT id, invoice_number, invoice_amount, tax_percentage, tax_amount FROM public.invoices WHERE invoice_amount < 0 OR tax_percentage < 0 OR tax_amount < 0;
-- 4. Check for invalid invoice date ordering:
--    SELECT id, invoice_number, issued_date, due_date FROM public.invoices WHERE due_date IS NOT NULL AND issued_date IS NOT NULL AND due_date < issued_date;
-- 5. Check for negative vendor obligation amounts or taxes:
--    SELECT id, title, amount, tax_percentage, tax_amount FROM public.vendor_obligations WHERE amount < 0 OR tax_percentage < 0 OR tax_amount < 0;
-- 6. Check for invoice client_id mismatches with project client_id:
--    SELECT i.id, i.invoice_number, i.client_id AS invoice_client, p.client_id AS project_client
--    FROM public.invoices i
--    JOIN public.projects p ON i.project_id = p.id
--    WHERE i.client_id <> p.client_id;

-- 1. Table-scoped constraint checks for public.projects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE n.nspname = 'public' AND t.relname = 'projects' AND c.conname = 'projects_contract_value_non_negative'
  ) THEN
    ALTER TABLE public.projects
      ADD CONSTRAINT projects_contract_value_non_negative CHECK (contract_value >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE n.nspname = 'public' AND t.relname = 'projects' AND c.conname = 'projects_date_ordering_check'
  ) THEN
    ALTER TABLE public.projects
      ADD CONSTRAINT projects_date_ordering_check CHECK (target_end_date IS NULL OR start_date IS NULL OR target_end_date >= start_date);
  END IF;
END $$;

-- 2. Table-scoped constraint checks for public.invoices
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE n.nspname = 'public' AND t.relname = 'invoices' AND c.conname = 'invoices_amount_non_negative'
  ) THEN
    ALTER TABLE public.invoices
      ADD CONSTRAINT invoices_amount_non_negative CHECK (invoice_amount >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE n.nspname = 'public' AND t.relname = 'invoices' AND c.conname = 'invoices_tax_percentage_non_negative'
  ) THEN
    ALTER TABLE public.invoices
      ADD CONSTRAINT invoices_tax_percentage_non_negative CHECK (tax_percentage IS NULL OR tax_percentage >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE n.nspname = 'public' AND t.relname = 'invoices' AND c.conname = 'invoices_tax_amount_non_negative'
  ) THEN
    ALTER TABLE public.invoices
      ADD CONSTRAINT invoices_tax_amount_non_negative CHECK (tax_amount >= 0 OR tax_amount IS NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE n.nspname = 'public' AND t.relname = 'invoices' AND c.conname = 'invoices_date_ordering_check'
  ) THEN
    ALTER TABLE public.invoices
      ADD CONSTRAINT invoices_date_ordering_check CHECK (due_date IS NULL OR issued_date IS NULL OR due_date >= issued_date);
  END IF;
END $$;

-- 3. Table-scoped constraint checks for public.vendor_obligations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE n.nspname = 'public' AND t.relname = 'vendor_obligations' AND c.conname = 'vendor_obligations_amount_non_negative'
  ) THEN
    ALTER TABLE public.vendor_obligations
      ADD CONSTRAINT vendor_obligations_amount_non_negative CHECK (amount >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE n.nspname = 'public' AND t.relname = 'vendor_obligations' AND c.conname = 'vendor_obligations_tax_percentage_non_negative'
  ) THEN
    ALTER TABLE public.vendor_obligations
      ADD CONSTRAINT vendor_obligations_tax_percentage_non_negative CHECK (tax_percentage IS NULL OR tax_percentage >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE n.nspname = 'public' AND t.relname = 'vendor_obligations' AND c.conname = 'vendor_obligations_tax_amount_non_negative'
  ) THEN
    ALTER TABLE public.vendor_obligations
      ADD CONSTRAINT vendor_obligations_tax_amount_non_negative CHECK (tax_amount >= 0 OR tax_amount IS NULL);
  END IF;
END $$;

-- 4. Trigger to enforce invoice client_id matches the associated project's client_id with explicit search_path
CREATE OR REPLACE FUNCTION public.enforce_invoice_client_id_matches_project()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp AS $$
DECLARE
  v_project_client_id UUID;
BEGIN
  SELECT client_id INTO v_project_client_id
  FROM public.projects
  WHERE id = NEW.project_id;

  IF v_project_client_id IS NULL THEN
    RAISE EXCEPTION 'Invoice references non-existent or inaccessible project_id: %', NEW.project_id;
  END IF;

  NEW.client_id := v_project_client_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_enforce_invoice_client_id_matches_project ON public.invoices;

CREATE TRIGGER trigger_enforce_invoice_client_id_matches_project
BEFORE INSERT OR UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.enforce_invoice_client_id_matches_project();
