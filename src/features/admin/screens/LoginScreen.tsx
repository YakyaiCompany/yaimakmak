import { useState } from "react";
import { postJson, ApiRequestError } from "../../../lib/api";
import { COMPANY } from "../../../config/company";

export function LoginScreen({ onLoginSuccess, onBack }: { onLoginSuccess: () => void; onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const res = await postJson<{ error?: { message?: string } }, { email: string; password: string }>("/api/v1/admin/auth/login", { email, password });
      if (res.error) {
        setError(res.error.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else {
        onLoginSuccess();
      }
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.code === "unauthorized") {
          setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        } else {
          setError(err.message);
        }
      } else {
        setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-100 p-4 font-body">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-ink-300/60">
        <div className="bg-brand-900 p-8 text-center">
          <h1 className="text-2xl font-heading font-bold text-white">{COMPANY.shortName} Admin</h1>
          <p className="text-brand-300 text-sm mt-2">ระบบจัดการเนื้อหาเว็บไซต์</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          <div className="mb-5">
            <label className="block text-sm font-medium text-ink-950 mb-1" htmlFor="email">อีเมล</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700 bg-white text-ink-950"
              placeholder="admin@example.com"
              autoComplete="username"
              disabled={loading}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-ink-950 mb-1" htmlFor="password">รหัสผ่าน</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-ink-300 py-2.5 pl-4 pr-11 text-sm focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700 bg-white text-ink-950"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(current => !current)}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink-600 transition-colors hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                title={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                disabled={loading}
              >
                {showPassword ? (
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9.4 4.2 10 8-.2 1.3-.8 2.5-1.6 3.5M6.2 6.2C4.3 7.7 2.7 9.9 2 12c.6 3.8 4.5 8 10 8 1.3 0 2.6-.3 3.7-.8" />
                  </svg>
                ) : (
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-8 10-8 10 8 10 8-3.5 8-10 8S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-700 hover:bg-brand-800 text-white font-medium py-3 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-ink-700 text-sm hover:text-brand-700 transition-colors"
            >
              &larr; กลับสู่หน้าเว็บไซต์หลัก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
