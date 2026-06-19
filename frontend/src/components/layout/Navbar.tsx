import { Link, useLocation } from "wouter";
import { Keyboard, BarChart2, Trophy, BookOpen, Terminal, LogIn, UserPlus, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const links = [
    { href: "/", label: "Home", icon: Terminal },
    { href: "/type/coding", label: "Type", icon: Keyboard },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/analytics", label: "Analytics", icon: BarChart2 },
    { href: "/about", label: "About", icon: Terminal },
    { href: "/hindi-guide", label: "Hindi Guide", icon: BookOpen },
  ];

  const isActive = (href: string) =>
    location === href || (href !== "/" && location.startsWith(href));

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <Terminal className="w-6 h-6 text-primary group-hover:text-primary/80 transition-colors" />
            <span className="font-mono font-bold text-xl tracking-tighter text-foreground group-hover:text-primary transition-colors">
              KEYFORGE<span className="text-primary">_AI</span>
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className={`flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer ${
                isActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}>
                <link.icon className="w-4 h-4" />
                {link.label}
              </div>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/profile">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors cursor-pointer ${
                  isActive("/profile")
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border/50 bg-secondary/50 hover:border-primary/40 text-foreground"
                }`}>
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-mono text-primary">{user.username}</span>
                </div>
              </Link>
              <button
                onClick={logout}
                className="text-xs font-mono text-muted-foreground hover:text-red-400 transition-colors px-2 py-1.5 rounded hover:bg-red-500/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/50 text-sm font-mono cursor-pointer transition-colors ${
                  isActive("/login") ? "text-primary border-primary/50" : "text-muted-foreground hover:text-foreground hover:border-border"
                }`}>
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </div>
              </Link>
              <Link href="/register">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-background text-sm font-mono font-bold cursor-pointer hover:bg-primary/90 transition-colors">
                  <UserPlus className="w-3.5 h-3.5" />
                  Register
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
