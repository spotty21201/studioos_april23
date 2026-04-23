type DataSourceNoticeProps = {
  title?: string;
  message: string;
};

export function DataSourceNotice({ title, message }: DataSourceNoticeProps) {
  return (
    <div className="rounded-[4px] border border-border bg-warning-soft px-4 py-3">
      {title ? (
        <p className="text-sm font-semibold text-text-primary">{title}</p>
      ) : null}
      <p
        className={`${title ? "mt-1" : ""} text-sm leading-6 text-text-secondary`}
      >
        {message}
      </p>
    </div>
  );
}
