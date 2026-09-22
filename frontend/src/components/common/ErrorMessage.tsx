interface Props {
  message: string;
}

function ErrorMessage({ message }: Props) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/70 p-4 text-red-900 shadow-2xs">
      <div className="mt-0.5 shrink-0">
        <svg
          className="h-5 w-5 text-red-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <strong className="block text-sm font-bold text-red-950">
          Terjadi Kesalahan
        </strong>
        <p className="mt-0.5 text-xs text-red-800">{message}</p>
      </div>
    </div>
  );
}

export default ErrorMessage;
