import { getToken } from "@/services/token";
import { useState } from "react";
import toast from "react-hot-toast";

const useGetOrderDetail = () => {
  const [loading, setLoading] = useState(false);

  const getOrderDetail = async (orderId: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/customer/orders/${orderId}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + getToken(),
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      return data;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, getOrderDetail };
};
export default useGetOrderDetail;
