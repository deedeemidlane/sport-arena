import useGetFieldDetail from "@/hooks/guest/useGetFieldDetail";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  ArrowLeft,
  Calendar,
  HandCoins,
  MapPin,
  Phone,
  Users,
  Volleyball,
} from "lucide-react";
import { Footer, Navigation } from "../../ui";
import { Spinner } from "@/components/common";
import { IField } from "@/types/Field";
import { formatPriceInVND, getFullImageUrl } from "@/utils/helperFunctions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SPORT_DISPLAYED_VALUES } from "@/constants/sports";

export default function FieldDetailPage() {
  const params = useParams();

  const { getFieldDetail } = useGetFieldDetail();

  const [field, setField] = useState<IField>();

  useEffect(() => {
    const fetchField = async () => {
      const fetchedField = await getFieldDetail(params.fieldId || "");
      setField(fetchedField);
    };

    fetchField();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {field ? (
        <div className="flex-1 container mx-auto pt-4 pb-24 px-4">
          {/* Back button */}
          <a href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4" />
              Về trang chủ
            </Button>
          </a>

          {/* Main image */}
          <div className="relative w-full h-[300px] rounded-xl overflow-hidden mb-8 bg-gray-100">
            <img
              src={
                field.imageUrl
                  ? getFullImageUrl(field.imageUrl)
                  : "/placeholder.svg"
              }
              alt={field.name}
              className="w-full h-full object-contain"
            />
            {/* <div className="absolute top-4 right-4 bg-primary text-white py-1 px-3 rounded-full text-sm flex items-center">
              <Star
                className="h-4 w-4 mr-1 text-yellow-300"
                fill="currentColor"
              />
              {field.rating}
            </div> */}
          </div>

          {/* Court information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main information */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-heading font-bold mb-4">
                {field.name}
              </h1>

              <div className="flex flex-wrap gap-8 mb-6">
                <div className="flex items-start text-gray-600">
                  <div>
                    <MapPin className="h-5 w-5 mr-1 mt-1" />
                  </div>
                  {field.address}, {field.ward}, {field.district},{" "}
                  {field.province}
                </div>
                {/* <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-1" />
                  {field.openTime}
                </div> */}
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-1" />
                  {field.numOfFields} sân
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-heading font-semibold mb-3">
                  Mô tả
                </h2>
                <p className="text-gray-700">
                  {field.description ? field.description : "Chưa có mô tả"}
                </p>
              </div>

              {/* Amenities */}
              {/* <div className="mb-8">
                <h2 className="text-xl font-heading font-semibold mb-3">
                  Tiện ích
                </h2>
                <div className="flex flex-wrap gap-2">
                  {field.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div> */}

              {/* Additional images */}
              {/* <div className="mb-8">
                <h2 className="text-xl font-heading font-semibold mb-3">
                  Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {field.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-video rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`${field.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div> */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.9213204948787!2d105.77145436129972!3d21.017462112252012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454a9a88bbdfd%3A0x26566ebdcbc82c86!2zVGhlIEVtZXJhbGQsIE5nb8yDIDE4MCDEkMawxqHMgG5nIMSQacyAbmggVGjDtG4sIE3hu7kgxJDDrG5oLCBOYW0gVOG7qyBMacOqbSwgSMOgIE7hu5lpIDEyMDE1LCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1743610188855!5m2!1svi!2s"
                width="600"
                height="450"
                style={{ border: 0 }}
                // allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Booking information */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-heading font-semibold mb-4">
                    Thông tin đặt sân
                  </h2>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Volleyball className="h-4 w-4 mr-1" />
                      <span className="text-gray-600">Loại sân</span>
                    </div>
                    <span className="font-medium">
                      {SPORT_DISPLAYED_VALUES[field.sportType]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <HandCoins className="h-4 w-4 mr-1" />
                      <span className="text-gray-600">Giá thuê</span>
                    </div>
                    <span className="font-medium">
                      {formatPriceInVND(field.pricePerHour)} / giờ
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      <span className="text-gray-600">Liên hệ</span>
                    </div>
                    <span className="font-medium">{field.owner.phone}</span>
                  </div>

                  <a href={`/fields/${field.id}/booking`}>
                    <Button className="w-full flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Đặt sân ngay
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex-1 flex justify-center items-center py-10">
          <Spinner />
        </div>
      )}

      <Footer />
    </div>
  );
}
