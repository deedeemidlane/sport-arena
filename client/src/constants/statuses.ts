import { OrderStatus } from "@/types/Order";

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  CONFIRMED: "bg-green-100 text-green-800 border-green-200",
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CANCELED: "bg-red-100 text-red-800 border-red-200",
  SELF_CANCELED: "bg-red-100 text-red-800 border-red-200",
  PROCESSING_REFUND: "bg-red-100 text-red-800 border-red-200",
  FINISHED: "bg-red-100 text-red-800 border-red-200",
};

export const ORDER_STATUS_TEXTS: Record<OrderStatus, string> = {
  CONFIRMED: "Đã xác nhận",
  PENDING: "Chờ xác nhận",
  CANCELED: "Đã bị hủy",
  SELF_CANCELED: "Bạn đã huỷ",
  PROCESSING_REFUND: "Bạn đã huỷ",
  FINISHED: "Bạn đã huỷ",
};

export const REQUEST_STATUS_OPTIONS = {
  OPEN: "Đang mở",
  PROCESSING_REQUEST: "Chờ duyệt",
  PROCESSING_PAYMENT: "Chờ thanh toán",
  MATCHED: "Đã ghép",
  CLOSED: "Đã đóng",
};
