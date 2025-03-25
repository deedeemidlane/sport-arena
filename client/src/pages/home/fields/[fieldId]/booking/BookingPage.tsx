import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/common/DatePicker";
import { Footer, Navigation } from "@/pages/home/ui";
import { ArrowLeft, Calendar } from "lucide-react";
import { formatDate, formatPriceInVND } from "@/utils/helperFunctions";
import useGetFieldDetail from "@/hooks/guest/useGetFieldDetail";
import { defaultFieldValue, IField } from "@/types/Field";
import { Spinner } from "@/components/common";

// Generate time slots from 5:00 to 23:00
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 5; hour < 23; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

type BookingSlot = {
  date: string;
  fieldIndex: number;
  time: string;
  selected: boolean;
  booked: boolean;
};

export default function BookingPage() {
  const { fieldId } = useParams();

  const { loading, getFieldDetail } = useGetFieldDetail();

  const [field, setField] = useState<IField>(defaultFieldValue);

  useEffect(() => {
    const fetchField = async () => {
      const fetchedField = await getFieldDetail(fieldId || "");
      setField(fetchedField);
    };

    fetchField();
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>([]);

  console.log("bookingSlots: ", bookingSlots);

  const handleSlotToggle = (
    fieldIndex: number,
    time: string,
    isSelected: boolean
  ) => {
    const updatedBookingSlots = [...bookingSlots];
    if (isSelected) {
      const selectedSlotIndex = updatedBookingSlots.findIndex(
        (slot) =>
          slot.date === selectedDate.toLocaleDateString() &&
          slot.fieldIndex === fieldIndex &&
          slot.time === time
      );
      updatedBookingSlots.splice(selectedSlotIndex, 1);
    } else {
      updatedBookingSlots.push({
        date: selectedDate.toLocaleDateString(),
        time,
        fieldIndex,
        selected: true,
        booked: false,
      });
    }

    setBookingSlots(updatedBookingSlots);
  };

  const handleSubmitBooking = () => {
    console.log("further handling: ", bookingSlots);
  };

  const numOfSelectedSlots = bookingSlots.filter(
    (slot) => slot.selected
  ).length;

  const getTotalPrice = () => {
    return field ? numOfSelectedSlots * field.pricePerHour : 0;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {!loading ? (
        <>
          {field ? (
            <div className="flex-1 container mx-auto pb-6 pt-4 px-4">
              {/* Back button */}
              <div className="flex justify-between sm:block mb-4">
                <Link
                  to={`/fields/${fieldId}`}
                  className="inline-flex items-center sm:mb-4 text-primary hover:underline"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Link>

                <h1 className="text-xl font-heading font-bold mb-4">
                  {field.name}
                </h1>

                {/* Date selection and view toggle */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDate(new Date())}
                    className="hidden sm:block"
                  >
                    Hôm nay
                  </Button>
                  <DatePicker date={selectedDate} setDate={setSelectedDate} />
                </div>
              </div>

              {/* Booking table */}
              <div className="h-[70vh] overflow-auto border mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="">
                      <th className="border p-3 text-left w-20"></th>
                      <th className="border border-r-2 p-3 text-center w-30">
                        Sân
                      </th>
                      <th className="border p-3 text-center">
                        {formatDate(selectedDate.toString())}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((time) => (
                      <tr key={time}>
                        <td className="border p-3 text-center font-semibold text-gray-600">
                          {time}
                        </td>
                        <td className="p-0" colSpan={8}>
                          <table className="w-full border-collapse">
                            <tbody>
                              {Array.from(Array(field.numOfFields).keys()).map(
                                (fieldIndex) => {
                                  const slot = bookingSlots.find(
                                    (s) =>
                                      s.date ===
                                        selectedDate.toLocaleDateString() &&
                                      s.fieldIndex === fieldIndex &&
                                      s.time === time
                                  );
                                  const isBooked = slot?.booked || false;
                                  const isSelected = slot?.selected || false;

                                  return (
                                    <tr key={`${fieldIndex}-${time}`}>
                                      <td className="border border-l-0 w-30 p-3 text-center">
                                        Sân {fieldIndex + 1}
                                      </td>
                                      <td className="border text-center">
                                        <button
                                          className={`w-full p-3 cursor-pointer hover:bg-gray-100 ${
                                            isBooked
                                              ? "bg-gray-200 text-gray-500 hover:bg-gray-200 hover:text-gray-500"
                                              : isSelected
                                              ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                                              : ""
                                          }`}
                                          onClick={() =>
                                            handleSlotToggle(
                                              fieldIndex,
                                              time,
                                              isSelected
                                            )
                                          }
                                        >
                                          {formatPriceInVND(field.pricePerHour)}
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Booking summary */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
                <div>
                  <p className="text-gray-600">
                    Đã chọn {numOfSelectedSlots} lịch
                  </p>
                  <p className="text-lg font-medium">
                    Tổng tiền: {formatPriceInVND(getTotalPrice())}
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={handleSubmitBooking}
                  disabled={numOfSelectedSlots === 0}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Đặt sân
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 container mx-auto py-24 px-4 flex flex-col items-center justify-center">
              <h1 className="text-3xl font-heading font-bold mb-4">
                Không tìm thấy sân tập
              </h1>
              <p className="mb-6">
                Sân tập bạn đang tìm kiếm không tồn tại hoặc đã bị xoá.
              </p>
              <Link to="/">
                <Button className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Về trang chủ
                </Button>
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="w-full flex-1 flex justify-center items-center py-10">
          <Spinner />
        </div>
      )}

      <Footer />
    </div>
  );
}
