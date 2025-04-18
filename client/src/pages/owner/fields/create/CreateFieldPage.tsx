import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { FieldForm } from "../ui";
import { useState } from "react";
import { IFieldTime, IService } from "@/types/Field";

export default function CreateFieldPage() {
  const [services, setServices] = useState<IService[]>([]);
  const [fieldTimes, setFieldTimes] = useState<IFieldTime[]>([
    {
      startTime: "",
      endTime: "",
      pricePerSlot: "",
    },
  ]);

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
            Thêm Sân Thể Thao Mới
          </h1>

          <div className="bg-white rounded-lg shadow-lg border-2 p-6 mb-10">
            <FieldForm
              services={services}
              setServices={setServices}
              fieldTimes={fieldTimes}
              setFieldTimes={setFieldTimes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
