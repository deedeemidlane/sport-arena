import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Calendar,
  Clock,
  Phone,
  Activity,
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
import { DISPLAYED_SPORTS } from "@/constants/sports";
import { formatDate, formatHour } from "@/utils/helperFunctions";
import useRequestMatch from "@/hooks/customer/useRequestMatch";
import { SearchField } from "./ui";
import { LevelBadge, StatusBadge } from "../utils/HelperComponents";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useAuthContext } from "@/context/AuthContext";
import { RequestConfirmationModal } from "./ui/modals/RequestConfirmationModal";

export default function MatchRequestsPage() {
  const navigate = useNavigate();

  // Check authentication
  const { authUser } = useAuthContext();
  useEffect(() => {
    if (
      authUser === "unauthorized" ||
      (typeof authUser !== "string" && authUser.role !== "CUSTOMER")
    ) {
      navigate("/login");
    }
  }, [authUser]);

  // Get search params
  const [searchParams] = useSearchParams();

  // Fetch match requests using search params
  const { loading: getMatchRequestsLoading, getOtherMatchRequests } =
    useGetOtherMatchRequests();
  const [matchRequests, setMatchRequests] = useState<IMatchRequest[]>([]);
  const pathname = useLocation();
  useEffect(() => {
    const fetchMatchRequests = async () => {
      const fetchedMatchRequests = await getOtherMatchRequests(pathname.search);
      setMatchRequests(fetchedMatchRequests);
    };

    fetchMatchRequests();
  }, [pathname]);

  const [selectedMatchRequest, setSelectedMatchRequest] =
    useState<IMatchRequest>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { loading, requestMatch } = useRequestMatch();

  const handleRequestMatch = () => {
    const formData = new FormData();

    // if (proofImage) {
    //   formData.append("image", proofImage);
    // }
    formData.append("matchRequestId", JSON.stringify(selectedMatchRequest?.id));

    requestMatch(formData);

    // setIsModalOpen(false);
  };

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-4">
          <h1 className="text-3xl font-bold mb-2">Yêu cầu ghép cặp đấu</h1>

          <a href="/match-requests/create" className="max-md:mt-4">
            <Button variant="blue">
              <Plus className="mt-0.5" /> Tạo yêu cầu ghép cặp đấu
            </Button>
          </a>
        </div>

        <SearchField
          sportType={searchParams.get("sportType") || undefined}
          province={searchParams.get("province") || undefined}
          district={searchParams.get("district") || undefined}
          level={searchParams.get("level") || undefined}
          gender={searchParams.get("gender") || undefined}
        />

        {!getMatchRequestsLoading ? (
          <>
            {matchRequests.length === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center py-12">
                <Inbox className="w-20 h-20" />
                <p className="text-xl">Không tìm thấy yêu cầu ghép cặp nào.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchRequests.map((request) => {
                  const sportField = request.booking.order.sportField;
                  return (
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
                                {sportField.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {sportField.address &&
                                  `${sportField.address}, `}
                                {sportField.ward}, {sportField.district},{" "}
                                {sportField.province}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-muted-foreground" />
                            <div className="font-medium">
                              {DISPLAYED_SPORTS[sportField.sportType]}
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
                        <Button
                          onClick={() => {
                            setSelectedMatchRequest(request);
                            setIsModalOpen(true);
                          }}
                        >
                          <Handshake /> Bắt cặp
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="w-full flex justify-center my-10">
            <Spinner />
          </div>
        )}

        {selectedMatchRequest && (
          <RequestConfirmationModal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            request={selectedMatchRequest}
            loading={loading}
            handleRequestMatch={handleRequestMatch}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
