import { useState } from "react";
import axios from "axios";

import type { Order } from "../../types/order";
import { cancelOrder } from "../../services/orderService";

interface Props {
  order: Order;
  onSuccess: () => void;
}

function CancelOrderButton({ order, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canCancel = order.status !== "DONE" && order.status !== "CANCELLED";

  async function handleCancel() {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin membatalkan order ini?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await cancelOrder(order.id, {
        event_id: crypto.randomUUID(),
        actor_id: "customer-001",
      });

      onSuccess();
    } catch (err: unknown) {
      console.error(err);

      let message = "Gagal membatalkan order.";
      if (
        axios.isAxiosError(err) &&
        err.response?.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        message = String(err.response.data.message);
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (!canCancel) {
    return (
      <div className="pt-2">
        <p className="text-xs font-semibold text-gray-500">
          {order.status === "DONE"
            ? "Order ini telah selesai dan tidak dapat dibatalkan."
            : "Order ini sudah dibatalkan sebelumnya."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      {/* Alert Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-900">
          <span className="text-sm font-bold">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Action Button */}
      <button
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-2xs transition-all hover:bg-red-700 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={loading}
        type="button"
        onClick={handleCancel}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin text-white"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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
        )}
        {loading ? "Membatalkan..." : "Batalkan Order"}
      </button>
    </div>
  );
}

export default CancelOrderButton;
