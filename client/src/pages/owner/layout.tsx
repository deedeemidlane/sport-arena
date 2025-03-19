import { Header, Sidebar } from "@/components/common";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { PiCourtBasketball } from "react-icons/pi";
import { Outlet, useNavigate } from "react-router";

const sidebarOptions = [
  {
    url: "/owner/fields",
    name: "Quản lý sân tập",
    icon: <PiCourtBasketball className="h-5 w-5" />,
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
    <div className="min-h-screen w-full md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <Sidebar options={sidebarOptions} />

      <div className="flex flex-col">
        <Header options={sidebarOptions} />

        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 sm:pt-4 md:gap-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
