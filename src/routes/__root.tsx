import { Outlet, createRootRoute } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth-context";
import { AppHeader } from "@/components/AppHeader";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <a href="/" className="fb-btn-primary mt-6 inline-block text-sm">Go home</a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="border-t border-border bg-card/50 py-6">
          <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground">
            FoodBridge · Reduce food waste, feed more people.
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
