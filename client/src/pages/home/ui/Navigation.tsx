import {
  Menu,
  ChevronDown,
  User,
  LogOut,
  ExternalLink,
  LogIn,
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
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useLogout from "@/hooks/authentication/useLogout";

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
  const { authUser } = useAuthContext();

  console.log(authUser);

  const { logout } = useLogout();

  return (
    <nav className="bg-white backdrop-blur-md border border-white shadow sticky top-0 w-full z-50 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="text-xl md:text-2xl font-heading font-bold text-primary">
            SportArena
          </span>
        </div>

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
          {authUser ? (
            <>
              {authUser.role === "CUSTOMER" ? (
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
                {authUser ? (
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
    </nav>
  );
};
