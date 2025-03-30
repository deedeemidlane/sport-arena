import { getToken } from "@/services/token";
import { useState } from "react";
import toast from "react-hot-toast";

const useUpdateOrderStatus = () => {
  const [loading, setLoading] = useState(false);

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/owner/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getToken(),
          },
          body: JSON.stringify({ status }),
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

  return { loading, updateOrderStatus };
};
export default useUpdateOrderStatus;
