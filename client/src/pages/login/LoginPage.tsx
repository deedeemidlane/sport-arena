import { LoginForm } from "./ui";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const { authUser } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (typeof authUser === "string") return;
    switch (authUser.role) {
      case "ADMIN":
        navigate("/admin");
        break;
      case "OWNER":
        navigate("/owner");
        break;
      case "CUSTOMER":
        navigate("/");
        break;
      default:
        break;
    }
  }, [authUser]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center sm:p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
