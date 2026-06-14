# Analýza a Architektúra Vlastného Helpdesku (Inšpirované GLPI)

Tento dokument slúži ako podklad a referenčná príručka pre návrh a vývoj vlastného ITSM/ITAM systému (Helpdesku) s pokročilou integráciou na Active Directory (AD).

---

## 1. Funkčný súhrn (Moduly systému)

Aby systém plnohodnotne pokryl potreby organizácie a konkuroval nástrojom ako GLPI, musí obsahovať nasledujúce kľúčové moduly:

### A. Core Ticketing (Správa požiadaviek)
* **Životný cyklus ticketu:** Nový $\rightarrow$ Pridelený $\rightarrow$ V riešení $\rightarrow$ Čaká na odpoveď $\rightarrow$ Vyriešený $\rightarrow$ Uzavretý.
* **Kategorizácia a Prioritizácia:** Dynamická matica priority kalkulovaná na základe dopadu (*Impact*) a naliehavosti (*Urgency*).
* **SLA (Service Level Agreement):** Sledovanie dvoch základných metrík:
    * *Time to Respond* (Čas do prvej odozvy)
    * *Time to Resolve* (Čas do kompletného vyriešenia)
    * Automatické eskalačné pravidlá (napr. upozornenie manažmentu pri dosiahnutí 80% SLA limitu).
* **Omnichannel zber požiadaviek:** Webový portál, spracovanie prichádzajúcich e-mailov (Inbound email-to-ticket), API rozhranie pre externé systémy.

### B. Správa používateľov a Rolí (RBAC & Dynamic Mapping)
Systém implementuje riadenie prístupu na základe rolí (Role-Based Access Control). Na základe integrácie s AD rozlišuje minimálne tieto profily:
* **End-User (Interný zamestnanec / Externista):** Zakladanie ticketov, sledovanie vlastných požiadaviek, schvaľovanie vyriešenia.
* **Technik / Riešiteľ:** Správa pridelených ticketov, zmena stavov, interné poznámky, komunikácia s koncovým používateľom.
* **Supervizor / Manažér:** Priraďovanie úloh riešiteľským skupinám, eskalácie, schvaľovanie zmien/nákupov, reporty a štatistiky.
* **Administrátor:** Kompletná konfigurácia systému, správa integrácií a systémových logov.

### C. Asset Management & CMDB (Správa majetku)
Prepojenie ticketov s infraštruktúrou (hlavná doména GLPI):
* **Konfiguračná databáza (CMDB):** Evidencia hardvéru (PC, notebooky, servery, switche), softvéru, licencií a sieťových prvkov.
* **Väzby a relácie:** Každý ticket je možné asociovať s konkrétnym objektom z CMDB (napr. "Tlačiareň 3. poschodie"). Riešiteľ okamžite vidí históriu incidentov daného zariadenia.

### D. Knowledge Base (Znalostná báza)
* **Verejná sekcia (Self-Service):** Návody na riešenie bežných problémov pre koncových používateľov (napr. ako nastaviť VPN).
* **Interná sekcia (Wiki pre IT):** Postupy, konfiguračné manuály a citlivé riešenia určené výhradne pre technikov.

---

## 2. Integrácia s Active Directory & Dynamické Priraďovanie Rolí

Integrácia zabezpečuje bezpečné prihlasovanie, automatickú synchronizáciu a bezúdržbovú správu oprávnení.

### A. Autentifikácia a Import
* **Protokoly:** Prihlasovanie cez LDAP/S, Kerberos (SSO), prípadne moderné OAuth2 / OpenID Connect (ak je AD prepojené s Azure AD / Entra ID).
* **Diferenciácia používateľov:**
    * *Interní zamestnanci:* Mapovaní na základe hlavných organizačných jednotiek (OU).
    * *Externí používatelia:* Identifikovaní podľa špecifického atribútu (napr. `extensionAttribute1`) alebo dedikovanej AD skupiny (napr. `Group-Externals`). Systém im striktne obmedzí viditeľnosť interných assetov a internej znalostnej bázy.

### B. Flexibilné Nastavenie Priraďovania Rolí (Pravidlá Pridelenia)
Aby administrátor nemusel manuálne nastavovať role v helpdesku, systém bude obsahovať **Konfiguračnú maticu pravidiel**, kde sa zadefinuje vzťah medzi AD atribútmi a rolami v systéme.

