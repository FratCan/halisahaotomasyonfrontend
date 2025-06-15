import NavBar from './Components/NavBar';
import { BrowserRouter as Router, Routes, Route,useLocation } from "react-router-dom";
import FacilitiesPage from "./pages/FacilitiesPage";
import HomePage from "./pages/HomePage";
import ReservationPage from "./pages/ReservationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import FieldsPage from "./pages/FieldsPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import AnnouncementPage from './pages/AnnouncementPage';
import { AuthProvider } from "./Context/AuthContext";
import ResetPasswordPage from './pages/ResetPasswordPage';
import PersonPage from './pages/PersonPage';
import { useState } from "react";
// App.js veya index.js
import "leaflet/dist/leaflet.css";


function Appcontent() {
  const location = useLocation();
  const [facilityId, setFacilityId] = useState(null);

  // Bu sayfalarda navbar gösterme
  const hideNavPaths = ["/","/login", "/register","/forgot-password","/reset-password"];
  const shouldShowNav = !hideNavPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNav && <NavBar />}
      <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/personal-info" element={<PersonPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />}></Route>
          <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/facility" element={<ProtectedRoute><FacilitiesPage /></ProtectedRoute>} />
          <Route path="/fields" element={
              <ProtectedRoute>
                <FieldsPage facilityId={facilityId} setFacilityId={setFacilityId} />
              </ProtectedRoute>}
          />
          <Route path="/reservation" element={<ProtectedRoute><ReservationPage /></ProtectedRoute>} />
          {/*<Route path="/announcement" element={<ProtectedRoute><AnnouncementPage/></ProtectedRoute>}/>*/}
      </Routes>
    </>
  );
}
function App() {
  return (
    <AuthProvider>
    <Router>
      <Appcontent />
    </Router>
    </AuthProvider>
  );
}

export default App;