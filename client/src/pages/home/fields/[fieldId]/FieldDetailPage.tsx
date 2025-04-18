import useGetFieldDetail from "@/hooks/guest/useGetFieldDetail";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  HandCoins,
  MapPin,
  Phone,
  Star,
  Users,
  Volleyball,
} from "lucide-react";
import { Footer, Navigation } from "../../ui";
import { Spinner } from "@/components/common";
import { IField, IReview } from "@/types/Field";
import {
  formatDate,
  formatPriceInVND,
  getAverageRating,
  getFullImageUrl,
} from "@/utils/helperFunctions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DISPLAYED_SPORTS } from "@/constants/sports";

export default function FieldDetailPage() {
  const params = useParams();

  const { getFieldDetail } = useGetFieldDetail();

  const [field, setField] = useState<IField>();

  useEffect(() => {
    const fetchField = async () => {
      const fetchedField = await getFieldDetail(params.fieldId || "");
      if (fetchedField) setField(fetchedField);
    };

    fetchField();
  }, []);

  const averageRating = useMemo(() => {
    return getAverageRating(field);
  }, [field]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {field ? (
        <div className="flex-1 container mx-auto pt-4 pb-10 px-4">
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
            {averageRating && (
              <div className="absolute top-4 right-4 bg-yellow-50 text-yellow-500 border border-yellow-200 py-1 px-3 rounded-full text-sm font-semibold flex items-center">
                <Star
                  className="h-4 w-4 mr-1 text-yellow-400"
                  fill="currentColor"
                />
                {averageRating}
              </div>
            )}
          </div>

          {/* Court information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main information */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-heading font-bold mb-4">
                {field.name}
              </h1>

              <div className="flex flex-wrap gap-8 mb-6">
                <div className="flex items-center text-gray-600">
                  <div>
                    <MapPin className="h-5 w-5 mr-1" />
                  </div>
                  {field.address && `${field.address}, `}
                  {field.ward}, {field.district}, {field.province}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-1" />
                  {field.fieldTimes[0]?.startTime}
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-1" />
                  {field.numOfFields} sân
                </div>
              </div>

              <div className="mb-8 border-2 rounded-sm">
                <h2 className="text-xl font-heading font-semibold mb-3 bg-gray-200 p-4">
                  Mô tả sân
                </h2>
                <p className="text-gray-700 p-4 pt-0">
                  {field.description ? field.description : "Chưa có mô tả"}
                </p>
              </div>

              {/* Amenities */}
              <div className="mb-8 border-2 rounded-sm">
                <h2 className="text-xl font-heading font-semibold mb-3 bg-gray-200 p-4">
                  Tiện ích
                </h2>
                <div className="text-gray-700 p-4 pt-0">
                  {field.services.length > 0 && (
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr>
                          <th className="border p-2">Tên</th>
                          <th className="border p-2">Giá thuê</th>
                        </tr>
                      </thead>
                      <tbody>
                        {field.services.map((service, index) => (
                          <tr key={`service-${index}`}>
                            <td className="border p-2 text-center">
                              {service.name}
                            </td>
                            <td className="border p-2 text-center">
                              {formatPriceInVND(service.price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
              <div className="mb-8 border-2 rounded-sm">
                <h2 className="text-xl font-heading font-semibold mb-3 bg-gray-200 p-4">
                  Vị trí sân
                </h2>
                <div className="text-gray-700 p-4 pt-0">
                  {field.googleMapLink !== "" && (
                    <iframe
                      src={field.googleMapLink}
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      // allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  )}
                </div>
              </div>

              {/* Reviews and Ratings Section */}
              <div className="mb-8 border-2 rounded-sm">
                <div className="flex items-center justify-between mb-3 bg-gray-200 p-4">
                  <h2 className="text-xl font-heading font-semibold">
                    Đánh giá
                  </h2>
                  {averageRating !== 0 && (
                    <div className="flex items-center">
                      <div className="bg-yellow-50 text-yellow-500 border border-yellow-200 px-3 py-1 rounded-md flex items-center mr-2">
                        <Star
                          className="h-4 w-4 mr-1 text-yellow-400"
                          fill="currentColor"
                        />
                        <span className="font-semibold">{averageRating}</span>
                        <span className="text-sm text-gray-500 ml-1">/ 5</span>
                      </div>
                      <span className="text-sm">
                        ({field.reviews.length} đánh giá)
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-gray-700 p-4 pt-0">
                  {field.reviews.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border">
                      <div className="p-4">
                        {field.reviews.map((review) => (
                          <ReviewItem key={review.id} review={review} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    "Chưa có đánh giá"
                  )}
                </div>
              </div>
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
                      {DISPLAYED_SPORTS[field.sportType]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <HandCoins className="h-4 w-4 mr-1" />
                      <span className="text-gray-600">Giá thuê</span>
                    </div>
                    <span className="font-medium">
                      {formatPriceInVND(field.minPrice)} -{" "}
                      {formatPriceInVND(field.maxPrice)}
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

// Review item component
const ReviewItem = ({ review }: { review: IReview }) => {
  return (
    <div className="border-b border-gray-200 py-4 last:border-0">
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <img
            src={
              review.user.avatarUrl
                ? getFullImageUrl(review.user.avatarUrl)
                : "/logo.png"
            }
            alt={"avatar"}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium">{review.user.name}</h4>
            <span className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </span>
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill={i < review.rating ? "currentColor" : "none"}
              />
            ))}
          </div>
          <p className="mt-2 text-gray-700">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};
