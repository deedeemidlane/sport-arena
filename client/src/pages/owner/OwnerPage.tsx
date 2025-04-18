import { useEffect } from "react";
import { useNavigate } from "react-router";

export const OwnerPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/owner/dashboard");
  }, []);

  return <></>;
};
