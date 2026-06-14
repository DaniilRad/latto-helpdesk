# Helpdesk hub

A GLPI-inspired ITSM/ITAM web app for helpdesk teams — tickets with SLA, asset CMDB,
AD users with rule-based roles, and a knowledge base.
Built with the **Lätto design system** (dark-first, amber accent, three themes).
Requirements live in `analiza_helpdesk_glpi.md`; this is the frontend-first prototype
of that spec with simulated AD data.

## Modules

- **Core ticketing** — lifecycle New → Assigned → In progress → Waiting → Resolved →
  Closed; GLPI-style priority matrix (impact × urgency → P1–P5); SLA tracking for
  *time to respond* and *time to resolve* with 80% warnings and breach badges;
  timeline with public replies and internal notes; tickets link to CMDB assets and
  requesters. End-users approve resolution (resolved → closed).
- **RBAC + AD rules** — five profiles (Administrator, Supervisor, Technician,
  End-user, External) with an editable permission matrix, and a **rule matrix**
  mapping AD groups / OUs / attributes to roles (first match wins, fallback =
  End-user) with a live preview of computed roles. A **"View as" persona switcher**
  in the topbar simulates logging in as any AD user — the whole UI re-gates.
- **CMDB** — devices (PCs, notebooks, mobiles, servers, printers, scanners,
  monitors, network), software + licenses with seat/expiry tracking, per-asset
  incident history.
- **Knowledge base** — public self-service articles + internal IT-only section,
  markdown-lite body, categories, tags, search, view counters.
- **Self-service portal** — end-users get a simplified home: KB search, new ticket,
  my tickets.
- **Ops dashboard** — SLA watchlist, tickets-by-status donut, devices-by-type bars,
  warranty watchlist, locked accounts, activity feed.

## Run it

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # production build in dist/
```

Data persists in localStorage (`helpdesk-hub:v2`) with a believable demo dataset.
There is no backend — `src/lib/store.jsx` is the single swap point for a real API
(Ticket/Asset/Auth services per the architecture doc).

## Structure

```
src/
  ds/          # Lätto design system (tokens, styles.css, React primitives) — copied
               # from "_Lätto Design System"; Toast adapted to lucide-react icons
  lib/         # meta (domain constants, priority matrix, SLA), rbac (profiles,
               # permissions, rule evaluator), store (context + localStorage),
               # seed data, markdown-lite renderer
  components/  # Shell (gated nav, persona switcher), charts, dialogs, ticket bits
  pages/       # Dashboard/Portal, Tickets(+detail), Kb(+article), Devices(+detail),
               # Software, Users(+detail), Roles (profiles + AD rules), Settings
```

Icons are [Lucide](https://lucide.dev) via `lucide-react`.
