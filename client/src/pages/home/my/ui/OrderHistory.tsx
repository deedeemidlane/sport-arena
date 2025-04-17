import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, MapPin } from "lucide-react";
import useGetOrders from "@/hooks/customer/useGetOrders";
import { useEffect, useState } from "react";
import { IOrder } from "@/types/Order";
import { Spinner } from "@/components/common";
import { ORDER_STATUS_COLORS, ORDER_STATUS_TEXTS } from "@/constants/statuses";
import useCancelOrder from "@/hooks/customer/useCancelOrder";
import { CancelOrderModal } from "./modals/CancelOrderModal";
import useConfirmRefund from "@/hooks/customer/useConfirmRefund";
import { useNavigate } from "react-router";

export const OrderHistory = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<IOrder[]>();
  const { loading, getOrders } = useGetOrders();

  const [toggleReRender, setToggleReRender] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
    };

    fetchOrders();
  }, [toggleReRender]);

  const canCanelOrder = (order: IOrder) => {
    if (order.status === "CANCELED") {
      return false;
    }

    const earliestBookingSlot = order.bookings[0];

    // Parse bookingDate and startTime
    const [month, day, year] = earliestBookingSlot.bookingDate
      .split("/")
      .map(Number);
    const [hour, minute] = earliestBookingSlot.startTime.split(":").map(Number);

    const bookingDateTime = new Date(year, month - 1, day, hour, minute); // Create Date object
    const now = new Date();
    const twentyFourHoursAfter = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Current time plus 24 hours

    // Check if the booking is more than 24 hours after the current time
    return bookingDateTime >= twentyFourHoursAfter;
  };

  const isSelfCanceled = (order: IOrder) => {
    return (
      order.status === "SELF_CANCELED" ||
      order.status === "PROCESSING_REFUND" ||
      order.status === "FINISHED"
    );
  };

  const [openCancelOrderModal, setOpenCancelOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder>();

  const { loading: cancelOrderLoading, cancelOrder } = useCancelOrder();
  const handleCancelOrder = async () => {
    const formData = new FormData();

    formData.append("orderId", JSON.stringify(selectedOrder?.id));

    await cancelOrder(formData);
    setToggleReRender(!toggleReRender);
    setOpenCancelOrderModal(false);
  };

  const { loading: confirmRefundLoading, confirmRefund } = useConfirmRefund();
  const handleConfirmRefund = async (orderId: number) => {
    const formData = new FormData();

    formData.append("orderId", JSON.stringify(orderId));

    await confirmRefund(formData);
    navigate("/my?tab=orders");
    setToggleReRender(!toggleReRender);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Lịch sử đặt sân</h2>
      </div>

      <Separator />

      {loading ? (
        <div className="w-full flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="grid gap-6">
          {orders?.length === 0 && (
            <div className="text-center text-gray-500">
              Bạn chưa có đơn đặt sân nào.
            </div>
          )}
          {orders?.map((order) => (
            <Card
              key={order.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <a
                      href={`/fields/${order.sportField.id}`}
                      className="hover:text-blue-500"
                    >
                      <CardTitle className="text-lg">
                        {order.sportField.name}
                      </CardTitle>
                    </a>
                    <CardDescription className="flex items-start gap-1 mt-1">
                      <div>
                        <MapPin className="h-4 w-4 mt-0.5" />
                      </div>
                      <div>
                        {order.sportField.ward}, {order.sportField.district},{" "}
                        {order.sportField.province}
                      </div>
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={ORDER_STATUS_COLORS[order.status]}
                  >
                    {ORDER_STATUS_TEXTS[order.status]}
                  </Badge>
                </div>
              </CardHeader>

              <CardFooter className="pt-2 flex justify-between items-center">
                {order.status === "SELF_CANCELED" && (
                  <p className="font-semibold text-sm italic text-yellow-500">
                    Đã huỷ đơn đặt sân. Vui lòng chờ chủ sân xử lý hoàn tiền.
                  </p>
                )}
                {order.status === "PROCESSING_REFUND" && (
                  <Button
                    variant="outline"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => {
                      handleConfirmRefund(order.id);
                    }}
                    disabled={confirmRefundLoading}
                  >
                    {confirmRefundLoading ? (
                      <Spinner />
                    ) : (
                      "Xác nhận đã hoàn tiền"
                    )}
                  </Button>
                )}
                {order.status === "FINISHED" && (
                  <p className="font-semibold text-sm italic text-green-600">
                    Huỷ sân hoàn tất.
                  </p>
                )}
                {!isSelfCanceled(order) && (
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={!canCanelOrder(order)}
                    onClick={() => {
                      setSelectedOrder(order);
                      setOpenCancelOrderModal(true);
                    }}
                  >
                    Hủy đặt sân
                  </Button>
                )}

                <a href={`/my/orders/${order.id}`} className="ml-auto">
                  <Button variant="ghost">
                    Chi tiết <ChevronRight />
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CancelOrderModal
        open={openCancelOrderModal}
        setOpen={setOpenCancelOrderModal}
        cancelOrder={handleCancelOrder}
        loading={cancelOrderLoading}
      />
    </div>
  );
};
