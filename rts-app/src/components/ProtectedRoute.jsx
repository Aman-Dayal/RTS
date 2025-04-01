import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spin } from 'antd';
const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) 
    {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width:"100vw" }}>
            <Spin size="large" />
          </div>;
    }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
