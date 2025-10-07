// Author: Marve 🦋
// Description: Taskify App - Handles landing/auth + main dashboard rendering

import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import DashboardCards from "./components/DashboardCards";
import AddTransactionSection from "./components/AddTransactionSection";
import DashboardAnalytics from "./components/DashboardAnalytics"; 
import RightPanel from "./components/RightPanel";
import LandingPage from "./components/LandingPage";
import AuthForm from "./components/AuthForm";
import "./App.css";

const App = () => {
  const [session, setSession] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="landing-auth-wrapper">
        {!showAuth ? (
          <LandingPage onGetStarted={() => setShowAuth(true)} />
        ) : (
          <AuthForm onBack={() => setShowAuth(false)} setSession={setSession} />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <div className="main-wrapper">
        <Sidebar />
        <main className="main-content">
          <DashboardHeader />
          <DashboardCards />
          <AddTransactionSection />
          <DashboardAnalytics /> {/* Raven’s chart area */}
        </main>
        <RightPanel />
      </div>
    </div>
  );
};

export default App;
