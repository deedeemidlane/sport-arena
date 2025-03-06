"use server";

import { AuthService } from "@/services/AuthService";
import { UserSchema } from "./schema";

export async function createOwnerAccount(data: UserSchema) {
  const service = new AuthService();

  try {
    const res = await service.createOwnerAccount(data);
    return res;
  } catch (error) {
    console.error("Có lỗi xảy ra, vui lòng thử lại.");
    throw error;
  }
}
