import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Footer, Navigation } from "@/pages/home/ui";
import { ArrowLeft } from "lucide-react";
import useGetFieldDetail from "@/hooks/guest/useGetFieldDetail";
import { defaultFieldValue, IField } from "@/types/Field";
import { Spinner } from "@/components/common";
import { useAuthContext } from "@/context/AuthContext";
import { BookingTable, CustomerInfo, QrPayment } from "./ui";
import usePlaceOrder from "@/hooks/customer/usePlaceOrder";
import { AfterPayment } from "./ui/AfterPayment";

export interface IBookingSlot {
  date: string;
  fieldIndex: number;
  time: string;
  price: number;
  selected: boolean;
  booked: boolean;
}

export interface ICustomerInfo {
  name: string;
  phone: string;
}

export default function BookingPage() {
  const { authUser } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (
      authUser === "unauthorized" ||
      (typeof authUser !== "string" && authUser.role !== "CUSTOMER")
    ) {
      navigate("/login");
    }
  }, [authUser]);

  const { fieldId } = useParams();

  const { loading, getFieldDetail } = useGetFieldDetail();

  const [field, setField] = useState<IField>(defaultFieldValue);

  useEffect(() => {
    const fetchField = async () => {
      const fetchedField = await getFieldDetail(fieldId || "");
      if (fetchedField) {
        setField(fetchedField);
      }
    };

    fetchField();
  }, []);

  useEffect(() => {
    const mergedBookingSlots: IBookingSlot[] = [];
    field.orders.forEach((order) => {
      if (order.status !== "CANCELED") {
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

  const [step, setStep] = useState("select_slots");

  const changeStep = (stepName: string) => {
    setStep(stepName);
  };

  const [bookingSlots, setBookingSlots] = useState<IBookingSlot[]>([]);
  const [customerInfo, setCustomerInfo] = useState<ICustomerInfo>();
  const [proofImage, setProofImage] = useState<File>();

  const { loading: placeOrderLoading, placeOrder } = usePlaceOrder();

  const handleSubmit = async () => {
    const formData = new FormData();

    if (proofImage) {
      formData.append("image", proofImage);
    }
    formData.append("fieldId", JSON.stringify(fieldId));
    formData.append(
      "bookingSlots",
      JSON.stringify(bookingSlots.filter((slot) => slot.selected))
    );
    formData.append("customerInfo", JSON.stringify(customerInfo));

    const res = await placeOrder(formData);

    if (res) changeStep("after_payment");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {!loading ? (
        <>
          {field ? (
            <div className="flex-1">
              {step === "select_slots" && (
                <BookingTable
                  field={field}
                  fieldId={fieldId}
                  bookingSlots={bookingSlots}
                  setBookingSlots={setBookingSlots}
                  changeStep={changeStep}
                />
              )}
              {step === "confirmation" && (
                <CustomerInfo
                  bookingSlots={bookingSlots}
                  field={field}
                  changeStep={changeStep}
                  customerInfo={customerInfo}
                  setCustomerInfo={setCustomerInfo}
                />
              )}
              {step === "QR_payment" && (
                <QrPayment
                  field={field}
                  bookingSlots={bookingSlots}
                  changeStep={changeStep}
                  proofImage={proofImage}
                  setProofImage={setProofImage}
                  loading={placeOrderLoading}
                  submitOrder={handleSubmit}
                />
              )}
              {step === "after_payment" && <AfterPayment />}
            </div>
          ) : (
            <div className="flex-1 container mx-auto py-24 px-4 flex flex-col items-center justify-center">
              <h1 className="text-3xl font-heading font-bold mb-4">
                Không tìm thấy sân đấu
              </h1>
              <p className="mb-6">
                Sân đấu bạn đang tìm kiếm không tồn tại hoặc đã bị xoá.
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
