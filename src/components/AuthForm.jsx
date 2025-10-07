//Auth Form Component by Marvel. Done. Please dont touch this.

import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "./AuthForm.css";

const AuthForm = ({ onBack, setSession }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSession(data.session);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Signup successful! Please check your email to confirm.");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return setMessage("Enter your email first.");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setMessage(error.message);
    else setMessage("Password reset link sent! Check your email.");
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Welcome Back 👋" : "Create Account 🦋"}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <p className="auth-toggle">
        {isLogin ? (
          <>
            Don’t have an account?{" "}
            <span onClick={() => setIsLogin(false)}>Sign up</span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span onClick={() => setIsLogin(true)}>Login</span>
          </>
        )}
      </p>

      {isLogin && (
        <p className="forgot" onClick={handleForgotPassword}>
          Forgot password?
        </p>
      )}

      {message && <p className="message">{message}</p>}

      <button className="back-btn" onClick={onBack}>
        ⬅ Back
      </button>
    </div>
  );
};

export default AuthForm;
