import NavBar from './Components/NavBar';
import { BrowserRouter as Router, Routes, Route,useLocation } from "react-router-dom";
import FacilitiesPage from "./pages/FacilitiesPage";
import HomePage from "./pages/HomePage";
import ReservationPage from "./pages/ReservationPage";
import RegisterPage from "./pages/RegisterPage";
import FieldsPage from "./pages/FieldsPage";

import ProtectedRoute from "./Components/ProtectedRoute";
import AnnouncementPage from './pages/AnnouncementPage';
import { AuthProvider } from "./Context/AuthContext";


function Appcontent() {
  const location = useLocation();

  // Bu sayfalarda navbar gösterme
  const hideNavPaths = ["/","/login", "/register"];
  const shouldShowNav = !hideNavPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNav && <NavBar />}
      <Routes>
          <Route path="/" element={<FacilitiesPage />} />
          <Route path="/login" element={<FacilitiesPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/facility" element={<ProtectedRoute><FacilitiesPage /></ProtectedRoute>} />
          <Route path="/fields" element={<ProtectedRoute><FieldsPage /></ProtectedRoute>} />
          <Route path="/reservation" element={<ProtectedRoute><ReservationPage /></ProtectedRoute>} />
          <Route path="/announcement" element={<ProtectedRoute><AnnouncementPage/></ProtectedRoute>}/>
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