import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Menu, User } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { Header, Sidebar } from "@/components/common";

const sidebarOptions = [
  {
    url: "/admin",
    name: "Quản lý tài khoản",
    icon: <User className="h-4 w-4" />,
  },
  {
    url: "/admin/hello",
    name: "Hello world",
    icon: <Menu className="h-4 w-4" />,
  },
];

export default function AdminPage() {
  const { authUser } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (authUser?.role !== "ADMIN") {
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
          Some content
        </main>
      </div>
    </div>
  );
}
