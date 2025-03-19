import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { FieldForm } from "../ui";
import { useParams } from "react-router";
import useGetFieldDetail from "@/hooks/owner/useGetFieldDetail";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/common";

export default function UpdateFieldPage() {
  const params = useParams();
  const fieldId = params.fieldId;

  const [field, setField] = useState();

  const { loading, getFieldDetail } = useGetFieldDetail();

  useEffect(() => {
    const fetchField = async () => {
      const fetchedField = await getFieldDetail(fieldId || "");
      setField(fetchedField);
    };

    fetchField();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex-1 container mx-auto px-4">
        <a href="/owner/fields">
          <Button variant="secondary" className="-ml-4 gap-1">
            <ChevronLeft />
            Quay lại
          </Button>
        </a>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-heading font-bold mb-8 mt-4">
            Cập nhật thông tin sân
          </h1>

          {loading ? (
            <Spinner />
          ) : (
            <div className="bg-white rounded-lg shadow-lg border-2 p-6">
              <FieldForm field={field} fieldId={fieldId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
