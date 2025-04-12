import { z } from "zod";

export const profileSchema = z
  .object({
    name: z.string().min(1, { message: "Họ tên không được để trống" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    phone: z
      .string()
      .min(10, { message: "Số điện thoại phải có ít nhất 10 số" }),
    gender: z.string().optional(),
    accountNo: z.string().optional(),
    accountName: z.string().optional(),
    acqId: z.string().optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => !data.newPassword || data.newPassword.length >= 8, {
    message: "Mật khẩu mới phải có ít nhất 6 ký tự",
    path: ["newPassword"],
  })
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmPassword,
    {
      message: "Mật khẩu xác nhận không khớp",
      path: ["confirmPassword"],
    }
  )
  .refine((data) => !data.newPassword || data.currentPassword, {
    message: "Vui lòng nhập mật khẩu hiện tại",
    path: ["currentPassword"],
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;
