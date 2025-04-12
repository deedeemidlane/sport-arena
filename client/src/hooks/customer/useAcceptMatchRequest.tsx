import { getToken } from "@/services/token";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router";

const useAcceptMatchRequest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const acceptMatchRequest = async (formData: FormData) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/customer/accept-match-request`,
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
      navigate("/my/created-match-requests?status=ALL");
    } catch (error: any) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, acceptMatchRequest };
};
export default useAcceptMatchRequest;
