import { useState } from "react";
import { useGetLeaderboard } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Crown } from "lucide-react";

export default function Leaderboard() {
  const [category, setCategory] = useState("overall");
  const [period, setPeriod] = useState<any>("all_time");

  const { data: leaderboard, isLoading } = useGetLeaderboard(
    { category, period, limit: 50 },
    { query: { enabled: true, queryKey: ['leaderboard', category, period] } }
  );

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
    return <span className="font-mono text-muted-foreground w-5 inline-block text-center">{rank}</span>;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono text-foreground flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            Global Rankings
          </h1>
          <p className="text-muted-foreground mt-2">See how you stack up against other developers.</p>
        </div>
        
        <Tabs value={period} onValueChange={setPeriod} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 border border-border/50">
            <TabsTrigger value="daily" className="font-mono text-xs">Daily</TabsTrigger>
            <TabsTrigger value="weekly" className="font-mono text-xs">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="font-mono text-xs">Monthly</TabsTrigger>
            <TabsTrigger value="all_time" className="font-mono text-xs">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={category} onValueChange={setCategory}>
        <TabsList className="flex flex-wrap h-auto bg-transparent gap-2 w-full justify-start border-b border-border/50 pb-4 mb-4 rounded-none">
          {["overall", "english", "hindi", "python", "javascript", "java", "cpp", "mysql"].map(cat => (
            <TabsTrigger 
              key={cat} 
              value={cat}
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary border border-transparent font-mono capitalize"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        <Card className="bg-card/50 backdrop-blur border-primary/10">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="w-24 text-center font-mono text-primary">Rank</TableHead>
                  <TableHead className="font-mono text-primary">Operative</TableHead>
                  <TableHead className="text-right font-mono text-primary">WPM</TableHead>
                  <TableHead className="text-right font-mono text-primary">Accuracy</TableHead>
                  <TableHead className="text-right font-mono text-primary hidden md:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(10).fill(0).map((_, i) => (
                    <TableRow key={i} className="border-border/10">
                      <TableCell><Skeleton className="h-6 w-8 mx-auto bg-primary/5" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32 bg-primary/5" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16 ml-auto bg-primary/5" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16 ml-auto bg-primary/5" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-24 ml-auto bg-primary/5" /></TableCell>
                    </TableRow>
                  ))
                ) : leaderboard && leaderboard.length > 0 ? (
                  leaderboard.map((entry) => (
                    <TableRow key={entry.rank} className="border-border/10 hover:bg-primary/5 transition-colors">
                      <TableCell className="text-center flex justify-center py-4">
                        {getRankIcon(entry.rank)}
                      </TableCell>
                      <TableCell className="font-mono font-medium text-foreground">
                        {entry.username}
                        {entry.language && category === "overall" && (
                          <span className="ml-2 text-xs text-muted-foreground px-2 py-0.5 rounded border border-border bg-muted/30">
                            {entry.language}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary">{entry.wpm}</TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">{entry.accuracy}%</TableCell>
                      <TableCell className="text-right font-mono text-xs text-muted-foreground/70 hidden md:table-cell">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-mono">
                      No records found in this sector.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
