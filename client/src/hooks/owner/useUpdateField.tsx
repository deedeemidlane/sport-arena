import { getToken } from "@/services/token";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import axios from "axios";

const useUpdateField = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const updateField = async (fieldId: string, formData: FormData) => {
    try {
      setLoading(true);
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/owner/fields/${fieldId}`,
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
      navigate("/owner/fields");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, updateField };
};
export default useUpdateField;
