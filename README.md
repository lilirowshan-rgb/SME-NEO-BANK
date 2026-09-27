# Digipay Business — SME neo-bank (web)

React + TypeScript + Vite implementation of the Digipay Business merchant panel (Persian, RTL).

Implemented so far: the **Loan & Credit** page (`/loan`) — offer configurator (amount, term,
repayment method, live installment/fee/total), installment schedule, alternative financing, and the
review → sign → disbursed flow — plus the shared sidebar. Other sidebar sections are placeholders.

Rates and figures are sample values from the design draft (the 23% annual rate is marked "to be confirmed").

```sh
npm install
npm run dev        # http://localhost:5173
npm test           # vitest
npm run build      # typecheck + production build
```

- `src/lib/loan.ts` — loan constants and amortization math
- `src/pages/LoanPage.tsx` — loan page and application flow
- `src/components/Sidebar.tsx` — panel navigation
