import { useState, useEffect } from "react";
import { useGetStatsSummary, useGetStatsTrends } from "@/lib/api";
import { useUsername } from "@/hooks/use-username";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, ReferenceLine, ComposedChart, Scatter,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Target, Zap, Hash, TrendingUp, TrendingDown, Minus, Brain } from "lucide-react";

interface WpmPrediction {
  currentAvg: number;
  predictedNext: number;
  predicted7Day: number;
  predicted30Day: number;
  trend: "improving" | "stable" | "declining";
  sessionsCount: number;
  slope: number;
  r2: number;
  historicalData: Array<{ session: number; actual: number; predicted: number }>;
}

interface AccPrediction {
  currentAvg: number;
  predictedNext: number;
  predicted7Day: number;
  predicted30Day: number;
  trend: "improving" | "stable" | "declining";
}

interface GoalResult {
  targetValue: number;
  currentAvg: number;
  estimatedDays: number;
  estimatedSessions: number;
  trend: "improving" | "stable" | "declining";
  achievable: boolean;
}

interface LangPrediction {
  language: string;
  currentAvg: number;
  predictedNext: number;
  predicted30Day: number;
  trend: "improving" | "stable" | "declining";
  sessionsCount: number;
}

const TREND_ICON = {
  improving: TrendingUp,
  stable: Minus,
  declining: TrendingDown,
};
const TREND_COLOR = {
  improving: "text-green-400",
  stable: "text-yellow-400",
  declining: "text-red-400",
};

