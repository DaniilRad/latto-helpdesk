// Seed data for the v0.3 modules — entities, groups, consumables, contracts,
// infrastructure, reservations.

export const SEED_ENTITIES = [
  { id: "e-hq",  name: "Lätto HQ",        description: "Internal organization" },
  { id: "e-ext", name: "External clients", description: "Contractors & partner access — isolated" },
];

export const SEED_GROUPS = [
  { id: "g-l1",  name: "L1 Support", description: "First line — triage, accounts, peripherals", members: ["u-mlepik"] },
  { id: "g-inf", name: "Infrastructure", description: "Servers, network, AD", members: ["u-mbalk"] },
];

export const SEED_CONSUMABLES = [
  { id: "c-cf259x", name: "HP toner CF259X",        type: "toner", stock: 3, min: 2, location: "IT storage · shelf A", notes: "Fits LT-PRN-001/003" },
  { id: "c-tk3160", name: "Kyocera toner TK-3160",  type: "toner", stock: 1, min: 2, location: "IT storage · shelf A", notes: "Fits LT-PRN-002" },
  { id: "c-cat6",   name: "Cat6 patch 2m",          type: "cable", stock: 14, min: 10, location: "IT storage · bin 3", notes: "" },
  { id: "c-usbc",   name: "USB-C charger 65W",      type: "cable", stock: 4, min: 3, location: "IT storage · bin 4", notes: "Notebook spares" },
  { id: "c-sim",    name: "SIM card (Telia M2M)",   type: "sim",   stock: 5, min: 2, location: "IT safe", notes: "Activate via Telia portal" },
  { id: "c-hdmi",   name: "HDMI cable 3m",          type: "cable", stock: 2, min: 4, location: "IT storage · bin 3", notes: "Meeting rooms keep eating these" },
];

export const SEED_CONTRACTS = [
  { id: "ct-m365",  type: "contract",    name: "Microsoft 365 subscription",  vendor: "Microsoft / Crayon", number: "M365-2024-018", startDate: "2024-02-01", endDate: "2027-01-31", cost: "€ 4 280 / y", notes: "Auto-renews; 60-day cancel window." },
  { id: "ct-isp",   type: "contract",    name: "Internet 1 Gbit + backup LTE", vendor: "Telia",             number: "TEL-55821",     startDate: "2023-09-01", endDate: "2026-08-31", cost: "€ 190 / m",  notes: "SLA 99.5%, 4h response." },
  { id: "ct-print", type: "contract",    name: "Printer service & parts",      vendor: "OfficePrint OÜ",    number: "OP-2022-77",    startDate: "2022-05-10", endDate: "2026-07-31", cost: "€ 65 / m",   notes: "Covers fusers — TCK-1040 part under this." },
  { id: "ct-ssl1",  type: "certificate", name: "latto.io wildcard TLS",        vendor: "Let's Encrypt",     number: "*.latto.io",    startDate: "2026-05-02", endDate: "2026-07-31", cost: "—",          notes: "Auto-renew via certbot on web proxy — verify cron after FS changes." },
  { id: "ct-ssl2",  type: "certificate", name: "VPN gateway certificate",      vendor: "DigiCert",          number: "vpn.latto.io",  startDate: "2025-08-15", endDate: "2026-08-15", cost: "€ 180 / y",  notes: "Manual renewal — calendar reminder 30d before." },
];

export const SEED_DOMAINS = [
  { id: "dom-1", name: "latto.io",      registrar: "Namecheap", expires: "2027-03-12", dns: "Cloudflare", notes: "Primary" },
  { id: "dom-2", name: "latto.dev",     registrar: "Namecheap", expires: "2026-09-02", dns: "Cloudflare", notes: "Redirects to latto.io" },
  { id: "dom-3", name: "lattohub.com",  registrar: "GoDaddy",   expires: "2026-07-20", dns: "GoDaddy",    notes: "Brand protection — consider dropping" },
];

