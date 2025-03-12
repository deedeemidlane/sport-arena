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

export const PlayerForm = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: UserSchema) => {
    console.log(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tài khoản người chơi</CardTitle>
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
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
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
                    <SelectTrigger>
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
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full mt-6">
            Tạo tài khoản
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
