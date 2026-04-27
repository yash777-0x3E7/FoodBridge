import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { ListingCard } from "@/components/ListingCard";
import type { FoodListing } from "@/lib/types";

export const Route = createFileRoute("/receiver/claimed")({
  component: ClaimedPage,
});

function ClaimedPage() {
  const { user, profile, loading } = useAuth();
  const [listings, setListings] = useState<FoodListing[]>([]);

  useEffect(() => {
    if (!user || !db) return;
    const q = query(
      collection(db, "foodListings"),
      where("claimedBy", "==", user.uid)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FoodListing, "id">) }));
        // Sort in memory to avoid needing a composite index in Firestore
        docs.sort((a, b) => (b.claimedAt || 0) - (a.claimedAt || 0));
        setListings(docs);
      },
      (err) => console.error("Claimed snapshot error", err)
    );
    return () => unsub();
  }, [user]);

  if (loading) return <div className="py-20 text-center text-sm text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/login" />;
  if (profile && profile.role !== "receiver") return <Navigate to="/donor" />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="fb-badge bg-accent-soft text-accent">My claims</span>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Food you've claimed</h1>
          <p className="mt-1 text-sm text-muted-foreground">Donor contact and pickup directions are below.</p>
        </div>
        <Link to="/receiver" className="fb-btn-outline text-sm">← Browse available food</Link>
      </div>

      <div className="mt-6">
        {listings.length === 0 ? (
          <div className="fb-card flex flex-col items-center px-6 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6l9 6 9-6" /><rect x="3" y="6" width="18" height="14" rx="2" /></svg>
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold">No claims yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">When you claim food from the available list, it'll show up here with full pickup details.</p>
            <Link to="/receiver" className="fb-btn-primary mt-4 text-sm">See available food</Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} variant="receiver-claimed" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
