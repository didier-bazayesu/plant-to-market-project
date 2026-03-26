import { Outlet, Link } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div>
      <Navbar/>
      <hr />
      <Outlet />
    </div>
  );
}

export default Layout;
