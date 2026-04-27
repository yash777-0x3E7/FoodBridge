import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import type { UserRole, UserProfile } from "@/lib/types";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

const DONOR_TYPES = [
  { v: "hotel", l: "Hotel" },
  { v: "restaurant", l: "Restaurant" },
  { v: "caterer", l: "Caterer" },
  { v: "function_hall", l: "Function hall" },
  { v: "other", l: "Other" },
];
const RECEIVER_TYPES = [
  { v: "orphanage", l: "Orphanage" },
  { v: "ngo", l: "NGO" },
  { v: "shelter", l: "Shelter" },
  { v: "individual", l: "Individual / person in need" },
  { v: "other", l: "Other" },
];

function SignupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("donor");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState("hotel");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (r: UserRole) => {
    setRole(r);
    setOrganizationType(r === "donor" ? "hotel" : "ngo");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isFirebaseConfigured || !auth || !db) {
      setError("Firebase is not configured. Add your Firebase keys to a local .env file (see README) and run the app locally.");
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const profile: UserProfile = {
        uid: cred.user.uid,
        name,
        email,
        phone,
        role,
        organizationName,
        organizationType: organizationType as UserProfile["organizationType"],
        createdAt: Date.now(),
      };
      await setDoc(doc(db, "users", cred.user.uid), profile);
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signup failed";
      setError(msg.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const types = role === "donor" ? DONOR_TYPES : RECEIVER_TYPES;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold">Join FoodBridge</h1>
        <p className="mt-2 text-sm text-muted-foreground">Pick your role to get started.</p>
      </div>

      {/* Role picker */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <RoleCard
          active={role === "donor"}
          onClick={() => handleRoleChange("donor")}
          title="I'm a donor"
          desc="Hotels, restaurants, caterers, function halls"
          tone="primary"
        />
        <RoleCard
          active={role === "receiver"}
          onClick={() => handleRoleChange("receiver")}
          title="I'm a receiver"
          desc="NGOs, orphanages, shelters, individuals"
          tone="accent"
        />
      </div>

      <form onSubmit={onSubmit} className="fb-card mt-5 space-y-4 p-6">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <input required value={name} onChange={(e) => setName(e.target.value)} className="fb-input" placeholder="Jane Doe" />
          </Field>
          <Field label="Phone">
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="fb-input" placeholder="+91 ..." />
          </Field>
          <Field label="Email">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="fb-input" placeholder="you@example.com" />
          </Field>
          <Field label="Password">
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="fb-input" placeholder="At least 6 characters" />
          </Field>
          <Field label={role === "donor" ? "Business / venue name" : "Organization name"}>
            <input required value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} className="fb-input" placeholder={role === "donor" ? "Hotel Sunrise" : "Hope NGO"} />
          </Field>
          <Field label={role === "donor" ? "Business type" : "Receiver type"}>
            <select value={organizationType} onChange={(e) => setOrganizationType(e.target.value)} className="fb-input">
              {types.map((t) => (
                <option key={t.v} value={t.v}>{t.l}</option>
              ))}
            </select>
          </Field>
        </div>

        <button type="submit" disabled={loading} className="fb-btn-primary w-full">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link>
      </p>
    </div>
  );
}

function RoleCard({ active, onClick, title, desc, tone }: { active: boolean; onClick: () => void; title: string; desc: string; tone: "primary" | "accent" }) {
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
