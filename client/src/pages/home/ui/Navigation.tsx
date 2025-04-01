import {
  Menu,
  ChevronDown,
  User,
  LogOut,
  ExternalLink,
  LogIn,
  Bell,
  X,
  History,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useLogout from "@/hooks/authentication/useLogout";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { INotification } from "@/types/Notification";
import useGetNotifications from "@/hooks/customer/useGetNotifications";
import { Spinner } from "@/components/common";
import { useNavigate } from "react-router";
import useReadNotification from "@/hooks/customer/useReadNotification";

const sports = [
  {
    name: "Bóng đá",
    url: "/football",
    imageUrl: "/football.png",
  },
  {
    name: "Cầu lông",
    url: "/badminton",
    imageUrl: "/badminton.png",
  },
  {
    name: "Pickle Ball",
    url: "/pickleball",
    imageUrl: "/pickleball.png",
  },
];

export const Navigation = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthContext();

  const { logout } = useLogout();

  const [notifications, setNotifications] = useState<INotification[]>([]);

  const { loading, getNotifications } = useGetNotifications();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (typeof authUser !== "string" && authUser.role === "CUSTOMER") {
        const fetchedNotifications = await getNotifications();
        setNotifications(fetchedNotifications);
      }
    };

    fetchNotifications();
  }, [authUser]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { readNotification } = useReadNotification();

  const NotificationsList = () => (
    <>
      {notifications.length > 0 ? (
        <div className="py-2">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              className={`px-4 py-3 cursor-pointer text-left ${
                notification.isRead ? "hover:bg-accent" : "bg-accent"
              } rounded-lg mb-1`}
              onClick={async () => {
                await readNotification(notification.id);
                navigate(`/orders/${notification.orderId}`);
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{notification.title}</h4>
                    <div
                      className={`w-2 h-2 mt-1 rounded-full ${
                        notification.isRead ? "bg-transparent" : "bg-primary"
                      }`}
                    />
                  </div>
                  <p
                    className="text-sm text-muted-foreground mt-1"
                    dangerouslySetInnerHTML={{
                      __html: notification.message,
                    }}
                  ></p>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      {notification.createdAt}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-60">
          <p className="text-muted-foreground">Bạn không có thông báo nào.</p>
        </div>
      )}
    </>
  );

  // Mobile Notifications Sheet
  const MobileNotifications = () => (
    <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative md:hidden">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[100dvh] p-0">
        <DialogTitle></DialogTitle>
        <div className="flex items-center justify-between p-4 sticky top-0 bg-background z-10 border-b">
          <h2 className="font-semibold text-lg">Notifications</h2>
          <SheetClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </div>
        <ScrollArea className="h-[calc(100dvh-60px)]">
          {loading ? <Spinner /> : <NotificationsList />}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  // Desktop Notifications Dropdown
  const DesktopNotifications = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hidden md:flex">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-background">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold">Thông báo</h3>
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          <NotificationsList />
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="bg-white backdrop-blur-md border border-white shadow sticky top-0 w-full z-50 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="text-xl md:text-2xl font-heading font-bold text-primary">
            SportArena
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-10 items-center">
          {sports.map((sport) => (
            <a
              key={sport.name}
              href={sport.url}
              className="flex items-center gap-1 font-semibold text-base hover:border-b-2 hover:border-primary animate-in"
            >
              <img src={sport.imageUrl} alt="sport icon" className="w-4 h-4" />
              {sport.name}
            </a>
          ))}
        </div>

        {/* Desktop Avatar Dropdown */}
        <div className="hidden md:flex items-center">
          {typeof authUser !== "string" ? (
            <>
              {authUser.role === "CUSTOMER" ? (
                <>
                  {/* Notification Bell */}
                  <DesktopNotifications />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center gap-1">
                        <Avatar className="h-7 w-7 border-2 border-primary">
                          <AvatarImage src="/logo.png" />
                          <AvatarFallback>ID</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                          {authUser.name}
                        </span>
                        <ChevronDown className="h-5 w-5" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="p-0">
                        <a
                          href={"/profile"}
                          className="flex items-center gap-2 p-2 rounded-lg"
                        >
                          <User className="h-4 w-4" />
                          Thông tin cá nhân
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-0">
                        <a
                          href={"/profile?tab=orders"}
                          className="flex items-center gap-2 p-2 rounded-lg"
                        >
                          <History className="h-4 w-4" />
                          Lịch sử đặt sân
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-0">
                        <button
                          className="flex items-center cursor-pointer gap-2 p-2 text-red-600 hover:text-red-700 hover:bg-transparent"
                          onClick={logout}
                        >
                          <LogOut className="h-4 w-4" color="#e7000b" />
                          Đăng xuất
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <a href="/login">
                  <Button>
                    Trang quản lý
                    <ExternalLink />
                  </Button>
                </a>
              )}
            </>
          ) : (
            <a href="/login">
              <Button>
                <LogIn />
                Đăng nhập
              </Button>
            </a>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <MobileNotifications />

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4">
                {sports.map((sport) => (
                  <a
                    key={sport.name}
                    href={sport.url}
                    className="flex items-center gap-2 font-semibold text-base ml-4"
                  >
                    <img
                      src={sport.imageUrl}
                      alt="sport icon"
                      className="w-4 h-4"
                    />
                    {sport.name}
                  </a>
                ))}

                {/* Mobile Profile Options */}
                <div className="mt-4 pt-4 border-t">
                  {typeof authUser !== "string" ? (
                    <>
                      <a
                        href={"/profile"}
                        className="flex items-center gap-2 text-base ml-4 mb-4"
                      >
                        <User className="h-4 w-4" />
                        Thông tin cá nhân
                      </a>
                      <button
                        className="flex items-center gap-2 text-base ml-4 text-red-600 hover:text-red-700 hover:bg-transparent"
                        onClick={logout}
                      >
                        <LogOut className="h-4 w-4" color="#e7000b" />
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <a href="/login" className="ml-4">
                      <Button className="">
                        <LogIn />
                        Đăng nhập
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
