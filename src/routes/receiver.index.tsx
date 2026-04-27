import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { ListingCard } from "@/components/ListingCard";
import type { FoodListing } from "@/lib/types";
import { isExpired } from "@/lib/listing-utils";

export const Route = createFileRoute("/receiver/")({
  component: ReceiverDashboard,
});

type SortKey = "newest" | "expiry";

function ReceiverDashboard() {
  const { user, profile, loading } = useAuth();
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [sort, setSort] = useState<SortKey>("expiry");
  const [search, setSearch] = useState("");
  const [claiming, setClaiming] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !db) return;
    const q = query(
      collection(db, "foodListings"),
      where("status", "==", "available")
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

  const visible = useMemo(() => {
    let out = listings.filter((l) => !isExpired(l));
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      out = out.filter(
        (l) =>
          l.foodTitle.toLowerCase().includes(s) ||
          l.foodType.toLowerCase().includes(s) ||
          l.pickupAddress.toLowerCase().includes(s) ||
          l.donorName.toLowerCase().includes(s)
      );
    }
    if (sort === "expiry") out = [...out].sort((a, b) => a.expiresAt - b.expiresAt);
    else out = [...out].sort((a, b) => b.createdAt - a.createdAt);
    return out;
  }, [listings, search, sort]);

  if (loading) return <CenteredLoader />;
  if (!user) return <Navigate to="/login" />;
  if (profile && profile.role !== "receiver") return <Navigate to="/donor" />;

  const handleClaim = async (l: FoodListing) => {
    if (!db || !user || !profile) return;
    setError(null);
    setClaiming(l.id);
    try {
      await updateDoc(doc(db, "foodListings", l.id), {
        status: "claimed",
        claimedBy: user.uid,
        claimedByName: profile.name,
        claimedByPhone: profile.phone,
        claimedAt: Date.now(),
      });
      setToast(`Claimed: ${l.foodTitle}. Pickup details are in "My claims".`);
      setTimeout(() => setToast(null), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not claim food");
    } finally {
      setClaiming(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="fb-badge bg-accent-soft text-accent">Receiver</span>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Available food right now</h1>
          <p className="mt-1 text-sm text-muted-foreground">Live updates from {profile?.organizationName ? `nearby donors · ${profile.organizationName}` : "nearby donors"}.</p>
        </div>
        <Link to="/receiver/claimed" className="fb-btn-outline text-sm">My claimed food →</Link>
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food, type, address or donor"
            className="fb-input pl-9"
          />
        </div>
        <div className="flex rounded-lg border border-border bg-card p-1">
          <SortButton active={sort === "expiry"} onClick={() => setSort("expiry")}>Expiring soon</SortButton>
          <SortButton active={sort === "newest"} onClick={() => setSort("newest")}>Newest</SortButton>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
      )}

      {/* Listings */}
      <div className="mt-6">
        {visible.length === 0 ? (
          <EmptyState
            title="No food available right now"
            text="New listings appear here in real time as donors post them. Sit tight."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((l) => (
              <ListingCard
                key={l.id}
                listing={l}
                variant="receiver-available"
                onClaim={handleClaim}
                claiming={claiming === l.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)]">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

function SortButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="fb-card flex flex-col items-center px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
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
