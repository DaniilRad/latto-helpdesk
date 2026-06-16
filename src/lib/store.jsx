import React from "react";
import { computePriority, rangesOverlap, SLA_CONFIG, TICKET_STATUS, uid } from "./meta.js";
import { can, DEFAULT_PROFILES, evaluateRole } from "./rbac.js";
import {
  SEED_ACTIVITY,
  SEED_DEVICES,
  SEED_KB,
  SEED_LICENSES,
  SEED_RULES,
  SEED_SOFTWARE,
  SEED_TICKETS,
  SEED_USERS,
} from "./seed.js";
import {
  DEFAULT_DASHBOARD,
  SEED_CONSUMABLES,
  SEED_CONTRACTS,
  SEED_DATABASES,
  SEED_DATACENTERS,
  SEED_DOMAINS,
  SEED_ENTITIES,
  SEED_GROUPS,
  SEED_PROBLEM_LINKS,
  SEED_PROBLEMS,
  SEED_RESERVATIONS,
  SEED_UNMANAGED,
} from "./seed2.js";

const LS_KEY = "helpdesk-hub:v4";
const StoreContext = React.createContext(null);

function seedState() {
  return {
    entities: SEED_ENTITIES,
    users: SEED_USERS.map((u) => ({ ...u, entityId: u.employeeType === "External" ? "e-ext" : "e-hq" })),
    devices: SEED_DEVICES.map((d) => ({ ...d, entityId: "e-hq" })),
    tickets: SEED_TICKETS.map((t) => ({
      ...t,
      groupId: null,
      problemId: SEED_PROBLEM_LINKS[t.id] || null,
      entityId: SEED_USERS.find((u) => u.id === t.requesterId)?.employeeType === "External" ? "e-ext" : "e-hq",
    })),
    problems: SEED_PROBLEMS,
    kb: SEED_KB,
    software: SEED_SOFTWARE,
    licenses: SEED_LICENSES,
    consumables: SEED_CONSUMABLES,
    contracts: SEED_CONTRACTS,
    domains: SEED_DOMAINS,
    databases: SEED_DATABASES,
    datacenters: SEED_DATACENTERS,
    unmanaged: SEED_UNMANAGED,
    reservations: SEED_RESERVATIONS,
    groups: SEED_GROUPS,
    rules: SEED_RULES,
    profiles: DEFAULT_PROFILES,
    activity: SEED_ACTIVITY,
    savedSearches: [],
    slaConfig: SLA_CONFIG,
    autoCloseDays: 3,
    dashboardLayout: DEFAULT_DASHBOARD,
    theme: "dark",
    personaId: "u-mbalk",
    entityFilter: "all",
    nextTicketNo: 1042,
    nextProblemNo: 8,
  };
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && Array.isArray(data.tickets) && Array.isArray(data.entities)) return data;
    }
  } catch {
    // corrupted storage — fall through to seed
  }
  return seedState();
}

