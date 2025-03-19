import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Building2, House, MapPin } from "lucide-react";

interface IAddressData {
  code: string;
  name: string;
}

interface ISelectionOption {
  value: string;
  label: string;
}

const AddressSelector = () => {
  const [provinces, setProvinces] = useState<ISelectionOption[]>([]);
  const [districts, setDistricts] = useState<ISelectionOption[]>([]);
  const [wards, setWards] = useState<ISelectionOption[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<
    ISelectionOption | undefined
  >();
  const [selectedDistrict, setSelectedDistrict] = useState<
    ISelectionOption | undefined
  >();
  const [selectedWard, setSelectedWard] = useState<
    ISelectionOption | undefined
  >();

  // Lấy danh sách tỉnh/thành phố
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => {
        setProvinces(
          data.map((p: IAddressData) => ({ value: p.code, label: p.name }))
        );
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu tỉnh:", error));
  }, []);

  // Khi chọn tỉnh, lấy danh sách quận/huyện
  useEffect(() => {
    if (selectedProvince) {
      fetch(
        `https://provinces.open-api.vn/api/p/${selectedProvince.value}?depth=2`
      )
        .then((res) => res.json())
        .then((data) => {
          setDistricts(
            data.districts.map((d: IAddressData) => ({
              value: d.code,
              label: d.name,
            }))
          );
          setSelectedDistrict(undefined);
          setWards([]);
        })
        .catch((error) => console.error("Lỗi khi lấy dữ liệu huyện:", error));
    }
  }, [selectedProvince]);

  // Khi chọn quận, lấy danh sách xã/phường
  useEffect(() => {
    if (selectedDistrict) {
      fetch(
        `https://provinces.open-api.vn/api/d/${selectedDistrict.value}?depth=2`
      )
        .then((res) => res.json())
        .then((data) => {
          setWards(
            data.wards.map((w: IAddressData) => ({
              value: w.code,
              label: w.name,
            }))
          );
          setSelectedWard(undefined);
        })
        .catch((error) => console.error("Lỗi khi lấy dữ liệu xã:", error));
    }
  }, [selectedDistrict]);

  return (
    <div className="flex gap-4">
      <Select
        value={selectedProvince?.label || undefined}
        onValueChange={(province) => {
          setSelectedProvince({
            value: provinces.find((p) => p.label === province)?.value || "",
            label: province,
          });
        }}
      >
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <div className="h-4 border-r border-gray-300"></div>
            <SelectValue placeholder="Chọn tỉnh/thành phố" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {provinces.map((province) => (
            <SelectItem key={`p-${province.value}`} value={province.label}>
              {province.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={selectedDistrict ? selectedDistrict.label : undefined}
        onValueChange={(district) => {
          setSelectedDistrict({
            value: districts.find((p) => p.label === district)?.value || "",
            label: district,
          });
        }}
      >
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <House className="h-4 w-4" />
            <div className="h-4 border-r border-gray-300"></div>
            <SelectValue placeholder="Chọn quận/huyện" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {districts.map((district) => (
            <SelectItem key={`d-${district.value}`} value={district.label}>
              {district.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={selectedWard?.label || undefined}
        onValueChange={(ward) => {
          setSelectedWard({
            value: wards.find((p) => p.label === ward)?.value || "",
            label: ward,
          });
        }}
      >
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <div className="h-4 border-r border-gray-300"></div>
            <SelectValue placeholder="Chọn xã/phường" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {wards.map((ward) => (
            <SelectItem key={`w-${ward.value}`} value={ward.label}>
              {ward.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AddressSelector;
