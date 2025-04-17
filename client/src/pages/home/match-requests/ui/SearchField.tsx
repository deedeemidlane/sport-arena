import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ArrowUpFromLine,
  Building2,
  CalendarIcon,
  Dribbble,
  MapPin,
  Search,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useNavigate } from "react-router";
import { SPORT_OPTIONS } from "@/constants/sports";
import { LEVEL_OPTIONS } from "@/constants/levels";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface IAddressData {
  code: string;
  name: string;
}

interface SearchParams {
  sportType?: string;
  province?: string;
  district?: string;
  level?: string;
  gender?: string;
  date?: Date;
}

interface SearchFieldProps {
  sportType?: string;
  province?: string;
  district?: string;
  level?: string;
  gender?: string;
  date?: string;
}

export const SearchField = ({
  sportType,
  province,
  district,
  level,
  gender,
  date,
}: SearchFieldProps) => {
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
      sportType: sportType,
      province: province,
      district: district,
      level: level,
      gender: gender,
      date: date ? new Date(date) : undefined,
    },
  });

  const isDirty = Object.keys(form.formState.dirtyFields).length > 0;

  // Handle province change to update district & ward options
  const handleProvinceChange = (provinceName: string) => {
    const provinceCode = provinces.find((p) => p.name === provinceName)?.code;
    setSelectedProvince(provinceCode);
    form.setValue("district", "");
  };

  const onSubmit = (data: SearchParams) => {
    console.log(data);

    let params = "";

    if (data.sportType && data.sportType !== "all")
      params += `sportType=${data.sportType}&`;
    if (data.province) params += `province=${data.province}&`;
    if (data.district) params += `district=${data.district}&`;
    if (data.level && data.level !== "all") params += `level=${data.level}&`;
    if (data.gender) params += `gender=${data.gender}&`;
    if (data.date) params += `date=${format(data.date, "M/d/y")}&`;

    navigate(`/match-requests?${params}`);
  };

  return (
    <div className="mb-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="rounded-xl p-6 border border-gray-200 shadow-md space-y-6">
            <div className="md:flex flex-wrap gap-4 items-end">
              {/* Sport type */}
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

              {/* Level */}
              <div className="flex-1 max-md:mb-2">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trình độ</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <div className="flex items-center gap-2">
                              <ArrowUpFromLine className="h-4 w-4" />
                              <div className="h-4 border-r border-gray-300"></div>
                              <SelectValue placeholder="Chọn trình độ" />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          {LEVEL_OPTIONS.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {/* Gender */}
              <div className="flex-1 max-md:mb-2">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giới tính</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <div className="h-4 border-r border-gray-300"></div>
                              <SelectValue placeholder="Chọn giới tính" />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Nam</SelectItem>
                          <SelectItem value="FEMALE">Nữ</SelectItem>
                          <SelectItem value="OTHER">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                className="bg-primary hover:bg-primary/90 max-md:w-full max-md:mb-2 hidden md:flex md:invisible"
                disabled={!isDirty}
              >
                <Search className="h-4 w-4" />
                Tìm kiếm
              </Button>
            </div>
            <div className="md:flex flex-wrap gap-4 items-end">
              {/* Date */}
              <div className="flex-1 max-md:mb-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Chọn ngày</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full text-left font-normal justify-start",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="h-4 w-4 opacity-50" />
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Chọn ngày</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const currentDate = new Date();
                              currentDate.setHours(0, 0, 0, 0);
                              return date < currentDate;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>

              {/* Province */}
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
                            <SelectItem
                              key={province.name}
                              value={province.name}
                            >
                              {province.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {/* District */}
              <div className="flex-1 max-md:mb-2">
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

              <Button
                className="bg-primary hover:bg-primary/90 max-md:w-full max-md:mb-2"
                disabled={!isDirty}
                type="submit"
              >
                <Search className="h-4 w-4" />
                Tìm kiếm
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
