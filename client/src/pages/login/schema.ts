import { z } from "zod";

export const userLoginSchema = z.object({
  phone: z
    .string()
    .min(1, { message: "Số điện thoại không được để trống" })
    .regex(/\d{10,11}$/, {
      message: "Số điện thoại phải chứa từ 10-11 chữ số",
    }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống" }),
});

export type UserLoginSchema = z.infer<typeof userLoginSchema>;
