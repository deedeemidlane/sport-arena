import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export const CustomerLayout = () => {
  const { authUser } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (
      authUser === "unauthorized" ||
      (typeof authUser !== "string" && authUser.role !== "CUSTOMER")
    ) {
      navigate("/login");
    }
  }, [authUser]);
  return (
    <div>
      <Outlet />
    </div>
  );
};
