import { getToken } from "@/services/token";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router";

const usePreBook = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const preBook = async (formData: FormData) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/owner/pre-bookings`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + getToken(),
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status >= 400) throw new Error(res.data.error);

      toast.success(res.data.message);

      navigate("/owner/pre-bookings");
    } catch (error: any) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, preBook };
};
export default usePreBook;
