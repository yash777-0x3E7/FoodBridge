import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { ListingCard } from "@/components/ListingCard";
import type { FoodListing } from "@/lib/types";

export const Route = createFileRoute("/donor/")({
  component: DonorDashboard,
});

function DonorDashboard() {
  const { user, profile, loading } = useAuth();
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [tab, setTab] = useState<"active" | "claimed">("active");

  useEffect(() => {
    if (!user || !db) return;
    const q = query(
      collection(db, "foodListings"),
      where("donorId", "==", user.uid)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FoodListing, "id">) }));
        // Sort in memory to avoid needing a composite index
        docs.sort((a, b) => b.createdAt - a.createdAt);
        setListings(docs);
      },
      (err) => console.error("Listings snapshot error", err)
    );
    return () => unsub();
  }, [user]);

  const active = useMemo(() => listings.filter((l) => l.status === "available"), [listings]);
  const claimed = useMemo(() => listings.filter((l) => l.status === "claimed"), [listings]);
  const shown = tab === "active" ? active : claimed;

  if (loading) return <CenteredLoader />;
  if (!user) return <Navigate to="/login" />;
  if (profile && profile.role !== "donor") return <Navigate to="/receiver" />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="fb-badge bg-primary-soft text-primary">Donor</span>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Hi, {profile?.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {profile?.organizationName} · Manage your food rescues here.
          </p>
        </div>
        <Link to="/donor/create" className="fb-btn-primary text-sm">+ New food listing</Link>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatCard label="Active listings" value={active.length} tone="primary" />
        <StatCard label="Claimed (rescued)" value={claimed.length} tone="accent" />
        <StatCard
          label="Total people served"
          value={claimed.reduce((sum, l) => sum + (Number(l.servesCount) || 0), 0)}
          tone="primary"
        />
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-2 border-b border-border">
        <TabButton active={tab === "active"} onClick={() => setTab("active")}>
          Active ({active.length})
        </TabButton>
        <TabButton active={tab === "claimed"} onClick={() => setTab("claimed")}>
          Claimed ({claimed.length})
        </TabButton>
      </div>

      {/* Listings */}
      <div className="mt-6">
        {shown.length === 0 ? (
          <EmptyState
            title={tab === "active" ? "No active listings yet" : "Nothing claimed yet"}
            text={
              tab === "active"
                ? "Create your first food listing — it takes about 30 seconds."
                : "Once a receiver claims one of your listings, it'll appear here."
            }
            cta={tab === "active" ? <Link to="/donor/create" className="fb-btn-primary mt-4 inline-block text-sm">Create a listing</Link> : null}
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {shown.map((l) => (
              <ListingCard key={l.id} listing={l} variant="donor" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: "primary" | "accent" }) {
  return (
    <div className="fb-card p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-3xl font-bold ${tone === "primary" ? "text-primary" : "text-accent"}`}>{value}</div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2.5 text-sm font-semibold transition ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
    >
      {children}
      {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
    </button>
  );
}

function EmptyState({ title, text, cta }: { title: string; text: string; cta?: React.ReactNode }) {
  return (
    <div className="fb-card flex flex-col items-center px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
      {cta}
    </div>
  );
}

function CenteredLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
