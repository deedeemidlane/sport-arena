import { Spinner } from "@/components/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetOrders from "@/hooks/owner/useGetOrders";
import { IOrder } from "@/types/Order";
import { useEffect, useState } from "react";
import { Tab } from "./ui";
import useUpdateOrderStatus from "@/hooks/owner/useUpdateOrderStatus";

export default function CancelingRequestsPage() {
  const { loading: getOrdersLoading, getOrders } = useGetOrders();
  const fetchOrders = async () => {
    const fetchedOrders = await getOrders();
    if (fetchedOrders) setOrders(fetchedOrders);
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
        <div className="w-full flex justify-center mt-20">
          <Spinner />
        </div>
      ) : (
        <Tabs defaultValue={"self_canceled"}>
          <div className="flex items-center">
            <TabsList className="max-sm:flex-col max-sm:h-auto">
              <TabsTrigger value="self_canceled">
                <span className="px-5">Yêu cầu huỷ</span>
              </TabsTrigger>
              <TabsTrigger value="processing_refund">
                <span className="px-5">Đơn đã hoàn tiền</span>
              </TabsTrigger>
            </TabsList>
          </div>
          {orders && (
            <>
              <TabsContent value="self_canceled">
                <Tab
                  orders={orders.filter(
                    (order) => order.status === "SELF_CANCELED"
                  )}
                  updateStatus={updateStatus}
                  updateOrderLoading={updateOrderLoading}
                  tabValue="self_canceled"
                  currentOrderId={currentOrderId}
                />
              </TabsContent>
              <TabsContent value="processing_refund">
                <Tab
                  orders={orders.filter(
                    (order) =>
                      order.status === "PROCESSING_REFUND" ||
                      order.status === "FINISHED"
                  )}
                  updateStatus={updateStatus}
                  updateOrderLoading={updateOrderLoading}
                  tabValue="processing_refund"
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
