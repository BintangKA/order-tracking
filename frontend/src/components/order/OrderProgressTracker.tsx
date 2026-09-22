import type { OrderStatus } from "../../types/order";

interface Props {
  status: OrderStatus;
}

interface Step {
  key: OrderStatus;
  label: string;
  description: string;
}

const STEPS: Step[] = [
  {
    key: "PENDING",
    label: "Pesanan Masuk",
    description: "Menunggu verifikasi",
  },
  {
    key: "ASSIGNED",
    label: "Penugasan",
    description: "Tim teknisi ditunjuk",
  },
  {
    key: "IN_PROGRESS",
    label: "Dalam Proses",
    description: "Pengerjaan layanan",
  },
  {
    key: "DONE",
    label: "Selesai",
    description: "Layanan rampung",
  },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  PENDING: 0,
  ASSIGNED: 1,
  IN_PROGRESS: 2,
  DONE: 3,
  CANCELLED: -1,
};

export function OrderProgressTracker({ status }: Props) {
  if (status === "CANCELLED") {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-950">
              Pesanan Telah Dibatalkan
            </h4>
            <p className="text-xs text-rose-700">
              Pesanan ini telah dihentikan dan tidak akan dilanjutkan ke tahap berikutnya.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_ORDER[status] ?? 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs sm:p-6">
      <div className="relative">
        {/* Step Items */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step.key} className="relative flex flex-col">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isCompleted
                        ? "bg-black text-white"
                        : isCurrent
                          ? "bg-black text-white ring-4 ring-gray-100"
                          : "border border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-xs font-bold ${
                        isCurrent
                          ? "text-black"
                          : isCompleted
                            ? "text-gray-900"
                            : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="truncate text-[11px] text-gray-500">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Progress bar line between steps */}
                {idx < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-4 left-9 right-3 -z-10 h-0.5 bg-gray-200">
                    <div
                      className="h-full bg-black transition-all"
                      style={{
                        width: idx < currentIndex ? "100%" : "0%",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default OrderProgressTracker;
