-- Migration: 20260423000005_hda_rebranding.sql
-- Rebrand canonical studio_profile row from AIM to HDA.

UPDATE public.studio_profile
SET studio_name = 'HDA',
    updated_at = NOW()
WHERE id = '10000000-0000-4000-8000-000000000001'
  AND studio_name IS DISTINCT FROM 'HDA';
