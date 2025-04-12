import { Spinner } from "@/components/common";
import { Button } from "@/components/ui/button";
import useGetFields from "@/hooks/guest/useGetFields";
import { IField } from "@/types/Field";
import { getFullImageUrl } from "@/utils/helperFunctions";
import { ChevronRight, Inbox, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";

export function CourtList({
  urlSearchParams,
  isHomePage,
}: {
  urlSearchParams: string;
  isHomePage: boolean;
}) {
  const { loading, getFields } = useGetFields();

  const [fields, setFields] = useState<IField[]>();

  useEffect(() => {
    const fetchFields = async () => {
      const fetchedFields: IField[] = await getFields(urlSearchParams);
      if (isHomePage) {
        setFields(fetchedFields.slice(0, 4));
      } else {
        setFields(fetchedFields);
      }
    };

    fetchFields();
  }, [urlSearchParams]);

  return (
    <div className="container mx-auto py-10 px-4">
      {!loading ? (
        <div>
          {fields && fields.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {fields.map((field) => (
                  <a
                    href={`/fields/${field.id}`}
                    key={field.id}
                    className="cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow"
                  >
                    <div className="relative h-48">
                      {field.imageUrl ? (
                        <img
                          alt="Sport field image"
                          className="w-full h-full object-cover"
                          src={getFullImageUrl(field.imageUrl)}
                        />
                      ) : (
                        <img
                          alt="Placeholder image"
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
              </div>
              {isHomePage && (
                <div className="flex justify-center mt-8">
                  <a href="/fields">
                    <Button
                      variant="ghost"
                      className="text-base text-blue-500 hover:text-blue-500"
                    >
                      Xem tất cả sân thể thao <ChevronRight />
                    </Button>
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="w-full flex flex-col items-center text-gray-400 my-10">
              <Inbox className="w-20 h-20" />
              <h2 className="font-semibold text-xl">
                Không tìm thấy sân thể thao nào!
              </h2>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full flex justify-center py-10">
          <Spinner />
        </div>
      )}
    </div>
  );
}
