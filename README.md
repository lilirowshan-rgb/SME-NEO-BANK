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
| `/cash` | Sub-wallets, 30-day balance forecast, automatic rules, bills, bank accounts |
| `/accounting` | P&L by period, expenses by category, transactions to review, wholesale invoices, CSV export |
| `/tax` | Moadian e-invoices (filter + resubmit rejected), VAT summary & payment, tax calendar |
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

## Code map

- `src/pages/` — one component per page
- `src/components/` — sidebar, headers, logo, bar chart, chips, stat card, toggle
- `src/lib/` — sample data and pure logic (loan amortisation, early-settlement fees, P&L, forecast, validators) with tests
- `src/styles/` — `base.css` (tokens, buttons, cards, forms), `panel.css`, `public.css`, `loan.css`
- `src/assets/` — Digipay/Digikala wordmarks and merchant logos cropped from the design PDF
