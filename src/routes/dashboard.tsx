import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/dashboard")({
  component: DashboardRedirect,
});

function DashboardRedirect() {
  const { user, profile, loading } = useAuth();

  if (loading) return <CenteredSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (!profile) return <CenteredSpinner label="Loading your profile…" />;

  if (profile.role === "donor") return <Navigate to="/donor" />;
  return <Navigate to="/receiver" />;
}

function CenteredSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
