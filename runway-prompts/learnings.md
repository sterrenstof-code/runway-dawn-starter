# Runway — Learnings & Best Practices

_Versie: 2.0 | Beyondesign Agency Standards_
_Voeg nieuwe learnings toe na elk project. Datum + context._

---

## Workflow

### Metafields vóór code — altijd

Metafields aanmaken in Shopify Admin vóórdat je de sectie codeert bespaart iteraties.
De klant kan meteen content invullen terwijl jij de sectie bouwt.
Volgorde: Figma review → metafield-lijst opstellen → aanmaken via Admin → dan coderen.

---

### Figma Dev Mode is de bron van waarheid

Nooit spacingwaarden, fontgroottes of kleuren schatten of overnemen uit het design panel.
Open altijd het **rechter paneel in Dev Mode** — die toont exacte px-waarden en hex-codes.
Converteer px naar rem door te delen door 10 (Dawn gebruikt root font-size 10px).

---

### Dawn kleurvariabelen zijn RGB-triplets

`--color-base-text` bevat `"26 26 26"` (geen `#`). Altijd `rgb()` wrapper:
```css
color: rgb(var(--color-base-text));
background-color: rgba(var(--color-base-accent-1), 0.15);
```
Dit werkt ook met `rgba()` voor transparantie — iets wat met HEX niet kan zonder extra waarden.

---

### Bouwvolgorde bespaart refactors

PDP → Home → Header → Collection → Content.
De PDP bevat de meeste complexe component-interacties. Door daar te starten
komen patronen (prijs, varianten, gallery) beschikbaar voor hergebruik op andere pagina's.

---

### `[BD feat]` commentaar versnelt overdracht

Elke BD wijziging omhullen met `/* [BD feat] Naam */` zorgt dat toekomstige developers
(of Claude) snel het verschil zien tussen Dawn-code en BD-aanpassingen.
Zoek op `[BD feat]` om alle aanpassingen in één keer te vinden.

---

## CSS

### Mobile-first voorkomt `!important`

Begin altijd met de mobile styles, voeg media queries toe voor grotere schermen.
Desktop overrides zijn zo altijd additief — nooit conflicterend.

---

### `aspect-ratio` + `object-fit: cover` voor stabiele afbeeldingscontainers

```css
.bd-card__image-wrapper {
  aspect-ratio: 3 / 4;
  overflow: hidden;
}
.bd-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```
Dit voorkomt layout shift bij langzaam ladende afbeeldingen en werkt op alle viewports.
Gebruik `contain` voor productafbeeldingen op witte achtergrond.

---

### BEM geeft structuur — hou het vlak

Maximaal twee niveaus diep: `.bd-sectie__element`. Vermijd `.bd-sectie__element__sub-element`.
Gebruik een modifier (`.bd-sectie__element--variant`) voor visuele variaties.

---

## Liquid

### Whitespace control is verplicht

`{%- -%}` tags verwijderen overbodige witruimte uit de HTML output.
Gebruik ze consequent — het maakt de gegenereerde HTML leesbaar en voorkomt spacing-bugs.

---

### `section.id` in ID-attributen voor herbruikbaarheid

```liquid
id="bd-hero-{{ section.id }}"
```
Zo kan dezelfde sectie meerdere keren op één pagina staan zonder ID-conflict.

---

### `selected_or_first_available_variant` is altijd correct

Gebruik dit altijd op PDPs. Het respecteert URL-parameters (`?variant=123`) én
valt terug op de eerste beschikbare variant als geen URL-parameter aanwezig is.

---

## JavaScript

### IIFE + guard = veilig op elke pagina

De IIFE isoleert scope. De guard (`if (!section) return`) voorkomt fouten op pagina's
waar de sectie niet bestaat. Beide zijn verplicht — nooit weglaten.

---

### `data-bd-*` attributen als JS hooks

Koppel JS nooit aan CSS-klassen. Als de klasse ooit hernoemt wordt, breekt de JS.
`data-bd-trigger`, `data-bd-target` etc. zijn stabiel en communiceren duidelijk het doel.

---

### Theme editor support is geen optioneel extra

Shopify's customizer laadt secties opnieuw bij elke instellingswijziging.
Zonder `shopify:section:load` handler werkt de JS niet live in de customizer.
Dit ontdek je anders pas als de klant klaagt — bouw het altijd in.

---

## Afbeeldingen

### LCP afbeelding altijd eager

De eerste grote afbeelding above the fold (`eager` + `fetchpriority: 'high'`) bepaalt
de LCP-score. Vergeet dit niet bij hero-secties en featured product banners.

### `widths` + `sizes` zijn verplicht voor goede Core Web Vitals

```liquid
widths: '375, 750, 990, 1200, 1500',
sizes: '(min-width: 990px) 50vw, 100vw'
```
Shopify genereert dan automatisch een `srcset` — de browser kiest het juiste formaat.

---

## Shopify Admin

### Dev theme naam is heilig

`[BD/ Dev- DO NOT PUBLISH ]` — nooit een andere naam, nooit publishen.
De brackets en slash zorgen dat het als BD-intern theme herkenbaar is in de theme-lijst.

### Shopify CLI `theme dev` vóór `theme push`

Controleer altijd lokaal met `shopify theme dev` voordat je naar het dev theme pusht.
`theme dev` laadt bestanden real-time — je ziet CSS-wijzigingen direct zonder push.

---

## MCP Tools

### Shopify Dev MCP geeft live documentatie

`@shopify/dev-mcp` geeft Claude Code toegang tot actuele Shopify Liquid docs.
Gebruik het via `mcp__shopify-dev__*` tools voor het opzoeken van Liquid objects,
filters en schema-opties tijdens codegeneratie.

### shopify-mcp voor Admin API operaties

Metafield-definities, metaobjecten en publicatiestatus zijn bereikbaar via GraphQL
door het community pakket `shopify-mcp`. Gebruik dit voor Phase 1 (metafields aanmaken)
en Phase 7 (deployment verificatie).

---
