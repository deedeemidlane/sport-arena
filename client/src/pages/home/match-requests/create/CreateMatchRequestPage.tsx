import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer, Navigation } from "../../ui";
import { useNavigate } from "react-router";
import { useAuthContext } from "@/context/AuthContext";
import { FormEvent, useEffect, useState } from "react";
import useGetOrders from "@/hooks/customer/useGetOrders";
import { IOrder } from "@/types/Order";
import { Spinner } from "@/components/common";
import { formatDate } from "@/utils/helperFunctions";
import { Label } from "@/components/ui/label";
import { IBooking } from "@/types/Booking";
import useCreateMatchRequest from "@/hooks/customer/useCreateMatchRequest";
import { IMatchRequest } from "@/types/MatchRequest";
import useGetCreatedMatchRequests from "@/hooks/customer/useGetCreatedMatchRequests";
import { getTimeIndex, TIME_SLOTS } from "@/constants/times";

export default function CreateMatchRequestPage() {
  const navigate = useNavigate();
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (
      authUser === "unauthorized" ||
      (typeof authUser !== "string" && authUser.role !== "CUSTOMER")
    ) {
      navigate("/login");
    }
  }, [authUser]);

  const [orders, setOrders] = useState<IOrder[]>();
  const { getOrders } = useGetOrders();
  const { getCreatedMatchRequests } = useGetCreatedMatchRequests();

  useEffect(() => {
    const fetchOrders = async () => {
      const fetchedOrders: IOrder[] = await getOrders();
      const fetchedMatchRequests: IMatchRequest[] =
        await getCreatedMatchRequests();

      if (fetchedOrders) {
        const firstFilteredOrders = fetchedOrders.filter(
          (order) => order.status === "CONFIRMED"
        );

        const now = new Date();

        const secondFilteredOrders = firstFilteredOrders
          .map((order) => {
            const validBookings = order.bookings.filter((slot) => {
              const duplicateSlot = fetchedMatchRequests.findIndex(
                (request) => request.bookingId == slot.id
              );
              if (duplicateSlot !== -1) return false;

              const [month, day, year] = slot.bookingDate
                .split("/")
                .map(Number);
              const [hour] = slot.startTime.split(":").map(Number);
              const bookingDateTime = new Date(year, month - 1, day, hour + 1);
              return bookingDateTime > now;
            });

            return { ...order, bookings: validBookings };
          })
          .filter((order) => order.bookings.length > 0);

        console.log("secondFilteredOrders: ", secondFilteredOrders);

        const combinedOrders = Array.from(
          secondFilteredOrders.reduce((map, order) => {
            if (!map.has(order.sportFieldId)) {
              map.set(order.sportFieldId, {
                ...order,
                bookings: [...order.bookings],
              });
            } else {
              const existingOrder = map.get(order.sportFieldId);
              existingOrder.bookings = [
                ...existingOrder.bookings,
                ...order.bookings,
              ];
            }
            return map;
          }, new Map())
        ).map(([_, order]) => order);

        console.log("combinedOrders: ", combinedOrders);

        setOrders(combinedOrders);
      }
    };

    fetchOrders();
  }, []);

  const [selectedOrder, setSelectedOrder] = useState<IOrder>();
  const [bookingSlot, setBookingSlot] = useState<IBooking>();
  const [level, setLevel] = useState<string>();

  const { loading, createMatchRequest } = useCreateMatchRequest();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(selectedOrder);
    console.log(bookingSlot);
    console.log(level);

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        bookingId: bookingSlot?.id,
        desiredLevel: level,
      })
    );

    createMatchRequest(formData);
  };
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <div className="flex-1 container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <a href="/match-requests" className="w-fit">
              <Button variant="ghost" className="flex items-center gap-2 mb-2">
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
            </a>
            <CardTitle className="text-2xl font-bold">
              Tạo yêu cầu ghép cặp đấu
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders ? (
              <>
                {orders.length > 0 ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Label className="mb-2">Sân đấu</Label>
                    <Select
                      onValueChange={(value) => {
                        setSelectedOrder(
                          orders.find(
                            (order) => order.sportFieldId == parseInt(value)
                          )
                        );
                        setBookingSlot(undefined);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn sân đấu" />
                      </SelectTrigger>
                      <SelectContent>
                        {orders.map((order) => (
                          <SelectItem
                            key={order.id}
                            value={order.sportFieldId.toString()}
                          >
                            {order.sportField.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedOrder && (
                      <div className="space-y-2">
                        <Label>Chọn khung giờ</Label>
                        <div className="overflow-x-auto border rounded-lg">
                          <table className="w-full border-collapse">
                            <thead className="rounded-t-lg">
                              <tr>
                                <th className="border p-2"></th>
                                <th className="border p-2">Ngày</th>
                                <th className="border p-2">Thời gian</th>
                                <th className="border p-2">Sân</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedOrder.bookings.map((slot, index) => (
                                <tr key={`slot-${index}`}>
                                  <td className="border p-2 text-center">
                                    <input
                                      type="radio"
                                      name="booking"
                                      onClick={() => setBookingSlot(slot)}
                                    />
                                  </td>
                                  <td className="border p-2 text-center">
                                    {formatDate(slot.bookingDate)}
                                  </td>
                                  <td className="border p-2 text-center">
                                    {slot.startTime} -{" "}
                                    {
                                      TIME_SLOTS[
                                        getTimeIndex(slot.startTime) + 1
                                      ]
                                    }
                                  </td>
                                  <td className="border p-2 text-center">
                                    Sân {slot.fieldNo}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <Label className="mb-2">Trình độ</Label>
                    <Select onValueChange={(value) => setLevel(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trình độ mong muốn" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Nghiệp dư</SelectItem>
                        <SelectItem value="INTERMEDIATE">Trung cấp</SelectItem>
                        <SelectItem value="ADVANCED">Chuyên nghiệp</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        !selectedOrder || !bookingSlot || !level || loading
                      }
                    >
                      {loading ? <Spinner /> : "Tạo yêu cầu"}
                    </Button>
                  </form>
                ) : (
                  <div className="w-full flex flex-col items-center text-gray-500 space-y-2 my-8">
                    <h3 className="text-xl font-bold">
                      Bạn chưa có sân đấu nào khả dụng.
                    </h3>
                    <p>Vui lòng đặt sân trước khi tạo yêu cầu.</p>
                    <a href="/fields">
                      <Button>Đặt sân ngay</Button>
                    </a>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full flex justify-center">
                <Spinner />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
