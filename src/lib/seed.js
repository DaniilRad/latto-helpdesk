// Seed data — a believable small-org dataset so the app is useful on first run.

export const SEED_USERS = [
  { id: "u-akoval",  displayName: "Anna Koval",      sam: "a.koval",     email: "a.koval@latto.io",     department: "Finance",     title: "Accountant",            phone: "+372 5301 1101", status: "enabled",  employeeType: "Internal", lastLogon: "2026-06-12T07:48:00Z", ou: "OU=Finance,DC=latto,DC=io",     groups: ["Domain Users", "Finance", "VPN Users"] },
  { id: "u-mbalk",   displayName: "Marko Balk",      sam: "m.balk",      email: "m.balk@latto.io",      department: "IT",          title: "System administrator",  phone: "+372 5301 1102", status: "enabled",  employeeType: "Internal", lastLogon: "2026-06-12T08:02:00Z", ou: "OU=IT,DC=latto,DC=io",          groups: ["Domain Users", "IT-Admins", "IT", "VPN Users"] },
  { id: "u-ksepp",   displayName: "Kadri Sepp",      sam: "k.sepp",      email: "k.sepp@latto.io",      department: "HR",          title: "HR manager",            phone: "+372 5301 1103", status: "enabled",  employeeType: "Internal", lastLogon: "2026-06-11T15:21:00Z", ou: "OU=HR,DC=latto,DC=io",          groups: ["Domain Users", "HR"] },
  { id: "u-jtamm",   displayName: "Jaan Tamm",       sam: "j.tamm",      email: "j.tamm@latto.io",      department: "Sales",       title: "Sales lead",            phone: "+372 5301 1104", status: "enabled",  employeeType: "Internal", lastLogon: "2026-06-12T06:55:00Z", ou: "OU=Sales,DC=latto,DC=io",       groups: ["Domain Users", "Sales", "VPN Users"] },
  { id: "u-lkask",   displayName: "Liis Kask",       sam: "l.kask",      email: "l.kask@latto.io",      department: "Sales",       title: "Account executive",     phone: "+372 5301 1105", status: "locked",   employeeType: "Internal", lastLogon: "2026-06-10T11:34:00Z", ou: "OU=Sales,DC=latto,DC=io",       groups: ["Domain Users", "Sales"] },
  { id: "u-rsaar",   displayName: "Rein Saar",       sam: "r.saar",      email: "r.saar@latto.io",      department: "Engineering", title: "Software engineer",     phone: "+372 5301 1106", status: "enabled",  employeeType: "Internal", lastLogon: "2026-06-12T08:10:00Z", ou: "OU=Engineering,DC=latto,DC=io", groups: ["Domain Users", "Engineering", "VPN Users"] },
  { id: "u-tkukk",   displayName: "Tiina Kukk",      sam: "t.kukk",      email: "t.kukk@latto.io",      department: "Engineering", title: "QA engineer",           phone: "+372 5301 1107", status: "enabled",  employeeType: "Internal", lastLogon: "2026-06-11T16:42:00Z", ou: "OU=Engineering,DC=latto,DC=io", groups: ["Domain Users", "Engineering"] },
  { id: "u-pmets",   displayName: "Peeter Mets",     sam: "p.mets",      email: "p.mets@latto.io",      department: "Warehouse",   title: "Warehouse operator",    phone: "+372 5301 1108", status: "enabled",  employeeType: "Internal", lastLogon: "2026-06-12T05:58:00Z", ou: "OU=Warehouse,DC=latto,DC=io",   groups: ["Domain Users", "Warehouse"] },
  { id: "u-eorav",   displayName: "Eva Orav",        sam: "e.orav",      email: "e.orav@latto.io",      department: "Marketing",   title: "Marketing specialist",  phone: "+372 5301 1109", status: "enabled",  employeeType: "Internal", lastLogon: "2026-06-11T13:05:00Z", ou: "OU=Marketing,DC=latto,DC=io",   groups: ["Domain Users", "Marketing"] },
  { id: "u-mlepik",  displayName: "Mart Lepik",      sam: "m.lepik",     email: "m.lepik@latto.io",     department: "IT",          title: "Helpdesk technician",   phone: "+372 5301 1110", status: "enabled",  employeeType: "Internal", lastLogon: "2026-06-12T07:30:00Z", ou: "OU=IT,DC=latto,DC=io",          groups: ["Domain Users", "IT-Support", "IT"] },
  { id: "u-svaher",  displayName: "Silvia Vaher",    sam: "s.vaher",     email: "s.vaher@latto.io",     department: "Finance",     title: "CFO",                   phone: "+372 5301 1111", status: "enabled",  employeeType: "Internal", lastLogon: "2026-06-11T17:48:00Z", ou: "OU=Finance,DC=latto,DC=io",     groups: ["Domain Users", "Finance", "Management"] },
  { id: "u-kraud",   displayName: "Kalev Raud",      sam: "k.raud",      email: "k.raud@latto.io",      department: "Warehouse",   title: "Logistics coordinator", phone: "+372 5301 1112", status: "disabled", employeeType: "Internal", lastLogon: "2026-04-02T09:12:00Z", ou: "OU=Disabled,DC=latto,DC=io",    groups: ["Domain Users"] },
  { id: "u-hpold",   displayName: "Helen Põld",      sam: "h.pold",      email: "h.pold@latto.io",      department: "HR",          title: "Recruiter",             phone: "+372 5301 1113", status: "enabled",  employeeType: "Internal", lastLogon: "2026-06-12T07:15:00Z", ou: "OU=HR,DC=latto,DC=io",          groups: ["Domain Users", "HR"] },
  { id: "u-aoja",    displayName: "Andres Oja",      sam: "a.oja",       email: "a.oja@latto.io",       department: "Engineering", title: "Engineering manager",   phone: "+372 5301 1114", status: "enabled",  employeeType: "Internal", lastLogon: "2026-06-12T08:20:00Z", ou: "OU=Engineering,DC=latto,DC=io", groups: ["Domain Users", "Engineering", "Management", "VPN Users", "IT-Supervisors"] },
  { id: "u-dnovak",  displayName: "Dana Nováková",   sam: "ext.dnovak",  email: "dana@partner-web.sk",  department: "External",    title: "Web agency contractor", phone: "+421 905 333 210", status: "enabled", employeeType: "External", lastLogon: "2026-06-11T09:40:00Z", ou: "OU=Externals,DC=latto,DC=io",   groups: ["Domain Users", "Group-Externals"] },
];

