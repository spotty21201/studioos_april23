revoke all on table
  public.project_finance_summary_v,
  public.project_attention_v,
  public.project_attention_items_v,
  public.project_attention_summary_v,
  public.finance_overview_v,
  public.dashboard_snapshot_v
from anon;

grant select on table
  public.project_finance_summary_v,
  public.project_attention_v,
  public.project_attention_items_v,
  public.project_attention_summary_v,
  public.finance_overview_v,
  public.dashboard_snapshot_v
to authenticated;
