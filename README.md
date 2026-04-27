# 🌉 FoodBridge

> **Real-time surplus food rescue for NGOs and people in need.**
> Connects hotels, restaurants, caterers and function halls (donors) with
> orphanages, NGOs, shelters and individuals (receivers), so surplus food gets
> rescued before it goes to waste.

 MVP built with **TanStack Start + Tailwind v4 + Firebase**.

---

## ✨ Features

- 🔐 Email/password auth with role selection (donor / receiver)
- 🍱 Donors create food listings (title, type, quantity, serves, pickup address, time, expiry, free or low-cost)
- ⚡ Receivers see all available listings in **real time** (Firestore `onSnapshot`)
- 🤝 One-tap **Claim food** flow — claimed listings disappear from other receivers' lists instantly
- 📍 **Open in Google Maps** button on every listing
- ⏰ Urgency badges — "Urgent pickup" if expiry < 2 hours, "Expired" auto-hidden from available list
- 📊 Donor dashboard with Active / Claimed tabs and rescue stats
- 📜 "My claims" page for receivers with donor contact + pickup info
- 📱 Clean, responsive Tailwind UI with the **Fresh Harvest** palette (green + warm orange on cream)

---

## 🧱 Tech stack

| Layer            | Tech                                              |
|------------------|---------------------------------------------------|
| Frontend         | React 19 + Vite 7 + TypeScript                    |
| Routing          | TanStack Router (file-based)                      |
| Styling          | Tailwind CSS v4 (oklch design tokens)             |
| Auth             | Firebase Authentication (Email/Password)          |
| Database         | Cloud Firestore (real-time)                       |
| Maps             | Google Maps deep links (no API key needed)        |
| Hosting          | Firebase Hosting (or any static host)             |

---

## 🚀 Run locally

### 1. Clone & install

```bash
git clone <your-repo-url> foodbridge
cd foodbridge
bun install        # or: npm install / pnpm install
```

### 2. Create a Firebase project

1. Go to https://console.firebase.google.com → **Add project**
2. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable**
3. **Build → Firestore Database → Create database** (start in *production* mode, pick a region)
4. **Project settings (⚙️) → General → Your apps → Add app → Web (`</>`)** — register an app and copy the config object

### 3. Add your Firebase config

Copy the example env file and paste your Firebase web-app keys:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=foodbridge-xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=foodbridge-xxxx
VITE_FIREBASE_STORAGE_BUCKET=foodbridge-xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:123:web:abc
```

> All vars **must** be prefixed `VITE_` so Vite exposes them to the browser.

### 4. Deploy Firestore security rules

The repo includes `firestore.rules`. Apply them via Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore        # select your project, accept default rules file path
firebase deploy --only firestore:rules
```

Or paste the contents of `firestore.rules` directly into the Firebase console
(**Firestore Database → Rules** tab).

### 5. Run

```bash
bun run dev        # or: npm run dev
```

Open http://localhost:3000 (port may differ — check terminal).

---

## 📦 Build & deploy to Firebase Hosting

This project is **TanStack Start (SSR)**. For Firebase Hosting (static), the
client build under `dist/client` is what you want to serve. The simplest path:

```bash
bun run build
firebase init hosting          # public directory: dist/client, single-page app: Yes
firebase deploy --only hosting
```

For full SSR you'd deploy the `dist/server` worker bundle to Cloudflare Workers
or another edge host — out of scope for this MVP.

---

## 🗂 Firestore data model

### Collection: `users/{uid}`

```ts
{
  uid: string,
  name: string,
  email: string,
  phone: string,
  role: "donor" | "receiver",
  organizationName: string,
  organizationType: "hotel" | "restaurant" | "caterer" | "function_hall"
                  | "orphanage" | "ngo" | "shelter" | "individual" | "other",
  createdAt: number   // epoch ms
}
```

### Collection: `foodListings/{id}`

```ts
{
  donorId: string,
  donorName: string,
  donorEmail: string,
  donorPhone: string,
  foodTitle: string,
  foodType: string,
  description: string,
  quantity: string,            // "8 kg / 4 trays"
  servesCount: number,
  pickupAddress: string,
  contactPhone: string,
  priceType: "free" | "low_cost",
  price: number,               // 0 when free
  pickupTime: number,          // epoch ms
  expiresAt: number,           // epoch ms
  notes: string,
  status: "available" | "claimed",
  claimedBy: string | null,
  claimedByName: string | null,
  claimedByPhone: string | null,
  claimedAt: number | null,
  createdAt: number
}
```

### Required Firestore indexes

The receiver dashboard, donor dashboard, and "My claims" page use composite
queries. Firestore will print the exact "Create index" link in the browser
console the first time each query runs — click it once and it's done. The
queries are:

- `foodListings where status == "available" orderBy createdAt desc`
- `foodListings where donorId == <uid> orderBy createdAt desc`
- `foodListings where claimedBy == <uid> orderBy claimedAt desc`

---

## 🛡 Security rules summary (`firestore.rules`)

- ✅ Each user reads/writes only their own `/users/{uid}` profile
- ✅ Authenticated users can **read** all food listings
- ✅ Only **donors** can **create** a listing, and only with their own `donorId`
- ✅ Listing **owner (donor)** can update their own listing freely
- ✅ A **receiver** can update a listing **only** to claim it (status flips
     `available → claimed`, immutable fields stay unchanged)
- ✅ Only the donor who created a listing can delete it

See `firestore.rules` for the full ruleset.

---

## 🗺 Routes

| Path                  | Page                                        |
|-----------------------|---------------------------------------------|
| `/`                   | Landing page                                |
| `/signup`             | Signup with role selection                  |
| `/login`              | Login                                       |
| `/dashboard`          | Redirects to donor or receiver dashboard    |
| `/donor`              | Donor dashboard (active + claimed tabs)     |
| `/donor/create`       | Create new food listing                     |
| `/receiver`           | Real-time available listings + claim flow   |
| `/receiver/claimed`   | Receiver's claimed food + donor contact     |

---

## 🧭 MVP simplifications (intentional)

- No separate backend — Firebase only
- No advanced verification, no payments, no volunteer delivery, no admin panel
- No distance-based matching (any receiver sees all available listings)
- No image uploads (can be added with Firebase Storage if time remains)
- Map is a **deep link** to Google Maps, not an embedded map UI

---

## 📝 License

MIT — built as a demo / hackathon-style MVP.