export const SEED_DEVICES = [
  { id: "d-pc001",  name: "LT-PC-001",  type: "pc",        brand: "Dell",    model: "OptiPlex 7020",     serial: "DL7020-44821", status: "in-use",   assignedTo: "u-akoval", location: "HQ · 2F · Finance",   os: "Windows 11 Pro 24H2", cpu: "i5-14500", ram: "16 GB", ip: "10.0.2.41",  mac: "9C:2D:CD:11:44:21", purchaseDate: "2024-09-12", warrantyUntil: "2027-09-12", notes: "" },
  { id: "d-pc002",  name: "LT-PC-002",  type: "pc",        brand: "Dell",    model: "OptiPlex 7020",     serial: "DL7020-44822", status: "in-use",   assignedTo: "u-svaher", location: "HQ · 2F · Finance",   os: "Windows 11 Pro 24H2", cpu: "i5-14500", ram: "16 GB", ip: "10.0.2.42",  mac: "9C:2D:CD:11:44:22", purchaseDate: "2024-09-12", warrantyUntil: "2027-09-12", notes: "" },
  { id: "d-pc003",  name: "LT-PC-003",  type: "pc",        brand: "HP",      model: "EliteDesk 805 G8",  serial: "HP805-99102",  status: "repair",   assignedTo: "u-pmets",  location: "Warehouse · office",  os: "Windows 10 Pro 22H2", cpu: "Ryzen 5 5650G", ram: "8 GB", ip: "10.0.4.11", mac: "3C:52:82:90:91:02", purchaseDate: "2021-11-03", warrantyUntil: "2024-11-03", notes: "PSU clicking — RMA opened 2026-06-08." },
  { id: "d-pc004",  name: "LT-PC-004",  type: "pc",        brand: "HP",      model: "EliteDesk 805 G8",  serial: "HP805-99103",  status: "in-use",   assignedTo: "u-ksepp",  location: "HQ · 1F · HR",        os: "Windows 11 Pro 23H2", cpu: "Ryzen 5 5650G", ram: "16 GB", ip: "10.0.1.18", mac: "3C:52:82:90:91:03", purchaseDate: "2021-11-03", warrantyUntil: "2024-11-03", notes: "" },
  { id: "d-nb001",  name: "LT-NB-001",  type: "notebook",  brand: "Lenovo",  model: "ThinkPad T14 Gen 5", serial: "LN-T14-70411", status: "in-use",  assignedTo: "u-mbalk",  location: "HQ · 1F · IT",        os: "Windows 11 Pro 24H2", cpu: "Ultra 7 155U", ram: "32 GB", ip: "10.0.1.71", mac: "E4:54:E8:70:41:01", purchaseDate: "2025-02-20", warrantyUntil: "2028-02-20", notes: "" },
  { id: "d-nb002",  name: "LT-NB-002",  type: "notebook",  brand: "Lenovo",  model: "ThinkPad T14 Gen 5", serial: "LN-T14-70412", status: "in-use",  assignedTo: "u-aoja",   location: "HQ · 3F · Eng",       os: "Windows 11 Pro 24H2", cpu: "Ultra 7 155U", ram: "32 GB", ip: "10.0.3.22", mac: "E4:54:E8:70:41:02", purchaseDate: "2025-02-20", warrantyUntil: "2028-02-20", notes: "" },
  { id: "d-nb003",  name: "LT-NB-003",  type: "notebook",  brand: "Apple",   model: "MacBook Pro 14 M3",  serial: "C02XJ0AAQ6L5", status: "in-use",  assignedTo: "u-rsaar",  location: "HQ · 3F · Eng",       os: "macOS 15.5",          cpu: "Apple M3 Pro", ram: "36 GB", ip: "10.0.3.31", mac: "F0:2F:4B:08:13:55", purchaseDate: "2024-04-09", warrantyUntil: "2026-07-09", notes: "AppleCare expiring soon." },
  { id: "d-nb004",  name: "LT-NB-004",  type: "notebook",  brand: "Lenovo",  model: "ThinkPad E16",       serial: "LN-E16-20931", status: "in-use",  assignedTo: "u-jtamm",  location: "Remote · Tartu",      os: "Windows 11 Pro 23H2", cpu: "i5-1335U", ram: "16 GB", ip: "vpn",       mac: "E4:54:E8:20:93:01", purchaseDate: "2023-08-15", warrantyUntil: "2026-08-15", notes: "" },
  { id: "d-nb005",  name: "LT-NB-005",  type: "notebook",  brand: "Lenovo",  model: "ThinkPad E16",       serial: "LN-E16-20932", status: "in-stock", assignedTo: null,      location: "HQ · IT storage",     os: "Windows 11 Pro 24H2", cpu: "i5-1335U", ram: "16 GB", ip: "",          mac: "E4:54:E8:20:93:02", purchaseDate: "2023-08-15", warrantyUntil: "2026-08-15", notes: "Spare — reimaged 2026-05-30." },
  { id: "d-nb006",  name: "LT-NB-006",  type: "notebook",  brand: "Apple",   model: "MacBook Air 13 M2",  serial: "C02ZK1BBR7M0", status: "in-use",  assignedTo: "u-eorav",  location: "HQ · 2F · Marketing", os: "macOS 15.5",          cpu: "Apple M2", ram: "16 GB", ip: "10.0.2.63",  mac: "F0:2F:4B:11:70:90", purchaseDate: "2023-03-22", warrantyUntil: "2026-06-22", notes: "" },
  { id: "d-srv001", name: "LT-SRV-DC1", type: "server",    brand: "Dell",    model: "PowerEdge R450",     serial: "PE450-00781",  status: "in-use",  assignedTo: null,       location: "HQ · server room",    os: "Windows Server 2022", cpu: "Xeon Silver 4310", ram: "64 GB", ip: "10.0.0.10", mac: "B0:7B:25:00:78:10", purchaseDate: "2023-04-12", warrantyUntil: "2027-04-12", notes: "Domain controller + DNS. Change window required." },
  { id: "d-srv002", name: "LT-SRV-FS1", type: "server",    brand: "Dell",    model: "PowerEdge R350",     serial: "PE350-01092",  status: "in-use",  assignedTo: null,       location: "HQ · server room",    os: "Windows Server 2022", cpu: "Xeon E-2336", ram: "32 GB", ip: "10.0.0.11", mac: "B0:7B:25:01:09:20", purchaseDate: "2022-08-30", warrantyUntil: "2026-08-30", notes: "File server. Backups nightly to NAS." },
  { id: "d-mob001", name: "LT-MOB-001", type: "mobile",    brand: "Apple",   model: "iPhone 15",          serial: "IM15-883120",  status: "in-use",  assignedTo: "u-jtamm",  location: "—",                   os: "iOS 18.5",            cpu: "", ram: "", ip: "", mac: "", purchaseDate: "2024-10-02", warrantyUntil: "2026-10-02", notes: "eSIM, MDM enrolled." },
  { id: "d-mob002", name: "LT-MOB-002", type: "mobile",    brand: "Samsung", model: "Galaxy S24",         serial: "SG24-771033",  status: "in-use",  assignedTo: "u-svaher", location: "—",                   os: "Android 15",          cpu: "", ram: "", ip: "", mac: "", purchaseDate: "2024-11-18", warrantyUntil: "2026-11-18", notes: "" },
  { id: "d-mob003", name: "LT-MOB-003", type: "mobile",    brand: "Samsung", model: "Galaxy A55",         serial: "SGA55-30911",  status: "in-stock", assignedTo: null,      location: "HQ · IT storage",     os: "Android 15",          cpu: "", ram: "", ip: "", mac: "", purchaseDate: "2025-01-27", warrantyUntil: "2027-01-27", notes: "Spare handset." },
  { id: "d-mob004", name: "LT-MOB-004", type: "mobile",    brand: "Apple",   model: "iPhone 13",          serial: "IM13-220871",  status: "retired", assignedTo: null,      location: "HQ · IT storage",     os: "iOS 17",              cpu: "", ram: "", ip: "", mac: "", purchaseDate: "2021-12-01", warrantyUntil: "2023-12-01", notes: "Battery 71% — recycle batch Q3." },
  { id: "d-prn001", name: "LT-PRN-001", type: "printer",   brand: "HP",      model: "LaserJet M428fdw",   serial: "HPLJ-55320",   status: "in-use",  assignedTo: null,       location: "HQ · 2F · corridor",  os: "FW 002.2310A",        cpu: "", ram: "", ip: "10.0.2.201", mac: "A0:48:1C:55:32:00", purchaseDate: "2022-05-10", warrantyUntil: "2025-05-10", notes: "Toner CF259X. Duplex jams when humid." },
  { id: "d-prn002", name: "LT-PRN-002", type: "printer",   brand: "Kyocera", model: "ECOSYS P3155dn",     serial: "KYO-88410",    status: "in-use",  assignedTo: null,       location: "Warehouse · packing", os: "FW 2S0_3000",         cpu: "", ram: "", ip: "10.0.4.201", mac: "00:C0:EE:88:41:00", purchaseDate: "2023-02-14", warrantyUntil: "2026-02-14", notes: "Label tray installed." },
  { id: "d-prn003", name: "LT-PRN-003", type: "printer",   brand: "HP",      model: "Color LaserJet M479", serial: "HPCJ-10277",  status: "repair",  assignedTo: null,       location: "HQ · 1F · HR",        os: "FW 002.2310A",        cpu: "", ram: "", ip: "10.0.1.202", mac: "A0:48:1C:10:27:70", purchaseDate: "2022-09-01", warrantyUntil: "2025-09-01", notes: "Fuser error 50.2 — part ordered." },
  { id: "d-scn001", name: "LT-SCN-001", type: "scanner",   brand: "Fujitsu", model: "fi-8170",            serial: "FJ8170-2210",  status: "in-use",  assignedTo: "u-akoval", location: "HQ · 2F · Finance",   os: "",                    cpu: "", ram: "", ip: "10.0.2.205", mac: "", purchaseDate: "2024-01-30", warrantyUntil: "2027-01-30", notes: "Invoice scanning station." },
  { id: "d-scn002", name: "LT-SCN-002", type: "scanner",   brand: "Zebra",   model: "DS2278",             serial: "ZB2278-0901",  status: "in-use",  assignedTo: "u-pmets",  location: "Warehouse · packing", os: "",                    cpu: "", ram: "", ip: "", mac: "", purchaseDate: "2023-06-19", warrantyUntil: "2026-06-19", notes: "Bluetooth cradle at packing desk 2." },
  { id: "d-mon001", name: "LT-MON-001", type: "monitor",   brand: "Dell",    model: "U2723QE",            serial: "DLU27-66110",  status: "in-use",  assignedTo: "u-rsaar",  location: "HQ · 3F · Eng",       os: "",                    cpu: "", ram: "", ip: "", mac: "", purchaseDate: "2024-04-09", warrantyUntil: "2027-04-09", notes: "" },
  { id: "d-mon002", name: "LT-MON-002", type: "monitor",   brand: "Dell",    model: "P2422H",             serial: "DLP24-31077",  status: "in-stock", assignedTo: null,      location: "HQ · IT storage",     os: "",                    cpu: "", ram: "", ip: "", mac: "", purchaseDate: "2022-03-11", warrantyUntil: "2025-03-11", notes: "" },
  { id: "d-net001", name: "LT-SW-CORE", type: "network",   brand: "UniFi",   model: "USW-Pro-48-PoE",     serial: "UI48-00112",   status: "in-use",  assignedTo: null,       location: "HQ · server room",    os: "UniFi OS 8.1",        cpu: "", ram: "", ip: "10.0.0.2",   mac: "78:45:58:00:11:20", purchaseDate: "2023-10-05", warrantyUntil: "2026-10-05", notes: "Core switch — do not power-cycle without change window." },
  { id: "d-net002", name: "LT-AP-2F",   type: "network",   brand: "UniFi",   model: "U6-Pro",             serial: "UIAP-20331",   status: "in-use",  assignedTo: null,       location: "HQ · 2F ceiling",     os: "UniFi OS 8.1",        cpu: "", ram: "", ip: "10.0.0.21",  mac: "78:45:58:20:33:10", purchaseDate: "2023-10-05", warrantyUntil: "2026-10-05", notes: "" },
];

