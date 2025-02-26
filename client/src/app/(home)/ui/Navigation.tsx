"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown, User, LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";

const Navigation = () => {
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

  return (
    <nav className="glass-effect shadow sticky top-0 w-full z-50 py-4">
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
            <Link
              key={sport.name}
              href={sport.url}
              className="flex items-center gap-1 font-semibold text-base hover:border-b-2 hover:border-primary animate-in"
            >
              <img src={sport.imageUrl} alt="sport icon" className="w-4 h-4" />
              {sport.name}
            </Link>
          ))}
        </div>

        {/* Desktop Avatar Dropdown */}
        <div className="hidden md:flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center gap-1">
                <Avatar className="h-7 w-7 border-2 border-primary">
                  <AvatarImage src="/logo.png" />
                  <AvatarFallback>ID</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-5 w-5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="p-0">
                <Link
                  href={"/profile"}
                  className="flex items-center gap-2 p-2 rounded-lg"
                >
                  <User className="h-4 w-4" />
                  Thông tin cá nhân
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link
                  href={"/logout"}
                  className="flex items-center gap-2 text-red-600 p-2 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            <div className="mt-8 flex flex-col gap-4">
              {sports.map((sport) => (
                <Link
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
                </Link>
              ))}

              {/* Mobile Profile Options */}
              <div className="mt-4 pt-4 border-t">
                <Link
                  href={"/profile"}
                  className="flex items-center gap-2 text-base ml-4 mb-4"
                >
                  <User className="h-4 w-4" />
                  Thông tin cá nhân
                </Link>
                <Link
                  href={"/logout"}
                  className="flex items-center gap-2 text-base ml-4 text-red-600 hover:text-red-700 hover:bg-transparent"
                  onClick={() => {}}
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navigation;
