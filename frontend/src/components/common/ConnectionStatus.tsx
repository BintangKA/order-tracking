export type ConnectionState = "connected" | "reconnecting" | "disconnected";

interface Props {
  status: ConnectionState;
}

const config = {
  connected: {
    label: "Connected (Real-Time)",
    badgeClass: "border-gray-200 bg-white text-gray-900",
    dotClass: "bg-emerald-500",
    pingClass: "bg-emerald-400",
  },
  reconnecting: {
    label: "Reconnecting...",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-900",
    dotClass: "bg-amber-500",
    pingClass: "bg-amber-400",
  },
  disconnected: {
    label: "Disconnected",
    badgeClass: "border-rose-200 bg-rose-50 text-rose-900",
    dotClass: "bg-rose-500",
    pingClass: "bg-rose-400",
  },
};

function ConnectionStatus({ status }: Props) {
  const current = config[status] ?? config.disconnected;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-2xs ${current.badgeClass}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${current.pingClass}`}
        />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${current.dotClass}`} />
      </span>
      <span>{current.label}</span>
    </div>
  );
}

export default ConnectionStatus;