/* ============ Tickets ============ */
// Today in seed-land is 2026-06-12 (~08:30 UTC).

export const SEED_TICKETS = [
  {
    id: "t-1041", number: "TCK-1041", title: "Cannot log in — account locked",
    description: "Liis can't sign in since this morning, error says the account is locked. Needs access urgently for a customer call at 10:00.",
    category: "incident", impact: "medium", urgency: "high", priority: 2,
    status: "in-progress", requesterId: "u-lkask", assigneeId: "u-mlepik", assetId: null,
    createdAt: "2026-06-12T07:55:00Z", updatedAt: "2026-06-12T08:15:00Z",
    firstResponseAt: "2026-06-12T08:05:00Z", resolvedAt: null,
    timeline: [
      { id: "e1", ts: "2026-06-12T07:55:00Z", type: "system", authorId: "u-lkask", text: "Ticket created via portal" },
      { id: "e2", ts: "2026-06-12T08:05:00Z", type: "comment", authorId: "u-mlepik", text: "Hi Liis — I see the lockout in AD (5 failed attempts from your notebook). Unlocking now; please don't retry the old password." },
      { id: "e3", ts: "2026-06-12T08:06:00Z", type: "status", authorId: "u-mlepik", from: "assigned", to: "in-progress" },
      { id: "e4", ts: "2026-06-12T08:15:00Z", type: "note", authorId: "u-mlepik", text: "Lockout source was a stale credential in Outlook on the old phone. Asked her to remove the account there." },
    ],
  },
  {
    id: "t-1040", number: "TCK-1040", title: "Printer on 1F prints blank pages",
    description: "HR printer outputs blank pages on every job since yesterday. Toner level shows 60%.",
    category: "incident", impact: "medium", urgency: "medium", priority: 3,
    status: "waiting", requesterId: "u-ksepp", assigneeId: "u-mlepik", assetId: "d-prn003",
    createdAt: "2026-06-11T13:10:00Z", updatedAt: "2026-06-12T07:40:00Z",
    firstResponseAt: "2026-06-11T13:50:00Z", resolvedAt: null,
    timeline: [
      { id: "e1", ts: "2026-06-11T13:10:00Z", type: "system", authorId: "u-ksepp", text: "Ticket created via portal" },
      { id: "e2", ts: "2026-06-11T13:50:00Z", type: "comment", authorId: "u-mlepik", text: "Reproduced — looks like the fuser (error 50.2 in the log). Ordering the part, printer goes to repair." },
      { id: "e3", ts: "2026-06-11T14:40:00Z", type: "status", authorId: "u-mlepik", from: "in-progress", to: "waiting" },
      { id: "e4", ts: "2026-06-12T07:40:00Z", type: "note", authorId: "u-mlepik", text: "Part ETA Friday. Redirected HR to LT-PRN-001 on 2F meanwhile." },
    ],
  },
  {
    id: "t-1039", number: "TCK-1039", title: "VPN drops every ~10 minutes from home",
    description: "Working from Tartu, VPN reconnects constantly since the weekend. Wired connection, other sites fine.",
    category: "incident", impact: "low", urgency: "high", priority: 3,
    status: "assigned", requesterId: "u-jtamm", assigneeId: "u-mbalk", assetId: "d-nb004",
    createdAt: "2026-06-11T09:20:00Z", updatedAt: "2026-06-11T10:00:00Z",
    firstResponseAt: "2026-06-11T10:00:00Z", resolvedAt: null,
    timeline: [
      { id: "e1", ts: "2026-06-11T09:20:00Z", type: "system", authorId: "u-jtamm", text: "Ticket created via e-mail (helpdesk@latto.io)" },
      { id: "e2", ts: "2026-06-11T10:00:00Z", type: "comment", authorId: "u-mbalk", text: "Taking this one. Please send the VPN client log from this morning (Help → Export logs)." },
    ],
  },
  {
    id: "t-1038", number: "TCK-1038", title: "New starter — laptop and accounts for Marketing",
    description: "New marketing colleague starts Monday 2026-06-16. Needs notebook, AD account, M365 license, and access to the shared drive.",
    category: "request", impact: "medium", urgency: "medium", priority: 3,
    status: "in-progress", requesterId: "u-hpold", assigneeId: "u-mbalk", assetId: "d-nb005",
    createdAt: "2026-06-10T08:30:00Z", updatedAt: "2026-06-11T16:00:00Z",
    firstResponseAt: "2026-06-10T09:00:00Z", resolvedAt: null,
    timeline: [
      { id: "e1", ts: "2026-06-10T08:30:00Z", type: "system", authorId: "u-hpold", text: "Ticket created via portal" },
      { id: "e2", ts: "2026-06-10T09:00:00Z", type: "comment", authorId: "u-mbalk", text: "Got it. LT-NB-005 is prepped as the spare — will rename and enroll it. AD account + M365 E3 on the list." },
      { id: "e3", ts: "2026-06-11T16:00:00Z", type: "note", authorId: "u-mbalk", text: "Account created, license assigned. Drive permissions pending Helen's confirmation of the team group." },
    ],
  },
  {
    id: "t-1037", number: "TCK-1037", title: "Excel crashes when opening large reports",
    description: "Monthly consolidation file (80 MB) crashes Excel on open about half the time. Started after last update.",
    category: "incident", impact: "high", urgency: "medium", priority: 2,
    status: "new", requesterId: "u-svaher", assigneeId: null, assetId: "d-pc002",
    createdAt: "2026-06-12T06:50:00Z", updatedAt: "2026-06-12T06:50:00Z",
    firstResponseAt: null, resolvedAt: null,
    timeline: [
      { id: "e1", ts: "2026-06-12T06:50:00Z", type: "system", authorId: "u-svaher", text: "Ticket created via portal" },
    ],
  },
  {
    id: "t-1036", number: "TCK-1036", title: "File server feels slow for the whole office",
    description: "Opening files from the shared drive takes 20–30 seconds since this morning. Affects everyone on 2F at least.",
    category: "incident", impact: "high", urgency: "high", priority: 1,
    status: "in-progress", requesterId: "u-akoval", assigneeId: "u-mbalk", assetId: "d-srv002",
    createdAt: "2026-06-12T07:35:00Z", updatedAt: "2026-06-12T08:20:00Z",
    firstResponseAt: "2026-06-12T07:50:00Z", resolvedAt: null,
    timeline: [
      { id: "e1", ts: "2026-06-12T07:35:00Z", type: "system", authorId: "u-akoval", text: "Ticket created via portal" },
      { id: "e2", ts: "2026-06-12T07:50:00Z", type: "comment", authorId: "u-mbalk", text: "Confirmed — disk queue on FS1 is spiking. Investigating; suspect last night's backup job didn't release its snapshot." },
      { id: "e3", ts: "2026-06-12T07:52:00Z", type: "status", authorId: "u-mbalk", from: "assigned", to: "in-progress" },
      { id: "e4", ts: "2026-06-12T08:20:00Z", type: "note", authorId: "u-mbalk", text: "Stale VSS snapshot confirmed. Releasing it during lunch window 12:00 — expect 2 min outage." },
    ],
  },
  {
    id: "t-1035", number: "TCK-1035", title: "Request: second monitor for QA desk",
    description: "Would speed up test runs a lot to have a second screen. Any spare 24\" would do.",
    category: "request", impact: "low", urgency: "low", priority: 5,
    status: "assigned", requesterId: "u-tkukk", assigneeId: "u-mlepik", assetId: "d-mon002",
    createdAt: "2026-06-09T11:00:00Z", updatedAt: "2026-06-10T09:30:00Z",
    firstResponseAt: "2026-06-10T09:30:00Z", resolvedAt: null,
    timeline: [
      { id: "e1", ts: "2026-06-09T11:00:00Z", type: "system", authorId: "u-tkukk", text: "Ticket created via portal" },
      { id: "e2", ts: "2026-06-10T09:30:00Z", type: "comment", authorId: "u-mlepik", text: "We have a Dell P2422H in storage — I'll bring it over this week." },
    ],
  },
  {
    id: "t-1034", number: "TCK-1034", title: "Scanner won't pair at packing desk 2",
    description: "Zebra scanner lost Bluetooth pairing after battery swap, beeps three times when scanning the pairing code.",
    category: "incident", impact: "medium", urgency: "high", priority: 2,
    status: "resolved", requesterId: "u-pmets", assigneeId: "u-mlepik", assetId: "d-scn002",
    createdAt: "2026-06-10T06:15:00Z", updatedAt: "2026-06-10T08:40:00Z",
    firstResponseAt: "2026-06-10T06:45:00Z", resolvedAt: "2026-06-10T08:40:00Z",
    timeline: [
      { id: "e1", ts: "2026-06-10T06:15:00Z", type: "system", authorId: "u-pmets", text: "Ticket created via phone call" },
      { id: "e2", ts: "2026-06-10T06:45:00Z", type: "comment", authorId: "u-mlepik", text: "Three beeps = cradle mismatch. Re-pairing against the desk 2 cradle barcode — sending the steps." },
      { id: "e3", ts: "2026-06-10T08:40:00Z", type: "status", authorId: "u-mlepik", from: "in-progress", to: "resolved" },
      { id: "e4", ts: "2026-06-10T08:40:00Z", type: "comment", authorId: "u-mlepik", text: "Paired and tested 20 scans. KB article updated with the cradle re-pair steps." },
    ],
  },
  {
    id: "t-1033", number: "TCK-1033", title: "Partner site CMS access for contractor",
    description: "Need read access to the marketing asset library for our web agency contractor (Dana).",
    category: "request", impact: "low", urgency: "medium", priority: 4,
    status: "closed", requesterId: "u-eorav", assigneeId: "u-mbalk", assetId: null,
    createdAt: "2026-06-05T10:00:00Z", updatedAt: "2026-06-08T09:00:00Z",
    firstResponseAt: "2026-06-05T11:30:00Z", resolvedAt: "2026-06-06T15:00:00Z",
    timeline: [
      { id: "e1", ts: "2026-06-05T10:00:00Z", type: "system", authorId: "u-eorav", text: "Ticket created via portal" },
      { id: "e2", ts: "2026-06-05T11:30:00Z", type: "comment", authorId: "u-mbalk", text: "External account ext.dnovak created in the Externals OU with library read-only. Sharing credentials via the password portal." },
      { id: "e3", ts: "2026-06-06T15:00:00Z", type: "status", authorId: "u-mbalk", from: "in-progress", to: "resolved" },
      { id: "e4", ts: "2026-06-08T09:00:00Z", type: "status", authorId: "u-eorav", from: "resolved", to: "closed" },
    ],
  },
  {
    id: "t-1032", number: "TCK-1032", title: "Wi-Fi dead spots near 2F meeting room",
    description: "Calls drop when walking from the kitchen to the big meeting room. Phones show full bars then nothing.",
    category: "incident", impact: "low", urgency: "low", priority: 5,
    status: "new", requesterId: "u-eorav", assigneeId: null, assetId: "d-net002",
    createdAt: "2026-06-08T14:20:00Z", updatedAt: "2026-06-08T14:20:00Z",
    firstResponseAt: null, resolvedAt: null,
    timeline: [
      { id: "e1", ts: "2026-06-08T14:20:00Z", type: "system", authorId: "u-eorav", text: "Ticket created via portal" },
    ],
  },
];

