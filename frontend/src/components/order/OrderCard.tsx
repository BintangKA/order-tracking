import { Link } from "react-router-dom";

import type { Order } from "../../types/order";

import OrderStatus from "./OrderStatus";

interface Props {
  order: Order;
}

function OrderCard({ order }: Props) {
  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/30 dark:hover:shadow-black/40">
      <div>
        {/* Header: Nomor Order, Service Title, & Status Badge */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {order.order_number}
            </p>

            <h2 className="text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
              {order.service}
            </h2>
          </div>

          <OrderStatus status={order.status} />
        </div>

        {/* Info Grid */}
        <div className="my-5 grid grid-cols-2 gap-4 border-y border-dashed border-slate-200 py-4 dark:border-slate-800">
          <div>
            <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Customer
            </span>
            <strong className="block truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {order.customer_name}
            </strong>
          </div>

          <div>
            <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Version
            </span>
            <strong className="block font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
              v{order.version}
            </strong>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Link
        className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.99] dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
        to={`/orders/${order.id}`}
      >
        View Detail
      </Link>
    </article>
  );
}

export default OrderCard;
