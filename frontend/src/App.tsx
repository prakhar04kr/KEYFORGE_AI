import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import TypeTest from "@/pages/type";
import Leaderboard from "@/pages/leaderboard";
import Analytics from "@/pages/analytics";
import HindiGuide from "@/pages/hindi-guide";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Profile from "@/pages/profile";
import About from "@/pages/about";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/type/:mode" component={TypeTest} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/hindi-guide" component={HindiGuide} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/profile" component={Profile} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
