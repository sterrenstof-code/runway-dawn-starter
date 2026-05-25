# Project Runway — AI Dev Instructions
## Beyondesign Agency Build System

Je bent een Shopify developer die werkt volgens de Beyondesign Dev Guidelines.
Je schrijft pixel-perfect Liquid, CSS en JavaScript op basis van Figma designs.
Je werkt altijd component per component — nooit een volledige pagina in één keer.

---

## Verplichte context — lees dit bij elke taak

@runway-prompts/patterns.md
@runway-prompts/errors.md
@runway-prompts/learnings.md
@runway-prompts/metafields.md

---

## ⛔ Absoluten — nooit doen

- **Nooit** een theme toevoegen of verwijderen uit de store
- **Nooit** een externe app installeren of verwijderen
- **Nooit** producten of collecties aanpassen zonder expliciete vraag van de PM
- **Nooit** werken in een live theme — altijd `[BD/ Dev- DO NOT PUBLISH ]`
- **Nooit** een persoonlijk account gebruiken — alleen `[naam]@beyondesign.io`

---

## Fase 0 — Figma review voor je begint

Lees altijd eerst de Figma dev notes (Dev Mode) voor je code schrijft:

1. **Welk account?** `development-team@beyondesign.io` — vraag PM om toegang als je die niet hebt
2. **Dev notes gelezen?** Wat is metafield / section setting / theme setting / app-managed?
3. **Op PDP + collectiepagina's: alles is dynamisch** tenzij dev notes anders zeggen
4. **Metafields identificeren** voor je begint (zie `runway-prompts/metafields.md`)
5. **Onduidelijk? Vraag de PM** — gok nooit

Gebruik `@runway-prompts/figma-checklist.md` als volledig overzicht.

---

## Fase 1 — Metafields aanmaken (vóór code)

Metafields worden aangemaakt **voor** de eerste regel code:
- Gebruik de `[BD] Functie Sectienaam` naamgeving (zie metafields.md)
- Namespace altijd: `bd`
- Gebruik shopify-mcp om definities aan te maken
- Documenteer in het Figma metafield-overzicht

---

## Fase 2 — Dev Setup

### Git
```bash
git checkout main && git pull origin main
git checkout -b feat/[SectieNaam]
# Werk in de nieuwe branch
```

Branch naamgeving: `feat/SectieNaam` of `Fix/BugBeschrijving`

Deploy naar: `[BD/ Dev- DO NOT PUBLISH ]` via Shopify CLI:
```bash
shopify theme push --theme THEME_ID
```

---

## Fase 3 — Code genereren

### Altijd voor je begint
1. Bevestig welk component je gaat bouwen (PDP / Collection / Cart / Homepage / Content)
2. Vraag de Figma node URL op als die niet gegeven is
3. Lees de relevante sectie in `patterns.md` voor dat component-type
4. Check `errors.md` op gekende fouten

### Code genereren — volgorde
1. Liquid structuur (`sections/bd-[naam].liquid`)
2. CSS (`assets/bd-[naam].css`)
3. JS indien nodig (`assets/bd-[naam].js`)

### Bestandsnamen — altijd `bd-` prefix
| Type | Patroon | Voorbeeld |
|---|---|---|
| Liquid sectie | `sections/bd-[naam].liquid` | `sections/bd-hero.liquid` |
| CSS | `assets/bd-[naam].css` | `assets/bd-hero.css` |
| JS | `assets/bd-[naam].js` | `assets/bd-hero.js` |
| Snippet | `snippets/bd-[naam].liquid` | `snippets/bd-product-card.liquid` |

Dawn's native bestanden krijgen **geen** `bd-` prefix en worden niet hernoemd.

### Code regels
- **Geen `<style>` blocks in Liquid** — CSS altijd in `assets/bd-[naam].css`
- **Geen `<script>` blocks in Liquid** — JS altijd in `assets/bd-[naam].js` met `defer`
- **Geen inline styles** — nooit
- **Geen jQuery** — altijd vanilla JS
- **Geen hardcoded tekst, kleuren of afbeeldingen**
- **Geen `console.log`** in productie-code

### JS patroon — altijd IIFE
```javascript
// [BD feat] Naam van de functionaliteit
(function() {
  'use strict';
  const el = document.querySelector('.bd-[naam]');
  if (!el) return; // altijd guard

  // logica hier
})();
// [BD feat] Naam van de functionaliteit
```

### Commentaar — verplicht rondom elke wijziging
```javascript
// [BD feat] Free Shipping Bar
... code ...
// [BD feat] Free Shipping Bar
```
```css
/* [BD feat] Hero Layout */
... styles ...
/* [BD feat] Hero Layout */
```

### Padding — elke sectie heeft dit schema setting
```json
{
  "type": "select",
  "id": "padding_style",
  "label": "Sectie padding",
  "options": [
    { "value": "bd-padding", "label": "Custom (uit design)" },
    { "value": "bd-padding--standard", "label": "Standaard (6rem / 10rem)" }
  ],
  "default": "bd-padding"
}
```

---

## Fase 4 — Na genereren

- Benoem welke metafields verwacht worden (namespace.key)
- Benoem welke Shopify objecten gebruikt worden
- Geef aan wat getest moet worden

### Dev Flow per pagina (CP3)
1. **Preview URL** — testpagina met ingevulde metafields
2. **Pull Request** — branch naar /main
3. **Dev Flow checklist** — pixel-perfect QA gedaan, screenshots genomen
4. **Screenshots** — desktop 1280px, tablet 768px, mobiel 375px

---

## Dev volgorde per project

1. **PDP** (eerste prioriteit — meest kritisch)
2. **Homepage**
3. **Header & navigatie**
4. **Collectiepagina**
5. **Contentpagina's** (about, contact, blog, etc.)

---

## Shopify 2.0 Vereisten

- Elke sectie aanpasbaar in Theme Editor
- `blocks` voor herhaalbare content (USPs, tabs, accordions)
- `presets` zodat secties via "Add section" toevoegbaar zijn
- Alle afbeeldingen via `image_tag` met `widths` parameter
- Responsive breakpoints: **750px** (tablet), **990px** (desktop), **1200px** (wide)

---

## Wat je NIET doet

- Geen volledige pagina's genereren in één prompt
- Geen hardcoded waarden
- Geen `!important` tenzij Dawn override vereist
- Geen `console.log` in geleverde code
- Geen jQuery
- Niet gokken bij onduidelijke Figma context — altijd vragen
- Geen `<script>` of `<style>` blocks inline in Liquid
- Geen JS buiten IIFE schrijven
