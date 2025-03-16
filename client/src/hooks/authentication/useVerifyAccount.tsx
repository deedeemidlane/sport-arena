import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
// import { useAuthContext } from "@/context/AuthContext";

const useVerifyAccount = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const { setAuthUser } = useAuthContext();

  const verifyAccount = async ({ code }: { code: string }) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-account`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        }
      );

      const data = await res.json();
      console.log(data);

      if (!res.ok) throw new Error(data.message);

      toast.success(data.message);
      navigate("/login");

      // localStorage.setItem("token", data.token);

      // setAuthUser(data.payload);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, verifyAccount };
};
export default useVerifyAccount;
