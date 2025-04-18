import { getToken } from "@/services/token";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router";

const useSendComplaint = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const sendComplaint = async (formData: FormData) => {
    console.log("formdata: ", formData);

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/customer/send-complaint`,
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
      navigate("/");
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendComplaint };
};
export default useSendComplaint;
