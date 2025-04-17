import { Header, Sidebar } from "@/components/common";
import { useAuthContext } from "@/context/AuthContext";
import { ScrollText, UserRoundX } from "lucide-react";
import { useEffect } from "react";
import { PiCourtBasketball } from "react-icons/pi";
import { Outlet, useNavigate } from "react-router";
import { LuNotebookPen } from "react-icons/lu";

const sidebarOptions = [
  {
    url: "/owner/fields",
    name: "Quản lý sân tập",
    icon: <PiCourtBasketball className="h-5 w-5" />,
  },
  {
    url: "/owner/orders",
    name: "Quản lý đơn đặt",
    icon: <ScrollText className="h-5 w-5" />,
  },
  {
    url: "/owner/canceling-requests",
    name: "Yêu cầu huỷ sân",
    icon: <UserRoundX className="h-5 w-5" />,
  },
  {
    url: "/owner/pre-bookings",
    name: "Quản lý sân đặt trước",
    icon: <LuNotebookPen className="h-5 w-5" />,
  },
];

export const OwnerPageLayout = () => {
  const { authUser } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (
      authUser === "unauthorized" ||
      (typeof authUser !== "string" && authUser.role !== "OWNER")
    ) {
      navigate("/login");
    }
  }, [authUser]);
  return (
    <div>
      {/* Sidebar */}
      <Sidebar options={sidebarOptions} />

      <div className="md:ml-64 h-auto flex flex-col">
        <Header options={sidebarOptions} />

        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 sm:pt-4 md:gap-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
