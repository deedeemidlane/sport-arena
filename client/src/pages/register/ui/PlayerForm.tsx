import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { userSchema, UserSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/common";
import useCreateCustomerAccount from "@/hooks/authentication/useCreateCustomerAccount";
import { IBank } from "@/types/OtherTypes";

export const PlayerForm = () => {
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

  const [termAgreement, setTermAgreement] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
  });

  const [frontIdCardImage, setFrontIdCardImage] = useState<File>();
  const [backIdCardImage, setBackIdCardImage] = useState<File>();

  const { loading, createCustomerAccount } = useCreateCustomerAccount();

  const onSubmit = (data: UserSchema) => {
    console.log(data);

    const formData = new FormData();

    if (frontIdCardImage) {
      formData.append("frontIdCardImage", frontIdCardImage);
    }
    if (backIdCardImage) {
      formData.append("backIdCardImage", backIdCardImage);
    }

    formData.append("data", JSON.stringify(data));

    createCustomerAccount(formData);
  };

  return (
    <Card className="md:w-2xl">
      <CardHeader>
        <CardTitle>Tài khoản người chơi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              {/* Phone number */}
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Số điện thoại <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("phone")}
                  id="phone"
                  type="text"
                  placeholder="Nhập số điện thoại"
                  className={
                    errors.phone &&
                    "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                  }
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="text"
                  placeholder="Nhập email"
                  className={
                    errors.email &&
                    "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                  }
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Họ tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("name")}
                  id="name"
                  type="text"
                  placeholder="Nhập họ tên"
                  className={
                    errors.name &&
                    "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                  }
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="">
                  Giới tính <span className="text-red-500">*</span>
                </Label>

                <Controller
                  control={control}
                  name="gender"
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger
                        className={
                          errors.gender &&
                          "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                        }
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <div className="h-4 border-r border-gray-300"></div>
                          <SelectValue
                            placeholder="Giới tính"
                            onChange={() => onChange(value)}
                          />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Nam</SelectItem>
                        <SelectItem value="FEMALE">Nữ</SelectItem>
                        <SelectItem value="OTHER">Giới tính khác</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <p className="text-red-500 text-sm">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">
                    Mật khẩu <span className="text-red-500">*</span>
                  </Label>
                </div>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  className={
                    errors.password &&
                    "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                  }
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="confirmPassword">
                    Nhập lại mật khẩu <span className="text-red-500">*</span>
                  </Label>
                </div>
                <Input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  className={
                    errors.confirmPassword &&
                    "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                  }
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {/* Front identify card image */}
              <div className="space-y-2">
                <Label htmlFor="frontImage" className="mb-2">
                  Căn cước công dân mặt trước{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <input
                  id="frontImage"
                  className="w-full text-sm border border-gray-300 rounded-lg cursor-pointer h-9"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  required
                  onChange={(e) => {
                    if (e.target.files) {
                      setFrontIdCardImage(e.target.files[0]);
                    }
                  }}
                />
              </div>

              {/* Back identify card image */}
              <div className="space-y-2">
                <Label htmlFor="backImage" className="mb-2">
                  Căn cước công dân mặt sau{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <input
                  id="backImage"
                  className="w-full text-sm border border-gray-300 rounded-lg cursor-pointer h-9"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  required
                  onChange={(e) => {
                    if (e.target.files) {
                      setBackIdCardImage(e.target.files[0]);
                    }
                  }}
                />
              </div>

              {/* Banks */}
              <div className="space-y-2">
                <Label htmlFor="acqId">
                  Chọn ngân hàng <span className="text-red-500">*</span>
                </Label>
                <Controller
                  control={control}
                  name="acqId"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        className={
                          errors.acqId &&
                          "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                        }
                      >
                        <SelectValue placeholder="Chọn ngân hàng" />
                      </SelectTrigger>
                      <SelectContent>
                        {banks.map((bank) => (
                          <SelectItem key={bank.id} value={bank.bin}>
                            <img
                              src={bank.logo}
                              alt="bank image"
                              className="h-5"
                            />
                            {bank.shortName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.acqId && (
                  <p className="text-red-500 text-sm">{errors.acqId.message}</p>
                )}
              </div>

              {/* Account number */}
              <div className="space-y-2">
                <Label htmlFor="accountNo">
                  Số tài khoản <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("accountNo")}
                  id="accountNo"
                  type="text"
                  placeholder="Nhập số tài khoản"
                  className={
                    errors.accountNo &&
                    "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                  }
                />
                {errors.accountNo && (
                  <p className="text-red-500 text-sm">
                    {errors.accountNo.message}
                  </p>
                )}
              </div>

              {/* Account name */}
              <div className="space-y-2">
                <Label htmlFor="accountName">
                  Chủ tài khoản <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("accountName")}
                  id="accountName"
                  type="text"
                  placeholder="Nhập tên chủ tài khoản"
                  className={
                    errors.accountName &&
                    "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                  }
                />
                {errors.accountName && (
                  <p className="text-red-500 text-sm">
                    {errors.accountName.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* Term agreement */}
          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              id="termAgreement"
              className=""
              checked={termAgreement}
              onCheckedChange={() => {
                setTermAgreement(!termAgreement);
              }}
            />
            <label
              htmlFor="termAgreement"
              className="text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tôi đồng ý với{" "}
              <a
                href="/term-of-service"
                className="font-medium text-blue-500 hover:underline"
                target="_blank"
              >
                Điều khoản sử dụng
              </a>{" "}
              và{" "}
              <a
                href="/privacy-policy"
                className="font-medium text-blue-500 hover:underline"
                target="_blank"
              >
                Chính sách bảo mật
              </a>{" "}
              của hệ thống
            </label>
          </div>
          <Button
            type="submit"
            className="w-full mt-6"
            disabled={loading || !termAgreement}
          >
            {loading ? <Spinner /> : "Tạo tài khoản"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
