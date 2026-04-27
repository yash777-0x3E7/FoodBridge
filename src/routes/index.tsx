import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-40 -left-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="fb-badge mb-5 bg-primary-soft text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Live food rescue platform
            </span>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Bridging surplus food
              <br />
              to <span className="text-primary">people in need</span>
              <span className="text-accent">.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              FoodBridge connects hotels, restaurants and event venues with orphanages, NGOs, shelters and
              people who need food quickly. Donors list surplus food. Receivers claim it in real time —
              before it goes to waste.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/signup" className="fb-btn-primary text-base">Get started — it's free</Link>
              <Link to="/login" className="fb-btn-outline text-base">I already have an account</Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              For donors (hotels · restaurants · caterers · function halls) and receivers (NGOs · orphanages · shelters · individuals)
            </p>
          </div>

          {/* Floating stat cards */}
          <div className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-3">
            <Stat value="Real-time" label="Listings update instantly via Firestore" accent="primary" />
            <Stat value="2-tap" label="Claim food in two taps, get directions" accent="accent" />
            <Stat value="0₹" label="Free for donors and most receivers" accent="primary" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Why FoodBridge?</h2>
            <p className="mt-3 text-muted-foreground">A simple bridge between surplus and need.</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Feature
              icon={
                <path d="M3 6h18M3 12h18M3 18h12" />
              }
              title="Reduce food wastage"
              text="Hotels and event venues dispose of edible food daily. List it in 30 seconds and rescue it instead."
              tone="primary"
            />
            <Feature
              icon={
                <>
                  <path d="M13 2L3 14h7l-1 8 11-13h-7l1-7z" />
                </>
              }
              title="Help people faster"
              text="Receivers see what's available right now, with pickup address, time, and a one-tap Google Maps link."
              tone="accent"
            />
            <Feature
              icon={
                <>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </>
              }
              title="Real-time availability"
              text="Powered by Firestore live updates. The moment someone claims food, it disappears from other lists."
              tone="primary"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="fb-card overflow-hidden p-7">
            <span className="fb-badge bg-primary-soft text-primary">For donors</span>
            <h3 className="mt-3 font-display text-2xl font-bold">List surplus food in seconds</h3>
            <ol className="mt-5 space-y-4 text-sm">
              {["Sign up as a donor", "Add the food, quantity, and pickup window", "We notify nearby receivers in real time"].map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                  <span className="pt-1">{s}</span>
                </li>
              ))}
            </ol>
            <Link to="/signup" className="fb-btn-primary mt-6 inline-block text-sm">Become a donor</Link>
          </div>

          <div className="fb-card overflow-hidden p-7">
            <span className="fb-badge bg-accent-soft text-accent">For receivers</span>
            <h3 className="mt-3 font-display text-2xl font-bold">Claim available food nearby</h3>
            <ol className="mt-5 space-y-4 text-sm">
              {["Sign up as a receiver", "Browse live listings sorted by urgency", "Claim it — get donor contact + Maps link"].map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">{i + 1}</span>
                  <span className="pt-1">{s}</span>
                </li>
              ))}
            </ol>
            <Link to="/signup" className="fb-btn-accent mt-6 inline-block text-sm">Become a receiver</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label, accent }: { value: string; label: string; accent: "primary" | "accent" }) {
  return (
    <div className="fb-card p-5 text-left">
      <div className={`font-display text-3xl font-bold ${accent === "primary" ? "text-primary" : "text-accent"}`}>{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function Feature({ icon, title, text, tone }: { icon: React.ReactNode; title: string; text: string; tone: "primary" | "accent" }) {
  return (
    <div className="fb-card p-6">
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${tone === "primary" ? "bg-primary-soft text-primary" : "bg-accent-soft text-accent"}`}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
