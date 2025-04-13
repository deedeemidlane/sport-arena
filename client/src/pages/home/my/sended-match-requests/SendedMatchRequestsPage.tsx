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
import { Spinner } from "@/components/common";
import useGetSendedMatchRequests from "@/hooks/customer/useGetSendedMatchRequests";
import { QrPaymentModal } from "./ui/modals";
import { SendedRequestCard } from "./ui";
import useDeposit from "@/hooks/customer/useDeposit";
import { REQUEST_STATUS_OPTIONS } from "@/constants/statuses";
import { IMatch } from "@/types/Match";

export default function SendedMatchRequestsPage() {
  const [requestedMatches, setRequestedMatches] = useState<IMatch[]>([]);
  const { loading, getSendedMatchRequests } = useGetSendedMatchRequests();

  const [toggleReRender, setToggleReRender] = useState(false);

  useEffect(() => {
    const fetchMatchRequests = async () => {
      const fetchedMatchRequests: IMatch[] = await getSendedMatchRequests();

      if (fetchedMatchRequests) {
        setRequestedMatches(fetchedMatchRequests);
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

  const [openQrPaymentModal, setOpenQrPaymentModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<IMatch>();

  const [proofImage, setProofImage] = useState<File>();

  const filteredMatchs =
    statusFilter === "ALL"
      ? requestedMatches
      : requestedMatches.filter((match) => match.status === statusFilter);

  const { loading: depositLoading, deposit } = useDeposit();

  const handleSubmit = async () => {
    const formData = new FormData();

    if (proofImage) {
      formData.append("image", proofImage);
    }
    if (selectedMatch) {
      formData.append("matchId", JSON.stringify(selectedMatch.opponentId));
    }

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
                {Object.entries(REQUEST_STATUS_OPTIONS).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
                <SelectItem value="REJECTED">Đã bị huỷ</SelectItem>
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
            {filteredMatchs.length === 0 ? (
              <div className="text-center py-12">
                <Inbox className="w-20 h-20 mx-auto text-gray-500" />
                <p className="text-xl text-gray-500">
                  Không tìm thấy yêu cầu ghép cặp nào.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatchs.map((match) => (
                  <SendedRequestCard
                    key={`request-${match.id}`}
                    requestedMatch={match}
                    setSelectedMatch={setSelectedMatch}
                    setOpenQrPaymentModal={setOpenQrPaymentModal}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {selectedMatch && (
          <QrPaymentModal
            open={openQrPaymentModal}
            setOpen={setOpenQrPaymentModal}
            creator={selectedMatch.matchRequest.user}
            price={selectedMatch.matchRequest.booking.price}
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
