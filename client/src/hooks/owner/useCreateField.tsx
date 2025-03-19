import { FieldSchema } from "@/pages/owner/fields/schema";
import { getToken } from "@/services/token";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const useCreateField = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const createField = async (fieldData: FieldSchema) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/owner/fields`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + getToken(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fieldData),
        }
      );

      const data = await res.json();
      console.log(data);

      if (!res.ok) throw new Error(data.error);

      toast.success(data.message);
      navigate("/owner/fields");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, createField };
};
export default useCreateField;
