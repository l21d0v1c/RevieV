import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 font-satisfy">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-3xl text-gray-300 mb-4">Oops! Page non trouvée</p>
        <a href="/" className="text-blue-400 hover:text-blue-200 underline text-2xl">
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default NotFound;