/* ============ Knowledge base ============ */

export const SEED_KB = [
  {
    id: "kb-vpn", title: "Set up VPN on a company notebook", visibility: "public",
    category: "Network", tags: ["vpn", "remote"], authorId: "u-mbalk", updatedAt: "2026-05-20T10:00:00Z", views: 184,
    body: "## Before you start\nYou need your AD password and the company notebook. VPN works from any network.\n\n## Steps\n- Open the **Lätto VPN** app from the Start menu\n- Sign in with your AD account (`name.surname`)\n- Approve the prompt in the authenticator app\n- Wait for the status to show `CONNECTED`\n\n## If it fails\n- Check you're not on the office network — VPN is for outside use\n- Restart the app once; twice won't help\n- Still stuck? Create a ticket and attach the log from **Help → Export logs**",
  },
  {
    id: "kb-printer", title: "Printer prints blank pages or jams", visibility: "public",
    category: "Hardware", tags: ["printer"], authorId: "u-mlepik", updatedAt: "2026-06-10T09:00:00Z", views: 96,
    body: "## Quick checks\n- Is the right printer selected? Office printers are named by floor (`PRN-2F`)\n- Open the front tray and check for a jammed sheet\n- Toner low warnings can be ignored until print quality drops\n\n## Blank pages\nBlank pages usually mean a hardware fault, not toner. Create a ticket with the printer name — don't swap toner yourself.\n\n## Where to print meanwhile\nEvery floor has a fallback printer. 1F → use `PRN-2F` one floor up.",
  },
  {
    id: "kb-password", title: "Change or reset your password", visibility: "public",
    category: "Accounts", tags: ["password", "account"], authorId: "u-mlepik", updatedAt: "2026-04-02T08:00:00Z", views: 240,
    body: "## Change (you know the old one)\nPress `Ctrl+Alt+Del` → **Change a password**. Minimum 12 characters; a passphrase works best.\n\n## Forgot it\nCall the helpdesk (ext. 100) — we verify you and issue a temporary password valid for one logon.\n\n## Locked out\nFive wrong attempts lock the account for 15 minutes. If it keeps locking without you typing anything, an old saved password is retrying somewhere (phone mail app is the usual suspect) — create a ticket.",
  },
  {
    id: "kb-unlock", title: "Unlock an AD account and find the lockout source", visibility: "internal",
    category: "Accounts", tags: ["ad", "lockout"], authorId: "u-mbalk", updatedAt: "2026-06-12T08:10:00Z", views: 31,
    body: "## Unlock\n`Unlock-ADAccount -Identity <sam>` or via ADUC → account tab.\n\n## Find the source — do this every time\nUnlocking without finding the source just relocks in minutes.\n- Check `4740` events on LT-SRV-DC1: `Get-WinEvent -FilterHashtable @{LogName='Security';Id=4740}`\n- The *Caller Computer Name* is where the bad credential lives\n- Usual suspects, in order: phone mail profile, mapped drive with saved creds, scheduled task, old RDP session\n\n## After\nNote the source in the ticket — we track repeat offenders.",
  },
  {
    id: "kb-imaging", title: "Notebook imaging and enrollment checklist", visibility: "internal",
    category: "Deployment", tags: ["imaging", "intune"], authorId: "u-mbalk", updatedAt: "2026-05-30T14:00:00Z", views: 18,
    body: "## Image\n- Boot PXE → select `Win11-24H2-Standard`\n- Hostname pattern: `LT-NB-XXX` (next free number from the inventory)\n\n## Enroll\n- Autopilot profile applies on first boot — sign in with the *user's* account, not admin\n- Verify BitLocker key escrowed to AD before handover\n\n## Handover\n- Update the device record: assignee, location, purchase + warranty dates\n- 15-minute intro for new starters: VPN, printers, KB portal",
  },
  {
    id: "kb-fs-slow", title: "File server slow — VSS snapshot runbook", visibility: "internal",
    category: "Servers", tags: ["fs1", "vss", "runbook"], authorId: "u-mbalk", updatedAt: "2026-06-12T08:25:00Z", views: 7,
    body: "## Symptom\nShare access slow office-wide, disk queue high on LT-SRV-FS1, backup ran the night before.\n\n## Check\n`vssadmin list shadows` — more than 2 shadows or one older than 24h = stale snapshot.\n\n## Fix\n- Announce a 2-minute outage window\n- `vssadmin delete shadows /for=D: /oldest`\n- Queue drops within a minute; if not, check the backup agent service\n\n## Prevent\nBackup job must call snapshot cleanup on completion — verify after every agent update.",
  },
];

