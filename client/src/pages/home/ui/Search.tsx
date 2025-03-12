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

export const Search = () => {
  return (
    <div className="container mx-auto pt-12 px-4">
      <div className="rounded-xl p-6 md:flex flex-wrap gap-4 items-end border-2 border-gray-200 shadow-md">
        <div className="flex-1 max-md:mb-2">
          <Select>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Dribbble className="h-4 w-4" />
                <div className="h-4 border-r border-gray-300"></div>
                <SelectValue placeholder="Chọn môn thể thao" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="football">Bóng đá</SelectItem>
              <SelectItem value="badminton">Cầu lông</SelectItem>
              <SelectItem value="pickleball">Pickle Ball</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 max-md:mb-2">
          <Select>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <div className="h-4 border-r border-gray-300"></div>
                <SelectValue placeholder="Chọn tỉnh/thành phố" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="province1">Province 1</SelectItem>
              <SelectItem value="province2">Province 2</SelectItem>
              <SelectItem value="province3">Province 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 max-md:mb-2">
          <Select>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <div className="h-4 border-r border-gray-300"></div>
                <SelectValue placeholder="Chọn quận/huyện" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="district1">District 1</SelectItem>
              <SelectItem value="district2">District 2</SelectItem>
              <SelectItem value="district3">District 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-primary hover:bg-primary/90 max-md:w-full">
          <SearchIcon className="h-4 w-4" />
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};
