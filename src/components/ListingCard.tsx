import type { FoodListing } from "@/lib/types";
import { timeUntil, formatDateTime, mapsLink } from "@/lib/listing-utils";

interface Props {
  listing: FoodListing;
  variant: "donor" | "receiver-available" | "receiver-claimed";
  onClaim?: (l: FoodListing) => void;
  claiming?: boolean;
}

export function ListingCard({ listing: l, variant, onClaim, claiming }: Props) {
  const expiry = timeUntil(l.expiresAt);
  const claimed = l.status === "claimed";

  return (
    <article className="fb-card flex flex-col overflow-hidden">
      {/* Top strip */}
      <div className="flex items-start justify-between gap-3 border-b border-border bg-gradient-to-br from-primary-soft/60 to-accent-soft/40 px-5 py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {claimed ? (
              <span className="fb-badge bg-muted text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" /> Claimed
              </span>
            ) : (
              <span className="fb-badge bg-primary text-primary-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" /> Available
              </span>
            )}
            {l.priceType === "free" ? (
              <span className="fb-badge bg-success/15 text-success">Free</span>
            ) : (
              <span className="fb-badge bg-accent/15 text-accent">₹{l.price ?? 0} · low cost</span>
            )}
            {expiry.expired && <span className="fb-badge bg-destructive/15 text-destructive">Expired</span>}
            {!expiry.expired && expiry.urgent && (
              <span className="fb-badge bg-accent text-accent-foreground animate-pulse">⚡ Urgent pickup</span>
            )}
          </div>
          <h3 className="mt-2 font-display text-lg font-semibold leading-tight">{l.foodTitle}</h3>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{l.foodType}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-muted-foreground">Serves</div>
          <div className="font-display text-2xl font-bold text-primary">{l.servesCount}</div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 px-5 py-4 text-sm">
        {l.description && <p className="text-foreground/80">{l.description}</p>}

        <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
          <Field label="Quantity" value={l.quantity} />
          <Field label={expiry.expired ? "Status" : "Expires"} value={expiry.label} highlight={expiry.urgent && !expiry.expired} />
          <Field label="Pickup time" value={formatDateTime(l.pickupTime)} />
          <Field label="Donor" value={l.donorName} />
        </dl>

        <div className="rounded-lg bg-muted/60 px-3 py-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Pickup address</div>
          <div className="text-sm text-foreground">{l.pickupAddress}</div>
        </div>

        {l.notes && (
          <div className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Notes: </span>{l.notes}
          </div>
        )}

        {variant === "receiver-claimed" && (
          <div className="rounded-lg bg-primary-soft/60 px-3 py-2 text-sm">
            <div className="font-semibold text-primary">Contact donor</div>
            <div className="text-foreground">{l.donorName} · <a href={`tel:${l.contactPhone}`} className="font-medium underline">{l.contactPhone}</a></div>
          </div>
        )}

        {variant === "donor" && claimed && (
          <div className="rounded-lg bg-accent-soft/60 px-3 py-2 text-sm">
            <div className="font-semibold text-accent">Claimed by</div>
            <div className="text-foreground">
              {l.claimedByName} · <a href={`tel:${l.claimedByPhone}`} className="font-medium underline">{l.claimedByPhone}</a>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 border-t border-border bg-muted/30 px-5 py-3">
        <a
          href={mapsLink(l.pickupAddress)}
          target="_blank"
          rel="noreferrer"
          className="fb-btn-outline inline-flex items-center gap-1.5 text-sm"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Open in Maps
        </a>
        {variant === "receiver-available" && !claimed && !expiry.expired && (
          <button
            onClick={() => onClaim?.(l)}
            disabled={claiming}
            className="fb-btn-primary text-sm ml-auto"
          >
            {claiming ? "Claiming…" : "Claim food"}
          </button>
        )}
      </div>
    </article>
  );
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={`text-sm ${highlight ? "font-semibold text-accent" : "text-foreground"}`}>{value}</dd>
    </div>
  );
}
