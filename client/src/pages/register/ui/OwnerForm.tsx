import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/common";
import { userSchema, UserSchema } from "../schema";
import useCreateOwnerAccount from "@/hooks/authentication/useCreateOwnerAccount";

export const OwnerForm = () => {
  const [termAgreement, setTermAgreement] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
  });

  const { loading, createOwnerAccount } = useCreateOwnerAccount();

  const onSubmit = (data: UserSchema) => {
    console.log(data);
    createOwnerAccount(data);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tài khoản chủ sân</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
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
            <div className="grid gap-2">
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
            <div className="grid gap-2">
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
            <div className="grid gap-2">
              <Label htmlFor="phone">
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
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
              )}
            </div>
            <div className="grid gap-2">
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
            <div className="grid gap-2">
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
            <div className="flex items-center space-x-2">
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
