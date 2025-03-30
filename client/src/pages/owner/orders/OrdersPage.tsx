import { Spinner } from "@/components/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetOrders from "@/hooks/owner/useGetOrders";
import { IOrder } from "@/types/Order";
import { useEffect, useState } from "react";
import { Tab } from "./ui";
import useUpdateOrderStatus from "@/hooks/owner/useUpdateOrderStatus";

export default function OrdersPage() {
  const { loading: getOrdersLoading, getOrders } = useGetOrders();

  const [orders, setOrders] = useState<IOrder[]>();

  useEffect(() => {
    const fetchOrders = async () => {
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
    };

    fetchOrders();
  }, []);

  console.log("orders: ", orders);

  const [currentOrderId, setCurrentOrderId] = useState<number>();

  const { loading: updateOrderLoading, updateOrderStatus } =
    useUpdateOrderStatus();

  const updateStatus = (orderId: number, status: string) => {
    setCurrentOrderId(orderId);
    updateOrderStatus(orderId, status);
  };

  return (
    <main className="items-start gap-4 p-4 sm:px-6 sm:py-0 sm:pt-4 md:gap-8">
      {getOrdersLoading ? (
        <div className="w-full text-center mt-10">
          <Spinner />
        </div>
      ) : (
        <Tabs defaultValue={"pending"}>
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
              <TabsTrigger value="confirmed">Đã xác nhận</TabsTrigger>
              <TabsTrigger value="canceled">Đã huỷ</TabsTrigger>
            </TabsList>
          </div>
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
              orders={orders?.filter((order) => order.status === "CONFIRMED")}
              updateStatus={updateStatus}
              updateOrderLoading={updateOrderLoading}
              tabValue="confirmed"
              currentOrderId={currentOrderId}
            />
          </TabsContent>
          <TabsContent value="canceled">
            <Tab
              orders={orders?.filter((order) => order.status === "CANCELED")}
              updateStatus={updateStatus}
              updateOrderLoading={updateOrderLoading}
              tabValue="canceled"
              currentOrderId={currentOrderId}
            />
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}
