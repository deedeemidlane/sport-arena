import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, History } from "lucide-react";
import { Footer, Navigation } from "../ui";
import { OrderHistory, ProfileForm } from "./ui";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect } from "react";

export default function ProfilePage() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (
      authUser === "unauthorized" ||
      (typeof authUser !== "string" && authUser.role !== "CUSTOMER")
    ) {
      navigate("/login");
    }
  }, [authUser]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="container mx-auto sm:px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto bg-white rounded-xl sm:shadow-md sm:border border-gray-200 overflow-hidden">
          <div className="p-6">
            <Tabs
              defaultValue={searchParams.get("tab") || "profile"}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger
                  value="profile"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Thông tin cá nhân
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Lịch sử đặt sân
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                {typeof authUser !== "string" && (
                  <ProfileForm authUser={authUser} />
                )}
              </TabsContent>

              <TabsContent value="orders">
                <OrderHistory />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
