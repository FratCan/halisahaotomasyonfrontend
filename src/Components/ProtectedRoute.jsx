import { useAuth } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // loading bilgisini de alıyoruz

  if (loading) {
    // Kullanıcı bilgisi yükleniyorsa bir yükleniyor animasyonu göster
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    // Kullanıcı login değilse
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
