import React, { useEffect } from "react";
import { Routes, Route, useNavigationType, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signinn from "./pages/Signinn";
import Customers from "./pages/Customers";
import Admin from "./pages/Admin";
import Setting from "./pages/Setting";
import Partner from "./pages/Partner";
import Profile from "./pages/Profile";
import Form from "./pages/Form";
import Transport from "./pages/Transport";
import Boq from "./pages/Boq";
import Lead from "./pages/Lead";
import PrivateRoute from './components/PrivateRoute';

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "Dashboard";
        metaDescription = "Dashboard page";
        break;
      case "/login":
        title = "Login";
        metaDescription = "Login page";
        break;
      case "/signinn":
        title = "Sign In";
        metaDescription = "Sign In page";
        break;
      case "/customers":
        title = "Customers";
        metaDescription = "Customers page";
        break;
      case "/admin":
        title = "Admin";
        metaDescription = "Admin page";
        break;
      case "/setting":
        title = "Settings";
        metaDescription = "Settings page";
        break;
      case "/partner":
        title = "Partners";
        metaDescription = "Partners page";
        break;
      case "/profile":
        title = "Profile";
        metaDescription = "Profile page";
        break;
      case "/form":
        title = "Form";
        metaDescription = "Form page";
        break;
      case "/transport":
        title = "Transport";
        metaDescription = "Transport page";
        break;
      case "/boq":
        title = "Boq";
        metaDescription = "Boq Page";
        break;
      case "/lead":
        title = "Lead";
        metaDescription = "Lead Page";
        break;
      default:
        title = "App";
        metaDescription = "App page";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector('head > meta[name="description"]');
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<PrivateRoute element={Dashboard} requiredRole="user" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signinn" element={<Signinn />} />
      <Route path="/customers" element={<PrivateRoute element={Customers} requiredRole="user" />} />
      <Route path="/setting" element={<PrivateRoute element={Setting} requiredRole="admin" />} />
      <Route path="/admin" element={<PrivateRoute element={Admin} requiredRole="admin" />} />
      <Route path="/partner" element={<PrivateRoute element={Partner} requiredRole="user" />} />
      <Route path="/profile" element={<PrivateRoute element={Profile} requiredRole="user" />} />
      <Route path="/form" element={<PrivateRoute element={Form} requiredRole="user" />} />
      <Route path="/transport" element={<PrivateRoute element={Transport} requiredRole="user" />} />
      <Route path="/boq" element={<PrivateRoute element={Boq} requiredRole="user" />} />
      <Route path="/lead" element={<PrivateRoute element={Lead} requiredRole="user" />} />
    </Routes>
  );
}

export default App;
