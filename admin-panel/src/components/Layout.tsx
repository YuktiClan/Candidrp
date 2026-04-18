
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-200">

      <Sidebar />   {/* ✅ ONLY HERE */}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

       

        <main className="flex-1 overflow-y-auto pt-3 pb-3 pl-0">
          
          <Outlet />
         
        </main>
      </div>

    </div>
  );
}
