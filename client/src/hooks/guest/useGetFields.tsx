import { useState } from "react";
import toast from "react-hot-toast";

const useGetFields = () => {
  const [loading, setLoading] = useState(false);

  const getFields = async (urlSearchParams: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/guest/fields?${urlSearchParams}`,
        { method: "GET" }
      );

      const data = await res.json();
      console.log(data);

      if (!res.ok) throw new Error(data.error);

      return data;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, getFields };
};
export default useGetFields;
