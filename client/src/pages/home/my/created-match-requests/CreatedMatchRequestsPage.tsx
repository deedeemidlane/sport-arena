import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Plus, Inbox, BadgePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Footer, Navigation } from "../../ui";
import { CreatedRequestCard } from "./ui";
import { IMatchRequest } from "@/types/MatchRequest";
import { Spinner } from "@/components/common";
import useAcceptMatchRequest from "@/hooks/customer/useAcceptMatchRequest";
import {
  ConfirmAcceptRequestModal,
  ConfirmRejectRequestModal,
  ImageModal,
} from "./ui/modals";
import useConfirmDeposit from "@/hooks/customer/useConfirmDeposit";
import useGetCreatedMatchRequests from "@/hooks/customer/useGetCreatedMatchRequests";
import useRejectMatchRequest from "@/hooks/customer/useRejectMatchRequest";
import { REQUEST_STATUS_OPTIONS } from "@/constants/statuses";

export default function CreatedMatchRequestsPage() {
  const [matchRequests, setMatchRequests] = useState<IMatchRequest[]>([]);
  const { loading, getCreatedMatchRequests } = useGetCreatedMatchRequests();

  const [toggleReRender, setToggleReRender] = useState(false);

  useEffect(() => {
    const fetchMatchRequests = async () => {
      const fetchedMatchRequests: IMatchRequest[] =
        await getCreatedMatchRequests();
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
        JSON.stringify(selectedRequest.match[0]?.opponent.id)
      );
    }
    await acceptMatchRequest(formData);
    setOpenAcceptModal(false);
    setToggleReRender(!toggleReRender);
  };

  const { loading: rejectRequestLoading, rejectMatchRequest } =
    useRejectMatchRequest();

  const rejectRequest = async () => {
    const formData = new FormData();
    if (selectedRequest) {
      formData.append("matchRequestId", JSON.stringify(selectedRequest.id));
      formData.append(
        "opponentId",
        JSON.stringify(selectedRequest.match[0]?.opponent.id)
      );
    }
    await rejectMatchRequest(formData);
    setOpenRejectModal(false);
    setToggleReRender(!toggleReRender);
  };

  const [openImageModal, setOpenImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const { loading: confirmDepositLoading, confirmDeposit } =
    useConfirmDeposit();

  const handleConfirmDeposit = async (request: IMatchRequest) => {
    const formData = new FormData();
    if (request) {
      formData.append("matchRequestId", JSON.stringify(request.id));
      formData.append(
        "opponentId",
        JSON.stringify(request.match[0]?.opponent.id)
      );
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
                {Object.entries(REQUEST_STATUS_OPTIONS).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
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
                  Không tìm thấy yêu cầu ghép cặp nào.
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

        {selectedRequest && (
          <>
            <ConfirmAcceptRequestModal
              selectedRequest={selectedRequest}
              openAcceptModal={openAcceptModal}
              setOpenAcceptModal={setOpenAcceptModal}
              acceptRequestLoading={acceptRequestLoading}
              acceptRequest={acceptRequest}
            />

            <ConfirmRejectRequestModal
              selectedRequest={selectedRequest}
              openRejectModal={openRejectModal}
              setOpenRejectModal={setOpenRejectModal}
              rejectRequestLoading={rejectRequestLoading}
              rejectRequest={rejectRequest}
            />
          </>
        )}

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
