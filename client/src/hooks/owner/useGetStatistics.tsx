import { getToken } from "@/services/token";
import { useState } from "react";
import toast from "react-hot-toast";

const useGetStatistics = () => {
  const [loading, setLoading] = useState(false);

  const getStatistics = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/owner/statistics`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + getToken(),
          },
        }
      );

      const data = await res.json();
      console.log(data);

      if (!res.ok) throw new Error(data.error);

      return data.fields;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, getStatistics };
};
export default useGetStatistics;
