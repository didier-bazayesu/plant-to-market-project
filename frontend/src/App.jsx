import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";

import Layout from "./components/Layout";
import HomeFarm from "./pages/HomeFarm";
import Farmers from "./pages/Farmers";
import Farm from "./pages/Farm";
import Crops from "./pages/Crops";
import About from "./pages/About";
import Activity from "./pages/Activities";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomeFarm />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="farmers" element={<Farmers />} />
        <Route path="activities" element={<Activity />} />
        <Route path="farms" element={<Farm />} />
        <Route path="crops" element={<Crops />} />
      </Route>
    </>
  )
);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;