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

export const OrderHistory = () => {
  const [orders, setOrders] = useState<IOrder[]>();
  const { loading, getOrders } = useGetOrders();

  useEffect(() => {
    const fetchOrders = async () => {
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
    };

    fetchOrders();
  }, []);

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
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled
                >
                  Hủy đặt sân
                </Button>
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
    </div>
  );
};
