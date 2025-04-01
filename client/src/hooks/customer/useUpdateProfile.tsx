import { getToken } from "@/services/token";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);

  const updateProfile = async (formData: FormData) => {
    try {
      setLoading(true);
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/customer/profile`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + getToken(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res);

      if (res.status >= 400) throw new Error(res.data.error);

      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, updateProfile };
};
export default useUpdateProfile;
