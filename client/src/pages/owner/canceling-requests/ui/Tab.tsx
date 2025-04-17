import { AlarmClock, HandCoins, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  formatDate,
  formatPriceInVND,
  formatTime,
} from "@/utils/helperFunctions";
import { IOrder } from "@/types/Order";
import { Spinner } from "@/components/common";
import { useState } from "react";
import { getTimeIndex, TIME_SLOTS } from "@/constants/times";
import { QrPaymentModal } from "./QrPaymentModal";

const tabContent: {
  [key: string]: { title: string; color: string };
} = {
  self_canceled: {
    title: "Yêu cầu huỷ sân",
    color: "bg-gray-300/60",
  },
  processing_refund: {
    title: "Đơn đã hoàn tiền",
    color: "bg-green-600/80 text-gray-100",
  },
};

interface TabProps {
  orders: IOrder[];
  updateStatus: (orderId: number, status: string) => Promise<void>;
  updateOrderLoading: boolean;
  tabValue: string;
  currentOrderId: number | undefined;
}

export const Tab = ({
  orders,
  updateStatus,
  updateOrderLoading,
  tabValue,
  currentOrderId,
}: TabProps) => {
  const [openQrModal, setOpenQrModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder>();

  const calculateTotalPrice = (order: IOrder) => {
    return order.bookings.reduce(
      (accumulator, currentValue) => accumulator + currentValue.price,
      0
    );
  };

  return (
    <Card x-chunk="dashboard-06-chunk-0" className="overflow-y-auto h-[80vh]">
      {orders.length === 0 && (
        <div className="flex items-center justify-center w-full h-full text-gray-500 font-semibold text-lg">
          <div className="flex flex-col items-center gap-2">
            <Inbox className="w-20 h-20" />
            {tabValue === "self_canceled"
              ? "Không có yêu cầu huỷ sân nào"
              : "Không có đơn đặt sân nào"}
          </div>
        </div>
      )}
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 xl:gap-8">
          {orders.map((order) => (
            <div key={tabValue + order.id}>
              <Card
                className="overflow-hidden py-0"
                x-chunk="dashboard-05-chunk-4"
              >
                <CardHeader
                  className={
                    "flex flex-row items-start py-4 " +
                    tabContent[tabValue].color
                  }
                >
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      Đơn số <span className="font-thin">#{order.id}</span>
                    </CardTitle>
                    <CardDescription>
                      <span
                        className={
                          "flex items-center text-black gap-1 " +
                          (tabValue === "preparing" || tabValue === "completed"
                            ? "text-white"
                            : "")
                        }
                      >
                        <AlarmClock className="h-5" />
                        {formatTime(order.createdAt)}{" "}
                        {formatDate(order.createdAt)}
                      </span>
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-6 text-sm">
                  <div className="grid gap-3">
                    <h2 className="font-bold text-lg">
                      {order.sportField.name}
                    </h2>
                    <Separator className="" />
                    <div className="font-semibold">Chi tiết đơn đặt</div>
                    <ul className="grid gap-3">
                      {order.bookings.map((slot) => (
                        <li
                          key={slot.id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-muted-foreground">
                            Sân {slot.fieldNo}
                            <span>
                              (
                              {`${slot.startTime} - ${
                                TIME_SLOTS[getTimeIndex(slot.startTime) + 1]
                              }`}
                              )
                            </span>{" "}
                            {formatDate(slot.bookingDate)}
                          </span>
                          <span>{formatPriceInVND(slot.price)}</span>
                        </li>
                      ))}
                    </ul>
                    <Separator className="my-2" />
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground">Tổng</span>
                        <span>
                          {formatPriceInVND(calculateTotalPrice(order))}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Thông tin khách hàng</div>
                    <dl className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Tên</dt>
                        <dd>{order.customerName}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Số điện thoại</dt>
                        <dd>{order.customerPhone}</dd>
                      </div>
                    </dl>
                  </div>
                  <Separator className="my-4" />
                  {tabValue === "self_canceled" && (
                    <>
                      {updateOrderLoading && currentOrderId === order.id ? (
                        <Button variant="outline" disabled className="w-full">
                          <Spinner />
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={() => {
                            setSelectedOrder(order);
                            setOpenQrModal(true);
                          }}
                        >
                          <HandCoins />
                          Hoàn tiền
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
                <CardFooter
                  className={
                    "flex flex-row items-center border-t px-6 py-3 " +
                    tabContent[tabValue].color
                  }
                ></CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </CardContent>
      {selectedOrder && (
        <QrPaymentModal
          open={openQrModal}
          setOpen={setOpenQrModal}
          price={calculateTotalPrice(selectedOrder)}
          customer={selectedOrder.user}
          fieldName={selectedOrder.sportField.name}
          loading={updateOrderLoading}
          handleSubmit={async () => {
            await updateStatus(selectedOrder.id, "PROCESSING_REFUND");
            setOpenQrModal(false);
          }}
        />
      )}
    </Card>
  );
};