export function StoreProvider({ children }) {
  const [state, setState] = React.useState(loadInitial);
  const [toasts, setToasts] = React.useState([]);

  React.useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state]);

  React.useEffect(() => {
    if (state.theme === "dark") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  // Automatic action: close resolved tickets after N days (GLPI-style cron, run on load).
  React.useEffect(() => {
    const cutoff = Date.now() - state.autoCloseDays * 86400000;
    const stale = state.tickets.filter(
      (t) => t.status === "resolved" && t.resolvedAt && new Date(t.resolvedAt).getTime() < cutoff,
    );
    if (stale.length === 0) return;
    setState((s) => ({
      ...s,
      tickets: s.tickets.map((t) =>
        stale.some((x) => x.id === t.id)
          ? {
              ...t,
              status: "closed",
              updatedAt: new Date().toISOString(),
              timeline: [
                ...t.timeline,
                {
                  id: uid(),
                  ts: new Date().toISOString(),
                  type: "system",
                  authorId: null,
                  text: `Auto-closed ${s.autoCloseDays} days after resolution`,
                },
              ],
            }
          : t,
      ),
    }));
    // run once per session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.tickets.filter, state.autoCloseDays]);

  const api = React.useMemo(() => {
    const log = (text, tone = "neutral") => {
      setState((s) => ({
        ...s,
        activity: [{ id: uid(), ts: new Date().toISOString(), text, tone }, ...s.activity].slice(0, 80),
      }));
    };

    const toast = (tone, title, message) => {
      const id = uid();
      setToasts((t) => [...t, { id, tone, title, message }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
    };

    const touchTicket = (s, id, patch, event) =>
      s.tickets.map((t) =>
        t.id === id
          ? {
              ...t,
              ...patch,
              updatedAt: new Date().toISOString(),
              timeline: event ? [...t.timeline, { id: uid(), ts: new Date().toISOString(), ...event }] : t.timeline,
            }
          : t,
      );

    // generic list helpers for the small collections
    const addTo = (key, item, msg) => {
      setState((s) => ({ ...s, [key]: [{ ...item, id: uid() }, ...s[key]] }));
      if (msg) toast("success", msg, item.name || "");
    };
    const saveIn = (key) => (id, patch) =>
      setState((s) => ({ ...s, [key]: s[key].map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
    const removeFrom = (key) => (id) => setState((s) => ({ ...s, [key]: s[key].filter((x) => x.id !== id) }));

    return {
      log,
      toast,
      dismissToast: (id) => setToasts((t) => t.filter((x) => x.id !== id)),
      setTheme: (theme) => setState((s) => ({ ...s, theme })),
      setPersona: (personaId) => setState((s) => ({ ...s, personaId, entityFilter: "all" })),
      setEntityFilter: (entityFilter) => setState((s) => ({ ...s, entityFilter })),

      /* ---- devices ---- */
      addDevice: (d) => {
        const device = { entityId: "e-hq", ...d, id: uid() };
        setState((s) => ({ ...s, devices: [device, ...s.devices] }));
        log(`${device.name} added to inventory`, "success");
        toast("success", "Device added", `${device.name} is now tracked.`);
        return device.id;
      },
      saveDevice: (id, patch, name) => {
        setState((s) => ({ ...s, devices: s.devices.map((d) => (d.id === id ? { ...d, ...patch } : d)) }));
        log(`${name} updated`, "neutral");
        toast("success", "Saved", `${name} updated.`);
      },
      deleteDevice: (id) => {
        const dev = state.devices.find((d) => d.id === id);
        setState((s) => ({
          ...s,
          devices: s.devices.filter((d) => d.id !== id),
          tickets: s.tickets.map((t) => (t.assetId === id ? { ...t, assetId: null } : t)),
          reservations: s.reservations.filter((r) => r.assetId !== id),
        }));
        if (dev) log(`${dev.name} removed from inventory`, "danger");
        toast("neutral", "Device removed", "It's gone from the inventory.");
      },

      /* ---- AD users ---- */
      addUser: (u) => {
        const user = { entityId: u.employeeType === "External" ? "e-ext" : "e-hq", ...u, id: uid() };
        setState((s) => ({ ...s, users: [user, ...s.users] }));
        log(`AD user ${user.sam} added`, "success");
        toast("success", "User added", `${user.displayName} is now tracked.`);
      },
      saveUser: (id, patch, name) => {
        setState((s) => ({ ...s, users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) }));
        log(`AD user ${name} updated`, "neutral");
        toast("success", "Saved", `${name} updated.`);
      },
      deleteUser: (id) => {
        const usr = state.users.find((u) => u.id === id);
        setState((s) => ({
          ...s,
          users: s.users.filter((u) => u.id !== id),
          devices: s.devices.map((d) => (d.assignedTo === id ? { ...d, assignedTo: null } : d)),
          groups: s.groups.map((g) => ({ ...g, members: g.members.filter((m) => m !== id) })),
        }));
        if (usr) log(`AD user ${usr.sam} removed`, "danger");
        toast("neutral", "User removed", "Their devices are now unassigned.");
      },

      /* ---- tickets ---- */
      addTicket: (t, authorId) => {
        const id = uid();
        const number = `TCK-${state.nextTicketNo}`;
        const now = new Date().toISOString();
        const author = state.users.find((u) => u.id === t.requesterId);
        const ticket = {
          groupId: null,
          ...t,
          id,
          number,
          entityId: author?.entityId || "e-hq",
          priority: computePriority(t.impact, t.urgency),
          status: t.assigneeId ? "assigned" : "new",
          createdAt: now,
          updatedAt: now,
          firstResponseAt: null,
          resolvedAt: null,
          timeline: [{ id: uid(), ts: now, type: "system", authorId, text: "Ticket created via portal" }],
        };
        setState((s) => ({ ...s, nextTicketNo: s.nextTicketNo + 1, tickets: [ticket, ...s.tickets] }));
        log(`${number} created`, "success");
        toast("success", "Ticket created", `${number} is in the queue.`);
        return id;
      },
      setTicketStatus: (id, to, authorId) => {
        const t = state.tickets.find((x) => x.id === id);
        if (!t || t.status === to) return;
        const patch = { status: to };
        if (to === "resolved" && !t.resolvedAt) patch.resolvedAt = new Date().toISOString();
        if (["new", "assigned", "in-progress"].includes(to)) patch.resolvedAt = null;
        setState((s) => ({
          ...s,
          tickets: touchTicket(s, id, patch, { type: "status", authorId, from: t.status, to }),
        }));
        log(`${t.number} → ${TICKET_STATUS[to].label}`, to === "resolved" ? "success" : "neutral");
      },
      assignTicket: (id, assigneeId, authorId) => {
        const t = state.tickets.find((x) => x.id === id);
        if (!t) return;
        const who = state.users.find((u) => u.id === assigneeId);
        const patch = { assigneeId: assigneeId || null };
        if (assigneeId && t.status === "new") patch.status = "assigned";
        setState((s) => ({
          ...s,
          tickets: touchTicket(s, id, patch, {
            type: "system",
            authorId,
            text: assigneeId ? `Assigned to ${who?.displayName || "?"}` : "Unassigned",
          }),
        }));
      },
      setTicketGroup: (id, groupId, authorId) => {
        const t = state.tickets.find((x) => x.id === id);
        if (!t) return;
        const g = state.groups.find((x) => x.id === groupId);
        setState((s) => ({
          ...s,
          tickets: touchTicket(
            s,
            id,
            { groupId: groupId || null },
            {
              type: "system",
              authorId,
              text: groupId ? `Routed to team ${g?.name || "?"}` : "Removed from team queue",
            },
          ),
        }));
      },
      saveTicketMeta: (id, patch) => {
        const t = state.tickets.find((x) => x.id === id);
        if (!t) return;
        const merged = { ...t, ...patch };
        setState((s) => ({
          ...s,
          tickets: touchTicket(s, id, { ...patch, priority: computePriority(merged.impact, merged.urgency) }, null),
        }));
      },
      addTicketEvent: (id, type, text, authorId) => {
        const t = state.tickets.find((x) => x.id === id);
        if (!t) return;
        const patch = {};
        if (type === "comment" && !t.firstResponseAt && authorId !== t.requesterId) {
          patch.firstResponseAt = new Date().toISOString();
        }
        setState((s) => ({ ...s, tickets: touchTicket(s, id, patch, { type, authorId, text }) }));
      },

      /* ---- problems (root-cause) ---- */
      addProblem: (p) => {
        const id = uid();
        const number = `PRB-${String(state.nextProblemNo).padStart(3, "0")}`;
        const now = new Date().toISOString();
        const problem = {
          status: "open",
          impact: "medium",
          urgency: "medium",
          assigneeId: null,
          rootCause: "",
          workaround: "",
          ...p,
          id,
          number,
          createdAt: now,
          updatedAt: now,
        };
        setState((s) => ({ ...s, nextProblemNo: s.nextProblemNo + 1, problems: [problem, ...s.problems] }));
        log(`${number} created`, "success");
        toast("success", "Problem created", `${number} groups the related tickets.`);
        return id;
      },
      saveProblem: (id, patch) => {
        setState((s) => ({
          ...s,
          problems: s.problems.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)),
        }));
      },
      setProblemStatus: (id, status) => {
        const p = state.problems.find((x) => x.id === id);
        if (!p) return;
        setState((s) => ({
          ...s,
          problems: s.problems.map((x) => (x.id === id ? { ...x, status, updatedAt: new Date().toISOString() } : x)),
        }));
        log(`${p.number} → ${status}`, status === "resolved" ? "success" : "neutral");
      },
      deleteProblem: (id) => {
        const p = state.problems.find((x) => x.id === id);
        setState((s) => ({
          ...s,
          problems: s.problems.filter((x) => x.id !== id),
          tickets: s.tickets.map((t) => (t.problemId === id ? { ...t, problemId: null } : t)),
        }));
        if (p) log(`${p.number} deleted`, "danger");
        toast("neutral", "Problem deleted", "Its tickets were unlinked.");
      },
      linkTicketToProblem: (ticketId, problemId) => {
        const t = state.tickets.find((x) => x.id === ticketId);
        const p = state.problems.find((x) => x.id === problemId);
        if (!t) return;
        setState((s) => ({
          ...s,
          tickets: touchTicket(
            s,
            ticketId,
            { problemId: problemId || null },
            {
              type: "system",
              authorId: null,
              text: problemId ? `Linked to problem ${p?.number || "?"}` : "Unlinked from problem",
            },
          ),
        }));
      },

      /* ---- knowledge base ---- */
      addArticle: (a, authorId) => {
        const article = { ...a, id: uid(), authorId, updatedAt: new Date().toISOString(), views: 0 };
        setState((s) => ({ ...s, kb: [article, ...s.kb] }));
        log(`KB article "${article.title}" published`, "success");
        toast("success", "Article published", article.title);
        return article.id;
      },
      saveArticle: (id, patch) => {
        setState((s) => ({
          ...s,
          kb: s.kb.map((a) => (a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a)),
        }));
        toast("success", "Saved", "Article updated.");
      },
      deleteArticle: (id) => {
        setState((s) => ({ ...s, kb: s.kb.filter((a) => a.id !== id) }));
        toast("neutral", "Article deleted", "It's gone from the knowledge base.");
      },
      bumpArticleViews: (id) => {
        setState((s) => ({ ...s, kb: s.kb.map((a) => (a.id === id ? { ...a, views: (a.views || 0) + 1 } : a)) }));
      },

      /* ---- software & licenses ---- */
      addSoftware: (sw) => addTo("software", { installs: [], ...sw }, "Software added"),
      deleteSoftware: (id) => {
        setState((s) => ({
          ...s,
          software: s.software.filter((x) => x.id !== id),
          licenses: s.licenses.filter((l) => l.softwareId !== id),
        }));
        toast("neutral", "Software removed", "Its licenses were removed too.");
      },
      addLicense: (l) => addTo("licenses", l, "License added"),
      deleteLicense: removeFrom("licenses"),

      /* ---- consumables ---- */
      addConsumable: (c) => addTo("consumables", c, "Consumable added"),
      saveConsumable: saveIn("consumables"),
      deleteConsumable: removeFrom("consumables"),
      adjustStock: (id, delta) => {
        setState((s) => ({
          ...s,
          consumables: s.consumables.map((c) => (c.id === id ? { ...c, stock: Math.max(0, c.stock + delta) } : c)),
        }));
      },

      /* ---- contracts, domains, databases, datacenters ---- */
      addContract: (c) => addTo("contracts", c, "Contract added"),
      saveContract: saveIn("contracts"),
      deleteContract: removeFrom("contracts"),
      addDomain: (d) => addTo("domains", d, "Domain added"),
      deleteDomain: removeFrom("domains"),
      addDatabase: (d) => addTo("databases", d, "Database added"),
      deleteDatabase: removeFrom("databases"),
      addDatacenter: (d) => addTo("datacenters", d, "Location added"),
      deleteDatacenter: removeFrom("datacenters"),

      /* ---- unmanaged devices ---- */
      approveUnmanaged: (id, type = "network") => {
        const um = state.unmanaged.find((x) => x.id === id);
        if (!um) return;
        const device = {
          id: uid(),
          name: um.name.toUpperCase().slice(0, 16),
          type,
          brand: um.vendor,
          model: "Discovered",
          serial: "",
          status: "in-stock",
          assignedTo: null,
          location: "Discovered on network",
          os: "",
          cpu: "",
          ram: "",
          ip: um.ip,
          mac: um.mac,
          purchaseDate: "",
          warrantyUntil: "",
          notes: `Approved from network discovery ${new Date().toISOString().slice(0, 10)}`,
          entityId: "e-hq",
        };
        setState((s) => ({ ...s, devices: [device, ...s.devices], unmanaged: s.unmanaged.filter((x) => x.id !== id) }));
        log(`${um.name} approved into inventory`, "success");
        toast("success", "Device approved", `${um.name} moved to inventory.`);
      },
      dismissUnmanaged: removeFrom("unmanaged"),

      /* ---- reservations ---- */
      addReservation: (r) => {
        const conflict = state.reservations.some(
          (x) => x.assetId === r.assetId && rangesOverlap(r.from, r.to, x.from, x.to),
        );
        if (conflict) {
          toast("danger", "Conflict", "That asset is already reserved in this window.");
          return false;
        }
        setState((s) => ({ ...s, reservations: [{ ...r, id: uid() }, ...s.reservations] }));
        log(`Reservation added for ${state.devices.find((d) => d.id === r.assetId)?.name || "?"}`, "success");
        toast("success", "Reserved", "The slot is yours.");
        return true;
      },
      deleteReservation: removeFrom("reservations"),

      /* ---- groups ---- */
      addGroup: (g) => addTo("groups", { members: [], ...g }, "Team created"),
      saveGroup: saveIn("groups"),
      deleteGroup: (id) => {
        setState((s) => ({
          ...s,
          groups: s.groups.filter((g) => g.id !== id),
          tickets: s.tickets.map((t) => (t.groupId === id ? { ...t, groupId: null } : t)),
        }));
        toast("neutral", "Team deleted", "Its tickets are no longer routed.");
      },

      /* ---- entities ---- */
      addEntity: (e) => addTo("entities", e, "Entity created"),
      saveEntity: saveIn("entities"),
      deleteEntity: (id) => {
        if (id === "e-hq") return;
        setState((s) => ({
          ...s,
          entities: s.entities.filter((e) => e.id !== id),
          users: s.users.map((u) => (u.entityId === id ? { ...u, entityId: "e-hq" } : u)),
          devices: s.devices.map((d) => (d.entityId === id ? { ...d, entityId: "e-hq" } : d)),
          tickets: s.tickets.map((t) => (t.entityId === id ? { ...t, entityId: "e-hq" } : t)),
        }));
        toast("neutral", "Entity deleted", "Its records moved to Lätto HQ.");
      },
      setRecordEntity: (collection, id, entityId) => {
        setState((s) => ({ ...s, [collection]: s[collection].map((x) => (x.id === id ? { ...x, entityId } : x)) }));
      },

      /* ---- RBAC: profiles & AD rules ---- */
      setProfilePerm: (role, perm, value) => {
        setState((s) => ({
          ...s,
          profiles: { ...s.profiles, [role]: { ...s.profiles[role], [perm]: value } },
        }));
        log(`Profile ${role}: ${perm} ${value ? "granted" : "revoked"}`, "neutral");
      },
      addRule: (r) => {
        setState((s) => ({
          ...s,
          rules: [...s.rules, { ...r, id: uid(), order: s.rules.length + 1, enabled: true }],
        }));
        log(`AD rule added: ${r.type} "${r.value}" → ${r.role}`, "success");
        toast("success", "Rule added", "It's evaluated in order, first match wins.");
      },
      saveRule: (id, patch) => {
        setState((s) => ({ ...s, rules: s.rules.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
      },
      deleteRule: (id) => {
        const r = state.rules.find((x) => x.id === id);
        setState((s) => ({ ...s, rules: s.rules.filter((x) => x.id !== id) }));
        if (r) log(`AD rule deleted: ${r.type} "${r.value}"`, "danger");
      },
      moveRule: (id, dir) => {
        setState((s) => {
          const idx = s.rules.findIndex((r) => r.id === id);
          const j = idx + dir;
          if (idx < 0 || j < 0 || j >= s.rules.length) return s;
          const rules = [...s.rules];
          [rules[idx], rules[j]] = [rules[j], rules[idx]];
          return { ...s, rules: rules.map((r, i) => ({ ...r, order: i + 1 })) };
        });
      },

      /* ---- SLA config & saved searches & dashboard ---- */
      setSlaTarget: (priority, field, hours) => {
        setState((s) => ({
          ...s,
          slaConfig: { ...s.slaConfig, [priority]: { ...s.slaConfig[priority], [field]: hours } },
        }));
      },
      setAutoCloseDays: (autoCloseDays) => setState((s) => ({ ...s, autoCloseDays })),
      addSavedSearch: (search) => {
        setState((s) => ({ ...s, savedSearches: [...s.savedSearches, { ...search, id: uid() }] }));
        toast("success", "Search saved", search.name);
      },
      deleteSavedSearch: (id) => setState((s) => ({ ...s, savedSearches: s.savedSearches.filter((x) => x.id !== id) })),
      setDashboardLayout: (dashboardLayout) => setState((s) => ({ ...s, dashboardLayout })),

      /* ---- data ---- */
      resetData: () => {
        localStorage.removeItem(LS_KEY);
        setState(seedState());
        toast("accent", "Data reset", "Back to the demo dataset.");
      },
      exportData: () => {
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `helpdesk-hub-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
      },
    };
  }, [state]);

  // Derived RBAC + entity scoping for the active persona.
  const derived = React.useMemo(() => {
    const persona = state.users.find((u) => u.id === state.personaId) || state.users[0];
    const { role, ruleId } = evaluateRole(persona, state.rules);
    const isStaff = ["admin", "supervisor", "technician"].includes(role);
    // Staff see everything (optionally narrowed by the topbar entity filter);
    // end-users and externals are hard-scoped to their own entity.
    const activeEntity = isStaff
      ? state.entityFilter !== "all"
        ? state.entityFilter
        : null
      : persona.entityId || "e-hq";
    const scope = (arr) => (activeEntity ? arr.filter((x) => (x.entityId || "e-hq") === activeEntity) : arr);

    return {
      persona,
      personaRole: role,
      personaRuleId: ruleId,
      personaIsStaff: isStaff,
      activeEntity,
      hasPerm: (perm) => can(role, perm, state.profiles),
      roleOf: (user) => evaluateRole(user, state.rules),
      devices: scope(state.devices),
      tickets: scope(state.tickets),
      allDevices: state.devices,
      allTickets: state.tickets,
    };
  }, [state]);

  const value = React.useMemo(() => ({ ...state, ...api, ...derived, toasts }), [state, api, derived, toasts]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
