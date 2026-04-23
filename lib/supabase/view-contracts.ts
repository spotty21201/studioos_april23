export type CurrencyCode = "IDR";

export type ProfileRole =
  | "principal"
  | "director"
  | "senior_associate"
  | "operations"
  | "team_member";

export type ProjectLifecycleStatus =
  | "proposal"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

export type ProjectHealthStatus = "on_track" | "watch" | "at_risk";

export type InvoiceStatus =
  | "draft"
  | "issued"
  | "paid"
  | "overdue"
  | "cancelled";

export type VendorObligationStatus =
  | "planned"
  | "due"
  | "paid"
  | "overdue"
  | "cancelled";

export type TaxStatus = "not_applicable" | "unpaid" | "paid";

export type DocumentCategory =
  | "proposal"
  | "contract"
  | "client_document"
  | "deliverable"
  | "support_document"
  | "invoice_attachment"
  | "vendor_attachment";

export type DocumentSourceType = "file" | "external_link";

export type LinkedEntityType =
  | "project"
  | "invoice"
  | "vendor_obligation"
  | "document";

export type NoteType =
  | "meeting_note"
  | "agreement"
  | "issue"
  | "reminder"
  | "follow_up"
  | "decision";

export type ActivityEventType =
  | "project_created"
  | "project_updated"
  | "project_status_changed"
  | "invoice_created"
  | "invoice_updated"
  | "invoice_status_changed"
  | "vendor_obligation_created"
  | "vendor_obligation_updated"
  | "vendor_obligation_status_changed"
  | "document_added"
  | "document_updated"
  | "note_created"
  | "note_updated";

export type ActivityEntityType =
  | "project"
  | "invoice"
  | "vendor_obligation"
  | "document"
  | "note";

export type AttentionLabel =
  | "watch"
  | "at_risk"
  | "overdue_invoice"
  | "unpaid_vendor"
  | "stale_review";

export type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  role: ProfileRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type StudioProfileRow = {
  id: string;
  studio_name: string;
  default_currency: CurrencyCode;
  timezone: string;
  created_at: string;
  updated_at: string;
};

