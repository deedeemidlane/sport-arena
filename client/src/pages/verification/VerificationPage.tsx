import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import useVerifyAccount from "@/hooks/authentication/useVerifyAccount";
import { Spinner } from "@/components/common";

export default function VerificationPage() {
  const FormSchema = z.object({
    code: z.string().min(6, {
      message: "Mã OTP phải chứa 6 chữ số",
    }),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  });

  const { loading, verifyAccount } = useVerifyAccount();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    verifyAccount({ ...data });
  }
  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center sm:p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="">
            <a href="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Logo" className="w-5 h-5" />
              <span className="text-md font-heading font-bold text-primary">
                SportArena
              </span>
            </a>
            <CardTitle className="text-2xl font-bold text-center">
              Xác thực email
            </CardTitle>
            <CardDescription className="text-center">
              Nhập mã OTP đã được gửi đến email của bạn
              <p className="text-blue-500">
                (Vui lòng kiểm tra hòm thư spam / thư rác nếu không nhận được
                email)
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full flex justify-center mt-2">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full space-y-6 flex flex-col items-center"
              >
                <Controller
                  control={control}
                  name="code"
                  render={({ field }) => (
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      {...field}
                      className="mx-auto"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
                {errors.code && (
                  <p className="text-sm text-red-500">{errors.code.message}</p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-5"
                >
                  {loading ? <Spinner /> : "Xác thực"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
