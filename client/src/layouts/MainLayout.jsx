import { Navigate, Outlet } from "react-router";

const MainLayout = () => {
  if (!localStorage.getItem("access_token")) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="w-full h-dvh">
      <Outlet />
    </div>
  );
};

export default MainLayout;