**Príklady automatizovaných pravidiel:**
1.  **Pravidlo pre Adminov:** Ak používateľ patrí do AD skupiny `CN=IT-Admins,OU=Groups,DC=firma,DC=local` $\rightarrow$ Priradiť rolu: **Administrátor**.
2.  **Pravidlo pre Technikov:** Ak používateľ patrí do AD skupiny `CN=IT-Support,OU=Groups,DC=firma,DC=local` $\rightarrow$ Priradiť rolu: **Technik**.
3.  **Pravidlo pre Externistov:** Ak má používateľ v AD atribút `employeeType == "External"` $\rightarrow$ Priradiť profil: **Externý používateľ** (izolovaný prístup).
4.  **Predvolené pravidlo (Fallback):** Ak používateľ nespadá pod žiadne pravidlo, ale úspešne sa autentifikoval $\rightarrow$ Priradiť rolu: **End-User (Interný)**.

*Poznámka: Tieto pravidlá sa vyhodnocujú v dvoch momentoch – pri prvom prihlásení používateľa (Just-In-Time provisioning) a počas pravidelnej nočnej synchronizácie (Cron job).*

---

## 3. Návrh Softvérovej Architektúry

Navrhované riešenie využíva modernú **Event-Driven (udalosťami riadenú) architektúru**, ktorá zabezpečuje vysokú škálovateľnosť, rýchlu odozvu rozhrania a oddelenie jednotlivých biznis logík.

### Komponentový diagram

```
[ Klientská aplikácia: React / Vue.js ] 
                    │
                    │ (HTTPS / REST API / GraphQL)
                    ▼
      [ API Gateway (Reverse Proxy / Auth) ]
                    │
     ┌──────────────┼──────────────┐
     ▼              ▼              ▼
┌───────────┐ ┌───────────┐ ┌──────────────┐
│  Ticket   │ │   Asset   │ │ Auth & Sync  │  ◀──▶ [ Active Directory ]
│  Service  │ │  Service  │ │   Service    │       (LDAP / Graph API)
└───────────┘ └───────────┘ └──────────────┘
     │              │              │
     └──────┬───────┴───────┬──────┘
            ▼               ▼
     [ Message Broker ] ──▶ [ Notification Service ]
     (RabbitMQ / Kafka)       (Email / MS Teams / SMS)
```

### Špecifikácia komponentov:

1.  **Frontend Vlastná Vrstva:** Responzívna Single Page Application (SPA). Dynamicky vykresľuje UI na základe JWT tokenu, ktorý obsahuje role používateľa vygenerované po overení voči AD.
2.  **API Gateway:** Zabezpečuje bezpečný vstup do systému (SSL/TLS terminácia, ochrana proti DDoS/Rate limiting, routovanie požiadaviek na konkrétne mikroservisy).
3.  **Auth & Sync Service:** Zodpovedá za integráciu s AD. Obsahuje modul na konfiguráciu pravidiel priraďovania rolí. Vykonáva pravidelné dopyty na AD a aktualizuje lokálnu cache používateľov.
4.  **Ticket & Asset Service:** Samostatné izolované služby. *Asset Service* spravuje objekty v CMDB. *Ticket Service* riadi procesy okolo incidentov. Sú navzájom prepojené pomocou referenčných ID.
5.  **Message Broker:** Odľahčuje synchrónne operácie. Ak technik uzavrie ticket, `Ticket Service` iba pošle správu do fronty. Používateľ nečaká na načítanie stránky, zatiaľ čo `Notification Service` na pozadí generuje a odosiela e-mail alebo notifikáciu do MS Teams.
6.  **Dátová Vrstva:** Hlavná relačná databáza **PostgreSQL** s aplikovanou Row-Level Security (RLS) pre bezpečné oddelenie dát interných zamestnancov a externistov. Pre pokročilé Full-textové vyhľadávanie v ticketoch a znalostnej báze sa implementuje **Elasticsearch**.

---

## 4. Kľúčové technické požiadavky (Best Practices)

* **Audit Trail:** Každá zmena priradenia roly (napr. prečo bol niekto preradený z Technika na Admina) a každá úprava ticketu musí byť nezmazateľne zapísaná s časovou pečiatkou a ID pôvodcu.
* **Idempotencia synchronizácie:** Opakovaný import z AD nesmie prepísať manuálne upravené lokálne výnimky, ak ich systém povoľuje.
* **Bezpečné ukladanie tajomstiev:** Prístupové údaje k AD (Service Account s právami na čítanie) nesmú byť natvrdo v kóde, ale uložené v bezpečnom trezore (Vault / Environment variables).
