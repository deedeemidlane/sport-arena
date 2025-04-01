import { AlarmClock, Check, Eye, Inbox, X } from "lucide-react";
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
  formatHour,
  formatPriceInVND,
  formatTime,
} from "@/utils/helperFunctions";
import { IOrder } from "@/types/Order";
import { Spinner } from "@/components/common";
import { useState } from "react";
import { ImageModal } from "./ImageModal";

const tabContent: {
  [key: string]: { title: string; color: string };
} = {
  pending: {
    title: "Đơn chờ xác nhận",
    color: "bg-yellow-300/60",
  },
  confirmed: {
    title: "Đơn đã xác nhận",
    color: "bg-green-600/80 text-gray-100",
  },
  canceled: {
    title: "Đơn đã huỷ",
    color: "bg-red-500/80 text-white",
  },
};

interface TabProps {
  orders: IOrder[] | undefined;
  updateStatus: (orderId: number, status: string) => void;
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
  const [openImageModal, setOpenImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  return (
    <Card x-chunk="dashboard-06-chunk-0" className="overflow-y-auto h-[80vh]">
      {/* <CardHeader>
        <CardTitle>{tabContent[tabValue].title}</CardTitle>
      </CardHeader> */}
      {orders?.length === 0 && (
        <div className="flex items-center justify-center w-full h-full text-gray-500 font-semibold text-lg">
          <div className="flex flex-col items-center gap-2">
            <Inbox className="w-20 h-20" />
            Chưa có đơn đặt sân nào.
          </div>
        </div>
      )}
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 xl:gap-8">
          {orders?.map((order) => (
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
                            Sân {slot.fieldNo}{" "}
                            <span>
                              ({formatHour(slot.startTime)} -{" "}
                              {formatHour(slot.startTime + 1)})
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
                          {formatPriceInVND(
                            order.bookings.reduce(
                              (accumulator, currentValue) =>
                                accumulator + currentValue.price,
                              0
                            )
                          )}
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
                  <Button
                    variant="blue"
                    size="sm"
                    className="rounded-xs"
                    onClick={() => {
                      setImageUrl(order.proofImageUrl);
                      setOpenImageModal(true);
                    }}
                  >
                    <Eye />
                    Minh chứng chuyển khoản
                  </Button>
                  {tabValue === "pending" && (
                    <>
                      <Separator className="my-4" />
                      {updateOrderLoading && currentOrderId === order.id ? (
                        <Button variant="outline" disabled className="w-full">
                          <Spinner />
                        </Button>
                      ) : (
                        <div className="flex items-center gap-4">
                          <Button
                            className="flex-1 text-green-600 font-bold hover:text-green-600"
                            variant="outline"
                            onClick={() => updateStatus(order.id, "CONFIRMED")}
                          >
                            <Check />
                            Xác nhận
                          </Button>
                          <Button
                            className="flex-1 text-red-600 font-bold hover:text-red-600"
                            variant="outline"
                            onClick={() => updateStatus(order.id, "CANCELED")}
                          >
                            <X />
                            Huỷ đơn
                          </Button>
                        </div>
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
      <ImageModal
        isOpen={openImageModal}
        closeModal={() => setOpenImageModal(false)}
        imageUrl={imageUrl}
      />
    </Card>
  );
};
