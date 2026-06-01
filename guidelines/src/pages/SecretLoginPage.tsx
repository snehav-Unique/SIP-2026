import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export function SecretLoginPage() {
  const { loginWithGoogle, loginWithPassword, status } = useAuth();
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogle = async () => {
    setError(null);
    const res = await loginWithGoogle();
    if (res.ok) navigate("/sipannouncements/admin");
    else setError(res.message || "Google sign-in failed");
  };

  const handlePassword = async () => {
    setError(null);
    const res = await loginWithPassword(pwd);
    if (res.ok) navigate("/sipannouncements/admin");
    else setError(res.message || "Password login failed");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Dean Access</h1>
        <p className="text-sm text-gray-600 mb-6">Sign in with your Google account or use the emergency password.</p>

        <div className="space-y-4">
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
          >
            Sign in with Google
          </button>

          <div className="text-center text-sm text-gray-400">— or —</div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Password</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary"
                placeholder="Enter emergency password"
              />
              <button onClick={handlePassword} className="px-4 py-2 bg-primary text-white rounded-lg font-semibold">
                Login
              </button>
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
          {status === "loading" && <div className="text-sm text-gray-500">Checking credentials…</div>}
        </div>
      </div>
    </div>
  );
}
