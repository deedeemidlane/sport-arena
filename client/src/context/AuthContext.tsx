import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { getToken } from "@/services/token";

export type IAuthUser = {
  id: string;
  name: string;
  phone: string;
  role: string;
  email: string;
  gender: string;
  avatarUrl?: string;
};

const AuthContext = createContext<{
  authUser: IAuthUser | string;
  setAuthUser: Dispatch<SetStateAction<IAuthUser | string>>;
  isLoading: boolean;
}>({
  authUser: "",
  setAuthUser: () => {},
  isLoading: true,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<IAuthUser | string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/user`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + getToken(),
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        setAuthUser(data);
      } catch (error) {
        setAuthUser("unauthorized");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isLoading,
        setAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
