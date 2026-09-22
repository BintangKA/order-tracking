import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ErrorMessage from "../components/common/ErrorMessage";
import Loading from "../components/common/Loading";
import ConnectionStatus, {
  type ConnectionState,
} from "../components/common/ConnectionStatus";

import CancelOrderButton from "../components/order/CancelOrderButton";
import OrderStatus from "../components/order/OrderStatus";
import OrderTimeline from "../components/order/OrderTimeline";

import { getOrder, getOrderHistory } from "../services/orderService";
import useOrderEvents from "../hooks/useOrderEvents";
import type { Order, OrderEvent } from "../types/order";

function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);

  const [order, setOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<OrderEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Loading message="Memuat detail order..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-4 px-4 py-12 sm:px-6 lg:px-8">
        <ErrorMessage message={error || "Order tidak ditemukan."} />

        <Link
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black shadow-2xs hover:bg-black hover:text-white transition-all"
          to="/orders"
        >
          ← Kembali ke Daftar Order
        </Link>
      </div>
    );
  }

  const connectionState: ConnectionState = connectionStatus;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-white text-black">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-6 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
        <div>
          <Link
            className="group mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 transition-colors hover:text-black"
            to="/orders"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Kembali ke Daftar Order
          </Link>

          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500">
            Detail Informasi Order
          </p>

          <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
            {order.order_number}
          </h1>

          <p className="mt-1 text-sm font-medium text-gray-700 sm:text-base">
            {order.service}
          </p>
        </div>

        <ConnectionStatus status={connectionState} />
      </div>

      {/* Content Layout */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(340px,1fr)]">
        {/* Main Details */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
              <div>
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Layanan & Status Saat Ini
                </span>

                <h2 className="text-xl font-black text-black sm:text-2xl">
                  {order.service}
                </h2>
              </div>

              <OrderStatus status={order.status} />
            </div>

            {/* Meta Details Grid */}
            <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <span className="mb-1 block text-xs font-semibold text-gray-500 uppercase">
                  Nama Pelanggan
                </span>
                <strong className="text-sm font-black text-black">
                  {order.customer_name}
                </strong>
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <span className="mb-1 block text-xs font-semibold text-gray-500 uppercase">
                  Versi Data
                </span>
                <strong className="font-mono text-sm font-black text-black">
                  v{order.version}
                </strong>
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <span className="mb-1 block text-xs font-semibold text-gray-500 uppercase">
                  Waktu Pembuatan
                </span>
                <strong className="text-sm font-semibold text-black">
                  {new Date(order.created_at).toLocaleString("id-ID", {
                    dateStyle: "full",
                    timeStyle: "medium",
                  })}
                </strong>
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <span className="mb-1 block text-xs font-semibold text-gray-500 uppercase">
                  Terakhir Diperbarui
                </span>
                <strong className="text-sm font-semibold text-black">
                  {new Date(order.updated_at).toLocaleString("id-ID", {
                    dateStyle: "full",
                    timeStyle: "medium",
                  })}
                </strong>
              </div>
            </div>

            {/* Action Area */}
            <div className="border-t border-gray-200 pt-6">
              <CancelOrderButton order={order} onSuccess={loadData} />
            </div>
          </div>
        </div>

        {/* Sidebar / Timeline */}
        <aside className="order-first lg:order-last">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
            <div className="mb-6 border-b border-gray-200 pb-4">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Riwayat Status
              </span>

              <h2 className="text-lg font-black text-black sm:text-xl">
                Timeline Perubahan
              </h2>
            </div>

            <OrderTimeline events={history} />
          </div>
        </aside>
      </section>
    </div>
  );
}

export default OrderDetailPage;
