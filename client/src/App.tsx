import { Route, Routes } from "react-router";
import { useAuthContext } from "./context/AuthContext";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import AdminPage from "./pages/admin";
import OwnerPage from "./pages/owner";
import NotFoundPage from "./not-found";

export default function App() {
  const { isLoading } = useAuthContext();

  if (isLoading) return null;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/owner">
        <Route index element={<OwnerPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// import viteLogo from "/vite.svg";
// <img src={viteLogo} className="logo" alt="Vite logo" />;
