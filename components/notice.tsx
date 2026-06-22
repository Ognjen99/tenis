type NoticeProps = {
  error?: string | string[];
  success?: string | string[];
};

export function Notice({ error, success }: NoticeProps) {
  const errorMessage = getFirstMessage(error);
  const successMessage = getFirstMessage(success);

  if (!errorMessage && !successMessage) {
    return null;
  }

  return (
    <div className="space-y-2">
      {errorMessage ? (
        <p className="break-words rounded-2xl border border-red-400/30 bg-red-950/50 px-4 py-3 text-sm text-red-100">
          {decodeURIComponent(errorMessage)}
        </p>
      ) : null}
      {successMessage ? (
        <p className="rounded-2xl border border-emerald-400/30 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-100">
          {decodeURIComponent(successMessage)}
        </p>
      ) : null}
    </div>
  );
}

function getFirstMessage(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}
