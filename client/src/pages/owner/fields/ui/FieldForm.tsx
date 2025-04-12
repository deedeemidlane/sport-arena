import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import useCreateFields from "@/hooks/owner/useCreateField";
import useUpdateFields from "@/hooks/owner/useUpdateField";
import { Label } from "@/components/ui/label";
import { SPORT_OPTIONS } from "@/constants/sports";
import { getFullImageUrl } from "@/utils/helperFunctions";
import { Landmark, Plus, Trash2, X } from "lucide-react";
import { PiCourtBasketball } from "react-icons/pi";
import { MdMiscellaneousServices } from "react-icons/md";
import { IService } from "@/types/Field";
import { IBank } from "@/types/OtherTypes";

interface IAddressData {
  code: string;
  name: string;
}

export const FieldForm = ({
  field,
  fieldId,
  services,
  setServices,
}: {
  field?: FieldSchema;
  fieldId?: string;
  services: IService[];
  setServices: Dispatch<SetStateAction<IService[]>>;
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
          const fetchedWards: IAddressData[] = data.wards;
          // Filter out duplicate ward names
          const uniqueWards = fetchedWards.filter(
            (ward, index, self) =>
              index === self.findIndex((w) => w.name === ward.name)
          );

          setWards(uniqueWards);
        })
        .catch((error) => console.error("Error when fetching wards:", error));
    }
  }, [selectedDistrict]);

  const [banks, setBanks] = useState<IBank[]>([]);
  // Fetch banks
  useEffect(() => {
    const fetchBank = async () => {
      try {
        const res = await fetch("https://api.vietqr.io/v2/banks");
        const fetchedBanks = await res.json();
        setBanks(fetchedBanks.data);
      } catch (error) {
        console.log("Error in fetchBank: ", error);
      }
    };

    fetchBank();
  }, []);

  const form = useForm<FieldSchema>({
    resolver: zodResolver(fieldSchema),
    defaultValues: field
      ? {
          ...field,
          googleMapLink:
            field.googleMapLink !== ""
              ? `<iframe src="${field.googleMapLink}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
              : "",
        }
      : defaultFormValue,
  });

  // let isDirty = Object.keys(form.formState.dirtyFields).length > 0;

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

  const [image, setImage] = useState<File>();

  const addService = () => {
    const newServices = [...services];
    newServices.push({
      name: "",
      price: "",
    });
    setServices(newServices);
  };

  const deleteService = (index: number) => {
    const newServices = [...services];
    newServices.splice(index, 1);
    setServices(newServices);
  };

  const onSubmit = async (data: FieldSchema) => {
    const iframe = data.googleMapLink;

    const link = iframe.substring(
      iframe.indexOf('"') + 1,
      iframe.indexOf('"', iframe.indexOf('"') + 2)
    );

    data.googleMapLink = link;

    const formData = new FormData();

    if (image) {
      formData.append("image", image);
    }
    formData.append("data", JSON.stringify(data));
    formData.append(
      "services",
      JSON.stringify(
        services.filter(
          (service) => service.name !== "" && service.price !== ""
        )
      )
    );

    if (field && fieldId) {
      updateField(fieldId, formData);
    } else {
      createField(formData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-2 mb-4">
          <PiCourtBasketball className="h-6 w-6 mt-0.5" />
          <h2 className="font-bold text-lg">Thông tin sân</h2>
        </div>
        <div className="space-y-6">
          {/* Sport Type */}
          <FormField
            control={form.control}
            name="sportType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Môn thể thao *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn môn thể thao" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SPORT_OPTIONS.map((sport) => (
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
                <FormLabel>
                  Địa chỉ chi tiết (số nhà, tên đường... KHÔNG NHẬP LẠI XÃ HUYỆN
                  TỈNH)
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nhập địa chỉ chi tiết..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="googleMapLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google map *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập iframe google map"
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
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

          {/* Image */}
          <Label htmlFor="image" className="text-right mb-2">
            Ảnh minh họa (.jpg, .jpeg, .png)
          </Label>
          {field?.imageUrl && form.watch("imageUrl") !== "" ? (
            <>
              <div className="relative p-0.5 border w-fit">
                <button
                  type="button"
                  className="absolute bg-gray-400 p-0.5 rounded-full cursor-pointer z-10"
                  onClick={() => {
                    form.setValue("imageUrl", "");
                  }}
                >
                  <X color="#fff" />
                </button>
                <img
                  src={getFullImageUrl(field.imageUrl)}
                  alt="field image"
                  className=""
                />
              </div>
            </>
          ) : (
            <input
              id="image"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => {
                if (e.target.files) {
                  setImage(e.target.files[0]);
                }
              }}
            />
          )}

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
        </div>

        <hr className="mt-6" />
        <div className="flex items-center gap-2">
          <Landmark className="w-6 h-6" />
          <h2 className="font-bold text-lg my-4">Thông tin chuyển khoản</h2>
        </div>
        <div className="space-y-6">
          {/* Banks selection */}
          <FormField
            control={form.control}
            name="acqId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chọn ngân hàng *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ngân hàng" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.bin}>
                        <img src={bank.logo} alt="bank image" className="h-5" />
                        {bank.shortName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Account number */}
          <FormField
            control={form.control}
            name="accountNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số tài khoản *</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số tài khoản" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Account name */}
          <FormField
            control={form.control}
            name="accountName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên chủ tài khoản *</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên chủ tài khoản" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <hr className="mt-6" />
        <div className="flex items-center gap-1 my-4">
          <MdMiscellaneousServices className="h-6 w-6 mt-1" />
          <h2 className="font-bold text-lg">Tiện ích</h2>
        </div>

        {services.map((service, index) => (
          <div key={`service-${index}`} className="my-4 flex items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor={`serviceName-${index}`}>Tên tiện ích</Label>
              <Input
                id={`serviceName-${index}`}
                placeholder="Nhập tên tiện ích"
                value={service.name}
                onChange={(e) => {
                  const newServices = [...services];
                  newServices[index].name = e.target.value;
                  setServices(newServices);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`servicePrice-${index}`}>Giá thuê (VND)</Label>
              <Input
                id={`servicePrice-${index}`}
                type="number"
                placeholder="Nhập giá thuê"
                value={service.price?.toString() || ""}
                onChange={(e) => {
                  const newServices = [...services];
                  newServices[index].price = e.target.value;
                  setServices(newServices);
                }}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => deleteService(index)}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        <Button type="button" variant="blue" onClick={addService}>
          <Plus /> Thêm tiện ích
        </Button>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full mt-6"
          disabled={createFieldLoading || updateFieldLoading}
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
