# Runway — Bekende Fouten & Oplossingen

_Versie: 2.0 | Beyondesign Agency Standards_
_Voeg nieuwe fouten toe zodra ze opduiken. Datum + beschrijving._

---

## CSS

### ❌ Dawn kleurvariabelen zonder `rgb()` wrapper

**Fout:**
```css
color: var(--color-base-text); /* geeft rauwe "R G B" triplet */
```

**Correct:**
```css
color: rgb(var(--color-base-text));
background-color: rgba(var(--color-base-accent-1), 0.1); /* met alpha */
```

**Waarom:** Dawn slaat kleuren op als RGB-triplets (`"26 26 26"`), niet als HEX. Altijd `rgb()` wrapper gebruiken.

---

### ❌ Architectuurklassen nesten in component CSS

**Fout:**
```css
.bd-hero__title .bd-h1 { margin: 0; } /* overschrijft architectuur */
```

**Correct:**
```css
.bd-hero__title { margin: 0; } /* stijl de component-selector direct */
```

---

### ❌ Verkeerde breakpoints

**Fout:** `768px`, `1024px`, `1280px` (Bootstrap / eigen systeem)

**Correct (Dawn standaard):**
- `750px` — tablet
- `990px` — desktop
- `1200px` — wide

---

### ❌ Desktop padding vergeten

**Fout:** Sectiepadding alleen voor mobiel ingesteld.

**Correct:**
```css
.bd-sectie { padding-block: var(--bd-section-padding-mobile, 6rem); }

@media screen and (min-width: 990px) {
  .bd-sectie { padding-block: var(--bd-section-padding-desktop, 10rem); }
}
```

---

## Liquid

### ❌ `product.variants.first` gebruiken

**Fout:**
```liquid
{{ product.variants.first.price | money }}
```

**Correct:**
```liquid
{{ product.selected_or_first_available_variant.price | money }}
```

**Waarom:** `variants.first` negeert de URL-parameter voor de geselecteerde variant.

---

### ❌ Ontbrekende blank-check

**Fout:**
```liquid
<h2>{{ section.settings.heading }}</h2>
```

**Correct:**
```liquid
{%- unless section.settings.heading == blank -%}
  <h2>{{ section.settings.heading | escape }}</h2>
{%- endunless -%}
```

---

### ❌ Output zonder escape

**Fout:**
```liquid
{{ product.title }}
{{ section.settings.heading }}
```

**Correct:**
```liquid
{{ product.title | escape }}
{{ section.settings.heading | escape }}
```

**Uitzondering:** `richtext_field` en `html`-type settings — die mogen zonder escape.

---

### ❌ Hardcoded tekst in Liquid

**Fout:**
```liquid
<button>Add to cart</button>
```

**Correct:**
```liquid
<button>{{ 'products.product.add_to_cart' | t }}</button>
```

---

### ❌ `<script>` block inline in Liquid sectie

**Fout:**
```liquid
<script>
  document.querySelector('.bd-hero').addEventListener(...)
</script>
{% schema %}...{% endschema %}
```

**Correct:** Altijd extern bestand:
```liquid
<script src="{{ 'bd-hero.js' | asset_url }}" defer="defer"></script>
{% schema %}...{% endschema %}
```

---

## JavaScript

### ❌ Geen guard voor ontbrekend element

**Fout:**
```javascript
const section = document.querySelector('.bd-hero');
section.addEventListener(...); // crasht als niet op pagina
```

**Correct:**
```javascript
const section = document.querySelector('[data-section-type="bd-hero"]');
if (!section) return;
```

---

### ❌ Geen theme editor support

**Fout:** JS initialiseert alleen bij `DOMContentLoaded` — werkt niet na sectie-reload in customizer.

**Correct:**
```javascript
function init() { /* ... */ }

document.addEventListener('shopify:section:load', function(event) {
  if (!event.target.querySelector('[data-section-type="bd-hero"]')) return;
  init();
});

init(); // eerste keer bij laden
```

---

### ❌ CSS-klassen als JS hooks

**Fout:**
```javascript
const trigger = section.querySelector('.bd-hero__button');
```

**Correct:**
```javascript
const trigger = section.querySelector('[data-bd-trigger]');
```

**Waarom:** CSS-klassen zijn voor styling, data-attributen voor JS-gedrag. Scheiding voorkomt breuk bij CSS-refactors.

---

## Metafields

### ❌ Verkeerde namespace

**Fout:** `custom`, `theme`, `store`

**Correct:** Altijd `bd`

---

### ❌ Metafields aanmaken ná coding

**Fout:** Component gebouwd zonder metafield-definitie → foutmeldingen in productpagina.

**Correct:** Metafields aanmaken in Shopify Admin **vóór** de eerste regel Liquid-code.

---

### ❌ Metafield zonder blank-check in Liquid

**Fout:**
```liquid
<p>{{ product.metafields.bd.subtitle_example.value }}</p>
```

**Correct:**
```liquid
{%- assign subtitle = product.metafields.bd.subtitle_example.value -%}
{%- unless subtitle == blank -%}
  <p>{{ subtitle | escape }}</p>
{%- endunless -%}
```

---

## Veiligheid & Workflow

### ❌ Werken in het live/gepubliceerde theme

**Nooit.** Altijd dev theme gebruiken: `[BD/ Dev- DO NOT PUBLISH ]`

---

### ❌ Credentials committen

Figma API token, Shopify access token of andere credentials horen nooit in een commit.
Gebruik `.mcp.json` (lokaal, in `.gitignore`) — nooit `.mcp.json.template` vullen met echte waarden.

---