/* ============ Software & licenses ============ */

export const SEED_SOFTWARE = [
  { id: "s-m365",   name: "Microsoft 365 Apps",  publisher: "Microsoft", version: "2405", category: "Productivity", installs: ["d-pc001", "d-pc002", "d-pc003", "d-pc004", "d-nb001", "d-nb002", "d-nb004", "d-nb005"] },
  { id: "s-win11",  name: "Windows 11 Pro",      publisher: "Microsoft", version: "24H2", category: "OS", installs: ["d-pc001", "d-pc002", "d-pc004", "d-nb001", "d-nb002", "d-nb004", "d-nb005"] },
  { id: "s-acrobat",name: "Acrobat Pro",          publisher: "Adobe",     version: "2025", category: "Productivity", installs: ["d-pc001", "d-pc002"] },
  { id: "s-slack",  name: "Slack",                publisher: "Salesforce", version: "4.39", category: "Communication", installs: ["d-nb001", "d-nb002", "d-nb003", "d-nb006"] },
  { id: "s-uniflow",name: "UniFi Network",        publisher: "Ubiquiti",  version: "8.1",  category: "Infrastructure", installs: ["d-srv001"] },
  { id: "s-veeam",  name: "Veeam Agent",          publisher: "Veeam",     version: "6.0",  category: "Backup", installs: ["d-srv001", "d-srv002"] },
];

