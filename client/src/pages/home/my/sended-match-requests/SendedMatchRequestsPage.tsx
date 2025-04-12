import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Inbox, Send, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Footer, Navigation } from "../../ui";
import { IMatchRequest } from "@/types/MatchRequest";
import { Spinner } from "@/components/common";
import useGetSendedMatchRequests from "@/hooks/customer/useGetSendedMatchRequests";
import { QrPaymentModal } from "./ui/modals";
import { SendedRequestCard } from "./ui";
import useDeposit from "@/hooks/customer/useDeposit";

export default function SendedMatchRequestsPage() {
  const [matchRequests, setMatchRequests] = useState<IMatchRequest[]>([]);
  const { loading, getSendedMatchRequests } = useGetSendedMatchRequests();

  const [toggleReRender, setToggleReRender] = useState(false);

  useEffect(() => {
    const fetchMatchRequests = async () => {
      const fetchedMatchRequests: IMatchRequest[] =
        await getSendedMatchRequests();
      setMatchRequests(fetchedMatchRequests);
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

  const [openQrPaymentModal, setOpenQrPaymentModal] = useState(false);
  const [selectedMatchRequest, setSelectedMatchRequest] =
    useState<IMatchRequest>();

  const [proofImage, setProofImage] = useState<File>();

  const filteredRequests =
    statusFilter === "ALL"
      ? matchRequests
      : matchRequests.filter((request) => request.status === statusFilter);

  const { loading: depositLoading, deposit } = useDeposit();

  const handleSubmit = async () => {
    const formData = new FormData();

    if (proofImage) {
      formData.append("image", proofImage);
    }
    formData.append("matchId", JSON.stringify(selectedMatchRequest?.match.id));

    await deposit(formData);
    setOpenQrPaymentModal(false);
    setToggleReRender(!toggleReRender);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <div className="container mx-auto py-8 px-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold mb-2">Yêu cầu ghép cặp đã gửi</h1>
            <Send className="w-8 h-8 max-sm:hidden" />
          </div>
          <div className="flex flex-row items-center gap-2 mt-4 md:mt-0">
            <Filter className="w-5 h-5 mt-1" />
            <h2 className="font-bold">Trạng thái:</h2>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
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
                  <SendedRequestCard
                    key={`request-${request.id}`}
                    request={request}
                    setSelectedRequest={setSelectedMatchRequest}
                    setOpenQrPaymentModal={setOpenQrPaymentModal}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {selectedMatchRequest && (
          <QrPaymentModal
            open={openQrPaymentModal}
            setOpen={setOpenQrPaymentModal}
            creator={selectedMatchRequest.user}
            price={selectedMatchRequest?.booking.price}
            proofImage={proofImage}
            setProofImage={setProofImage}
            loading={depositLoading}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
