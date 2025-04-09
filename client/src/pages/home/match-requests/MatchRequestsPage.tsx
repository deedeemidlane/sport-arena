import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  Clock,
  Phone,
  Activity,
  CheckCircle,
  XCircle,
  Circle,
  Plus,
  Handshake,
  Inbox,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Footer, Navigation } from "../ui";
import { Button } from "@/components/ui/button";
import useGetOtherMatchRequests from "@/hooks/customer/useGetOtherMatchRequests";
import { useEffect, useState } from "react";
import { IMatchRequest } from "@/types/MatchRequest";
import { Spinner } from "@/components/common";
import { SPORT_DISPLAYED_VALUES } from "@/constants/sports";
import { formatDate, formatHour } from "@/utils/helperFunctions";

// Types
type DesireLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
type RequestStatus = "OPEN" | "MATCHED" | "CLOSED";

// Helper function to render status badges with appropriate colors and icons
const StatusBadge = ({ status }: { status: RequestStatus }) => {
  switch (status) {
    case "OPEN":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-600 border-blue-200"
        >
          <Circle className="w-3 h-3 mr-1 fill-blue-600 stroke-blue-600" /> Open
        </Badge>
      );
    case "MATCHED":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-600 border-green-200"
        >
          <CheckCircle className="w-3 h-3 mr-1 stroke-green-600" /> Matched
        </Badge>
      );
    case "CLOSED":
      return (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-600 border-gray-200"
        >
          <XCircle className="w-3 h-3 mr-1 stroke-gray-600" /> Closed
        </Badge>
      );
    default:
      return null;
  }
};

// Helper function to render level badges with appropriate colors
const LevelBadge = ({ level }: { level: DesireLevel }) => {
  switch (level) {
    case "BEGINNER":
      return <Badge className="bg-emerald-500">Beginner</Badge>;
    case "INTERMEDIATE":
      return <Badge className="bg-amber-500">Intermediate</Badge>;
    case "ADVANCED":
      return <Badge className="bg-red-500">Advanced</Badge>;
    default:
      return null;
  }
};

export default function MatchRequestsPage() {
  const [matchRequests, setMatchRequests] = useState<IMatchRequest[]>();
  const { getOtherMatchRequests } = useGetOtherMatchRequests();

  useEffect(() => {
    const fetchMatchRequests = async () => {
      const fetchedMatchRequests = await getOtherMatchRequests();
      setMatchRequests(fetchedMatchRequests);
    };

    fetchMatchRequests();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 pb-8 pt-4 flex-1">
        <Breadcrumb>
          <BreadcrumbList className="text-md">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Danh sách yêu cầu ghép cặp</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Yêu cầu ghép cặp đấu</h1>
            <p className="text-muted-foreground">
              Tìm đối thủ phủ hợp với đội của bạn
            </p>
          </div>

          <a href="/match-requests/create" className="max-md:mt-4">
            <Button variant="blue">
              <Plus className="mt-0.5" /> Tạo yêu cầu ghép cặp đấu
            </Button>
          </a>
        </div>

        {matchRequests ? (
          <>
            {matchRequests.length === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center py-12">
                <Inbox className="w-20 h-20" />
                <p className="text-xl">Không tìm thấy yêu cầu ghép cặp nào.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchRequests.map((request) => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={request.user.avatarUrl}
                              alt={request.user.name}
                            />
                            <AvatarFallback>
                              {request.user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">
                              {request.user.name}
                            </CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Phone className="w-3 h-3 mr-1" />
                              {request.user.phone}
                            </CardDescription>
                          </div>
                        </div>
                        <StatusBadge status={request.status} />
                      </div>
                    </CardHeader>

                    <CardContent className="pb-0">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {request.booking.order.sportField.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {request.booking.order.sportField.address}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-muted-foreground" />
                          <div className="font-medium">
                            {
                              SPORT_DISPLAYED_VALUES[
                                request.booking.order.sportField.sportType
                              ]
                            }
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div className="font-medium">
                            {formatDate(request.booking.bookingDate)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div className="font-medium">
                            {formatHour(request.booking.startTime)} -{" "}
                            {formatHour(request.booking.startTime + 1)}
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between items-center pt-4 mt-4 border-t">
                      <LevelBadge level={request.desiredLevel} />
                      <Button>
                        <Handshake /> Bắt cặp
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full flex justify-center my-10">
            <Spinner />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
