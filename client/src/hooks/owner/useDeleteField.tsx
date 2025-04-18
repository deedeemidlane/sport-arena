import { getToken } from "@/services/token";
import { useState } from "react";
import toast from "react-hot-toast";

const useDeleteField = () => {
  const [loading, setLoading] = useState(false);

  const deleteField = async (fieldId: number) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/owner/fields/${fieldId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + getToken(),
          },
        }
      );

      const data = await res.json();
      console.log(data);

      if (!res.ok) throw new Error(data.error);

      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, deleteField };
};
export default useDeleteField;
