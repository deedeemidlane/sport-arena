import { getToken } from "@/services/token";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const useRequestMatch = () => {
  const [loading, setLoading] = useState(false);

  const requestMatch = async (formData: FormData) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/customer/request-match`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + getToken(),
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res.data);

      toast.success(res.data.message);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.error);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, requestMatch };
};
export default useRequestMatch;
