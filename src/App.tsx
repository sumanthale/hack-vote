import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { TeamPage } from "./pages/TeamPage";
import { AdminPage } from "./pages/AdminPage";
import { JudgePage } from "./pages/JudgePage";
import { ResultsPage } from "./pages/ResultsPage";
import JudgeRoute from "./JudgeRoute";
import { useEffect, useState } from "react";

function App() {
  const [role, setRole] = useState<"visitor" | "judge" | null>(null);

  useEffect(() => {
    const secret = localStorage.getItem("is_main");
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");
    if (secret === "cq-superjudge") {
      setRole("judge");
    } else if (code === "cq-superjudge") {
      localStorage.setItem("is_main", "cq-superjudge");
      setRole("judge");
    } else {
      setRole("visitor");
    }
  }, []);



  if (!role) return null; // optional: loader while checking role

  return (
    <Router>
      <Layout>
        <Routes>
          {role === "judge" ? (
            <>
              <Route path="/admin" element={<AdminPage />} />
              <Route
                path="/"
                element={
                  <JudgeRoute path="cq-superjudge">
                    <JudgePage />
                  </JudgeRoute>
                }
              />
              <Route
                path="/judge"
                element={
                  <JudgeRoute path="cq-superjudge">
                    <JudgePage />
                  </JudgeRoute>
                }
              />
              <Route
                path="/results"
                element={
                  <JudgeRoute path="cq-superjudge">
                    <ResultsPage />
                  </JudgeRoute>
                }
              />
            </>
          ) : (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/team/:teamId" element={<TeamPage />} />
            </>
          )}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
