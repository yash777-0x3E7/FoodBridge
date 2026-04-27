import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/donor/create")({
  component: CreateListingPage,
});

const FOOD_TYPES = [
  "Cooked meal",
  "Vegetarian",
  "Non-vegetarian",
  "Snacks",
  "Bakery",
  "Fruits & vegetables",
  "Packaged food",
  "Other",
];

function toEpoch(local: string): number {
  // local is "YYYY-MM-DDTHH:mm" from datetime-local
  return new Date(local).getTime();
}

function defaultLocal(offsetMinutes: number) {
  const d = new Date(Date.now() + offsetMinutes * 60_000);
  d.setSeconds(0, 0);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60_000).toISOString().slice(0, 16);
}

function CreateListingPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([{ title: "", type: FOOD_TYPES[0], quantity: "", serves: 10 }]);
  const [description, setDescription] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [priceType, setPriceType] = useState<"free" | "low_cost">("free");
  const [price, setPrice] = useState<number>(0);
  const [pickupTime, setPickupTime] = useState(defaultLocal(30));
  const [expiresAt, setExpiresAt] = useState(defaultLocal(180));
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="py-20 text-center text-sm text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/login" />;
  if (profile && profile.role !== "donor") return <Navigate to="/receiver" />;

  const addItem = () => setItems([...items, { title: "", type: FOOD_TYPES[0], quantity: "", serves: 10 }]);
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isFirebaseConfigured || !db || !user || !profile) {
      setError("Firebase is not configured.");
      return;
    }
    if (toEpoch(expiresAt) <= Date.now()) {
      setError("Expiry time must be in the future.");
      return;
    }
    setSubmitting(true);
    try {
      // Create a separate listing for each food item
      const promises = items.map((item) => 
        addDoc(collection(db, "foodListings"), {
          donorId: user.uid,
          donorName: profile.name,
          donorEmail: profile.email,
          donorPhone: profile.phone,
          foodTitle: item.title,
          foodType: item.type,
          description,
          quantity: item.quantity,
          servesCount: Number(item.serves) || 0,
          pickupAddress,
          contactPhone: contactPhone || profile.phone,
          priceType,
          price: priceType === "low_cost" ? Number(price) || 0 : 0,
          pickupTime: toEpoch(pickupTime),
          expiresAt: toEpoch(expiresAt),
          notes,
          status: "available",
          claimedBy: null,
          claimedByName: null,
          claimedByPhone: null,
          claimedAt: null,
          createdAt: Date.now(),
          _serverCreatedAt: serverTimestamp(),
        })
      );
      
      await Promise.all(promises);
      navigate({ to: "/donor" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create listings";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div>
        <span className="fb-badge bg-primary-soft text-primary">New listing</span>
        <h1 className="mt-2 font-display text-3xl font-bold">Share surplus food</h1>
        <p className="mt-1 text-sm text-muted-foreground">You can donate multiple items at once.</p>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
        )}

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="fb-card relative p-6">
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="absolute right-4 top-4 text-muted-foreground hover:text-destructive transition"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              )}
              <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Item #{index + 1}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Food title">
                  <input required value={item.title} onChange={(e) => updateItem(index, "title", e.target.value)} className="fb-input" placeholder="e.g. Veg biryani" />
                </Field>
                <Field label="Food type">
                  <select value={item.type} onChange={(e) => updateItem(index, "type", e.target.value)} className="fb-input">
                    {FOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Quantity">
                  <input required value={item.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} className="fb-input" placeholder="e.g. 5 kg" />
                </Field>
                <Field label="Estimated serves">
                  <input type="number" min={1} required value={item.serves} onChange={(e) => updateItem(index, "serves", Number(e.target.value))} className="fb-input" />
                </Field>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 font-medium text-muted-foreground transition hover:border-primary hover:text-primary"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            Add another food item
          </button>
        </div>

        <div className="fb-card space-y-5 p-6">
          <Section title="Common Details">
            <Field label="Description (optional)">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="fb-input min-h-[80px]" placeholder="Details about freshness, cooking time..." />
            </Field>
          </Section>

          <Section title="Pickup details">
            <Field label="Pickup address">
              <textarea required value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} className="fb-input min-h-[70px]" placeholder="Full address" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Contact phone">
                <input required value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="fb-input" placeholder="+91 ..." />
              </Field>
              <Field label="Pickup time">
                <input type="datetime-local" required value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="fb-input" />
              </Field>
              <Field label="Expires at">
                <input type="datetime-local" required value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="fb-input" />
              </Field>
            </div>
          </Section>

          <Section title="Pricing">
            <div className="grid grid-cols-2 gap-3">
              <PriceOption active={priceType === "free"} onClick={() => setPriceType("free")} title="Free" desc="Donated at no cost" tone="primary" />
              <PriceOption active={priceType === "low_cost"} onClick={() => setPriceType("low_cost")} title="Low cost" desc="A small recovery price" tone="accent" />
            </div>
            {priceType === "low_cost" && (
              <Field label="Price (₹)">
                <input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="fb-input" />
              </Field>
            )}
          </Section>

          <Section title="Notes (optional)">
            <Field label="">
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="fb-input min-h-[60px]" placeholder="Anything else..." />
            </Field>
          </Section>

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={() => navigate({ to: "/donor" })} className="fb-btn-outline text-sm">Cancel</button>
            <button type="submit" disabled={submitting} className="fb-btn-primary text-sm">
              {submitting ? "Publishing…" : `Publish ${items.length} ${items.length === 1 ? 'listing' : 'listings'}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium">{label}</span>}
      {children}
    </label>
  );
}

function PriceOption({ active, onClick, title, desc, tone }: { active: boolean; onClick: () => void; title: string; desc: string; tone: "primary" | "accent" }) {
  const ring = active
    ? tone === "primary"
      ? "border-primary ring-2 ring-primary/30 bg-primary-soft/40"
      : "border-accent ring-2 ring-accent/30 bg-accent-soft/40"
    : "border-border bg-card hover:bg-muted/50";
  return (
    <button type="button" onClick={onClick} className={`rounded-xl border p-4 text-left transition ${ring}`}>
      <div className="font-display font-semibold">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
    </button>
  );
}
