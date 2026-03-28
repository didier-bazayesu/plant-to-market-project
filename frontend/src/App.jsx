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
import Activity from "./pages/Activities";
import Crops from "./pages/Crops";
import Farmers from "./pages/Farmers";
import FarmerDashboard from "./pages/farmer/Dashboard";
import FarmList from "./pages/farmer/FarmList";
import FarmDetail from "./pages/farmer/FarmDetail";
import CropDetail from "./pages/farmer/CropDetatil";
import AdminDashboard from "./pages/admin/Dashboard";

import { AuthProvider } from './context/AuthContext';
import { CropProvider } from './context/CropContext';
import { FarmProvider } from './context/FarmContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* ── PUBLIC ── */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomeFarm />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* ── FARMER PROTECTED ── */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<FarmerDashboard />} />
        <Route path="activities" element={<Activity />} />
        <Route path="my-farms" element={<FarmList />} />
        <Route path="my-farms/:farmId" element={<FarmDetail />} />
        <Route path="my-farms/:farmId/crops/:cropId" element={<CropDetail />} />
        <Route path="my-crops" element={<Crops />} />
      </Route>

      {/* ── ADMIN PROTECTED ── */}
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
      <FarmProvider>
        <CropProvider>
          <RouterProvider router={router} />
        </CropProvider>
      </FarmProvider>
    </AuthProvider>
  );
}

export default App;
