import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userLoginSchema, UserLoginSchema } from "../schema";
import { Spinner } from "@/components/common";
import useLogin from "@/hooks/authentication/useLogin";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginSchema>({
    resolver: zodResolver(userLoginSchema),
  });

  const { loading, login } = useLogin();

  const onSubmit = async (data: UserLoginSchema) => {
    console.log(data);
    login(data);
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-5 h-5" />
            <span className="text-md font-heading font-bold text-primary">
              SportArena
            </span>
          </a>
          <CardTitle className="text-2xl font-bold text-center">
            Đăng nhập
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Email / Số điện thoại</Label>
                <Input
                  {...register("username")}
                  id="username"
                  type="text"
                  placeholder="Nhập email hoặc số điện thoại"
                  className={
                    errors.username &&
                    "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                  }
                />
                {errors.username && (
                  <p className="text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
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
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Spinner /> : "Đăng nhập"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Chưa có tài khoản?{" "}
              <a href="/register" className="underline underline-offset-4">
                Đăng ký ngay
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
