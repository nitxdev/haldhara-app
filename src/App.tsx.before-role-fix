import { useEffect, useState } from "react";
import { Sprout, Phone, LockKeyhole, UserRound, ArrowRight, ShieldCheck } from "lucide-react";
import Dashboard from "./Dashboard";
import "./Auth.css";

const API = "http://localhost:5001/api";

type User = { id: string; name: string; phone: string; role: string };
type AuthResponse = { success: boolean; message?: string; data?: { token?: string; user?: User } };

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("haldhara_token") || "");
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [stage, setStage] = useState<"details" | "otp">("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("haldhara_token");
    if (!saved) { setChecking(false); return; }

    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${saved}` } })
      .then(async r => {
        if (!r.ok) throw new Error("Session expired");
        return r.json();
      })
      .then(() => setToken(saved))
      .catch(() => {
        localStorage.removeItem("haldhara_token");
        setToken("");
      })
      .finally(() => setChecking(false));
  }, []);

  async function callApi(path: string, body: object) {
    const response = await fetch(`${API}/auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json() as AuthResponse;
    if (!response.ok || result.success === false) {
      throw new Error(result.message || "Request failed. Please try again.");
    }
    return result;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      if (mode === "login") {
        const result = await callApi("login", { phone, password });
        if (!result.data?.token) throw new Error("Login token was not returned.");
        localStorage.setItem("haldhara_token", result.data.token);
        setToken(result.data.token);
        return;
      }

      if (stage === "details") {
        await callApi("otp/request", { phone });
        setStage("otp");
        setMessage("OTP requested. Check the delivery method configured for your number.");
      } else {
        await callApi("otp/verify", { phone, code });
        const result = await callApi("register", { name, phone, password, role: "farmer" });
        if (!result.data?.token) throw new Error("Registration succeeded but no login token was returned.");
        localStorage.setItem("haldhara_token", result.data.token);
        setToken(result.data.token);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    localStorage.removeItem("haldhara_token");
    setToken("");
    setMode("login");
    setStage("details");
    setPassword("");
    setCode("");
    setMessage("You have been logged out.");
  }

  if (checking) {
    return <div className="auth-loading"><Sprout size={34} /> Checking your Haldhara session…</div>;
  }

  if (token) return <Dashboard onLogout={logout} />;

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-brand"><img src="/images/haldhara-logo.svg" alt="Haldhara farmers and mountain logo"/><b>HALDHARA</b></div>
        <div className="auth-landscape" aria-hidden="true">
          <div className="auth-sun"/><div className="auth-mountain one"/><div className="auth-mountain two"/>
          <div className="auth-field"/><div className="auth-farmer">🧑‍🌾</div>
        </div>
        <div className="auth-visual-copy">
          <span className="auth-eyebrow">ROOTED IN THE LAND</span>
          <h1>Our farmers.<br/>Our future.</h1>
          <p>Connecting Arunachal's farmers to better opportunities, trusted buyers and a stronger community.</p>
          <div className="auth-trust"><ShieldCheck size={18}/> Built for farmers across Northeast India</div>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-card">
          <div className="auth-mobile-brand"><img src="/images/haldhara-logo.svg" alt="Haldhara logo"/> HALDHARA</div>
          <span className="auth-eyebrow">{mode === "login" ? "WELCOME BACK" : "JOIN THE COMMUNITY"}</span>
          <h2>{mode === "login" ? "Welcome back!" : stage === "otp" ? "Verify your phone" : "Create your account"}</h2>
          <p className="auth-subtitle">
            {mode === "login" ? "Sign in to access your farmer dashboard." :
             stage === "otp" ? "Enter the OTP you received on your phone." :
             "Create a farmer account to get started with Haldhara."}
          </p>

          <div className="auth-tabs">
            <button className={mode === "login" ? "selected" : ""} onClick={() => { setMode("login"); setStage("details"); setMessage(""); }}>Log in</button>
            <button className={mode === "register" ? "selected" : ""} onClick={() => { setMode("register"); setStage("details"); setMessage(""); }}>Create account</button>
          </div>

          <form onSubmit={submit} className="auth-form">
            {mode === "register" && stage === "details" && (
              <label>Full name
                <span className="auth-input"><UserRound size={18}/><input required value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" autoComplete="name"/></span>
              </label>
            )}
            <label>Phone number
              <span className="auth-input"><Phone size={18}/><input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91XXXXXXXXXX" autoComplete="tel" disabled={stage === "otp" && mode === "register"}/></span>
            </label>
            {mode === "register" && stage === "otp" && (
              <label>Verification code
                <span className="auth-input"><ShieldCheck size={18}/><input required value={code} onChange={e => setCode(e.target.value)} placeholder="Enter OTP" inputMode="numeric" autoComplete="one-time-code" maxLength={8}/></span>
              </label>
            )}
            {(mode === "login" || stage === "details") && (
              <label>Password
                <span className="auth-input"><LockKeyhole size={18}/><input required type="password" minLength={12} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 12 characters" autoComplete={mode === "login" ? "current-password" : "new-password"}/></span>
              </label>
            )}
            {message && <div className="auth-message" role="status">{message}</div>}
            <button className="auth-submit" disabled={busy} type="submit">
              {busy ? "Please wait…" : mode === "login" ? "Log in to Haldhara" : stage === "details" ? "Send verification OTP" : "Verify & create account"}
              {!busy && <ArrowRight size={18}/>}
            </button>
            {mode === "register" && stage === "otp" && (
              <button type="button" className="auth-back" onClick={() => { setStage("details"); setCode(""); setMessage(""); }}>Change details</button>
            )}
          </form>
          <p className="auth-footnote"><ShieldCheck size={15}/> Your account is protected by phone verification and secure sign-in.</p>
        </div>
        <footer className="auth-footer">HALDHARA · हमारे किसान हमारा भविष्य</footer>
      </section>
    </main>
  );
}

export default App;

