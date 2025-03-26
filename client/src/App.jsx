import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";
import UserFavoritePage from "./pages/UserFavoritePage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/favorites" element={<UserFavoritePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
