import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "@/context/AuthContext";
import { removeToken } from "@/services/token";
import { useNavigate } from "react-router";

const useLogout = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
      removeToken();
      setAuthUser("unauthorized");
      navigate("/");
    } catch (error: any) {
      console.error(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};
export default useLogout;
