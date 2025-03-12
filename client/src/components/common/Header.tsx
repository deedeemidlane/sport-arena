import { NavLink } from "react-router";

import useLogout from "@/hooks/authentication/useLogout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";

import { CircleUser, Menu } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";

export const Header = ({
  options,
}: {
  options: {
    url: string;
    name: string;
    icon: React.ReactElement;
  }[];
}) => {
  const { authUser } = useAuthContext();

  const { logout } = useLogout();

  return (
    <header className="flex h-14 items-center justify-between md:justify-end gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      {/* Sidebar responsive */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="">
          <DialogTitle></DialogTitle>
          <SheetHeader>
            <a
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <img src="/logo.png" className="h-6 w-6" />
              <span className="">Trang quản lý</span>
            </a>
          </SheetHeader>
          <nav className="grid gap-2 px-2 text-sm font-medium lg:px-4">
            {options.map((option, index) => (
              <NavLink
                key={index}
                to={option.url}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center rounded-lg px-3 py-2 transition-all bg-muted text-primary cursor-default"
                    : "flex items-center rounded-lg px-3 py-2 transition-all hover:text-primary hover:bg-muted"
                }
              >
                {option.icon}
                <span className="ml-3">{option.name}</span>
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      {/* Avatar button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{authUser?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>Đăng xuất</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
