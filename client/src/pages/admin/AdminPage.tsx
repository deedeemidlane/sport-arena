import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { MoreHorizontal, User } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { Header, Sidebar, Spinner } from "@/components/common";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/helperFunctions";
import useGetUsers from "@/hooks/admin/useGetUsers";
import { IUser } from "@/types/User";
import { Badge } from "@/components/ui/badge";

const sidebarOptions = [
  {
    url: "/admin",
    name: "Quản lý tài khoản",
    icon: <User className="h-4 w-4" />,
  },
];

export default function AdminPage() {
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

  const { loading, getUsers } = useGetUsers();

  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen w-full md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <Sidebar options={sidebarOptions} />

      <div className="flex flex-col">
        <Header options={sidebarOptions} />

        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 sm:pt-4 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách tài khoản</CardTitle>
              <CardDescription>
                Theo dõi các tài khoản đã đăng ký trên hệ thống.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="w-full flex justify-center">
                  <Spinner />
                </div>
              ) : (
                <Card className="py-0 rounded-md overflow-auto relative">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Họ tên</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Số điện thoại</TableHead>
                        <TableHead>Loại tài khoản</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Ngày tạo
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Trạng thái
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user, index) => (
                        <TableRow key={index} className="py-4">
                          <TableCell className="hidden sm:table-cell pl-4">
                            <img
                              alt="Ảnh đại diện User"
                              className="aspect-square rounded-md object-cover"
                              height="64"
                              src="/placeholder.svg"
                              width="64"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                          <TableCell>
                            {user.role === "CUSTOMER" ? (
                              <span className="text-blue-500 font-semibold">
                                Người chơi
                              </span>
                            ) : (
                              <span className="text-rose-500 font-semibold">
                                Chủ sân
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatDate(user.createdAt)}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {user.verified ? (
                              <Badge variant="active">Đã xác thực email</Badge>
                            ) : (
                              <Badge variant="destructive">Chưa xác thực</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                                <DropdownMenuItem>Xóa</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
