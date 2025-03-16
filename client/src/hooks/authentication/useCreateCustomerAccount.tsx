import { useState } from "react";
import toast from "react-hot-toast";
import { UserSchema } from "@/pages/register/schema";
import { useNavigate } from "react-router";

const useCreateCustomerAccount = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const createCustomerAccount = async (customerData: UserSchema) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/create-customer-account`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customerData),
        }
      );

      const data = await res.json();
      console.log(data);

      if (!res.ok) throw new Error(data.error);

      toast.success(data.message);
      navigate("/verification");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, createCustomerAccount };
};

export default useCreateCustomerAccount;
