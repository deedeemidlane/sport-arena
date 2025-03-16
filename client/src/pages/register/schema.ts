import { z } from "zod";

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const userSchema = z
  .object({
    phone: z
      .string()
      .min(1, { message: "Số điện thoại không được để trống" })
      .regex(/\d{10,11}$/, {
        message: "Số điện thoại phải chứa từ 10-11 chữ số",
      }),
    email: z
      .string()
      .min(1, { message: "Email không được để trống" })
      .regex(EMAIL_REGEX, {
        message: "Email không hợp lệ",
      }),
    name: z.string().min(1, { message: "Họ tên không được để trống" }),
    gender: z.string({ required_error: "Vui lòng chọn giới tính" }),
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 kí tự" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"], // path of error
  });

export type UserSchema = z.infer<typeof userSchema>;
