import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const useCreateCustomerAccount = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const createCustomerAccount = async (formData: FormData) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/create-customer-account`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log(res);

      if (res.status >= 400) throw new Error(res.data.error);

      toast.success(res.data.message);
      navigate("/verification");
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, createCustomerAccount };
};

export default useCreateCustomerAccount;
