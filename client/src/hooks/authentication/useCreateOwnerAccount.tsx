import { useState } from "react";
import toast from "react-hot-toast";
import { OwnerSchema } from "@/pages/register/schema";
import { useNavigate } from "react-router";

const useCreateOwnerAccount = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const createOwnerAccount = async (ownerData: OwnerSchema) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/create-owner-account`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ownerData),
        }
      );

      const data = await res.json();
      console.log(data);

      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("sport_arena_email", ownerData.email);

      toast.success(data.message);
      navigate("/verification");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, createOwnerAccount };
};

export default useCreateOwnerAccount;
