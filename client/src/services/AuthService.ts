import { UserSchema } from "@/app/register/schema";
import { ApiService } from "./apiService";

export class AuthService {
  async createOwnerAccount(data: UserSchema) {
    try {
      return await ApiService.post("/api/auth/owner/create-account", data);
    } catch (error) {
      console.error("Error create owner account:", error);
      throw error;
    }
  }
}