export const SEED_LICENSES = [
  { id: "l-m365",   softwareId: "s-m365",   name: "M365 Business Premium", key: "tenant-latto", seats: 20, used: 15, expires: "2027-01-31" },
  { id: "l-acrobat",softwareId: "s-acrobat",name: "Acrobat Pro (VIP)",     key: "VIP-7741-2210", seats: 3,  used: 2,  expires: "2026-08-31" },
  { id: "l-slack",  softwareId: "s-slack",  name: "Slack Pro",             key: "workspace-latto", seats: 12, used: 11, expires: "2026-07-15" },
  { id: "l-veeam",  softwareId: "s-veeam",  name: "Veeam Universal",       key: "VUL-99-30417",  seats: 4,  used: 2,  expires: "2027-03-01" },
  { id: "l-win11",  softwareId: "s-win11",  name: "Windows 11 Pro (OEM)",  key: "per-device",    seats: 99, used: 7,  expires: "" },
];

/* ============ AD role-assignment rules ============ */

export const SEED_RULES = [
  { id: "rule-admins", order: 1, enabled: true, type: "group",     value: "IT-Admins",             role: "admin",      note: "IT administrators" },
  { id: "rule-superv", order: 2, enabled: true, type: "group",     value: "IT-Supervisors",        role: "supervisor", note: "Helpdesk supervisors / managers" },
  { id: "rule-techs",  order: 3, enabled: true, type: "group",     value: "IT-Support",            role: "technician", note: "Helpdesk technicians" },
  { id: "rule-ext",    order: 4, enabled: true, type: "attribute", value: "employeeType=External", role: "external",   note: "Contractors — isolated access" },
];

export const SEED_ACTIVITY = [
  { id: "a1", ts: "2026-06-12T08:05:00Z", text: "TCK-1041 first response by m.lepik (SLA met)", tone: "success" },
  { id: "a2", ts: "2026-06-12T07:52:00Z", text: "TCK-1036 escalated to P1 — file server slow office-wide", tone: "danger" },
  { id: "a3", ts: "2026-06-11T14:40:00Z", text: "LT-PRN-003 moved to repair — fuser error 50.2", tone: "warning" },
  { id: "a4", ts: "2026-06-10T11:35:00Z", text: "Account l.kask locked after failed logons", tone: "danger" },
  { id: "a5", ts: "2026-06-10T08:40:00Z", text: "TCK-1034 resolved — scanner re-paired at desk 2", tone: "success" },
  { id: "a6", ts: "2026-06-09T09:12:00Z", text: "LT-MOB-003 added to stock", tone: "success" },
  { id: "a7", ts: "2026-06-08T16:20:00Z", text: "LT-PC-003 RMA opened with HP", tone: "warning" },
];
