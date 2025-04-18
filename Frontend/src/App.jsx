import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage.jsx";
import RegisterPage from "./Pages/RegisterPage/RegisterPage.jsx";
import LoginPage from "./Pages/LoginPage/LoginPage.jsx";
import Dashboard from "./Pages/UserDashboard/Dashboard.jsx";
import SkillSharingPosts from "./Pages/SkillSharing/SkillSharingPosts.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/skill-sharing" element={<SkillSharingPosts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
