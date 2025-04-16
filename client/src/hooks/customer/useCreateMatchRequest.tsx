import { getToken } from "@/services/token";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import axios from "axios";

const useCreateMatchRequest = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const createMatchRequest = async (formData: FormData) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/customer/match-requests`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + getToken(),
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res);

      if (res.status >= 400) throw new Error(res.data.error);

      toast.success(res.data.message);
      navigate("/my/created-match-requests");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, createMatchRequest };
};
export default useCreateMatchRequest;
