import { useEffect } from "react";
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
          {/* <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Danh sách nhân viên</CardTitle>
              <CardDescription>
                Quản lý tài khoản nhân viên tại đây.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getStaffsLoading ? (
                <div className="w-full text-center">
                  <Spinner />
                </div>
              ) : (
                <>
                  <Card>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center w-[50px] hidden sm:table-cell">
                            STT
                          </TableHead>
                          <TableHead>Tên nhân viên</TableHead>
                          <TableHead>Tên đăng nhập</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Ngày tạo
                          </TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {staffs.map((staff, index) => (
                          <TableRow key={staff.id}>
                            <TableCell className="hidden sm:table-cell text-center">
                              {index + 1}
                            </TableCell>
                            <TableCell className="font-medium">
                              {staff.name}
                            </TableCell>
                            <TableCell>{staff.username}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatDate(staff.createdAt)}
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
                </>
              )}
            </CardContent>
          </Card> */}
        </main>
      </div>
    </div>
  );
}
