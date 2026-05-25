# Runway — Bewezen Patronen per Component

_Versie: 2.0 | Beyondesign Agency Standards_
_Dit bestand wordt automatisch geüpdatet door de Runway Prompt Engine op basis van projectdata._

---

## BD Bestandsnamen & Prefixes

Alle custom BD bestanden gebruiken het `bd-` prefix:

```
sections/bd-hero.liquid
assets/bd-hero.css
assets/bd-hero.js
snippets/bd-product-card.liquid
assets/bd-theme-architecture.css   ← globale stijlen
assets/bd-design-tokens.css        ← project-specifieke tokens
```

Dawn's native bestanden worden **niet** hernoemd.

---

## BD Code Commentaar — verplicht

Elke BD wijziging is ingepakt met commentaar:

```css
/* [BD feat] Hero Layout */
.bd-hero { ... }
/* [BD feat] Hero Layout */
```

```javascript
// [BD feat] Cart Drawer Counter
(function() { ... })();
// [BD feat] Cart Drawer Counter
```

Zo is elke BD wijziging terug te vinden door `[BD feat]` te zoeken.

---

## Dawn CSS Variabelen — altijd gebruiken

```css
/* Kleuren (RGB triplets — gebruik altijd rgb() wrapper) */
color: rgb(var(--color-base-text));
background-color: rgb(var(--color-base-background-1));
background-color: rgba(var(--color-base-accent-1), 0.1); /* met alpha */

/* Volledige lijst */
var(--color-base-text)
var(--color-base-background-1)
var(--color-base-background-2)
var(--color-base-accent-1)
var(--color-base-accent-2)
var(--color-base-outline-button-labels)
var(--color-base-solid-button-labels)

/* Typografie */
var(--font-heading-family)
var(--font-heading-style)
var(--font-heading-weight)
var(--font-body-family)
var(--font-body-style)
var(--font-body-weight)

/* Layout & spacing */
var(--page-width)
var(--spacing-sections-desktop)
var(--spacing-sections-mobile)
var(--grid-desktop-horizontal-spacing)
var(--grid-mobile-horizontal-spacing)
```

BD custom tokens (uit `bd-design-tokens.css`):
```css
var(--bd-color-primary)
var(--bd-font-heading)
var(--bd-text-h1)  /* etc. */
var(--bd-space-md)
var(--bd-section-padding-mobile)    /* standaard: 6rem */
var(--bd-section-padding-desktop)   /* standaard: 10rem */
```

---

## Schema Patroon — Standaard BD Sectie

```liquid
{% comment %}
  Section: bd-[naam]
  Metafields: [lijst van bd.key namen]
{% endcomment %}

{%- liquid
  assign heading = section.settings.heading
-%}

<section
  id="bd-[naam]-{{ section.id }}"
  class="bd-[naam] {{ section.settings.padding_style }} color-{{ section.settings.color_scheme }} gradient"
  aria-labelledby="bd-[naam]-heading-{{ section.id }}"
>
  <div class="bd-[naam]__container page-width">
    {%- unless heading == blank -%}
      <h2 id="bd-[naam]-heading-{{ section.id }}" class="bd-[naam]__heading {{ section.settings.heading_size }}">
        {{- heading | escape -}}
      </h2>
    {%- endunless -%}
  </div>
</section>

{{ 'bd-[naam].css' | asset_url | stylesheet_tag }}
<script src="{{ 'bd-[naam].js' | asset_url }}" defer="defer"></script>

{% schema %}
{
  "name": "BD — Sectienaam",
  "tag": "section",
  "class": "bd-[naam]",
  "disabled_on": { "groups": ["header", "footer"] },
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Titel",
      "default": "Standaard titel"
    },
    {
      "type": "select",
      "id": "heading_size",
      "label": "Titel grootte",
      "options": [
        { "value": "bd-h2", "label": "H2 (standaard)" },
        { "value": "bd-h1", "label": "H1 (groot)" },
        { "value": "bd-h3", "label": "H3 (klein)" }
      ],
      "default": "bd-h2"
    },
    {
      "type": "select",
      "id": "padding_style",
      "label": "Sectie padding",
      "options": [
        { "value": "bd-padding", "label": "Custom (uit design)" },
        { "value": "bd-padding--standard", "label": "Standaard (6rem / 10rem)" }
      ],
      "default": "bd-padding"
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "Kleurenschema",
      "default": "scheme-1"
    }
  ],
  "blocks": [],
  "presets": [{ "name": "BD — Sectienaam" }]
}
{% endschema %}
```

