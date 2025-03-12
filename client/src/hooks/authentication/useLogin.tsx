import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "@/context/AuthContext";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async ({
    phone,
    password,
  }: {
    phone: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, password }),
        }
      );

      const data = await res.json();
      // console.log(data);

      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("token", data.token);

      setAuthUser(data.payload);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};
export default useLogin;
