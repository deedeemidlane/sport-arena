import { PiCourtBasketball } from "react-icons/pi";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Menu } from "lucide-react";
import { Header, Sidebar } from "@/components/common";

const sidebarOptions = [
  {
    url: "/owner",
    name: "Quản lý sân tập",
    icon: <PiCourtBasketball className="h-5 w-5" />,
  },
  {
    url: "/admin/hello",
    name: "Hello world",
    icon: <Menu className="h-5 w-5" />,
  },
];

export default function OwnerPage() {
  const { authUser } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (authUser?.role !== "OWNER") {
      navigate("/login");
    }
  }, [authUser]);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <Sidebar options={sidebarOptions} />

      <div className="flex flex-col">
        <Header options={sidebarOptions} />

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 sm:pt-4 md:gap-8">
          Owner page
        </main>
      </div>
    </div>
  );
}
