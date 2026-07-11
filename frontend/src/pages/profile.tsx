import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth, getAuthHeaders } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Shield, Calendar, Activity, Zap, Target, Hash, LogOut } from "lucide-react";

interface ProfileData {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Summary {
  bestWpm: number;
  averageWpm: number;
  bestAccuracy: number;
  totalTests: number;
}

export default function Profile() {
  const [, navigate] = useLocation();
  const { user, logout, token } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    const headers = getAuthHeaders();
    Promise.all([
      fetch("/api/profile", { headers }).then(r => r.json()),
      user ? fetch(`/api/stats/summary?username=${user.username}`).then(r => r.json()) : Promise.resolve(null),
    ]).then(([p, s]) => {
      setProfile(p);
      setSummary(s);
    }).finally(() => setLoading(false));
  }, [token, user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Skeleton className="h-10 w-48 bg-primary/10" />
      <Skeleton className="h-40 bg-primary/5 rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 bg-primary/5 rounded-xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-mono text-foreground flex items-center gap-3">
          <User className="w-8 h-8 text-primary" />
          Profile
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors font-mono text-sm"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {profile && (
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader><CardTitle className="font-mono text-primary text-lg">Account Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={User} label="Username" value={profile.username} />
              <InfoRow icon={Mail} label="Email" value={profile.email} />
              <InfoRow icon={Shield} label="Role" value={profile.role.toUpperCase()} />
              <InfoRow icon={Calendar} label="Joined" value={new Date(profile.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })} />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={Zap} label="Best WPM" value={summary?.bestWpm ?? 0} loading={loading} />
        <StatCard icon={Activity} label="Avg WPM" value={summary?.averageWpm ?? 0} loading={loading} />
        <StatCard icon={Target} label="Best Accuracy" value={`${summary?.bestAccuracy ?? 0}%`} loading={loading} />
        <StatCard icon={Hash} label="Total Tests" value={summary?.totalTests ?? 0} loading={loading} />
      </div>

      <div className="flex gap-3">
        <button onClick={() => navigate("/analytics")}
          className="flex-1 py-2.5 border border-primary/40 text-primary hover:bg-primary/10 transition-colors rounded-md font-mono text-sm">
          View Analytics
        </button>
        <button onClick={() => navigate("/type/english")}
          className="flex-1 py-2.5 bg-primary text-background hover:bg-primary/90 transition-colors rounded-md font-mono font-bold text-sm">
          Start Typing
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/40 border border-border/30">
      <Icon className="w-4 h-4 text-primary shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-mono uppercase">{label}</p>
        <p className="text-sm text-foreground font-mono truncate">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, loading }: { icon: any; label: string; value: any; loading: boolean }) {
  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase">{label}</p>
          {loading ? <Skeleton className="h-7 w-20 bg-primary/10 mt-1" /> :
            <p className="text-2xl font-bold font-mono text-foreground">{value}</p>}
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-5 h-5" />
        </div>
      </CardContent>
    </Card>
  );
}
