import { Spinner } from "@/components/common";
import useGetFields from "@/hooks/guest/useGetFields";
import { IField } from "@/types/Field";
import { getFullImageUrl } from "@/utils/helperFunctions";
import { MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";

export function CourtList() {
  const { getFields } = useGetFields();

  const [fields, setFields] = useState<IField[]>();

  useEffect(() => {
    const fetchFields = async () => {
      const fetchedFields = await getFields();
      setFields(fetchedFields);
    };

    fetchFields();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4">
      <h2 className="text-3xl font-heading font-bold mb-8">
        Danh sách sân tập
      </h2>

      {fields ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <>
            {fields.map((field) => (
              <a
                href={`/fields/${field.id}`}
                key={field.id}
                className="cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow"
              >
                <div className="relative h-48">
                  {field.imageUrl ? (
                    <img
                      alt="Ảnh minh họa món"
                      className="w-full h-full object-cover"
                      src={getFullImageUrl(field.imageUrl)}
                    />
                  ) : (
                    <img
                      alt="Ảnh đại diện User"
                      className="w-full h-full object-cover"
                      src="/placeholder.svg"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    {field.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Phone className="h-4 w-4 mr-2" />
                    {field.owner.phone}
                  </div>
                  <div className="flex items-start text-sm text-gray-600 mb-2">
                    <span>
                      <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                    </span>
                    <span>
                      {field.ward}, {field.district}, {field.province}
                    </span>
                  </div>
                  {/* <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  {field.rating}
                </div> */}
                </div>
              </a>
            ))}
          </>
        </div>
      ) : (
        <div className="w-full flex justify-center py-10">
          <Spinner />
        </div>
      )}
    </div>
  );
}