---

## CSS Patroon — Mobile First

```css
/* [BD feat] BD-Naam layout */

/* Mobile (basis) */
.bd-[naam] {
  padding-block: var(--bd-section-padding-mobile);
}

.bd-[naam].bd-padding--standard {
  padding-block: var(--bd-section-padding-mobile);
}

/* Tablet — 750px */
@media screen and (min-width: 750px) {
  .bd-[naam] { ... }
}

/* Desktop — 990px */
@media screen and (min-width: 990px) {
  .bd-[naam] {
    padding-block: var(--bd-section-padding-desktop);
  }
  .bd-[naam].bd-padding--standard {
    padding-block: var(--bd-section-padding-desktop);
  }
}

/* Wide — 1200px */
@media screen and (min-width: 1200px) {
  .bd-[naam] { ... }
}

/* [BD feat] BD-Naam layout */
```

BEM naamgeving:
```css
.bd-hero { }              /* block */
.bd-hero__title { }       /* element */
.bd-hero__title--sale { } /* modifier */
```

Nooit architectuur-klassen nesten:
```css
/* ❌ Fout */
.bd-hero__title .bd-h1 { margin: 0; }

/* ✅ Correct */
.bd-hero__title { margin: 0; }
```

---

## JS Patroon — altijd IIFE

**Nooit** een `<script>` block in het Liquid bestand. Altijd een extern bestand.

```javascript
// [BD feat] Sectienaam interactie
(function() {
  'use strict';

  // Guard: alleen uitvoeren als element bestaat
  const section = document.querySelector('.bd-[naam]');
  if (!section) return;

  // Cacheer DOM referenties
  const trigger = section.querySelector('[data-bd-trigger]');
  const target  = section.querySelector('[data-bd-target]');

  if (!trigger || !target) return;

  // Events
  trigger.addEventListener('click', function(e) {
    e.preventDefault();
    // logica
  });

  // Theme editor support
  document.addEventListener('shopify:section:load', function(event) {
    if (!event.target.querySelector('.bd-[naam]')) return;
    // herinitialiseer indien nodig
  });

})();
// [BD feat] Sectienaam interactie
```

Laden in Liquid (onderaan sectie, voor `{% schema %}`):
```liquid
<script src="{{ 'bd-[naam].js' | asset_url }}" defer="defer"></script>
```

---

## Metafields — BD Naamgeving & Implementatie

**Namespace altijd: `bd`**
**Naamgeving: `[BD] Functie Sectienaam` → key: `functie_sectienaam`**

```liquid
{%- comment -%} Altijd met blank check {%- endcomment -%}
{%- assign subtitle = product.metafields.bd.subtitle_featured_product.value -%}
{%- unless subtitle == blank -%}
  <p class="bd-featured-product__subtitle">{{ subtitle | escape }}</p>
{%- endunless -%}
```

Afbeelding metafield:
```liquid
{%- assign media = product.metafields.bd.secondary_image_pdp.value -%}
{%- if media != blank -%}
  {{- media | image_url: width: 1200 | image_tag:
      loading: 'lazy',
      width: media.width,
      height: media.height,
      alt: media.alt | escape
  -}}
{%- endif -%}
```

Metaobject lijst:
```liquid
{%- assign entries = product.metafields.bd.testimonials_pdp.value -%}
{%- if entries != blank -%}
  {%- for entry in entries -%}
    <p>{{ entry.fields.bd_quote.value | escape }}</p>
  {%- endfor -%}
{%- endif -%}
```

---

## Afbeeldingen — Correct Patroon

