import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { inputClass, primaryButton } from "@/admin/styles";
import { Alert, FieldLabel } from "@/admin/components/AdminUi";

export default function LoginPanel({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      onLogin(user);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,186,193,0.18),transparent_35%)]" />
      <form
        onSubmit={submit}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl sm:p-10"
      >
        <a
          href="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-cyan"
        >
          <ArrowLeft className="h-4 w-4" /> Back to website
        </a>
        <img src="/images/logo/logo_dark.png" alt="KASMED" className="mb-8 h-12 w-auto" />
        <h1 className="text-3xl font-extrabold text-navy">Admin sign in</h1>
        <p className="mb-8 mt-2 text-sm text-slate-500">
          Manage KASMED content, partners, messages, and settings.
        </p>
        {error && <Alert tone="error">{error}</Alert>}
        <div className="space-y-5">
          <FieldLabel label="Username">
            <input
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              className={inputClass}
              autoComplete="username"
              required
            />
          </FieldLabel>
          <FieldLabel label="Password">
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className={inputClass}
              autoComplete="current-password"
              required
            />
          </FieldLabel>
          <button disabled={loading} className={`${primaryButton} w-full justify-center`}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
