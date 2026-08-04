"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-full bg-background text-foreground">
        <div className="flex min-h-screen flex-col items-center justify-center p-8">
          <div className="max-w-lg rounded-[8px] border border-border bg-white p-8 text-left shadow-sm">
            <h1 className="text-xl font-semibold text-text-primary">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              An unexpected issue occurred while loading the app. This can happen when data from the database uses a format the interface cannot display.
            </p>
            {process.env.NODE_ENV === "development" && error.digest ? (
              <p className="mt-2 text-xs text-text-tertiary break-all">
                Details: {error.message} ({error.digest})
              </p>
            ) : null}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[2px] border border-black bg-black px-5 text-sm font-medium text-white hover:bg-accent-strong"
              >
                Try again
              </button>
              <a
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center rounded-[2px] border border-border bg-white px-5 text-sm font-medium text-text-primary hover:bg-surface-muted"
              >
                Return to Dashboard
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
