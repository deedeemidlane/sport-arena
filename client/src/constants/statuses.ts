type OrderStatus = "CONFIRMED" | "PENDING" | "CANCELED";

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  CONFIRMED: "bg-green-100 text-green-800 border-green-200",
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CANCELED: "bg-red-100 text-red-800 border-red-200",
};

export const ORDER_STATUS_TEXTS: Record<OrderStatus, string> = {
  CONFIRMED: "Đã xác nhận",
  PENDING: "Chờ xác nhận",
  CANCELED: "Đã hủy",
};
