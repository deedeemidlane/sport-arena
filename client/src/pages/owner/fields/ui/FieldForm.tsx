import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { defaultFormValue, fieldSchema, FieldSchema } from "../schema";
import { Spinner } from "@/components/common";
import { SPORTS } from "@/constants/sports";
import useCreateFields from "@/hooks/owner/useCreateField";
import useUpdateFields from "@/hooks/owner/useUpdateField";

interface IAddressData {
  code: string;
  name: string;
}

export const FieldForm = ({
  field,
  fieldId,
}: {
  field?: FieldSchema;
  fieldId?: string;
}) => {
  const [selectedProvince, setSelectedProvince] = useState<string>();
  const [selectedDistrict, setSelectedDistrict] = useState<string>();

  const [provinces, setProvinces] = useState<IAddressData[]>([]);
  const [districts, setDistricts] = useState<IAddressData[]>([]);
  const [wards, setWards] = useState<IAddressData[]>([]);

  // Fetch provinces
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => {
        setProvinces(data);
        if (field) {
          const provinceCode = data.find(
            (p: IAddressData) => p.name === field.province
          )?.code;
          setSelectedProvince(provinceCode);
        }
      })
      .catch((error) => console.error("Error when fetching provinces:", error));
  }, []);

  // When province changes, fetch districts
  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then((res) => res.json())
        .then((data) => {
          setDistricts(data.districts);
          if (field) {
            const districtCode = data.districts.find(
              (d: IAddressData) => d.name === field.district
            )?.code;
            setSelectedDistrict(districtCode);
          }
        })
        .catch((error) =>
          console.error("Error when fetching districts:", error)
        );
    }
  }, [selectedProvince]);

  // When district change, fetch wards
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
        .then((res) => res.json())
        .then((data) => {
          setWards(data.wards);
        })
        .catch((error) => console.error("Error when fetching wards:", error));
    }
  }, [selectedDistrict]);

  const form = useForm<FieldSchema>({
    resolver: zodResolver(fieldSchema),
    defaultValues: field ? field : defaultFormValue,
  });

  let isDirty = Object.keys(form.formState.dirtyFields).length > 0;

  // Handle province change to update district & ward options
  const handleProvinceChange = (provinceName: string) => {
    const provinceCode = provinces.find((p) => p.name === provinceName)?.code;
    setSelectedProvince(provinceCode);
    setSelectedDistrict("");
    form.setValue("district", "");
    form.setValue("ward", "");
  };

  // Handle district change to update ward options
  const handleDistrictChange = (districtName: string) => {
    const districtCode = districts.find((d) => d.name === districtName)?.code;
    setSelectedDistrict(districtCode);
    form.setValue("ward", "");
  };

  const { loading: createFieldLoading, createField } = useCreateFields();
  const { loading: updateFieldLoading, updateField } = useUpdateFields();

  const onSubmit = async (data: FieldSchema) => {
    console.log(data);

    if (field && fieldId) {
      updateField(fieldId, data);
    } else {
      createField(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Sport Type */}
        <FormField
          control={form.control}
          name="sportType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Môn thể thao *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn môn thể thao" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SPORTS.map((sport) => (
                    <SelectItem key={sport.value} value={sport.value}>
                      {sport.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Court Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên sân *</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên sân..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Number of Fields */}
        <FormField
          control={form.control}
          name="numOfFields"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số lượng sân *</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location Selection - Province */}
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Tỉnh/Thành phố *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleProvinceChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tỉnh/thành phố" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province.name} value={province.name}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* District */}
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Quận/Huyện *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleDistrictChange(value);
                  }}
                  defaultValue={field.value}
                  disabled={!selectedProvince}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn quận/huyện" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedProvince &&
                      districts?.map((district) => (
                        <SelectItem key={district.name} value={district.name}>
                          {district.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ward */}
          <FormField
            control={form.control}
            name="ward"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Phường/Xã *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedDistrict}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phường/xã" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedDistrict &&
                      wards?.map((ward) => (
                        <SelectItem key={ward.name} value={ward.name}>
                          {ward.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ *</FormLabel>
              <FormControl>
                <Input placeholder="Nhập địa chỉ chi tiết..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Per Hour */}
        <FormField
          control={form.control}
          name="pricePerHour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá thuê mỗi giờ (VNĐ) *</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả thêm</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả thêm về sân thể thao..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={createFieldLoading || updateFieldLoading || !isDirty}
        >
          {createFieldLoading || updateFieldLoading ? (
            <Spinner />
          ) : (
            <>{field ? "Lưu" : "Tạo sân thể thao"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};
