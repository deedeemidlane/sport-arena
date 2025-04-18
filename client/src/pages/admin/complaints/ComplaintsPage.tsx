import { Header, Sidebar, Spinner } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";
import useGetComplaints from "@/hooks/admin/useGetComplaints";
import { IComplaint } from "@/types/Complaint";
import { formatDate } from "@/utils/helperFunctions";
import { MessageSquare, Image, User, MailWarning } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ImageModal } from "../ui";

const sidebarOptions = [
  {
    url: "/admin/users",
    name: "Quản lý tài khoản",
    icon: <User className="h-4 w-4" />,
  },
  {
    url: "/admin/complaints",
    name: "Quản lý khiếu nại",
    icon: <MailWarning className="h-4 w-4" />,
  },
];

export default function ComplaintsPage() {
  const { authUser } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (
      authUser === "unauthorized" ||
      (typeof authUser !== "string" && authUser.role !== "ADMIN")
    ) {
      navigate("/login");
    }
  }, [authUser]);

  const [complaints, setComplaints] = useState<IComplaint[]>([]);

  const { loading, getComplaints } = useGetComplaints();

  useEffect(() => {
    const fetchComplaints = async () => {
      const fetchedComplaints = await getComplaints();
      if (fetchedComplaints) setComplaints(fetchedComplaints);
    };

    fetchComplaints();
  }, []);

  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<IComplaint>();

  return (
    <div>
      {/* Sidebar */}
      <Sidebar options={sidebarOptions} />

      <div className="md:ml-64 h-auto flex flex-col">
        <Header options={sidebarOptions} />

        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 sm:pt-4 md:gap-8">
          <div className="">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Quản Lý Phản Hồi
            </h1>

            {loading ? (
              <Spinner />
            ) : (
              <div className="grid md:grid-cols-2 gap-4 xl:gap-8">
                {complaints.map((complaint) => (
                  <Card
                    key={complaint.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">
                            {complaint.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Từ: {complaint.user.name} ·{" "}
                            {formatDate(complaint.createdAt)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">{complaint.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {complaint.imageUrl && (
                            <Button
                              variant={"blue"}
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                setOpenImageModal(true);
                              }}
                            >
                              <Image /> Xem ảnh đính kèm
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {selectedComplaint && (
              <ImageModal
                isOpen={openImageModal}
                closeModal={() => setOpenImageModal(false)}
                imageUrl={selectedComplaint.imageUrl}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
