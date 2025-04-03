import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Dribbble,
  MapPin,
  Search as SearchIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { SPORT_OPTIONS } from "@/constants/sports";
import { useNavigate } from "react-router";
import { Label } from "@/components/ui/label";

interface IAddressData {
  code: string;
  name: string;
}

interface SearchParams {
  fieldName: string;
  sportType?: string;
  province: string;
  district: string;
}

interface SearchProps {
  fieldName?: string;
  sportType?: string;
  province?: string;
  district?: string;
}

export const Search = ({
  fieldName,
  sportType,
  province,
  district,
}: SearchProps) => {
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState<string>();

  const [provinces, setProvinces] = useState<IAddressData[]>([]);
  const [districts, setDistricts] = useState<IAddressData[]>([]);

  // Fetch provinces
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => {
        setProvinces(data);
        if (province) {
          const provinceCode = data.find(
            (p: IAddressData) => p.name === province
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
        })
        .catch((error) =>
          console.error("Error when fetching districts:", error)
        );
    }
  }, [selectedProvince]);

  const form = useForm<SearchParams>({
    defaultValues: {
      fieldName: fieldName,
      sportType: sportType,
      province: province,
      district: district,
    },
  });

  // Handle province change to update district & ward options
  const handleProvinceChange = (provinceName: string) => {
    const provinceCode = provinces.find((p) => p.name === provinceName)?.code;
    setSelectedProvince(provinceCode);
    form.setValue("district", "");
  };

  const onSubmit = (data: SearchParams) => {
    let params = "";

    if (data.fieldName) params += `fieldName=${data.fieldName}&`;
    if (data.sportType && data.sportType !== "all")
      params += `sportType=${data.sportType}&`;
    if (data.province) params += `province=${data.province}&`;
    if (data.district) params += `district=${data.district}`;

    navigate(`/fields?${params}`);
  };

  return (
    <div className="container mx-auto pt-4 px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="rounded-xl p-6 md:flex flex-wrap gap-4 items-end border border-gray-200">
            <div className="flex-1 max-md:mb-2">
              <Label className="mb-2">Tên sân tập</Label>
              <div className="relative">
                <SearchIcon
                  color="#71717b"
                  className="h-4 w-4 absolute left-2.5 top-2.5"
                />
                <Input
                  id=""
                  type="text"
                  placeholder="Nhập tên sân"
                  className="pl-8"
                  {...form.register("fieldName")}
                />
              </div>
            </div>
            <div className="flex-1 max-md:mb-2">
              <FormField
                control={form.control}
                name="sportType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Môn thể thao</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <Dribbble className="h-4 w-4" />
                            <div className="h-4 border-r border-gray-300"></div>
                            <SelectValue placeholder="Chọn môn thể thao" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {SPORT_OPTIONS.map((sport) => (
                          <SelectItem key={sport.value} value={sport.value}>
                            {sport.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 max-md:mb-2">
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Tỉnh/Thành phố</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleProvinceChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <div className="h-4 border-r border-gray-300"></div>
                            <SelectValue placeholder="Chọn tỉnh/thành phố" />
                          </div>
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
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 max-md:mb-2">
              {/* District */}
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Quận/Huyện</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                      disabled={!selectedProvince}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <div className="h-4 border-r border-gray-300"></div>
                            <SelectValue placeholder="Chọn quận/huyện" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedProvince &&
                          districts?.map((district) => (
                            <SelectItem
                              key={district.name}
                              value={district.name}
                            >
                              {district.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <Button className="bg-primary hover:bg-primary/90 max-md:w-full">
              <SearchIcon className="h-4 w-4" />
              Tìm kiếm
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
