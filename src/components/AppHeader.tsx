import { Link, useNavigate } from "@tanstack/react-router";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "./Logo";

export function AppHeader() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (auth) await signOut(auth);
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-3">
          {user && profile ? (
            <>
              {profile.role === "donor" ? (
                <>
                  <Link to="/donor" className="hidden sm:inline text-sm font-medium text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground" }}>
                    Dashboard
                  </Link>
                  <Link to="/donor/create" className="fb-btn-primary text-sm">
                    + New listing
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/receiver" className="hidden sm:inline text-sm font-medium text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground" }}>
                    Available food
                  </Link>
                  <Link to="/receiver/claimed" className="hidden sm:inline text-sm font-medium text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground" }}>
                    My claims
                  </Link>
                </>
              )}
              <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-xs font-medium">{profile.name}</span>
                <span className="text-xs text-muted-foreground">· {profile.role}</span>
              </div>
              <button onClick={handleLogout} className="fb-btn-outline text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="fb-btn-outline text-sm">Login</Link>
              <Link to="/signup" className="fb-btn-primary text-sm">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
