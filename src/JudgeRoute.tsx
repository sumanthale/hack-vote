// JudgeRoute.tsx
import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";

interface JudgeRouteProps {
  children: React.ReactNode;
  path: string; // the secret code to check
}

const JudgeRoute: React.FC<JudgeRouteProps> = ({ children, path }) => {
  const location = useLocation();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const storedSecret = localStorage.getItem("is_main");
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");

    if (storedSecret === path) {
      setAllowed(true);
    } else if (code === path) {
      localStorage.setItem("is_main", path);
      setAllowed(true);
    } else {
      setAllowed(false);
    }
  }, [location.search, path]);

  if (allowed === null) return null; // loading state
  if (!allowed) return <Navigate to="/" replace />; // redirect if not allowed

  return <>{children}</>;
};

export default JudgeRoute;
