import { getToken } from "@/services/token";
import { useState } from "react";
import toast from "react-hot-toast";

const useReadNotification = () => {
  const [loading, setLoading] = useState(false);

  const readNotification = async (notificationId: number) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/customer/notifications/${notificationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getToken(),
          },
        }
      );

      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.error);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, readNotification };
};
export default useReadNotification;
