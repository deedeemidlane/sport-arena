import { Fragment, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/common/DatePicker";
import { ArrowLeft, Calendar } from "lucide-react";
import { formatHour, formatPriceInVND } from "@/utils/helperFunctions";
import { defaultFieldValue, IField } from "@/types/Field";
import useGetFieldDetail from "@/hooks/owner/useGetFieldDetail";
import { Spinner } from "@/components/common";
import usePreBook from "@/hooks/owner/usePreBook";
import { getTimeIndex, TIME_SLOTS } from "@/constants/times";

export interface IBookingSlot {
  date: string;
  fieldIndex: number;
  time: string;
  price: number;
  selected: boolean;
  booked: boolean;
}

export default function FieldPreBookingsPage() {
  const { fieldId } = useParams();

  const { loading, getFieldDetail } = useGetFieldDetail();

  const [field, setField] = useState<IField>(defaultFieldValue);

  useEffect(() => {
    const fetchField = async () => {
      const fetchedField = await getFieldDetail(fieldId || "");
      if (fetchedField) setField(fetchedField);
    };

    fetchField();
  }, []);

  const [bookingSlots, setBookingSlots] = useState<IBookingSlot[]>([]);

  useEffect(() => {
    const mergedBookingSlots: IBookingSlot[] = [];
    field.orders.forEach((order) => {
      if (order.status !== "CANCELED" && order.status !== "FINISHED") {
        order.bookings.forEach((bookingSlot) => {
          mergedBookingSlots.push({
            date: bookingSlot.bookingDate,
            fieldIndex: bookingSlot.fieldNo,
            time: bookingSlot.startTime,
            price: bookingSlot.price,
            selected: false,
            booked: true,
          });
        });
      }
    });
    setBookingSlots(mergedBookingSlots);
  }, [field]);

  const numOfSelectedSlots = bookingSlots.filter(
    (slot) => slot.selected
  ).length;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const currentHour = useMemo(() => {
    if (selectedDate.toLocaleDateString() === new Date().toLocaleDateString()) {
      return new Date().getHours();
    }
    return 0;
  }, [selectedDate]);

  const handleSlotToggle = (
    fieldIndex: number,
    time: string,
    isSelected: boolean,
    price: number
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
        price: price,
        selected: true,
        booked: false,
      });
    }

    setBookingSlots(updatedBookingSlots);
  };

  const { loading: preBookLoading, preBook } = usePreBook();

  const handleSubmitBooking = () => {
    const formData = new FormData();

    formData.append("fieldId", JSON.stringify(fieldId));
    formData.append(
      "bookingSlots",
      JSON.stringify(bookingSlots.filter((slot) => slot.selected))
    );

    console.log(formData.get("bookingSlots"));
    console.log(formData.get("fieldId"));

    preBook(formData);
  };

  return (
    <>
      {loading ? (
        <div className="w-full flex items-center justify-center my-20">
          <Spinner />
        </div>
      ) : (
        <div className="flex-1 container mx-auto pb-6">
          {/* Back button */}
          <div className="mb-4">
            <Link
              to={"/owner/pre-bookings"}
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
          <div className="max-h-[60vh] overflow-auto border mb-4">
            <table className="w-full border-collapse border-2">
              <thead>
                <tr>
                  <th className="p-3 text-left w-20 outline-2 -outline-offset-1 outline-gray-400 sticky top-0 left-0 bg-gray-300 z-10"></th>
                  {Array.from(
                    { length: field.numOfFields },
                    (_, i) => i + 1
                  ).map((fieldIndex) => (
                    <th
                      key={`fieldNo-${fieldIndex}`}
                      className=" outline-2 -outline-offset-1 outline-gray-400 p-3.5 text-center sticky top-0 bg-white"
                    >
                      Sân {fieldIndex}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {field.fieldTimes.map((fieldTime) => (
                  <Fragment key={`fieldTime-${fieldTime.id}`}>
                    {TIME_SLOTS.slice(
                      TIME_SLOTS.indexOf(fieldTime.startTime),
                      TIME_SLOTS.indexOf(fieldTime.endTime)
                    )
                      .filter((time) => time > formatHour(currentHour))
                      .map((time) => (
                        <tr key={time}>
                          <td className="outline-2 -outline-offset-1 bg-white p-3 border-none text-center font-bold sticky left-0 sm:whitespace-nowrap max-sm:w-16">
                            {time} - {TIME_SLOTS[getTimeIndex(time) + 1]}
                          </td>
                          {Array.from(
                            { length: field.numOfFields },
                            (_, i) => i + 1
                          ).map((fieldIndex) => {
                            const slot = bookingSlots.find(
                              (s) =>
                                s.date === selectedDate.toLocaleDateString() &&
                                s.fieldIndex === fieldIndex &&
                                s.time === time
                            );
                            const isBooked = slot?.booked || false;
                            const isSelected = slot?.selected || false;

                            return (
                              <td
                                key={`${fieldIndex}-${time}`}
                                className="text-center border-2"
                              >
                                <button
                                  className={`w-full p-3.5 max-sm:py-9 hover:bg-gray-100 text-sm ${
                                    isBooked
                                      ? "bg-gray-200 text-gray-500 hover:bg-gray-200 hover:text-gray-500 cursor-not-allowed"
                                      : isSelected
                                      ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800 cursor-pointer"
                                      : "cursor-pointer"
                                  }`}
                                  disabled={isBooked}
                                  onClick={() =>
                                    handleSlotToggle(
                                      fieldIndex,
                                      time,
                                      isSelected,
                                      fieldTime.pricePerSlot
                                    )
                                  }
                                >
                                  {formatPriceInVND(fieldTime.pricePerSlot)}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Booking summary */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-bold">Đã chọn {numOfSelectedSlots} lịch</p>
            </div>

            <Button
              size="lg"
              onClick={handleSubmitBooking}
              disabled={numOfSelectedSlots === 0 || preBookLoading}
            >
              {preBookLoading ? (
                <Spinner />
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Giữ chỗ
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
