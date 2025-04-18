import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Clock, DollarSign, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import useGetStatistics from "@/hooks/owner/useGetStatistics";
import { IField } from "@/types/Field";
import { Spinner } from "@/components/common";
import { formatPriceInVND } from "@/utils/helperFunctions";
import { TIME_SLOTS } from "@/constants/times";
import { DISPLAYED_SPORTS } from "@/constants/sports";
import { IUser } from "@/types/User";

const COLORS: Record<string, string> = {
  "Bóng đá": "#0088FE",
  Pickleball: "#00C49F",
  "Cầu lông": "#FFBB28",
};

export default function DashboardPage() {
  const { loading, getStatistics } = useGetStatistics();

  const [fields, setFields] = useState<IField[]>([]);

  useEffect(() => {
    const fetchFields = async () => {
      const fetchedFields = await getStatistics();
      if (fetchedFields) setFields(fetchedFields);
    };

    fetchFields();
  }, []);

  const [timeRange, setTimeRange] = useState("month");

  const totalConfirmedOrders = useMemo(() => {
    return fields.reduce((sum, field) => {
      const confirmedOrdersCount = field.orders.length;
      return sum + confirmedOrdersCount;
    }, 0);
  }, [fields]);

  const totalRevenue = useMemo(() => {
    let totalConfirmedPayments = 0;

    fields.forEach((field) => {
      field.orders.forEach((order) => {
        totalConfirmedPayments += order.payment.amount;
      });
    });
    return totalConfirmedPayments;
  }, [fields]);

  const hourlyBookings = useMemo(() => {
    // Initialize slot counts
    const slotCounts = TIME_SLOTS.map((time) => ({ time, count: 0 }));

    // Create a quick lookup map for easier updating
    const slotMap = new Map(slotCounts.map((slot) => [slot.time, slot]));

    // Traverse data and count bookings by startTime
    fields.forEach((field) => {
      field.orders.forEach((order) => {
        order.bookings.forEach((booking) => {
          const slot = slotMap.get(booking.startTime);
          if (slot) {
            slot.count += 1;
          }
        });
      });
    });

    return Array.from(slotMap.values());
  }, [fields]);

  const totalBookingTime = useMemo(() => {
    let confirmedBookingCount = 0;

    fields.forEach((field) => {
      field.orders.forEach((order) => {
        confirmedBookingCount += order.bookings.length;
      });
    });

    return confirmedBookingCount * 1.5;
  }, [fields]);

  const sportTypeData = useMemo(() => {
    // Map to track count of orders per sport type
    const sportTypeMap = new Map();

    fields.forEach((field) => {
      const sportName = field.sportType;
      const orderCount = field.orders.length;

      if (orderCount > 0) {
        if (sportTypeMap.has(sportName)) {
          sportTypeMap.set(sportName, sportTypeMap.get(sportName) + orderCount);
        } else {
          sportTypeMap.set(sportName, orderCount);
        }
      }
    });

    // Convert map to array format
    const sportTypeData: { name: string; value: number }[] = Array.from(
      sportTypeMap,
      ([name, countOrder]) => ({
        name: DISPLAYED_SPORTS[name],
        value: Number(((countOrder * 100) / totalConfirmedOrders).toFixed(0)),
      })
    );

    return sportTypeData;
  }, [fields]);

  const countRatingByScore = useMemo(() => {
    const ratingCount: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    fields.forEach((field) => {
      field.reviews.forEach((review) => {
        if (ratingCount[review.rating] !== undefined) {
          ratingCount[review.rating]++;
        }
      });
    });

    return ratingCount;
  }, [fields]);

  const numberOfReviews = useMemo(() => {
    let totalReviews = 0;

    fields.forEach((field) => {
      totalReviews += field.reviews.length;
    });

    return totalReviews;
  }, [fields]);

  const averageRating = useMemo(() => {
    let totalRating = 0;

    fields.forEach((field) => {
      field.reviews.forEach((review) => {
        totalRating += review.rating;
      });
    });

    const averageRating =
      numberOfReviews > 0 ? (totalRating / numberOfReviews).toFixed(1) : 0;

    return averageRating;
  }, [fields]);

  const top5Users: { user: IUser; count: number; paid: number }[] =
    useMemo(() => {
      // Flatten all orders from all sport fields
      const allOrders = fields.flatMap((field) => field.orders);

      // Create a map to count orders per user
      const userOrderCount = new Map();

      for (const order of allOrders) {
        const userId = order.userId;
        const userInfo = order.user;

        if (!userOrderCount.has(userId)) {
          userOrderCount.set(userId, {
            count: 1,
            paid: order.payment.amount,
            user: userInfo,
          });
        } else {
          userOrderCount.get(userId).count += 1;
          userOrderCount.get(userId).paid += order.payment.amount;
        }
      }

      // Convert map to array and sort by count descending
      const topUsers = Array.from(userOrderCount.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      console.log(topUsers);

      return topUsers;
    }, [fields]);

  const statCards = [
    {
      title: "Tổng số lượt đặt sân",
      value: totalConfirmedOrders,
      icon: <Users size={20} />,
    },
    {
      title: "Tổng doanh thu",
      value: formatPriceInVND(totalRevenue),
      icon: <DollarSign size={20} />,
    },
    {
      title: "Thời gian đặt sân trung bình",
      value: totalConfirmedOrders
        ? `${(totalBookingTime / totalConfirmedOrders).toFixed(1)} giờ`
        : "0 giờ",
      icon: <Clock size={20} />,
    },
  ];

  return (
    <>
      {!loading ? (
        <div className="container mx-auto p-4 flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-heading font-bold">Thống Kê Sân</h1>
              <p className="text-muted-foreground">
                Theo dõi hoạt động và doanh thu của sân thể thao
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn khung thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">7 Ngày Qua</SelectItem>
                  <SelectItem value="month">30 Ngày Qua</SelectItem>
                  <SelectItem value="quarter">3 Tháng Qua</SelectItem>
                  <SelectItem value="year">1 Năm Qua</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {statCards.map((card, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <div className="rounded-full p-2 bg-muted">{card.icon}</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="hourly" className="mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-2 gap-4 px-2 mb-2 w-full">
              <TabsTrigger value="hourly">Theo Giờ</TabsTrigger>
              <TabsTrigger value="sports">Theo môn thể thao</TabsTrigger>
            </TabsList>

            <TabsContent value="hourly" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Phân Bố Đặt Sân Theo Giờ</CardTitle>
                  <CardDescription>
                    Hiển thị các khoảng thời gian phổ biến nhất
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ChartContainer
                        config={{
                          count: { color: "#f97316" },
                        }}
                        className="aspect-auto h-[300px] w-full"
                      >
                        <BarChart
                          data={hourlyBookings}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar
                            dataKey="count"
                            fill="#f97316"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ChartContainer>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tỷ Lệ Đặt Sân Theo Môn Thể Thao</CardTitle>
                  <CardDescription>
                    Phân bố các môn thể thao được đặt sân nhiều nhất
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                      >
                        <Pie
                          data={sportTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {sportTypeData.map((sport, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[sport.name]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Đánh Giá Từ Người Dùng</CardTitle>
                <CardDescription>Số lượng đánh giá theo số sao</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center">
                      <span className="w-8 text-sm">{star} ★</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full"
                          style={{
                            width: `${
                              numberOfReviews > 0
                                ? (countRatingByScore[star] * 100) /
                                  numberOfReviews
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="w-12 text-right text-sm">
                        {numberOfReviews > 0
                          ? (
                              (countRatingByScore[star] * 100) /
                              numberOfReviews
                            ).toFixed(1)
                          : 0}
                        %
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <span className="text-3xl font-bold">{averageRating}</span>
                  <span className="text-sm text-muted-foreground"> trên 5</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Dựa trên {numberOfReviews} đánh giá
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Khách Hàng Thân Thiết</CardTitle>
                <CardDescription>
                  Top 5 khách hàng đặt sân nhiều nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {top5Users.map((customer, index) => (
                    <div key={index} className="flex items-start">
                      <div className="h-2 w-2 mt-2 rounded-full bg-primary mr-3">
                        <span className="sr-only">Ranking indicator</span>
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium leading-none">
                            {customer.user.name}
                          </p>
                          <span className="text-sm font-semibold text-primary">
                            #{index + 1}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {customer.count} đơn ·{" "}
                          {formatPriceInVND(customer.paid)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* <div className="mt-6 pt-6 border-t">
                  <Button variant="outline" className="w-full">
                    Xem chi tiết khách hàng
                  </Button>
                </div> */}
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Đặt Sân Gần Đây</CardTitle>
                <CardDescription>
                  Hoạt động đặt sân trong 24 giờ qua
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[1, 2, 3].map((booking) => (
                    <div key={booking} className="flex items-start">
                      <div className="h-2 w-2 mt-2 rounded-full bg-primary mr-3">
                        <span className="sr-only">Activity indicator</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {booking === 1
                            ? "Nguyễn Văn A đã đặt Sân 2"
                            : booking === 2
                            ? "Trần Thị B đã đặt Sân 1"
                            : "Phạm Văn C đã đặt Sân 3"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking === 1
                            ? "18:00 - 20:00"
                            : booking === 2
                            ? "14:00 - 15:30"
                            : "08:30 - 10:00"}
                          <span className="ml-2 text-xs">
                            {booking === 1
                              ? "15 phút trước"
                              : booking === 2
                              ? "2 giờ trước"
                              : "6 giờ trước"}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t">
                  <Button variant="outline" className="w-full">
                    Xem tất cả đơn đặt sân
                  </Button>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center my-10">
          <Spinner />
        </div>
      )}
    </>
  );
}