export type ClientRow = {
  id: string;
  name: string;
  industry: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type ClientContactRow = {
  id: string;
  client_id: string;
  full_name: string;
  job_title: string | null;
  email: string | null;
  phone: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type ProjectRow = {
  id: string;
  project_code: string;
  name: string;
  slug: string;
  client_id: string;
  primary_contact_id: string | null;
  lifecycle_status: ProjectLifecycleStatus;
  health_status: ProjectHealthStatus;
  summary: string | null;
  location: string | null;
  start_date: string | null;
  target_end_date: string | null;
  completed_at: string | null;
  contract_value: number;
  currency: CurrencyCode;
  project_owner_id: string | null;
  last_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type VendorRow = {
  id: string;
  name: string;
  service_type: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type InvoiceRow = {
  id: string;
  project_id: string;
  client_id: string;
  invoice_number: string;
  title: string;
  issued_date: string | null;
  due_date: string | null;
  invoice_amount: number;
  status: InvoiceStatus;
  paid_at: string | null;
  tax_percentage: number | null;
  tax_amount: number;
  tax_status: TaxStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type VendorObligationRow = {
  id: string;
  project_id: string;
  vendor_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  amount: number;
  status: VendorObligationStatus;
  paid_at: string | null;
  tax_percentage: number | null;
  tax_amount: number;
  tax_status: TaxStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type DocumentRow = {
  id: string;
  project_id: string;
  title: string;
  category: DocumentCategory;
  source_type: DocumentSourceType;
  file_path: string | null;
  external_url: string | null;
  linked_entity_type:
    | Exclude<LinkedEntityType, "document">
    | null;
  linked_entity_id: string | null;
  document_date: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type NoteRow = {
  id: string;
  project_id: string;
  author_id: string;
  title: string | null;
  body: string;
  note_type: NoteType;
  linked_entity_type: LinkedEntityType | null;
  linked_entity_id: string | null;
  noted_at: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type ActivityEventRow = {
  id: string;
  project_id: string;
  actor_id: string | null;
  event_type: ActivityEventType;
  entity_type: ActivityEntityType;
  entity_id: string;
  summary: string;
  metadata: Record<string, unknown>;
  occurred_at: string;
  created_at: string;
  updated_at: string;
};

export type ProjectFinanceSummaryRow = {
  project_id: string;
  contract_value: number;
  total_invoiced: number;
  total_paid: number;
  outstanding_receivable: number;
  total_vendor_value: number;
  total_vendor_paid: number;
  outstanding_payable: number;
  total_tax_unpaid: number;
};

export type ProjectAttentionItemRow = {
  attention_item_id: string;
  project_id: string;
  project_code: string;
  project_name: string;
  client_name: string;
  attention_label: AttentionLabel;
  attention_summary: string;
  created_at: string;
};

export type ProjectAttentionSummaryRow = {
  project_id: string;
  attention_count: number;
  needs_attention: boolean;
};

export type FinanceOverviewRow = {
  contract_value_total: number;
  total_invoiced: number;
  total_paid: number;
  outstanding_receivable: number;
  outstanding_payable: number;
  unpaid_tax_total: number;
};

export type DashboardSnapshotRow = {
  active_projects: number;
  projects_needing_attention: number;
};

export type ProjectRelationRow = Pick<ProjectRow, "id" | "project_code" | "name" | "slug">;

export type ClientRelationRow = Pick<ClientRow, "id" | "name">;

export type ClientContactRelationRow = Pick<
  ClientContactRow,
  "id" | "full_name" | "email" | "job_title"
>;

export type ProfileRelationRow = Pick<
  ProfileRow,
  "id" | "full_name" | "email" | "role"
>;

export type VendorRelationRow = Pick<VendorRow, "id" | "name">;

export type ProjectRecordRow = ProjectRow & {
  client: ClientRelationRow | null;
  primary_contact: ClientContactRelationRow | null;
  project_owner: ProfileRelationRow | null;
};

export type InvoiceRecordRow = InvoiceRow & {
  project: ProjectRelationRow | null;
  client: ClientRelationRow | null;
};

export type VendorObligationRecordRow = VendorObligationRow & {
  project: ProjectRelationRow | null;
  vendor: VendorRelationRow | null;
};

export type DocumentRecordRow = DocumentRow & {
  project: ProjectRelationRow | null;
};

export type NoteRecordRow = NoteRow & {
  project: ProjectRelationRow | null;
  author: ProfileRelationRow | null;
};

export type ActivityEventRecordRow = ActivityEventRow & {
  project: ProjectRelationRow | null;
  actor: ProfileRelationRow | null;
};

export type CreateProjectWithActivityArgs = {
  p_project_code: string;
  p_name: string;
  p_slug: string;
  p_client_id: string;
  p_lifecycle_status?: ProjectLifecycleStatus;
  p_health_status?: ProjectHealthStatus;
  p_contract_value?: number;
  p_currency?: CurrencyCode;
  p_primary_contact_id?: string | null;
  p_summary?: string | null;
  p_location?: string | null;
  p_start_date?: string | null;
  p_target_end_date?: string | null;
  p_completed_at?: string | null;
  p_project_owner_id?: string | null;
  p_last_reviewed_at?: string | null;
};

export type UpdateProjectWithActivityPatch = Partial<{
  project_code: string;
  name: string;
  slug: string;
  client_id: string;
  primary_contact_id: string | null;
  lifecycle_status: ProjectLifecycleStatus;
  health_status: ProjectHealthStatus;
  summary: string | null;
  location: string | null;
  start_date: string | null;
  target_end_date: string | null;
  completed_at: string | null;
  contract_value: number;
  currency: CurrencyCode;
  project_owner_id: string | null;
  last_reviewed_at: string | null;
}>;

export type UpdateProjectWithActivityArgs = {
  p_project_id: string;
  p_patch: UpdateProjectWithActivityPatch;
};

export type CreateNoteWithActivityArgs = {
  p_project_id: string;
  p_body: string;
  p_note_type?: NoteType;
  p_title?: string | null;
  p_linked_entity_type?: LinkedEntityType | null;
  p_linked_entity_id?: string | null;
  p_noted_at?: string | null;
};
