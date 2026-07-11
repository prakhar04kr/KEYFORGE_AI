import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, UserPlus, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [, navigate] = useLocation();
  const { register } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Terminal className="w-7 h-7 text-primary" />
            <span className="font-mono font-bold text-2xl text-primary">KEYFORGE</span>
          </div>
          <CardTitle className="font-mono text-foreground text-lg">Create Account</CardTitle>
          <p className="text-muted-foreground text-sm font-mono">Join the typing elite</p>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted-foreground uppercase mb-1">Username</label>
              <input
                type="text"
                {...field("username")}
                required
                pattern="[a-zA-Z0-9_]+"
                minLength={3}
                maxLength={30}
                className="w-full px-3 py-2 bg-background/60 border border-border/60 rounded-md font-mono text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors placeholder:text-muted-foreground/40"
                placeholder="keyforger_42"
              />
              <p className="text-xs text-muted-foreground/60 mt-1 font-mono">Letters, numbers, underscores only</p>
            </div>
            <div>
              <label className="block text-xs font-mono text-muted-foreground uppercase mb-1">Email</label>
              <input
                type="email"
                {...field("email")}
                required
                className="w-full px-3 py-2 bg-background/60 border border-border/60 rounded-md font-mono text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors placeholder:text-muted-foreground/40"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted-foreground uppercase mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  {...field("password")}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 pr-10 bg-background/60 border border-border/60 rounded-md font-mono text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors placeholder:text-muted-foreground/40"
                  placeholder="Min 6 characters"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-muted-foreground uppercase mb-1">Confirm Password</label>
              <input
                type={showPass ? "text" : "password"}
                {...field("confirm")}
                required
                className="w-full px-3 py-2 bg-background/60 border border-border/60 rounded-md font-mono text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors placeholder:text-muted-foreground/40"
                placeholder="Repeat password"
              />
            </div>

            {error && (
              <div className="px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-background font-mono font-bold text-sm rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-pulse">CREATING ACCOUNT...</span>
              ) : (
                <><UserPlus className="w-4 h-4" /> CREATE ACCOUNT</>
              )}
            </button>

            <div className="text-center text-sm text-muted-foreground font-mono">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")} className="text-primary hover:underline cursor-pointer">
                Sign in
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
