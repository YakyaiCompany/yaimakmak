import { useState } from "react";
import { postJson, ApiRequestError } from "../../../lib/api";
import { COMPANY } from "../../../config/company";

export function LoginScreen({ onLoginSuccess, onBack }: { onLoginSuccess: () => void; onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
              disabled={loading}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-ink-950 mb-1" htmlFor="password">รหัสผ่าน</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700 bg-white text-ink-950"
              placeholder="••••••••"
              disabled={loading}
              required
            />
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
