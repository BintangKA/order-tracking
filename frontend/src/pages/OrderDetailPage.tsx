import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import ConnectionStatus, {
  type ConnectionState,
} from "../components/common/ConnectionStatus";
import ErrorMessage from "../components/common/ErrorMessage";
import Loading from "../components/common/Loading";

import OrderStatus from "../components/order/OrderStatus";
import OrderProgressTracker from "../components/order/OrderProgressTracker";
import OrderTimeline from "../components/order/OrderTimeline";

import {
  cancelOrder,
  getOrder,
  getOrderHistory,
  updateOrderStatus,
} from "../services/orderService";
import useOrderEvents from "../hooks/useOrderEvents";
import type { Order, OrderEvent, OrderStatus as OrderStatusType } from "../types/order";

const NEXT_STATUS_CONFIG: Partial<
  Record<
    OrderStatusType,
    {
      nextStatus: OrderStatusType;
      actionLabel: string;
      description: string;
      buttonClass: string;
    }
  >
> = {
  PENDING: {
    nextStatus: "ASSIGNED",
    actionLabel: "Tugaskan Pesanan ke Tim",
    description: "Tugaskan pesanan ini kepada tim teknisi agar segera diproses.",
    buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  ASSIGNED: {
    nextStatus: "IN_PROGRESS",
    actionLabel: "Mulai Pengerjaan Layanan",
    description: "Tandai bahwa pekerjaan teknis di lapangan telah resmi dimulai.",
    buttonClass: "bg-purple-600 hover:bg-purple-700 text-white",
  },
  IN_PROGRESS: {
    nextStatus: "DONE",
    actionLabel: "Tandai Layanan Selesai",
    description: "Selesaikan pesanan setelah seluruh pekerjaan tuntas dikerjakan.",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
};

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);

  const [order, setOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<OrderEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const loadData = useCallback(async () => {
    if (!Number.isFinite(orderId)) {
      setError("ID Order tidak valid.");
      setLoading(false);
      return;
    }

    try {
      setError("");
      const [orderData, historyData] = await Promise.all([
        getOrder(orderId),
        getOrderHistory(orderId),
      ]);

      setOrder(orderData);
      setHistory(historyData);
    } catch (err) {
      console.error(err);
      setError("Tidak dapat memuat detail order.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const handleOrderUpdate = useCallback(
    (updatedOrder: Order) => {
      if (updatedOrder.id !== orderId) {
        return;
      }

      setOrder(updatedOrder);
      getOrderHistory(orderId).then(setHistory).catch(console.error);
    },
    [orderId],
  );

  const { status: connectionStatus } = useOrderEvents({
    onOrderUpdated: handleOrderUpdate,
    onReconnect: loadData,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  async function handleAdvanceStatus(nextStatus: OrderStatusType) {
    if (!order) return;
    try {
      setActionLoading(true);
      setActionError("");
      const updated = await updateOrderStatus(order.id, {
        status: nextStatus,
        actor_type: "ADMIN",
        actor_id: "admin-web",
      });
      setOrder(updated);
      const updatedHistory = await getOrderHistory(order.id);
      setHistory(updatedHistory);
    } catch (err: unknown) {
      console.error(err);
      let msg = "Gagal memperbarui status order.";
      if (
        axios.isAxiosError(err) &&
        err.response?.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        msg = String(err.response.data.message);
      }
      setActionError(msg);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancelOrder() {
    if (!order) return;
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin membatalkan pesanan ${order.order_number}?`
    );
    if (!confirmed) return;

    try {
      setActionLoading(true);
      setActionError("");
      const updated = await cancelOrder(order.id, {
        event_id: crypto.randomUUID(),
        actor_id: "admin-web",
      });
      setOrder(updated);
      const updatedHistory = await getOrderHistory(order.id);
      setHistory(updatedHistory);
    } catch (err: unknown) {
      console.error(err);
      let msg = "Gagal membatalkan pesanan.";
      if (
        axios.isAxiosError(err) &&
        err.response?.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        msg = String(err.response.data.message);
      }
      setActionError(msg);
    } finally {
      setActionLoading(false);
    }
  }

  function handleCopyOrderNumber() {
    if (!order) return;
    navigator.clipboard.writeText(order.order_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-white text-black">
        <Loading message="Memuat informasi pesanan..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col items-start gap-4 px-4 py-16 sm:px-6 lg:px-8">
        <ErrorMessage message={error || "Pesanan tidak ditemukan."} />
        <Link
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-2xs transition-all hover:bg-black hover:text-white"
          to="/orders"
        >
          <span>←</span>
          <span>Kembali ke Daftar Pesanan</span>
        </Link>
      </div>
    );
  }

  const connectionState: ConnectionState = connectionStatus;
  const nextConfig = NEXT_STATUS_CONFIG[order.status];
  const canCancel = order.status !== "DONE" && order.status !== "CANCELLED";

  const customerInitials = order.customer_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "CL";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Live Indicator */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-gray-500">
          <Link
            to="/orders"
            className="font-medium text-gray-600 hover:text-black transition-colors"
          >
            Daftar Pesanan
          </Link>
          <span>/</span>
          <span className="font-mono font-semibold text-gray-900">
            {order.order_number}
          </span>
        </nav>

        <ConnectionStatus status={connectionState} />
      </div>

      {/* Main Order Header Bar */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-mono text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
                {order.order_number}
              </h1>

              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopyOrderNumber}
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-black active:bg-gray-200"
                title="Salin Nomor Order"
              >
                {copied ? (
                  <>
                    <svg
                      className="h-3.5 w-3.5 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-emerald-700 font-semibold">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="h-3.5 w-3.5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Salin</span>
                  </>
                )}
              </button>

              {/* Status Badge */}
              <OrderStatus status={order.status} />

              {/* Version Chip */}
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-600">
                v{order.version}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-600">
              Layanan yang diminta:{" "}
              <strong className="font-semibold text-gray-900">
                {order.service}
              </strong>
            </p>
          </div>

          {/* Quick Action in Header (if actionable) */}
          {nextConfig && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleAdvanceStatus(nextConfig.nextStatus)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold shadow-xs transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed ${nextConfig.buttonClass}`}
              >
                {actionLoading ? (
                  <svg
                    className="h-4 w-4 animate-spin text-white"
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
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <span>{nextConfig.actionLabel}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Visual Stepper Tracker */}
      <div className="mb-8">
        <OrderProgressTracker status={order.status} />
      </div>

      {/* Action Error Alert */}
      {actionError && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-900">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">⚠</span>
            <span>{actionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError("")}
            className="text-xs text-red-700 underline hover:text-red-900"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 2-Column Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Primary Details & Action Center (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Card: Customer Information */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-sm font-bold text-gray-900">
                Informasi Pelanggan
              </h2>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                Pelanggan Terverifikasi
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white shadow-2xs">
                {customerInitials}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-bold text-gray-950">
                  {order.customer_name}
                </h3>
                <p className="text-xs text-gray-500">
                  Pemesan Layanan · Prioritas Standar
                </p>
              </div>
            </div>
          </div>

          {/* Card: Service & Timestamp Details */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs sm:p-6">
            <h2 className="border-b border-gray-100 pb-4 text-sm font-bold text-gray-900">
              Rincian Pemesanan & Layanan
            </h2>

            <dl className="divide-y divide-gray-100 text-xs">
              <div className="flex items-center justify-between py-3">
                <dt className="text-gray-500 font-medium">Jenis Layanan</dt>
                <dd className="font-semibold text-gray-900">{order.service}</dd>
              </div>

              <div className="flex items-center justify-between py-3">
                <dt className="text-gray-500 font-medium">Nomor Referensi</dt>
                <dd className="font-mono font-bold text-gray-900">
                  {order.order_number}
                </dd>
              </div>

              <div className="flex items-center justify-between py-3">
                <dt className="text-gray-500 font-medium">Waktu Pemesanan</dt>
                <dd className="font-medium text-gray-800">
                  {new Date(order.created_at).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  ·{" "}
                  {new Date(order.created_at).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </dd>
              </div>

              <div className="flex items-center justify-between py-3">
                <dt className="text-gray-500 font-medium">Pembaruan Terakhir</dt>
                <dd className="font-medium text-gray-800">
                  {new Date(order.updated_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  ·{" "}
                  {new Date(order.updated_at).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </dd>
              </div>

              <div className="flex items-center justify-between py-3">
                <dt className="text-gray-500 font-medium">Versi Data Terkini</dt>
                <dd className="inline-flex items-center gap-1.5 font-mono font-semibold text-gray-700">
                  <span>Versi {order.version}</span>
                  <span className="text-[10px] text-gray-400">
                    (Optimistic Lock)
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Card: Management & Status Actions */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs sm:p-6">
            <h2 className="border-b border-gray-100 pb-3 text-sm font-bold text-gray-900">
              Tindakan Manajemen Pesanan
            </h2>

            {nextConfig ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {nextConfig.description}
                  </p>
                  <div className="mt-3">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleAdvanceStatus(nextConfig.nextStatus)}
                      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-bold shadow-xs transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed ${nextConfig.buttonClass}`}
                    >
                      {actionLoading ? "Memproses..." : nextConfig.actionLabel}
                    </button>
                  </div>
                </div>

                {canCancel && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        Batalkan Pesanan
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Hentikan proses pengerjaan pesanan ini secara permanen.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={handleCancelOrder}
                      className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 active:bg-red-100 disabled:opacity-50"
                    >
                      Batalkan Order
                    </button>
                  </div>
                )}
              </div>
            ) : order.status === "DONE" ? (
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-emerald-50/70 border border-emerald-200 p-4 text-xs text-emerald-900">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
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
                </div>
                <div>
                  <p className="font-bold text-emerald-950">
                    Pesanan Selesai
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Layanan ini telah selesai tuntas dan tidak memerlukan tindakan lanjutan.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-rose-50/70 border border-rose-200 p-4 text-xs text-rose-900">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                  <svg
                    className="h-4 w-4"
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
                  <p className="font-bold text-rose-950">Pesanan Dibatalkan</p>
                  <p className="text-[11px] text-rose-700 mt-0.5">
                    Pesanan ini berstatus batal dan arsip telah dikunci.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Activity Audit Trail / Timeline (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900">
                  Riwayat Aktivitas
                </h2>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-600">
                  {history.length}
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>

            {/* Audit Trail List */}
            <OrderTimeline events={history} />

            <div className="mt-6 border-t border-gray-100 pt-4 text-center">
              <p className="text-[11px] text-gray-400">
                Data aktivitas tersinkronisasi langsung melalui protokol SSE.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
