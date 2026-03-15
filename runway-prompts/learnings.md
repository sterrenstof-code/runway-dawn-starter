# Runway — Projectleerningen & Best Practices

_Versie: 1.0 | Laatste update: maart 2026_
_Dit bestand groeit automatisch op basis van alle CP3/CP4 rapporten over alle projecten._

---

## Hoe dit bestand werkt

Learnings zijn inzichten die breder gaan dan een specifieke fout — werkwijzen, aanpakken en beslissingen die bewezen werken. Ze komen uit post-project analyses en QA-rapporten.

---

## Aanpak & Werkwijze

### [L-001] Altijd sectie per sectie — nooit een volledige pagina
Genereer componenten één voor één. Een volledige PDP in één prompt resulteert in code die moeilijk te debuggen is, schema-fouten bevat, en niet pixel-perfect is. Werk altijd van boven naar onder: hero → info → tabs → gerelateerd.

### [L-002] Figma als enige bron van waarheid
Vraag altijd de Figma node URL op voor je begint. Screenshots zijn tweede keuze — ze missen exacte spacing, kleuren en font-sizes. Gebruik de Figma MCP tool om design tokens direct te lezen.

### [L-003] Metafields documenteren voor je begint
Vraag voor aanvang van een PDP of collection page naar het volledige metafield-overzicht. Metafields die pas halverwege ontdekt worden veroorzaken herwerk. De metafield-documentatie zit in de Dev Notes (CP1).

### [L-004] Preview met testdata — altijd
Een preview zonder ingevulde metafields en testproduct is geen preview. Zorg dat de testpagina alle edge cases dekt: lang productnaam, geen afbeelding, uitverkocht, sale prijs.

---

## Shopify 2.0 Specifiek

### [L-005] Dawn als basis, niet als template
Dawn is een startpunt voor de architectuur (CSS variabelen, JS events, schema conventies), niet als visueel startpunt. Overschrijf Dawn's visuele stijl volledig via de CSS variabelen in `settings_data.json`.

### [L-006] Theme Editor compatibiliteit is niet optioneel
Elke sectie moet volledig aanpasbaar zijn via de Theme Editor. Klant of PM kan anders niet zelfstandig aanpassingen doen. Dit is geen nice-to-have — het is een deliverable requirement.

### [L-007] Gebruik Dawn's JS event systeem
Dawn heeft een uitgebreid event systeem (`cart:updated`, `variant:change`, `drawer:open`…). Gebruik dit altijd in plaats van eigen event handlers te schrijven. Dit voorkomt conflicten en dubbele logica.

### [L-008] `settings_data.json` voor kleurenschema's
Kleuren en fonts worden niet in CSS hardcoded — ze worden ingesteld in `config/settings_data.json`. Dit zorgt dat de Theme Editor en de gerenderde kleuren overeenkomen.

---

## Performance

### [L-009] Lazy loading voor alles buiten de fold
Alle afbeeldingen die niet in het initiële viewport zitten krijgen `loading: 'lazy'`. Hero-afbeeldingen krijgen `loading: 'eager'` en optioneel `fetchpriority: 'high'`.

### [L-010] Geen externe scripts zonder expliciete goedkeuring
Externe JS libraries (sliders, animaties, fonts) worden altijd besproken voor implementatie. Elke externe script is een performance risico en potentieel security issue.

---

## QA & Oplevering

### [L-011] Pixel-perfect QA doe je in de browser, niet in de code
Gebruik de Shopify Theme Inspector plugin en een ruler tool om spacing te vergelijken met Figma. Code die er goed uitziet in de editor kan in de browser afwijken.

### [L-012] Test op drie breakpoints: 375px, 768px, 1280px
Elke opgeleverde sectie wordt getest op deze drie exacte breedtes. Screenshots van deze drie views gaan in het CP3-rapport.

### [L-013] Uitverkochte en variant-loze states altijd testen
Een product zonder varianten, een uitverkochte variant, en een product met 10+ varianten — alle drie testen voor oplevering.

---

## Communicatie & Proces

### [L-014] Onduidelijkheden melden, niet oplossen
Als een Figma component onduidelijk is (ontbrekende mobile state, onduidelijke interactie, ontbrekende data), meld dit direct aan de PM. Niet zelf interpreteren — interpretaties kosten meer tijd in QA dan de oorspronkelijke vraag.

### [L-015] PR per pagina, niet per project
Elke pagina krijgt een eigen branch en PR. Dit maakt QA gerichtter en maakt rollbacks makkelijker. Nooit alle pagina's in één enkele PR.

---

_Dit bestand wordt aangevuld na elk afgerond project. Learnings die 3+ keer voorkomen worden gepromoveerd naar `patterns.md`._
