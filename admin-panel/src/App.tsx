import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import NewsList from "./pages/NewsList";
import CreateNews from "./pages/CreateNews";
import CreateJob from "./pages/CreateJob";
import Contacts from "./pages/Contacts";
import ResetPassword from "./pages/ResetPassword";

import Login from "./pages/Login";


export default function App() {
  return (
    <Routes>

      {/* 🔐 Protected */}
      <Route element={<ProtectedRoute />}>
        
        {/* Layout ONLY ONCE */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/create" element={<CreateNews />} />
          <Route path="/create-job" element={<CreateJob />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/reset" element={<ResetPassword />} />
         
        </Route>

      </Route>

      {/* Public */}
      <Route path="/login" element={<Login />} />
     
    

    </Routes>
  );
}