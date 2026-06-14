# Gap Analýza: Porovnanie Latto (Helpdesk hub) vs. GLPI

Tento dokument poskytuje podrobný prehľad modulov a funkcií, ktoré sa nachádzajú v robustnom ITSM/ITAM systéme GLPI, ale v aktuálnej verzii aplikácie **Latto (v0.2)** zatiaľ chýbajú alebo nie sú plne špecifikované. Slúži ako backlog pre vývojový tím.

---

## 1. Modul: Podpora a Ticketing (Podpora)

Váš systém má sekciu `Tickets`, no GLPI rozdeľuje podporu na komplexnejšie ITIL procesy:

* **Problémy (Problems):** Schopnosť zoskupiť viacero incidentov/ticketov pod jeden spoločný "Problém" (napr. ak 10 ľudí hlási výpadok internetu, rieši sa jeden root-cause problém).
* **Zmeny (Changes):** Riadenie zmien (Change Management) pre schvaľovanie a plánovanie infraštruktúrnych zásahov (napr. plánovaná odstávka servera).
* **Opakujúce sa požiadavky a zmeny:** Šablóny a automatické generovanie tiketov v pravidelných intervaloch (napr. "Mesačná kontrola záloh").
* **Plánovanie (Planning):** Kalendár pre technikov, kde vidia pridelené tikety a plánované zásahy naviazané na čas.
* **Štatistiky (Statistics):** Pokročilé reporty priamo v module podpory (napr. priemerný čas vyriešenia, efektivita technikov).

---

## 2. Modul: Inventár a Správa majetku (Inventár / Správa)

Latto má v menu `Devices` a `Software`. GLPI však rozmieňa hardvér a IT majetok na drobné sub-kategórie, čo je pre kvalitnú IT Asset Management (ITAM) aplikáciu kľúčové:

### A. Chýbajúci hardvérový inventár (v Latto zlúčené pod "Devices")
* **Špecifické IT kategórie:** Sieťové zariadenia (Switche, Routre), Tlačiarne, Monitory, Telefóny.
* **Komponenty a spotrebný materiál:** Náplne (tonery), Káble, SIM karty a pasívne zariadenia.
* **Infraštruktúrne prvky:** Rozvádzače (Racky) a Skrine, Napájacie PDU lišty.
* **Nespravované zariadenia:** Detekované zariadenia v sieti, ktoré ešte neboli schválené do evidencie.

### B. Chýbajúci logický a softvérový inventár (v Latto chýba sekcia Správa)
* **Licencie:** Sledovanie počtu zakúpených vs. voľných licencií pre softvér.
* **Zmluvy a Certifikáty:** Evidencia kontraktov s dodávateľmi a sledovanie exspirácie SSL/TLS certifikátov.
* **Domény a Databázy:** Evidencia firemných webových domén a databázových inštancií.
* **Dátové centrá a Klastre:** Logické zoskupovanie serverov do klastrov a fyzických lokalít serverovní.

---

## 3. Modul: Nástroje a Pomocné funkcie (Nástroje)

Táto celá sekcia v Latto zatiaľ chýba (máte iba `Knowledge base`):

* **Projekty (Projects):** Riadenie väčších IT projektov priamo v helpdesku (prepojenie úloh s tiketmi a assetmi).
* **Rezervácie (Reservations):** Rezervačný systém pre firemný majetok (napr. možnosť rezervovať si firemné auto, projektor alebo zdieľaný notebook).
* **Pripomienky a RSS kanály:** Interné pripomienky pre technikov a odoberanie externých noviniek (napr. bezpečnostné bulletiny).
* **Uložené hľadania (Saved searches) & Tree view:** Možnosť uložiť si zložité filtre tiketov a zobraziť infraštruktúru v stromovej štruktúre.

---

## 4. Modul: Administrácia, Pravidlá a Nastavenia

V Latto máte záložky `Roles & rules` a `Settings`. Pre dosiahnutie flexibility GLPI by tieto sekcie mali obsahovať:

### A. Administrácia (Riadenie štruktúry)
* **Entity (Entities):** Kľúčová funkcia GLPI. Umožňuje multi-tenancy rozdelenie systému (napr. materská firma vs. dcérske pobočky, alebo interné IT vs. externí klienti), kde každá entita vidí iba svoje tikety a majetok.
* **Skupiny (Groups):** Riešiteľské tímy (napr. "L1 Support", "Sieťari", "Spracovanie dát").
* **Číselníky a Profily:** Správa typov tiketov, stavov a detailných oprávnení pre jednotlivé profily.

### B. Nastavenia (Technické pozadie)
* **Prijímače (Receivers):** Konfigurácia IMAP/POP3 pre automatické zakladanie tiketov z e-mailov.
* **Automatické akcie (Automatic actions):** Správa systémových cron jobov (napr. automatické uzatváranie vyriešených tiketov po 3 dňoch).
* **Úrovne služieb (SLA):** Dedikované rozhranie na definovanie reakčných časov podľa priority.
* **Komponenty a Rozbaľovacie ponuky:** Možnosť plne si prispôsobiť formuláre a select-boxy bez programovania.
* **OAuth IMAP applications:** Moderné bezpečné overenie pre mailové schránky (napr. voči Microsoft 365 / Google Workspace).

---

## Odporúčaný postup implementácie pre Latto (Roadmap)

1. **Fáza 1 (Rozšírenie Ticketingu):** Pridať *Skupiny (riešiteľské tímy)* a *Pravidlá* pre automatické priraďovanie tiketov.
2. **Fáza 2 (Doplnenie CMDB):** Rozmeniť `Devices` na *Počítače, Sieťové prvky a Periférie*, a prepojiť ich s tiketmi.
3. **Fáza 3 (E-mail integrácia):** Implementovať *Prijímače (Email-to-Ticket)* cez OAuth IMAP aplikácie.
4. **Fáza 4 (Multi-tenancy):** Implementovať *Entity*, aby bolo možné bezpečne izolovať interných používateľov od externistov.
