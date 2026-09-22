import type { OrderEvent } from "../../types/order";

interface Props {
  events: OrderEvent[];
}

function formatStatus(status: string | null) {
  if (!status) {
    return "Order Dibuat";
  }

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function OrderTimeline({ events }: Props) {
  if (events.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        <p>Belum ada riwayat status.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {events.map((event) => (
        <div
          key={event.event_id}
          className="relative flex gap-4 pb-8 last:pb-0"
        >
          {/* Marker + Garis Vertikal */}
          <div className="relative flex w-4 flex-none justify-center after:absolute after:top-4 after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[2px] after:bg-gray-200 last:after:hidden">
            <span className="relative z-10 mt-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-black ring-2 ring-gray-200" />
          </div>

          {/* Isi Konten Event */}
          <div className="flex-1 pt-0.5">
            <div className="text-sm font-bold text-black">
              {formatStatus(event.new_status)}
            </div>

            <div className="mt-0.5 text-xs text-gray-600">
              {event.previous_status
                ? `${formatStatus(event.previous_status)} → ${formatStatus(
                    event.new_status,
                  )}`
                : formatStatus(event.new_status)}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
              <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 font-bold text-gray-800">
                {event.actor_type}
                {event.actor_id ? ` · ${event.actor_id}` : ""}
              </span>

              <span>•</span>

              <span>{new Date(event.created_at).toLocaleString("id-ID")}</span>
            </div>

            <div className="mt-1 font-mono text-[11px] text-gray-400">
              Versi {event.version}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderTimeline;
