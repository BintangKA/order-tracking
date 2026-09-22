import type { OrderStatus as OrderStatusType } from "../../types/order";

interface Props {
  status: OrderStatusType;
}

const statusConfig: Record<
  OrderStatusType,
  {
    label: string;
    badgeClasses: string;
    dotClasses: string;
  }
> = {
  PENDING: {
    label: "Pending",
    badgeClasses: "bg-amber-50 text-amber-900 border-amber-300",
    dotClasses: "bg-amber-500",
  },
  ASSIGNED: {
    label: "Assigned",
    badgeClasses: "bg-blue-50 text-blue-900 border-blue-300",
    dotClasses: "bg-blue-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    badgeClasses: "bg-purple-50 text-purple-900 border-purple-300",
    dotClasses: "bg-purple-600",
  },
  DONE: {
    label: "Done",
    badgeClasses: "bg-emerald-50 text-emerald-950 border-emerald-300",
    dotClasses: "bg-emerald-600",
  },
  CANCELLED: {
    label: "Cancelled",
    badgeClasses: "bg-rose-50 text-rose-950 border-rose-300",
    dotClasses: "bg-rose-600",
  },
};

function OrderStatus({ status }: Props) {
  const config = statusConfig[status];

  if (!config) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-800">
        <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
        {status}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold tracking-wide whitespace-nowrap shadow-2xs ${config.badgeClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClasses}`} />
      {config.label}
    </span>
  );
}

export default OrderStatus;
