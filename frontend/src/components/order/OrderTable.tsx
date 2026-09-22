import { Link } from "react-router-dom";
import type { Order } from "../../types/order";
import OrderStatus from "./OrderStatus";

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-base font-bold text-black">
          Tidak Ada Data Order
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Belum ada order yang sesuai dengan filter atau pencarian saat ini.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-black"
                scope="col"
              >
                No. Order
              </th>
              <th
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-black"
                scope="col"
              >
                Pelanggan
              </th>
              <th
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-black"
                scope="col"
              >
                Layanan
              </th>
              <th
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-black"
                scope="col"
              >
                Status
              </th>
              <th
                className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-black text-center"
                scope="col"
              >
                Versi
              </th>
              <th
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-black"
                scope="col"
              >
                Dibuat
              </th>
              <th
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-black"
                scope="col"
              >
                Terakhir Update
              </th>
              <th
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-black text-right"
                scope="col"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orders.map((order) => {
              const initials = order.customer_name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-gray-50/80"
                >
                  {/* No. Order */}
                  <td className="whitespace-nowrap px-6 py-4 font-mono text-sm font-bold text-black">
                    <Link
                      className="inline-flex items-center gap-1.5 text-black hover:underline"
                      to={`/orders/${order.id}`}
                    >
                      {order.order_number}
                    </Link>
                  </td>

                  {/* Customer */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                        {initials || "CL"}
                      </div>
                      <span className="font-semibold text-black">
                        {order.customer_name}
                      </span>
                    </div>
                  </td>

                  {/* Service */}
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {order.service}
                  </td>

                  {/* Status */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <OrderStatus status={order.status} />
                  </td>

                  {/* Version */}
                  <td className="whitespace-nowrap px-4 py-4 text-center">
                    <span className="inline-block rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 font-mono text-xs font-bold text-gray-800">
                      v{order.version}
                    </span>
                  </td>

                  {/* Created At */}
                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-gray-600">
                    {new Date(order.created_at).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>

                  {/* Updated At */}
                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-gray-600">
                    {new Date(order.updated_at).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <Link
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-black shadow-2xs transition-all hover:bg-black hover:text-white"
                      to={`/orders/${order.id}`}
                    >
                      <span>Detail</span>
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M9 5l7 7-7 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderTable;

