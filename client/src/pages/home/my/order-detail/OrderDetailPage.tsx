import { useNavigate, useParams } from "react-router";
import { Footer, Navigation } from "../../ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Phone, Star, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useGetOrderDetail from "@/hooks/customer/useGetOrderDetail";
import { IOrder } from "@/types/Order";
import { ORDER_STATUS_COLORS, ORDER_STATUS_TEXTS } from "@/constants/statuses";
import { Spinner } from "@/components/common";
import { formatDate, formatPriceInVND } from "@/utils/helperFunctions";
import { Textarea } from "@/components/ui/textarea";
import { getTimeIndex, TIME_SLOTS } from "@/constants/times";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { getOrderDetail } = useGetOrderDetail();
  const [order, setOrder] = useState<IOrder>();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      const orderDetail = await getOrderDetail(orderId || "");
      setOrder(orderDetail);
    };

    fetchOrderDetail();
  }, [orderId]);
  console.log("order", order);

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmitReview = () => {};

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {order ? (
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="space-y-6">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 mb-4"
                  onClick={() => navigate("/my?tab=orders")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại
                </Button>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-bold">Chi tiết đơn đặt sân</h2>
                  <Badge
                    variant="outline"
                    className={ORDER_STATUS_COLORS[order.status]}
                  >
                    {ORDER_STATUS_TEXTS[order.status]}
                  </Badge>
                </div>

                <Card className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <a
                      href={`/fields/${order.sportField.id}`}
                      className="hover:text-blue-500"
                    >
                      <CardTitle className="text-lg">
                        {order.sportField.name}
                      </CardTitle>
                    </a>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <div>
                        <MapPin className="h-5 w-5" />
                      </div>
                      {order.sportField.ward}, {order.sportField.district},{" "}
                      {order.sportField.province}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border">
                        <thead>
                          <tr>
                            <th className="border p-2">Ngày</th>
                            <th className="border p-2">Thời gian</th>
                            <th className="border p-2">Sân</th>
                            <th className="border p-2">Giá</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.bookings.map((slot, index) => (
                            <tr key={`slot-${index}`}>
                              <td className="border p-2 text-center">
                                {formatDate(slot.bookingDate)}
                              </td>
                              <td className="border p-2 text-center">
                                {slot.startTime} -{" "}
                                {TIME_SLOTS[getTimeIndex(slot.startTime) + 1]}
                              </td>
                              <td className="border p-2 text-center">
                                Sân {slot.fieldNo}
                              </td>
                              <td className="border p-2 text-center">
                                {formatPriceInVND(slot.price)}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td
                              className="border p-2 text-center font-bold"
                              colSpan={3}
                            >
                              Tổng tiền
                            </td>
                            <td className="border p-2 text-center">
                              {formatPriceInVND(
                                order.bookings.reduce(
                                  (acc, slot) => acc + slot.price,
                                  0
                                )
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-3">
                      <h3 className="text-lg font-semibold">Người đặt</h3>
                      <div className="sm:flex gap-10">
                        <div className="flex items-center gap-2 mt-2">
                          <User className="h-4 w-4" />
                          <span>{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Phone className="h-4 w-4" />
                          <span>{order.customerPhone}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {order.status === "CONFIRMED" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Đánh giá dịch vụ
                      </CardTitle>
                      <CardDescription>
                        Hãy chia sẻ trải nghiệm của bạn tại sân tập này
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Chất lượng sân</p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Button
                              key={star}
                              variant="ghost"
                              size="icon"
                              className={`h-10 w-10 ${
                                rating >= star
                                  ? "text-yellow-500"
                                  : "text-muted-foreground"
                              }`}
                              onClick={() => handleRatingClick(star)}
                            >
                              <Star
                                className="h-6 w-6"
                                fill={rating >= star ? "currentColor" : "none"}
                              />
                            </Button>
                          ))}
                          <span className="text-sm text-muted-foreground ml-2">
                            {rating > 0 ? `${rating}/5` : "Chưa đánh giá"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="comment"
                          className="text-sm font-medium"
                        >
                          Nhận xét của bạn
                        </label>
                        <Textarea
                          id="comment"
                          placeholder="Chia sẻ trải nghiệm của bạn tại sân bóng này..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="min-h-[120px]"
                        />
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                      <Button onClick={handleSubmitReview}>Gửi đánh giá</Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center">
          <Spinner />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default OrderDetailPage;