export const SEED_DATABASES = [
  { id: "db-1", name: "erp-prod",   engine: "PostgreSQL 16", assetId: "d-srv002", sizeGb: 38, notes: "Nightly dump to NAS" },
  { id: "db-2", name: "hr-portal",  engine: "MySQL 8",       assetId: "d-srv002", sizeGb: 4,  notes: "" },
  { id: "db-3", name: "monitoring", engine: "PostgreSQL 16", assetId: "d-srv001", sizeGb: 11, notes: "Grafana + Prometheus retention 90d" },
];

export const SEED_DATACENTERS = [
  { id: "dc-1", name: "HQ server room", location: "HQ · basement", racks: ["RACK-01", "RACK-02"], notes: "UPS 6 kVA, AC redundant" },
  { id: "dc-2", name: "Backup site",    location: "Warehouse · office", racks: ["RACK-W1"], notes: "NAS + LTE failover only" },
];

export const SEED_UNMANAGED = [
  { id: "um-1", name: "raspberrypi-4f2a", ip: "10.0.2.118", mac: "DC:A6:32:4F:2A:01", firstSeen: "2026-06-10T11:02:00Z", lastSeen: "2026-06-12T07:55:00Z", vendor: "Raspberry Pi Foundation" },
  { id: "um-2", name: "ESP-30AA12",       ip: "10.0.2.131", mac: "24:6F:28:30:AA:12", firstSeen: "2026-06-08T09:30:00Z", lastSeen: "2026-06-12T08:01:00Z", vendor: "Espressif" },
  { id: "um-3", name: "DESKTOP-K3J9PQ",   ip: "10.0.4.77",  mac: "00:1A:7D:K3:J9:PQ", firstSeen: "2026-06-11T13:44:00Z", lastSeen: "2026-06-11T16:20:00Z", vendor: "Unknown" },
];

export const SEED_RESERVATIONS = [
  { id: "res-1", assetId: "d-nb005",  userId: "u-eorav", from: "2026-06-15T08:00:00Z", to: "2026-06-17T16:00:00Z", note: "Conference demo notebook" },
  { id: "res-2", assetId: "d-mob003", userId: "u-jtamm", from: "2026-06-12T07:00:00Z", to: "2026-06-13T16:00:00Z", note: "Customer visit — spare phone" },
];

// Problems (GLPI-style) — root-cause records grouping multiple incidents.
export const SEED_PROBLEMS = [
  {
    id: "p-vpn", number: "PRB-007", title: "VPN gateway drops sessions under load",
    description: "Multiple remote users report the VPN tunnel collapsing every few minutes during busy hours. Suspected gateway resource exhaustion.",
    status: "investigating", impact: "high", urgency: "medium", assigneeId: "u-mbalk",
    rootCause: "", workaround: "Reconnect; prefer wired office connection for large transfers until resolved.",
    createdAt: "2026-06-10T08:20:00Z", updatedAt: "2026-06-12T09:10:00Z",
  },
  {
    id: "p-fs", number: "PRB-006", title: "File server I/O degradation office-wide",
    description: "General slowness opening and saving files on the shared drive. Correlates with backup window and large report exports.",
    status: "known-error", impact: "medium", urgency: "high", assigneeId: "u-mbalk",
    rootCause: "Nightly backup job overlaps business hours and saturates the RAID array.",
    workaround: "Reschedule heavy exports to afternoon; backup window being moved earlier.",
    createdAt: "2026-06-08T07:00:00Z", updatedAt: "2026-06-11T15:30:00Z",
  },
];

/** Seed links: ticketId → problemId. Applied when seeding tickets. */
export const SEED_PROBLEM_LINKS = {
  "t-1039": "p-vpn",
  "t-1036": "p-fs",
  "t-1037": "p-fs",
};

/** Default dashboard layout — widget keys + size (cols out of 4). */
export const DEFAULT_DASHBOARD = [
  { key: "kpi-tickets", size: 1 }, { key: "kpi-sla", size: 1 },
  { key: "kpi-repair", size: 1 }, { key: "kpi-users", size: 1 },
  { key: "monthly-flow", size: 2 }, { key: "tickets-status", size: 2 },
  { key: "sla-watchlist", size: 2 }, { key: "devices-type", size: 2 },
  { key: "warranty", size: 2 }, { key: "contracts", size: 2 },
  { key: "activity", size: 2 }, { key: "low-stock", size: 1 }, { key: "reservations", size: 1 },
];
