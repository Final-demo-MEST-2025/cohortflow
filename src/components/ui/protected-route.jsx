import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../../services/auth";


export default function ProtectedRoute({ roles }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = authService.getAuthenticatedUser();

  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        const refreshed = await  authService.refreshAuthToken();
        if (!refreshed) {
          navigate("auth/login", { 
            replace: true,
            state: { from: location }
          });
          return;
        }
      }

      // Check for authorization
      if (roles) {
        const userRoles = [];
        userRoles.push(role);
        const hasRequiredRoles = roles.some(role => userRoles.includes(role));

        if (!hasRequiredRoles) {
          navigate("/unauthorized", { replace: true });
          setIsAuthorized(false);
          return;
        }
      }
      setIsAuthorized(true);
    };

    checkAuth();
  }, [navigate, location, roles, role]);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? <Outlet /> : null;
}