import { Spinner } from "@/components/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetOrders from "@/hooks/owner/useGetOrders";
import { IOrder } from "@/types/Order";
import { useEffect, useState } from "react";
import { Tab } from "./ui";
import useUpdateOrderStatus from "@/hooks/owner/useUpdateOrderStatus";

export default function OrdersPage() {
  const { loading: getOrdersLoading, getOrders } = useGetOrders();
  const fetchOrders = async () => {
    const fetchedOrders = await getOrders();
    setOrders(fetchedOrders);
  };

  const [orders, setOrders] = useState<IOrder[]>();
  const [toggleReRender, setToggleReRender] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [toggleReRender]);

  const [currentOrderId, setCurrentOrderId] = useState<number>();

  const { loading: updateOrderLoading, updateOrderStatus } =
    useUpdateOrderStatus();

  const updateStatus = async (orderId: number, status: string) => {
    setCurrentOrderId(orderId);
    await updateOrderStatus(orderId, status);
    setToggleReRender(!toggleReRender);
  };

  return (
    <div className="items-start gap-4 md:gap-8">
      {getOrdersLoading ? (
        <div className="w-full text-center mt-10">
          <Spinner />
        </div>
      ) : (
        <Tabs defaultValue={"pending"}>
          <div className="flex items-center">
            <TabsList className="max-sm:flex-col max-sm:h-auto">
              <TabsTrigger value="pending">
                <span className="px-5">Đơn chờ xác nhận</span>
              </TabsTrigger>
              <TabsTrigger value="confirmed">
                <span className="px-5">Đơn đã xác nhận</span>
              </TabsTrigger>
              <TabsTrigger value="canceled">
                <span className="px-5">Đơn đã huỷ</span>
              </TabsTrigger>
            </TabsList>
          </div>
          {orders && (
            <>
              <TabsContent value="pending">
                <Tab
                  orders={orders?.filter((order) => order.status === "PENDING")}
                  updateStatus={updateStatus}
                  updateOrderLoading={updateOrderLoading}
                  tabValue="pending"
                  currentOrderId={currentOrderId}
                />
              </TabsContent>
              <TabsContent value="confirmed">
                <Tab
                  orders={orders?.filter(
                    (order) => order.status === "CONFIRMED"
                  )}
                  updateStatus={updateStatus}
                  updateOrderLoading={updateOrderLoading}
                  tabValue="confirmed"
                  currentOrderId={currentOrderId}
                />
              </TabsContent>
              <TabsContent value="canceled">
                <Tab
                  orders={orders?.filter(
                    (order) => order.status === "CANCELED"
                  )}
                  updateStatus={updateStatus}
                  updateOrderLoading={updateOrderLoading}
                  tabValue="canceled"
                  currentOrderId={currentOrderId}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      )}
    </div>
  );
}
