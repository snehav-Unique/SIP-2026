import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export function SecretLoginPage() {
  const { loginWithGoogle, status, allowedEmailsConfigured } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "authorized") {
      navigate("/sipannouncements/admin");
    }
  }, [status, navigate]);

  const handleGoogle = async () => {
    setError(null);
    const res = await loginWithGoogle();
    if (res.ok) navigate("/sipannouncements/admin");
    else setError(res.message || "Google sign-in failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg border-2 border-primary/15 p-6">
        <h1 className="text-2xl font-bold mb-2">Dean Access</h1>
        <p className="text-sm text-gray-600 mb-6">
          Sign in with your authorized Google account.
        </p>

        {!allowedEmailsConfigured && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <code>VITE_ALLOWED_DEANS</code> is empty — Google login will reject
            every account until allowed dean emails are configured.
          </div>
        )}

        <button
          onClick={handleGoogle}
          disabled={status === "loading"}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {status === "loading" ? "Signing in..." : "Sign in with Google"}
        </button>

        {error && (
          <div className="mt-4 text-sm text-red-600">{error}</div>
        )}
      </div>
    </div>
  );
}