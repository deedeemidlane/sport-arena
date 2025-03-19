import { z } from "zod";

export const fieldSchema = z.object({
  sportType: z
    .string({ required_error: "Vui lòng chọn môn thể thao" })
    .min(1, { message: "Vui lòng chọn môn thể thao" }),
  name: z.string().min(1, { message: "Vui lòng nhập tên sân" }),
  numOfFields: z.coerce
    .number({ required_error: "Vui lòng nhập số lượng sân" })
    .min(1, { message: "Số lượng sân phải lớn hơn 0" }),
  province: z
    .string({ required_error: "Vui lòng chọn tỉnh/thành phố" })
    .min(1, { message: "Vui lòng chọn tỉnh/thành phố" }),
  district: z
    .string({ required_error: "Vui lòng chọn quận/huyện" })
    .min(1, { message: "Vui lòng chọn quận/huyện" }),
  ward: z
    .string({ required_error: "Vui lòng chọn xã/phường" })
    .min(1, { message: "Vui lòng chọn xã/phường" }),
  address: z.string().min(1, { message: "Vui lòng nhập địa chỉ" }),
  pricePerHour: z.coerce
    .number()
    .min(1, { message: "Giá thuê phải lớn hơn 0" }),
  description: z.string().optional(),
});

export type FieldSchema = z.infer<typeof fieldSchema>;

export const defaultFormValue: FieldSchema = {
  sportType: "",
  name: "",
  numOfFields: 1,
  province: "",
  district: "",
  ward: "",
  address: "",
  pricePerHour: 0,
  description: "",
};
