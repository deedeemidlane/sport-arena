import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatDate, getFullImageUrl } from "@/utils/helperFunctions";
import useGetFields from "@/hooks/owner/useGetFields";
import { IField } from "@/types/Field";
import { MoreHorizontal, Plus } from "lucide-react";
import { Spinner } from "@/components/common";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OwnerFieldsPage() {
  const { loading, getFields } = useGetFields();

  const [fields, setFields] = useState<IField[]>([]);

  useEffect(() => {
    const fetchFields = async () => {
      const fetchedFields = await getFields();
      if (fetchedFields) setFields(fetchedFields);
    };

    fetchFields();
  }, []);

  const renderSportType = (
    sportType: "FOOTBALL" | "PICKLEBALL" | "BADMINTON"
  ) => {
    switch (sportType) {
      case "FOOTBALL":
        return <span className="text-rose-400 font-semibold">Bóng đá</span>;
      case "BADMINTON":
        return <span className="text-blue-600 font-semibold">Cầu lông</span>;
      case "PICKLEBALL":
        return (
          <span className="text-emerald-600 font-semibold">Pickleball</span>
        );
      default:
        break;
    }
    return <></>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách sân đấu</CardTitle>
        <CardDescription>Quản lý các sân đấu của bạn tại đây.</CardDescription>
        <a href="/owner/fields/create">
          <Button>
            <Plus />
            Thêm sân đấu mới
          </Button>
        </a>
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
                  <TableHead>Tên</TableHead>
                  <TableHead>Loại sân</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields &&
                  fields.length > 0 &&
                  fields.map((field, index) => (
                    <TableRow key={index} className="py-4">
                      <TableCell className="hidden sm:table-cell pl-4">
                        {field.imageUrl ? (
                          <img
                            alt="Sport field image"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={getFullImageUrl(field.imageUrl)}
                            width="64"
                          />
                        ) : (
                          <img
                            alt="Placeholder image"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src="/placeholder.svg"
                            width="64"
                          />
                        )}
                      </TableCell>
                      <TableCell>{field.name}</TableCell>
                      <TableCell>{renderSportType(field.sportType)}</TableCell>
                      <TableCell>
                        {field.address && `${field.address}, `}
                        {field.ward}, {field.district}, {field.province}
                      </TableCell>
                      <TableCell>{formatDate(field.createdAt)}</TableCell>
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
                            <DropdownMenuItem>
                              <a
                                href={`/owner/fields/${field.id}`}
                                className="w-full"
                              >
                                Chỉnh sửa
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Xóa</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                {(!fields || fields.length === 0) && (
                  <TableRow className="bg-white hover:bg-white">
                    <TableCell colSpan={8}>
                      <div className="py-20 flex flex-col w-full h-full items-center text-center">
                        <span className="text-gray-600 text-base font-semibold">
                          Không tìm thấy sân đấu 👀
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
