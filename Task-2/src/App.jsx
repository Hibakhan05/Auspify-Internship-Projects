import { useEffect, useLayoutEffect, useState } from "react";
import { useAuth } from "./hooks/useAuth";
import LandingPage from "./components/landing/LandingPage";
import AuthView from "./components/auth/AuthView";
import Dashboard from "./components/dashboard/Dashboard";

/**
  Two separate environments:
  public   landing page + auth views
  private  dashboard (only when a session exists)
  Switching between them unmounts the old tree, and every GSAP context inside
  it is reverted by its own effect cleanup.
 */
export default function App() {
  const { user, logOut } = useAuth();
  const [route, setRoute] = useState("landing"); // landing | login | signup

  // Every view change starts at the top, without a smooth scroll animation.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [route, user?.id]);

  useEffect(() => {
    document.title = user ? "Workspace | clareo." : "clareo.";
  }, [user]);

  const handleLogout = () => {
    setRoute("landing");
    logOut();
  };

  if (user) return <Dashboard key={user.id} user={user} onLogout={handleLogout} />;

  if (route === "login" || route === "signup") {
    return <AuthView mode={route} onSwitch={setRoute} onBack={() => setRoute("landing")} />;
  }

  return <LandingPage onNavigate={setRoute} />;
}
