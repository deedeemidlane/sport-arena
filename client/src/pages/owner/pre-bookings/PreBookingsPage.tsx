import { useEffect, useState } from "react";
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
import { getFullImageUrl } from "@/utils/helperFunctions";
import useGetFields from "@/hooks/owner/useGetFields";
import { IField } from "@/types/Field";
import { ExternalLink } from "lucide-react";
import { Spinner } from "@/components/common";
import { useNavigate } from "react-router";

export default function PreBookingsPage() {
  const navigate = useNavigate();
  const { loading, getFields } = useGetFields();

  const [fields, setFields] = useState<IField[]>([]);

  useEffect(() => {
    const fetchFields = async () => {
      const fetchedFields = await getFields();
      setFields(fetchedFields);
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
        <CardTitle className="text-2xl font-bold">Chọn sân tập</CardTitle>
        <CardDescription className="text-base">
          Nhấn vào sân tập để đặt lịch
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
                  <TableHead>Tên</TableHead>
                  <TableHead>Loại sân</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields &&
                  fields.length > 0 &&
                  fields.map((field, index) => (
                    <TableRow
                      key={index}
                      className="py-2 cursor-pointer"
                      onClick={() => {
                        navigate(`/owner/pre-bookings/${field.id}`);
                      }}
                    >
                      <TableCell className="hidden sm:table-cell pl-4">
                        {field.imageUrl ? (
                          <img
                            alt="Ảnh minh họa món"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={getFullImageUrl(field.imageUrl)}
                            width="64"
                          />
                        ) : (
                          <img
                            alt="Ảnh đại diện User"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src="/placeholder.svg"
                            width="64"
                          />
                        )}
                      </TableCell>
                      <TableCell>{field.name}</TableCell>
                      <TableCell>{renderSportType(field.sportType)}</TableCell>
                      <TableCell>{field.address}</TableCell>
                      <TableCell>
                        <ExternalLink />
                      </TableCell>
                    </TableRow>
                  ))}
                {(!fields || fields.length === 0) && (
                  <TableRow className="bg-white hover:bg-white">
                    <TableCell colSpan={8}>
                      <div className="py-20 flex flex-col w-full h-full items-center text-center">
                        <span className="text-gray-600 text-base font-semibold">
                          Không tìm thấy sân tập 👀
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
