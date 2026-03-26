import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";

import Layout from "./components/Layout";
import HomeFarm from "./pages/HomeFarm";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Farm from "./pages/Farm";
import Crops from "./pages/Crops";
import Activity from "./pages/Activities";
import Farmers from "./pages/Farmers";
import FarmerDashboard from "./pages/farmer/Dashboard";

import { AuthProvider } from './context/AuthContext';
import { CropProvider } from './context/CropContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from "./pages/admin/Dashboard";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* ── PUBLIC routes ── */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomeFarm />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* ── FARMER protected routes ── */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<FarmerDashboard />} />
        <Route path="activities" element={<Activity />} />
        <Route path="farms" element={<Farm />} />
        <Route path="crops" element={<Crops />} />
      </Route>

      {/* ── ADMIN only routes ── */}
      <Route path="/admin" element={
        <AdminRoute>
          <Layout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="farmers" element={<Farmers />} />
      </Route>
    </>
  )
);

function App() {
  return (
    <AuthProvider>
      <CropProvider>
        <RouterProvider router={router} />
      </CropProvider>
    </AuthProvider>
  );
}

export default App;