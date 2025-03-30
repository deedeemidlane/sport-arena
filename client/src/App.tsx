import { Route, Routes } from "react-router";
import { useAuthContext } from "./context/AuthContext";

import {
  NotFoundPage,
  PrivacyPolicyPage,
  TermOfServicePage,
} from "./pages/static";

import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import VerificationPage from "./pages/verification/VerificationPage";

import AdminPage from "./pages/admin";

import { OwnerPage, OwnerPageLayout } from "./pages/owner";
import OwnerFieldsPage from "./pages/owner/fields";
import CreateFieldPage from "./pages/owner/fields/create";
import UpdateFieldPage from "./pages/owner/fields/update";
import FieldsPage from "./pages/home/fields";
import FieldDetailPage from "./pages/home/fields/[fieldId]";
import BookingPage from "./pages/home/fields/[fieldId]/booking";
import OrdersPage from "./pages/owner/orders";

export default function App() {
  const { isLoading } = useAuthContext();

  if (isLoading) return null;

  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="fields">
        <Route index element={<FieldsPage />} />
        <Route path=":fieldId">
          <Route index element={<FieldDetailPage />} />
          <Route path="booking" element={<BookingPage />} />
        </Route>
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="verification" element={<VerificationPage />} />
      <Route path="admin" element={<AdminPage />} />
      <Route path="owner" element={<OwnerPageLayout />}>
        <Route index element={<OwnerPage />} />
        <Route path="fields">
          <Route index element={<OwnerFieldsPage />} />
          <Route path="create" element={<CreateFieldPage />} />
          <Route path=":fieldId" element={<UpdateFieldPage />} />
        </Route>
        <Route path="orders">
          <Route index element={<OrdersPage />} />
        </Route>
      </Route>
      <Route path="term-of-service" element={<TermOfServicePage />} />
      <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// import viteLogo from "/vite.svg";
// <img src={viteLogo} className="logo" alt="Vite logo" />;
