# Digipay Business — SME neo-bank (web)

React + TypeScript + Vite implementation of the **Digipay Business** design draft (Persian, RTL).
All numbers, rates and names in `[brackets]` are sample placeholders from the design.

## Pages

| Route | Page |
| --- | --- |
| `/` | Marketing site: hero, network stats, merchant logos, about, who it's for, services (filterable accordion), panel preview, testimonials |
| `/login` | "Your account was found" — consent to read network data, then enter the panel |
| `/signup` | 6-step business account opening with validation (national code, mobile, date, Sheba) |
| `/faq` | Searchable, filterable FAQ |
| `/dashboard` | Balances, early settlement calculator, 6-month cash flow chart, transactions, upcoming payments |
| `/loan` | Pre-approved loan offer → review → digital signature → disbursed |
| `/sales` | All sales channels: DigiPay, other POS terminals (via bank statement), transfers, cash; credit limit on total sales |
| `/cash` | Sub-wallets, 30-day balance forecast, automatic rules, bills, bank accounts |
| `/accounting` | P&L by period, expenses by category, transactions to review, wholesale invoices, CSV export |
| `/tax` | Moadian e-invoices (filter + resubmit rejected), VAT summary & payment, tax calendar |
| `/ads` | Advertising & growth: campaigns (pause/resume, create), budget and results, daily estimate, growth tools |
| `/insights` | Benchmarks by sector, sales seasonality, percentile position, suggestions |
| `/profile` | Business info (editable), network connections, credit-score factors, documents, people |

## Run it

Requires [Node.js](https://nodejs.org) 20.19+ (LTS recommended).

```sh
npm install
npm start          # opens http://localhost:5173 in your browser
```

Other commands: `npm test` (unit + UI tests), `npm run build` (type-check + production build into `dist/`),
`npm run preview` (serve the production build).

### Windows

1. Install **Node.js LTS** from https://nodejs.org (default options), then open a new **PowerShell**.
2. Get the code — either `git clone -b claude/beautiful-faraday-nd6ym2 https://github.com/lilirowshan-rgb/sme-neo-bank.git`
   or download the branch as a ZIP from GitHub and extract it.
3. In PowerShell, `cd` into the folder that contains `package.json`, then run `npm install` and `npm start`.

If PowerShell says *running scripts is disabled*, run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once.
The Vazirmatn font is bundled, so the site works offline.

## Deploy (Docker / Kubernetes / Hamravesh Darkube)

The repo ships a production `Dockerfile` (Node build → nginx) and `nginx.conf`:

- listens on **port 80**; every app route (`/dashboard`, `/loan`, …) falls back to `index.html`
- **`/healthz`** returns `200 ok` — use it for liveness and readiness probes
- hashed files under `/assets/` are cached for a year; `index.html` is `no-cache`, so new deploys show up immediately
- no environment variables or volumes are needed (static site, stateless — safe to run several replicas)

```sh
docker build -t sme-neo-bank .
docker run -p 8080:80 sme-neo-bank      # http://localhost:8080
```

Base images are pulled from Hamravesh's Docker Hub mirror (`hub.hamdocker.ir/library`) by default, so the
build works on Darkube without extra settings. Outside Iran, add `--build-arg REGISTRY=docker.io/library`.
For an npm mirror add `--build-arg NPM_REGISTRY=<url>`.

**Darkube:** create an app from this Git repository with the Dockerfile build (Dockerfile path `Dockerfile`,
build context `.`), set the **port to 80**, point the readiness probe at `/healthz`, then attach your domain and enable HTTPS in the app's domain settings.

## Code map

- `src/pages/` — one component per page
- `src/components/` — sidebar, headers, logo, bar chart, chips, stat card, toggle
- `src/lib/` — sample data and pure logic (loan amortisation, early-settlement fees, P&L, forecast, validators) with tests
- `src/styles/` — `base.css` (tokens, buttons, cards, forms), `panel.css`, `public.css`, `loan.css`
- `src/assets/` — Digipay/Digikala wordmarks and merchant logos cropped from the design PDF
