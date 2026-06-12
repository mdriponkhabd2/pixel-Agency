import React, { useState } from "react";
import { LogIn, UserPlus, ShieldAlert, Key, ArrowLeft, Send } from "lucide-react";
import { User } from "../types";

interface AuthPagesProps {
  onAuthSuccess: (user: User) => void;
  onNavigate: (route: string) => void;
  initialMode?: 'login' | 'signup' | 'admin-login' | 'forgot';
}

export default function AuthPages({ onAuthSuccess, onNavigate, initialMode = 'login' }: AuthPagesProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'admin-login' | 'forgot' | 'reset'>(initialMode);
  
  // Registration States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Login States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Admin States
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // Forgot password simulator states
  const [forgotEmail, setForgotEmail] = useState("");
  const [demoResetToken, setDemoResetToken] = useState("");
  const [newResetPassword, setNewResetPassword] = useState("");

  // Global Info/Error triggers
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const clearMessages = () => {
    setError("");
    setInfo("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError("Please fill out all registration fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, phone, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to register new account");
      }

      setInfo("Registration successful! You are now logged in.");
      setTimeout(() => {
        onAuthSuccess(data.user);
        onNavigate("home");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "An unexpected registration failure occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!loginEmail || !loginPassword) {
      setError("Please input your login email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Invalid credentials combination");
      }

      setInfo("Welcome back! Loading your specialized workspace dashboard...");
      setTimeout(() => {
        onAuthSuccess(data.user);
        onNavigate("home");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Error logging in.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!adminUsername || !adminPassword) {
      setError("Please enter the admin credentials.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminUsername, password: adminPassword })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Incorrect security credentials");
      }

      setInfo("Success! Verified Master Administrator Portal...");
      setTimeout(() => {
        onAuthSuccess(data.user);
        onNavigate("admin");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Credential authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!forgotEmail) {
      setError("Please input your registered email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setInfo("Recovery token has been dispatched successfully! Use recovery code 'PRO-837' to set a new password.");
      // Auto routing helper for demo
      setTimeout(() => {
        setMode('reset');
      }, 2000);
    }, 1200);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (demoResetToken !== "PRO-837") {
      setError("Invalid recovery key. Please check your token and retry.");
      return;
    }
    if (newResetPassword.length < 5) {
      setError("Password must be at least 5 characters long.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setInfo("Password updated successfully! Redirecting to login standard...");
      setTimeout(() => {
        setMode('login');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-28 flex items-center justify-center min-h-[85vh] font-sans" id="auth-pages-viewport">
      <div className="w-full max-w-md bg-dark-card border border-gray-800 rounded-sm p-8 shadow-none relative overflow-hidden">
        
        {/* Visual Orange accent light */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand" />

        {/* Dynamic header title depending on mode */}
        <div className="text-center mb-8">
          {mode === 'login' && (
            <>
              <div className="w-12 h-12 rounded-sm bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-3">
                <LogIn className="w-5 h-5 text-brand" />
              </div>
              <h2 className="text-2xl font-black font-display tracking-wide text-white">Welcome Back</h2>
              <p className="text-xs text-gray-400 mt-1">Access your dynamic packages and workspace portal</p>
            </>
          )}

          {mode === 'signup' && (
            <>
              <div className="w-12 h-12 rounded-sm bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-3">
                <UserPlus className="w-5 h-5 text-brand" />
              </div>
              <h2 className="text-2xl font-black font-display tracking-wide text-white">Join the Studio</h2>
              <p className="text-xs text-gray-400 mt-1">Get custom rates and manage orders dynamically</p>
            </>
          )}

          {mode === 'admin-login' && (
            <>
              <div className="w-12 h-12 rounded-sm bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-3">
                <ShieldAlert className="w-5 h-5 text-brand" />
              </div>
              <h2 className="text-2xl font-black font-display tracking-wide text-white">Admin System Gate</h2>
              <p className="text-xs text-gray-400 mt-1">Secure administrator role access only</p>
            </>
          )}

          {mode === 'forgot' && (
            <>
              <div className="w-12 h-12 rounded-sm bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-3">
                <Key className="w-5 h-5 text-brand" />
              </div>
              <h2 className="text-2xl font-black font-display tracking-wide text-white">Recover Password</h2>
              <p className="text-xs text-gray-400 mt-1">We will send a code to restore account session</p>
            </>
          )}

          {mode === 'reset' && (
            <>
              <div className="w-12 h-12 rounded-sm bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-3">
                <Key className="w-5 h-5 text-brand" />
              </div>
              <h2 className="text-2xl font-black font-display tracking-wide text-white">Reset Password</h2>
              <p className="text-xs text-gray-400 mt-1">Enter your recovery token and new password</p>
            </>
          )}
        </div>

        {/* Global Notifications system */}
        {error && (
          <div className="mb-6 p-4 rounded-sm bg-red-500/10 border border-red-500/30 text-red-400 text-xs leading-relaxed font-mono">
            ⚠ {error}
          </div>
        )}
        {info && (
          <div className="mb-6 p-4 rounded-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs leading-relaxed">
            ✓ {info}
          </div>
        )}

        {/* Login Page Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5" id="form-user-login">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 font-mono">
                Email Address
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-black/50 border border-gray-800 focus:border-brand rounded-sm py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 font-mono">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { clearMessages(); setMode('forgot'); }}
                  className="text-xs text-brand hover:underline font-mono"
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/50 border border-gray-800 focus:border-brand rounded-sm py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-hover text-black py-3 rounded-sm text-sm font-bold tracking-wider transition-all disabled:opacity-50 mt-2"
            >
              {loading ? "Authenticating Session..." : "LOG IN Securely"}
            </button>

            <div className="text-center pt-4 border-t border-gray-800 text-xs text-gray-400 space-y-2">
              <p>
                Don't have an agency account yet?{" "}
                <button
                  type="button"
                  onClick={() => { clearMessages(); setMode('signup'); }}
                  className="text-brand font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
              <p>
                Are you an agency manager?{" "}
                <button
                  type="button"
                  onClick={() => { clearMessages(); setMode('admin-login'); }}
                  className="text-gray-300 font-semibold hover:underline font-mono"
                >
                  Admin Portal Login
                </button>
              </p>
            </div>
          </form>
        )}

        {/* User Registration Form */}
        {mode === 'signup' && (
          <form onSubmit={handleRegister} className="space-y-4" id="form-user-signup">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 font-mono">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Marcus Aurelius"
                className="w-full bg-black/50 border border-gray-800 focus:border-brand rounded-sm py-2.5 px-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 font-mono">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@cloud.com"
                  className="w-full bg-black/50 border border-gray-800 focus:border-brand rounded-sm py-2.5 px-3.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 font-mono">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01837679963"
                  className="w-full bg-black/50 border border-gray-800 focus:border-brand rounded-sm py-2.5 px-3.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 font-mono">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-gray-800 focus:border-brand rounded-sm py-2.5 px-3.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 font-mono">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-gray-800 focus:border-brand rounded-sm py-2.5 px-3.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-hover text-black py-3 rounded-sm text-sm font-bold tracking-wider transition-all disabled:opacity-50 mt-3"
            >
              {loading ? "Registering Credentials..." : "REGISTER ACCOUNT"}
            </button>

            <div className="text-center pt-4 border-t border-gray-800 text-xs text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => { clearMessages(); setMode('login'); }}
                className="text-brand font-semibold hover:underline"
              >
                Log In Here
              </button>
            </div>
          </form>
        )}

        {/* Admin Login Form */}
        {mode === 'admin-login' && (
          <form onSubmit={handleAdminLogin} className="space-y-5" id="form-admin-login">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 font-mono">
                Admin Username
              </label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full bg-black/50 border border-gray-800 focus:border-brand rounded-sm py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 font-mono">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/50 border border-gray-800 focus:border-brand rounded-sm py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-hover text-black py-3 rounded-sm text-sm font-bold tracking-wider transition-all disabled:opacity-50 mt-2"
            >
              {loading ? "Decrypting Node Vault..." : "AUTHORIZE ADMIN ACCESS"}
            </button>

            <div className="text-center pt-4 border-t border-gray-800 text-xs">
              <button
                type="button"
                onClick={() => { clearMessages(); setMode('login'); }}
                className="text-gray-400 hover:text-white flex items-center justify-center space-x-1.5 mx-auto font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Standard Login</span>
              </button>
            </div>
          </form>
        )}

        {/* Forgotten Password Page Form */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-5" id="form-forgot-pass">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 font-mono">
                Your Registered Email
              </label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="enter-your-account-email@gmail.com"
                className="w-full bg-black/50 border border-gray-800 focus:border-brand rounded-sm py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-hover text-black py-3 rounded-sm text-sm font-bold tracking-wider transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "Sending Recovery Token..." : "SEND RECOVERY CODE"}</span>
            </button>

            <div className="text-center pt-4 border-t border-gray-800 text-xs">
              <button
                type="button"
                onClick={() => { clearMessages(); setMode('login'); }}
                className="text-gray-400 hover:text-white flex items-center justify-center space-x-1.5 mx-auto font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to login space</span>
              </button>
            </div>
          </form>
        )}

        {/* Reset Password Form */}
        {mode === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-4" id="form-reset-pass">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 font-mono">
                Recovery Token
              </label>
              <input
                type="text"
                required
                value={demoResetToken}
                onChange={(e) => setDemoResetToken(e.target.value)}
                placeholder="PRO-837"
                className="w-full bg-black/50 border border-gray-800 focus:border-brand rounded-sm py-2.5 px-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all font-mono text-center tracking-widest text-brand"
              />
              <p className="text-[10px] text-gray-500 mt-1 font-mono text-center">Injected Code: <span className="text-white">PRO-837</span></p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 font-mono">
                New Secured Password
              </label>
              <input
                type="password"
                required
                value={newResetPassword}
                onChange={(e) => setNewResetPassword(e.target.value)}
                placeholder="new password"
                className="w-full bg-black/50 border border-gray-800 focus:border-brand rounded-sm py-2.5 px-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-hover text-black py-3 rounded-sm text-sm font-bold tracking-wider transition-all disabled:opacity-50 mt-1"
            >
              {loading ? "Re-encrypting..." : "OVERWRITE PASSWORD"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
