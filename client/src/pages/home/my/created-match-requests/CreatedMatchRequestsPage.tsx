import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Plus, Inbox, BadgePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Footer, Navigation } from "../../ui";
import { CreatedRequestCard } from "./ui";
import { IMatchRequest } from "@/types/MatchRequest";
import { Spinner } from "@/components/common";
import { DISPLAYED_SPORTS } from "@/constants/sports";
import { DISPLAYED_LEVELS } from "@/constants/levels";
import { formatDate, formatHour } from "@/utils/helperFunctions";
import useGetMyMatchRequests from "@/hooks/customer/useGetMyMatchRequests";
import useAcceptMatchRequest from "@/hooks/customer/useAcceptMatchRequest";
import { ImageModal } from "./ui/modals";
import useConfirmDeposit from "@/hooks/customer/useConfirmDeposit";

export default function CreatedMatchRequestsPage() {
  const [matchRequests, setMatchRequests] = useState<IMatchRequest[]>([]);
  const { loading, getMyMatchRequests } = useGetMyMatchRequests();

  const [toggleReRender, setToggleReRender] = useState(false);

  useEffect(() => {
    const fetchMatchRequests = async () => {
      const fetchedMatchRequests: IMatchRequest[] = await getMyMatchRequests();
      if (fetchedMatchRequests) {
        setMatchRequests(fetchedMatchRequests);
      }
    };
    fetchMatchRequests();
  }, [toggleReRender]);

  const [searchParams, setSearchParams] = useSearchParams();

  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") || "ALL"
  );

  useEffect(() => {
    setSearchParams({ status: statusFilter });
  }, [statusFilter]);

  useEffect(() => {
    setStatusFilter(searchParams.get("status") || "ALL");
  }, [searchParams.get("status")]);

  const filteredRequests =
    statusFilter === "ALL"
      ? matchRequests
      : matchRequests.filter((request) => request.status === statusFilter);

  const [selectedRequest, setSelectedRequest] = useState<IMatchRequest>();
  const [openAcceptModal, setOpenAcceptModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);

  const { loading: acceptRequestLoading, acceptMatchRequest } =
    useAcceptMatchRequest();

  const acceptRequest = async () => {
    const formData = new FormData();
    if (selectedRequest) {
      formData.append("matchRequestId", JSON.stringify(selectedRequest.id));
      formData.append(
        "opponentId",
        JSON.stringify(selectedRequest.match.opponent.id)
      );
    }
    await acceptMatchRequest(formData);
    setOpenAcceptModal(false);
    setToggleReRender(!toggleReRender);
  };

  const rejectRequest = () => {
    setOpenRejectModal(false);
  };

  const [openImageModal, setOpenImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const { loading: confirmDepositLoading, confirmDeposit } =
    useConfirmDeposit();

  const handleConfirmDeposit = async (request: IMatchRequest) => {
    const formData = new FormData();
    if (request) {
      formData.append("matchRequestId", JSON.stringify(request.id));
      formData.append("opponentId", JSON.stringify(request.match.opponent.id));
    }
    await confirmDeposit(formData);
    setToggleReRender(!toggleReRender);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <div className="container mx-auto py-8 px-4 flex-1">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between items-start mb-10">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold mb-2">Yêu cầu ghép cặp đã tạo</h1>
            <BadgePlus className="w-8 h-8 max-sm:hidden" />
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-4 lg:mt-0">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                <SelectItem value="OPEN">Đang mở</SelectItem>
                <SelectItem value="PROCESSING_REQUEST">Chờ duyệt</SelectItem>
                <SelectItem value="PROCESSING_PAYMENT">
                  Chờ thanh toán
                </SelectItem>
                <SelectItem value="MATCHED">Đã ghép</SelectItem>
                <SelectItem value="CLOSED">Đã đóng</SelectItem>
              </SelectContent>
            </Select>
            <Link to="/match-requests/create">
              <Button>
                <Plus className="h-4 w-4" />
                Tạo yêu cầu ghép cặp
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="w-full flex justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <Inbox className="w-20 h-20 mx-auto text-gray-500" />
                <p className="text-xl text-gray-500">
                  Không có yêu cầu ghép cặp nào.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((request) => (
                  <CreatedRequestCard
                    key={`request-${request.id}`}
                    request={request}
                    setSelectedRequest={setSelectedRequest}
                    setOpenAcceptModal={setOpenAcceptModal}
                    setOpenRejectModal={setOpenRejectModal}
                    setImageUrl={setImageUrl}
                    setOpenImageModal={setOpenImageModal}
                    confirmDepositLoading={confirmDepositLoading}
                    handleConfirmDeposit={handleConfirmDeposit}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <Dialog open={openAcceptModal} onOpenChange={setOpenAcceptModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận ghép cặp</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn chấp nhận yêu cầu ghép cặp này không?
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && selectedRequest.match.opponent && (
              <div className="my-4">
                <p className="font-medium text-lg mb-2">Thông tin đối thủ</p>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={selectedRequest.match.opponent.avatarUrl}
                    />
                    <AvatarFallback>
                      {selectedRequest.match.opponent.name
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {selectedRequest.match.opponent.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedRequest.match.opponent.phone}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p>
                    <strong>Môn thể thao:</strong>{" "}
                    {
                      DISPLAYED_SPORTS[
                        selectedRequest.booking.order.sportField.sportType
                      ]
                    }
                  </p>
                  <p>
                    <strong>Trình độ:</strong>{" "}
                    {DISPLAYED_LEVELS[selectedRequest.desiredLevel]}
                  </p>
                  <p>
                    <strong>Sân đấu:</strong>{" "}
                    {selectedRequest.booking.order.sportField.name}
                  </p>
                  <p>
                    <strong>Thời gian:</strong>{" "}
                    {formatHour(selectedRequest.booking.startTime)}
                    {" ngày "}
                    {formatDate(selectedRequest.booking.bookingDate)}
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              {acceptRequestLoading ? (
                <Button variant="outline" className="w-full" disabled>
                  <Spinner />
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setOpenAcceptModal(false)}
                  >
                    Huỷ
                  </Button>
                  <Button onClick={acceptRequest}>Xác nhận</Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openRejectModal} onOpenChange={setOpenRejectModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận huỷ</DialogTitle>
              <DialogDescription>
                {/* Bạn có chắc chắn muốn huỷ yêu cầu ghép cặp từ đối thủ này không? */}
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && selectedRequest.match.opponent && (
              <div className="mt-4">
                <p className="mb-2 text-center">
                  Bạn có chắc chắn muốn huỷ yêu cầu ghép cặp từ đối thủ này
                  không?
                </p>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={selectedRequest.match.opponent.avatarUrl}
                    />
                    <AvatarFallback>
                      {selectedRequest.match.opponent.name
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {selectedRequest.match.opponent.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedRequest.match.opponent.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpenRejectModal(false)}
              >
                Huỷ
              </Button>
              <Button onClick={rejectRequest}>Xác nhận</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ImageModal
          isOpen={openImageModal}
          closeModal={() => setOpenImageModal(false)}
          imageUrl={imageUrl}
        />
      </div>
      <Footer />
    </div>
  );
}
