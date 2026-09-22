interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Memuat data..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-gray-200 border-t-black" />
      <p className="text-sm font-semibold text-gray-800">{message}</p>
    </div>
  );
}