```liquid
{%- comment -%} LCP (above fold): eager + high priority {%- endcomment -%}
{{- image | image_url: width: 1500 | image_tag:
    loading: 'eager',
    fetchpriority: 'high',
    widths: '375, 750, 990, 1200, 1500',
    sizes: '(min-width: 990px) 50vw, 100vw',
    width: image.width,
    height: image.height,
    alt: image.alt | escape,
    class: 'bd-hero__image'
-}}

{%- comment -%} Alle andere afbeeldingen: lazy {%- endcomment -%}
{{- image | image_url: width: 1200 | image_tag:
    loading: 'lazy',
    widths: '375, 750, 990, 1200',
    sizes: '(min-width: 990px) 33vw, (min-width: 750px) 50vw, 100vw',
    width: image.width,
    height: image.height,
    alt: image.alt | escape,
    class: 'bd-card__image'
-}}

{%- comment -%} Placeholder als geen afbeelding {%- endcomment -%}
{%- if image != blank -%}
  {{- image | image_url: width: 1200 | image_tag: ... -}}
{%- else -%}
  {{ 'product-1' | placeholder_svg_tag: 'bd-card__image bd-card__image--placeholder' }}
{%- endif -%}
```

CSS voor afbeeldingscontainers (houdt verhoudingen bij elk formaat):
```css
.bd-card__image-wrapper {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3 / 4; /* of 1/1, 16/9, etc. */
}
.bd-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* cover voor decoratief, contain voor producten */
  display: block;
}
```

---

## PDP — Product Detail Page

### Structuur
1. Product hero (afbeeldingen + variant/prijs/ATC)
2. Productbeschrijving / tabs
3. Metafield secties (ingrediënten, gebruik, specs)
4. Gerelateerde producten

### Kritische punten
- `product.selected_or_first_available_variant` voor correcte variantselectie
- Prijs altijd via `selected_or_first_available_variant.price | money`
- Add-to-cart form met verplichte structuur:

```liquid
{%- form 'product', product, id: 'product-form-{{ section.id }}', novalidate: 'novalidate' -%}
  <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
  <button type="submit" name="add" class="bd-button bd-button--primary">
    {{ 'products.product.add_to_cart' | t }}
  </button>
{%- endform -%}
```

### Sale prijs patroon
```liquid
{%- assign variant = product.selected_or_first_available_variant -%}
{%- if variant.compare_at_price > variant.price -%}
  <s class="bd-price__compare">{{ variant.compare_at_price | money }}</s>
{%- endif -%}
<span class="bd-price__current">{{ variant.price | money }}</span>
```

---

## Collection Page

```liquid
{% paginate collection.products by 24 %}
  {%- if collection.products.size == 0 -%}
    <p>{{ 'collections.general.no_matches' | t }}</p>
  {%- else -%}
    {%- for product in collection.products -%}
      {%- render 'bd-product-card', product: product -%}
    {%- endfor -%}
  {%- endif -%}
  {{ paginate | default_pagination }}
{% endpaginate %}
```

---

## Cart Drawer

- Gebruik `sections/cart-drawer.liquid` (Dawn's bestaande sectie)
- Cart item images: altijd `object-fit: contain`
- Items container: geen vaste hoogte — scrollbaar
- Checkout bar: altijd sticky onderaan

```css
/* [BD feat] Cart drawer layout */
.bd-cart-drawer__items {
  flex: 1;
  overflow-y: auto; /* scroll, geen fixed height */
}
.bd-cart-drawer__footer {
  position: sticky;
  bottom: 0;
  background: rgb(var(--color-base-background-1));
}
.bd-cart-drawer__item-image {
  object-fit: contain; /* altijd contain voor cart items */
}
/* [BD feat] Cart drawer layout */
```

---

## Homepage Secties

Hero patroon met mobile image:
```liquid
{%- assign hero_image = section.settings.mobile_image -%}
{%- if hero_image == blank -%}
  {%- assign hero_image = section.settings.image -%}
{%- endif -%}
```

---

## Header

- Gedeeld door alle pagina's — test op elke paginatype
- Sticky header: zorg dat tekst altijd leesbaar is, ook op hero-secties
- Z-index problemen voorkomen: header krijgt expliciete z-index
- Controleer of de header er anders uitziet op bepaalde pagina's (bijv. transparant op hero)
