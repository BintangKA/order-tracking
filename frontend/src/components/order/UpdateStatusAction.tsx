import { useEffect, useRef, useState } from "react";
import axios from "axios";
import type { Order, OrderStatus } from "../../types/order";
import { updateOrderStatus } from "../../services/orderService";

interface Props {
  order: Order;
  onUpdated?: (updatedOrder: Order) => void;
}

interface TransitionOption {
  status: OrderStatus;
  label: string;
  badgeClass: string;
  dotClass: string;
  isDestructive?: boolean;
}

const TRANSITIONS_MAP: Record<OrderStatus, TransitionOption[]> = {
  PENDING: [
    {
      status: "ASSIGNED",
      label: "Tugaskan (ASSIGNED)",
      badgeClass: "text-blue-700 hover:bg-blue-50",
      dotClass: "bg-blue-500",
    },
    {
      status: "CANCELLED",
      label: "Batalkan Order",
      badgeClass: "text-rose-700 hover:bg-rose-50",
      dotClass: "bg-rose-500",
      isDestructive: true,
    },
  ],
  ASSIGNED: [
    {
      status: "IN_PROGRESS",
      label: "Kerjakan (IN_PROGRESS)",
      badgeClass: "text-purple-700 hover:bg-purple-50",
      dotClass: "bg-purple-600",
    },
    {
      status: "CANCELLED",
      label: "Batalkan Order",
      badgeClass: "text-rose-700 hover:bg-rose-50",
      dotClass: "bg-rose-500",
      isDestructive: true,
    },
  ],
  IN_PROGRESS: [
    {
      status: "DONE",
      label: "Selesaikan (DONE)",
      badgeClass: "text-emerald-700 hover:bg-emerald-50",
      dotClass: "bg-emerald-600",
    },
    {
      status: "CANCELLED",
      label: "Batalkan Order",
      badgeClass: "text-rose-700 hover:bg-rose-50",
      dotClass: "bg-rose-500",
      isDestructive: true,
    },
  ],
  DONE: [],
  CANCELLED: [],
};

export function UpdateStatusAction({ order, onUpdated }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const availableTransitions = TRANSITIONS_MAP[order.status] || [];
  const isTerminal = availableTransitions.length === 0;

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  async function handleSelectStatus(targetStatus: OrderStatus, isDestructive?: boolean) {
    if (isDestructive) {
      const confirmed = window.confirm(
        `Apakah Anda yakin ingin mengubah status pesanan ${order.order_number} menjadi BATAL?`
      );
      if (!confirmed) return;
    }

    setIsOpen(false);
    setLoading(true);
    setErrorMessage(null);

    try {
      const updatedOrder = await updateOrderStatus(order.id, {
        status: targetStatus,
        actor_type: "ADMIN",
        actor_id: "admin-table",
      });

      // Update state in parent page instantly without full reload
      if (onUpdated) {
        onUpdated(updatedOrder);
      }
    } catch (err: unknown) {
      console.error("Gagal mengubah status order:", err);
      let msg = "Gagal mengubah status.";
      if (
        axios.isAxiosError(err) &&
        err.response?.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        msg = String(err.response.data.message);
      }
      setErrorMessage(msg);
      window.alert(`Gagal mengubah status: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  if (isTerminal) {
    return (
      <span className="inline-flex items-center px-2 py-1 text-[11px] font-medium text-gray-400">
        Status Final
      </span>
    );
  }

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        disabled={loading}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-800 shadow-2xs transition-all hover:border-black hover:text-black active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        title="Ubah Status Pesanan"
      >
        {loading ? (
          <svg
            className="h-3.5 w-3.5 animate-spin text-black"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg
            className="h-3.5 w-3.5 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <span>{loading ? "Menyimpan..." : "Ubah Status"}</span>
        <svg
          className={`h-3 w-3 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-30 mt-1 w-52 origin-top-right rounded-lg border border-gray-200 bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="border-b border-gray-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Pilih Status Baru
          </div>
          <div className="py-1">
            {availableTransitions.map((option) => (
              <button
                key={option.status}
                type="button"
                onClick={() => handleSelectStatus(option.status, option.isDestructive)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-semibold transition-colors ${option.badgeClass}`}
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${option.dotClass}`} />
                <span className="flex-1 truncate">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick error notification tooltip if needed */}
      {errorMessage && (
        <div className="absolute right-0 top-full z-40 mt-1 rounded bg-red-600 px-2 py-1 text-[11px] font-medium text-white shadow-md">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default UpdateStatusAction;