export default function Analytics() {
  const { username } = useUsername();
  const { user } = useAuth();
  const activeUser = user?.username || username;
  const [days, setDays] = useState("30");

  const { data: summary, isLoading: summaryLoading } = useGetStatsSummary(
    { username: activeUser },
    { query: { enabled: !!activeUser, queryKey: ["stats-summary", activeUser] } }
  );
  const { data: trends, isLoading: trendsLoading } = useGetStatsTrends(
    { username: activeUser, days: parseInt(days) },
    { query: { enabled: !!activeUser, queryKey: ["stats-trends", activeUser, days] } }
  );

  const [wpmPred, setWpmPred] = useState<WpmPrediction | null>(null);
  const [accPred, setAccPred] = useState<AccPrediction | null>(null);
  const [langPred, setLangPred] = useState<LangPrediction[]>([]);
  const [predLoading, setPredLoading] = useState(false);
  const [goalTarget, setGoalTarget] = useState("100");
  const [goalResult, setGoalResult] = useState<GoalResult | null>(null);
  const [goalLoading, setGoalLoading] = useState(false);

  useEffect(() => {
    if (!activeUser) return;
    setPredLoading(true);
    Promise.all([
      fetch(`/api/predictions/wpm?username=${encodeURIComponent(activeUser)}`).then(r => r.json()),
      fetch(`/api/predictions/accuracy?username=${encodeURIComponent(activeUser)}`).then(r => r.json()),
      fetch(`/api/predictions/language?username=${encodeURIComponent(activeUser)}`).then(r => r.json()),
    ]).then(([w, a, l]) => {
      setWpmPred(w);
      setAccPred(a);
      setLangPred(Array.isArray(l) ? l : []);
    }).catch(() => {}).finally(() => setPredLoading(false));
  }, [activeUser]);

  const handleGoal = async () => {
    const target = parseInt(goalTarget);
    if (!target || !activeUser) return;
    setGoalLoading(true);
    try {
      const res = await fetch("/api/predictions/goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetWpm: target, username: activeUser }),
      });
      setGoalResult(await res.json());
    } catch {} finally {
      setGoalLoading(false);
    }
  };

  const forecastData = wpmPred?.historicalData
    ? [
        ...wpmPred.historicalData.slice(-20),
        { session: (wpmPred.sessionsCount || 0) + 7, predicted: wpmPred.predicted7Day, actual: null, isForecast: true },
        { session: (wpmPred.sessionsCount || 0) + 30, predicted: wpmPred.predicted30Day, actual: null, isForecast: true },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-mono text-foreground flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary" />
          Performance Telemetry
        </h1>
        <p className="text-muted-foreground mt-2 font-mono">Operative: {activeUser}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Best WPM" value={summary?.bestWpm || 0} icon={Zap} loading={summaryLoading} />
        <StatCard title="Avg WPM" value={summary?.averageWpm || 0} icon={Activity} loading={summaryLoading} />
        <StatCard title="Best Accuracy" value={`${summary?.bestAccuracy || 0}%`} icon={Target} loading={summaryLoading} />
        <StatCard title="Total Tests" value={summary?.totalTests || 0} icon={Hash} loading={summaryLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-primary text-lg">WPM Velocity</CardTitle>
            <Select value={days} onValueChange={setDays}>
              <SelectTrigger className="w-[120px] font-mono text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="h-[300px]">
            {trendsLoading ? (
              <Skeleton className="w-full h-full bg-primary/5" />
            ) : trends && trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#39FF6A" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#39FF6A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(57,255,106,0.3)', borderRadius: '8px' }}
                    itemStyle={{ color: '#39FF6A' }}
                    labelFormatter={(val) => new Date(val).toLocaleDateString()}
                  />
                  <Area type="monotone" dataKey="wpm" stroke="#39FF6A" strokeWidth={2} fillOpacity={1} fill="url(#colorWpm)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono">No telemetry data available.</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader><CardTitle className="font-mono text-primary text-lg">Mode Proficiency</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            {summaryLoading ? (
              <Skeleton className="w-full h-full bg-primary/5" />
            ) : summary?.byMode && summary.byMode.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.byMode} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                  <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                  <YAxis dataKey="mode" type="category" stroke="rgba(255,255,255,0.5)" fontSize={12} width={80} />
                  <Tooltip
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(57,255,106,0.3)' }}
                    itemStyle={{ color: '#39FF6A' }}
                  />
                  <Bar dataKey="averageWpm" fill="#39FF6A" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono">Insufficient data.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── PERFORMANCE FORECAST ── */}
      <div>
        <h2 className="text-2xl font-bold font-mono text-foreground flex items-center gap-3 mb-6">
          <Brain className="w-7 h-7 text-primary" />
          Performance Forecast
          <span className="text-xs font-normal text-muted-foreground border border-primary/30 rounded px-2 py-0.5 ml-2">Linear Regression AI</span>
        </h2>

        {/* WPM Prediction Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Current Avg WPM", value: wpmPred?.currentAvg ?? "—", color: "text-foreground" },
            { label: "Next Race WPM", value: wpmPred?.predictedNext ?? "—", color: "text-primary" },
            { label: "7-Day Forecast", value: wpmPred?.predicted7Day ?? "—", color: "text-blue-400" },
            { label: "30-Day Forecast", value: wpmPred?.predicted30Day ?? "—", color: "text-purple-400" },
          ].map((c) => (
            <Card key={c.label} className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-5">
                <p className="text-xs font-mono text-muted-foreground uppercase mb-1">{c.label}</p>
                {predLoading ? <Skeleton className="h-8 w-16 bg-primary/10" /> :
                  <p className={`text-3xl font-bold font-mono ${c.color}`}>{c.value}</p>
                }
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Accuracy + Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-5">
                <p className="text-xs font-mono text-muted-foreground uppercase mb-3">Accuracy Forecast</p>
                <div className="space-y-3">
                  {[
                    { label: "Current Avg", value: accPred?.currentAvg, suffix: "%" },
                    { label: "Next Race", value: accPred?.predictedNext, suffix: "%" },
                    { label: "7-Day", value: accPred?.predicted7Day, suffix: "%" },
                    { label: "30-Day", value: accPred?.predicted30Day, suffix: "%" },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between items-center">
                      <span className="text-xs font-mono text-muted-foreground">{r.label}</span>
                      {predLoading ? <Skeleton className="h-4 w-12 bg-primary/10" /> :
                        <span className="text-sm font-bold font-mono text-foreground">{r.value ?? "—"}{r.value ? r.suffix : ""}</span>
                      }
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-5">
                <p className="text-xs font-mono text-muted-foreground uppercase mb-3">Trend Analysis</p>
                {predLoading ? <Skeleton className="h-10 bg-primary/10 rounded" /> : wpmPred ? (
                  <div className="flex items-center gap-3">
                    {(() => {
                      const TrendIcon = TREND_ICON[wpmPred.trend];
                      return <TrendIcon className={`w-8 h-8 ${TREND_COLOR[wpmPred.trend]}`} />;
                    })()}
                    <div>
                      <p className={`text-xl font-bold font-mono capitalize ${TREND_COLOR[wpmPred.trend]}`}>
                        {wpmPred.trend}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        Slope: {wpmPred.slope > 0 ? "+" : ""}{wpmPred.slope} WPM/session
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">R² = {wpmPred.r2}</p>
                    </div>
                  </div>
                ) : <p className="text-muted-foreground font-mono text-sm">Complete more tests to unlock</p>}
              </CardContent>
            </Card>
          </div>

          {/* Regression Chart */}
          <Card className="lg:col-span-2 bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="font-mono text-primary text-lg">Regression Trend + Forecast</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px]">
              {predLoading ? (
                <Skeleton className="w-full h-full bg-primary/5" />
              ) : forecastData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={forecastData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
                    <XAxis dataKey="session" stroke="rgba(255,255,255,0.3)" fontSize={11} label={{ value: "Session", position: "insideBottom", offset: -2, fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(57,255,106,0.2)', borderRadius: '8px', fontSize: 12 }}
                      labelFormatter={(v) => `Session ${v}`}
                    />
                    <ReferenceLine
                      x={wpmPred?.sessionsCount}
                      stroke="rgba(255,255,255,0.2)"
                      strokeDasharray="4 4"
                      label={{ value: "Now", fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                    />
                    <Scatter dataKey="actual" fill="#39FF6A" name="Actual WPM" />
                    <Line type="monotone" dataKey="predicted" stroke="#00d4ff" strokeWidth={2} dot={false} name="Regression" strokeDasharray="0" />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground font-mono">
                  <Brain className="w-10 h-10 opacity-30" />
                  <span className="text-sm">Complete at least 3 typing tests to unlock forecasting</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Goal Predictor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="font-mono text-primary text-lg">Goal Achievement Predictor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-mono text-muted-foreground uppercase mb-1">Target WPM</label>
                  <input
                    type="number"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    min={1}
                    max={300}
                    className="w-full px-3 py-2 bg-background/60 border border-border/60 rounded-md font-mono text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="e.g. 100"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleGoal}
                    disabled={goalLoading}
                    className="px-4 py-2 bg-primary text-background font-mono font-bold text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {goalLoading ? "..." : "Predict"}
                  </button>
                </div>
              </div>

              {goalResult && (
                <div className={`p-4 rounded-lg border ${goalResult.achievable ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-mono text-muted-foreground uppercase">Target</p>
                      <p className="text-2xl font-bold font-mono text-foreground">{goalResult.targetValue} WPM</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono text-muted-foreground uppercase">Current Avg</p>
                      <p className="text-2xl font-bold font-mono text-primary">{goalResult.currentAvg} WPM</p>
                    </div>
                  </div>
                  {goalResult.estimatedDays === 0 ? (
                    <p className="text-green-400 font-mono text-sm">✓ Already achieved!</p>
                  ) : goalResult.achievable ? (
                    <div className="space-y-1">
                      <p className="text-green-400 font-mono text-sm font-bold">
                        Estimated: ~{goalResult.estimatedDays} days
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        ~{goalResult.estimatedSessions} sessions at current improvement rate
                      </p>
                    </div>
                  ) : (
                    <p className="text-red-400 font-mono text-sm">
                      {goalResult.trend === "declining"
                        ? "⚠ Performance declining — focus on accuracy first"
                        : "⚠ Trend too flat to predict within 1 year — keep practicing!"}
                    </p>
                  )}
                </div>
              )}

              <div className="text-xs text-muted-foreground font-mono opacity-60">
                Common targets: 60, 80, 100, 120, 150 WPM
              </div>
            </CardContent>
          </Card>

          {/* Language-wise Predictions */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="font-mono text-primary text-lg">Language Forecasts</CardTitle>
            </CardHeader>
            <CardContent>
              {predLoading ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 bg-primary/5 rounded" />)}
                </div>
              ) : langPred.length > 0 ? (
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {langPred.map((l) => {
                    const TrendIcon = TREND_ICON[l.trend];
                    return (
                      <div key={l.language} className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-border/30">
                        <div className="flex items-center gap-2 min-w-0">
                          <TrendIcon className={`w-4 h-4 shrink-0 ${TREND_COLOR[l.trend]}`} />
                          <span className="text-sm font-mono text-foreground capitalize truncate">{l.language}</span>
                          <span className="text-xs text-muted-foreground font-mono shrink-0">({l.sessionsCount})</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-2">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground font-mono">Now</p>
                            <p className="text-sm font-bold font-mono text-foreground">{l.currentAvg}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground font-mono">30d</p>
                            <p className="text-sm font-bold font-mono text-primary">{l.predicted30Day}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-[200px] flex flex-col items-center justify-center gap-2 text-muted-foreground font-mono">
                  <Brain className="w-8 h-8 opacity-30" />
                  <span className="text-sm">Need 2+ tests per language</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, loading }: any) {
  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-mono text-muted-foreground uppercase">{title}</p>
          {loading ? <Skeleton className="h-8 w-24 bg-primary/10" /> :
            <p className="text-3xl font-bold font-mono text-foreground">{value}</p>}
        </div>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-6 h-6" />
        </div>
      </CardContent>
    </Card>
  );
}
