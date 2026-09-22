import type { OrderEvent, OrderStatus } from "../../types/order";

interface Props {
  events: OrderEvent[];
}

const STATUS_TEXT: Record<OrderStatus, string> = {
  PENDING: "Pesanan Masuk",
  ASSIGNED: "Ditugaskan ke Tim",
  IN_PROGRESS: "Sedang Dikerjakan",
  DONE: "Pesanan Selesai",
  CANCELLED: "Pesanan Dibatalkan",
};

const STATUS_COLORS: Record<
  OrderStatus,
  { dot: string; ring: string; line: string }
> = {
  PENDING: {
    dot: "bg-amber-500",
    ring: "ring-amber-100",
    line: "border-amber-200",
  },
  ASSIGNED: {
    dot: "bg-blue-600",
    ring: "ring-blue-100",
    line: "border-blue-200",
  },
  IN_PROGRESS: {
    dot: "bg-purple-600",
    ring: "ring-purple-100",
    line: "border-purple-200",
  },
  DONE: {
    dot: "bg-emerald-600",
    ring: "ring-emerald-100",
    line: "border-emerald-200",
  },
  CANCELLED: {
    dot: "bg-rose-600",
    ring: "ring-rose-100",
    line: "border-rose-200",
  },
};

function getEventDescription(event: OrderEvent): string {
  if (!event.previous_status) {
    return "Pesanan pertama kali dibuat dan tersimpan di database.";
  }

  const from = STATUS_TEXT[event.previous_status] || event.previous_status;
  const to = STATUS_TEXT[event.new_status] || event.new_status;

  if (event.new_status === "CANCELLED") {
    return `Pesanan dibatalkan dari status "${from}".`;
  }

  return `Status dialihkan dari "${from}" menjadi "${to}".`;
}

export function OrderTimeline({ events }: Props) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="mt-3 text-xs font-semibold text-gray-600">
          Belum ada riwayat aktivitas
        </p>
        <p className="mt-0.5 text-[11px] text-gray-400">
          Setiap pembaruan status akan tercatat secara otomatis di sini.
        </p>
      </div>
    );
  }

  // Display latest events first or in chronological order?
  // Usually chronologically or latest first. In the original, it maps events in the order received from DB (chronological).
  return (
    <div className="flow-root">
      <ul className="-mb-6">
        {events.map((event, idx) => {
          const isLast = idx === events.length - 1;
          const colors = STATUS_COLORS[event.new_status] || {
            dot: "bg-gray-400",
            ring: "ring-gray-100",
            line: "border-gray-200",
          };

          const eventTime = new Date(event.created_at);

          return (
            <li key={event.event_id || event.id} className="relative pb-6">
              {/* Vertical connector line */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="absolute top-4 left-3.5 -ml-px h-full w-0.5 bg-gray-200"
                />
              )}

              <div className="relative flex items-start space-x-3.5">
                {/* Node marker */}
                <div className="relative">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full bg-white ring-4 ${colors.ring}`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${colors.dot}`}
                    />
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-gray-900">
                      {STATUS_TEXT[event.new_status] || event.new_status}
                    </h4>
                    <span className="font-mono text-[11px] text-gray-400">
                      v{event.version}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                    {getEventDescription(event)}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                    <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 font-semibold text-gray-700">
                      <svg
                        className="h-3 w-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{event.actor_type}</span>
                      {event.actor_id && (
                        <span className="text-gray-400">
                          ({event.actor_id})
                        </span>
                      )}
                    </span>

                    <span>•</span>

                    <time
                      dateTime={event.created_at}
                      className="text-gray-500"
                    >
                      {eventTime.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      pukul{" "}
                      {eventTime.toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default OrderTimeline;
