import { useCallback, useEffect, useMemo, useState } from "react";

import ConnectionStatus, {
  type ConnectionState,
} from "../components/common/ConnectionStatus";
import ErrorMessage from "../components/common/ErrorMessage";
import Loading from "../components/common/Loading";
import OrderTable from "../components/order/OrderTable";

import { getOrders } from "../services/orderService";
import type { Order, OrderStatus as OrderStatusType } from "../types/order";
import useOrderEvents from "../hooks/useOrderEvents";

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const loadOrders = useCallback(async () => {
    try {
      setError("");
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat daftar pesanan. Pastikan backend aktif.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOrderUpdate = useCallback((updatedOrder: Order) => {
    setOrders((currentOrders) => {
      const exists = currentOrders.some(
        (order) => order.id === updatedOrder.id,
      );

      if (!exists) {
        return [updatedOrder, ...currentOrders];
      }

      return currentOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      );
    });
  }, []);

  const { status: connectionStatus } = useOrderEvents({
    onOrderUpdated: handleOrderUpdate,
    onReconnect: loadOrders,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders();
  }, [loadOrders]);

  const connectionState: ConnectionState = connectionStatus;

  // Filter & Search Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.service.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        selectedStatus === "ALL" || order.status === selectedStatus;

      return matchSearch && matchStatus;
    });
  }, [orders, searchQuery, selectedStatus]);

  // Metric summaries
  const stats = useMemo(() => {
    const total = orders.length;
    const inProgress = orders.filter((o) => o.status === "IN_PROGRESS").length;
    const done = orders.filter((o) => o.status === "DONE").length;
    const pending = orders.filter((o) => o.status === "PENDING" || o.status === "ASSIGNED").length;
    return { total, inProgress, done, pending };
  }, [orders]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Loading message="Memuat daftar order..." />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-white text-black">
      {/* Page Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-black sm:text-3xl">
            Daftar Pesanan
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola dan pantau seluruh order layanan secara langsung.
          </p>
        </div>

        <ConnectionStatus status={connectionState} />
      </div>

      {/* Summary Metrics */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
          <p className="text-xs font-semibold text-gray-500 uppercase">Total Order</p>
          <p className="mt-1 text-2xl font-black text-black">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
          <p className="text-xs font-semibold text-gray-500 uppercase">Menunggu / Ditugaskan</p>
          <p className="mt-1 text-2xl font-black text-amber-600">{stats.pending}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
          <p className="text-xs font-semibold text-gray-500 uppercase">Sedang Dikerjakan</p>
          <p className="mt-1 text-2xl font-black text-purple-600">{stats.inProgress}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
          <p className="text-xs font-semibold text-gray-500 uppercase">Selesai</p>
          <p className="mt-1 text-2xl font-black text-emerald-600">{stats.done}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && <ErrorMessage message={error} />}

      {/* Search & Filter Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <input
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-9 text-sm text-black placeholder-gray-400 shadow-2xs transition-colors focus:border-black focus:outline-none"
            placeholder="Cari order, pelanggan, layanan..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { label: "Semua", value: "ALL" },
              { label: "Pending", value: "PENDING" },
              { label: "Assigned", value: "ASSIGNED" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Done", value: "DONE" },
              { label: "Cancelled", value: "CANCELLED" },
            ] as const
          ).map((filter) => {
            const isActive = selectedStatus === filter.value;
            return (
              <button
                key={filter.value}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-black text-white shadow-2xs"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 hover:text-black"
                }`}
                type="button"
                onClick={() => setSelectedStatus(filter.value as OrderStatusType | "ALL")}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <OrderTable orders={filteredOrders} />
    </div>
  );
}

export default OrdersPage;
