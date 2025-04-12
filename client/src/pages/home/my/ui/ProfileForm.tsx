import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload, Check, Eye, EyeOff } from "lucide-react";
import useUpdateProfile from "@/hooks/customer/useUpdateProfile";
import { ProfileFormValues, profileSchema } from "../schema";
import { Separator } from "@/components/ui/separator";
import { getFullImageUrl } from "@/utils/helperFunctions";
import { IUser } from "@/types/User";
import { IBank } from "@/types/OtherTypes";

export const ProfileForm = ({ authUser }: { authUser: IUser }) => {
  const [avatar, setAvatar] = useState<string | undefined>(authUser.avatarUrl);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...authUser,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { loading, updateProfile } = useUpdateProfile();

  const onSubmit = async (data: ProfileFormValues) => {
    console.log(data);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
        </div>
        <Separator />
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="w-32 h-32 border-2 border-primary">
            <AvatarImage
              src={avatar || "/placeholder.svg"}
              alt="Avatar"
              className="object-cover"
            />
            <AvatarFallback className="text-3xl">
              <User className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>

          <div className="relative">
            <Input
              type="file"
              id="avatar"
              className="hidden"
              accept=".jpg,.jpeg,.png"
              onChange={handleAvatarChange}
            />
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => document.getElementById("avatar")?.click()}
            >
              <Upload className="h-4 w-4" />
              Đổi ảnh đại diện
            </Button>
          </div>
        </div>

        <div className="flex-1 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giới tính</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Nam</SelectItem>
                          <SelectItem value="FEMALE">Nữ</SelectItem>
                          <SelectItem value="OTHER">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Banks */}
                <FormField
                  control={form.control}
                  name="acqId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngân hàng</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={
                              form.formState.errors.acqId &&
                              "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                            }
                          >
                            <SelectValue placeholder="Chọn ngân hàng" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số tài khoản</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số tài khoản" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên chủ tài khoản</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tên chủ tài khoản"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <FormLabel>CCCD mặt trước</FormLabel>
                  <div className="border rounded-md p-1">
                    <img
                      src={getFullImageUrl(authUser.frontIdCardImageUrl)}
                      alt="frontIdCardImage"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <FormLabel>CCCD mặt sau</FormLabel>
                  <div className="border rounded-md p-1">
                    <img
                      src={getFullImageUrl(authUser.backIdCardImageUrl)}
                      alt="backIdCardImage"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Đổi mật khẩu</h3>

                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu hiện tại</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showCurrentPassword ? "text" : "password"}
                              placeholder="••••••"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 mt-4">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu mới</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              placeholder="••••••"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading && <span className="animate-spin">⏳</span>}
                  {!loading && <Check className="h-4 w-4" />}
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
