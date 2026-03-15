# Runway — Bewezen Patronen per Component

_Versie: 1.0 | Laatste update: maart 2026_
_Dit bestand wordt automatisch geüpdatet door de Runway Prompt Engine op basis van projectdata._

---

## Dawn CSS Variabelen — altijd gebruiken

```css
/* Kleuren */
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

/* Spacing */
var(--page-width)          /* max-width container */
var(--spacing-sections-desktop)
var(--spacing-sections-mobile)
var(--grid-desktop-horizontal-spacing)
var(--grid-mobile-horizontal-spacing)
```

---

## Schema Patroon — Standaard Sectie

```liquid
{% schema %}
{
  "name": "Sectienaam",
  "tag": "section",
  "class": "section",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Titel",
      "default": "Standaard titel"
    },
    {
      "type": "select",
      "id": "color_scheme",
      "options": [
        { "value": "accent-1", "label": "Accent 1" },
        { "value": "accent-2", "label": "Accent 2" },
        { "value": "background-1", "label": "Background 1" },
        { "value": "background-2", "label": "Background 2" },
        { "value": "inverse", "label": "Inverse" }
      ],
      "default": "background-1",
      "label": "Kleurenschema"
    },
    {
      "type": "range",
      "id": "padding_top",
      "min": 0, "max": 100, "step": 4, "unit": "px",
      "label": "Padding boven",
      "default": 36
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "min": 0, "max": 100, "step": 4, "unit": "px",
      "label": "Padding onder",
      "default": 36
    }
  ],
  "blocks": [],
  "presets": [
    {
      "name": "Sectienaam"
    }
  ]
}
{% endschema %}
```

---

## Metafields — Correcte Implementatie

```liquid
{%- comment -%} ALTIJD met default fallback {%- endcomment -%}
{{ product.metafields.custom.field_name | default: '' }}

{%- comment -%} Controleer bestaan voor conditionele rendering {%- endcomment -%}
{% if product.metafields.custom.field_name != blank %}
  <div class="component__meta">
    {{ product.metafields.custom.field_name }}
  </div>
{% endif %}

{%- comment -%} Metafield lijst (json type) {%- endcomment -%}
{% assign meta_list = product.metafields.custom.list_field.value %}
{% if meta_list != blank %}
  {% for item in meta_list %}
    <li>{{ item }}</li>
  {% endfor %}
{% endif %}
```

---

## Afbeeldingen — Correct Patroon

```liquid
{%- comment -%} ALTIJD widths meegeven voor performance {%- endcomment -%}
{{
  image
  | image_url: width: 1500
  | image_tag:
    loading: 'lazy',
    widths: '375, 550, 750, 1100, 1500',
    sizes: '(min-width: 1280px) 700px, (min-width: 768px) 50vw, 100vw',
    class: 'component__image',
    alt: image.alt | escape
}}

{%- comment -%} Placeholder als geen afbeelding {%- endcomment -%}
{% if image != blank %}
  {{ image | image_url: width: 1500 | image_tag: ... }}
{% else %}
  {{ 'product-1' | placeholder_svg_tag: 'component__image component__image--placeholder' }}
{% endif %}
```

---

## PDP — Product Detail Page

### Structuur
1. Product hero (afbeeldingen links, info rechts)
2. Product beschrijving / tabs
3. Metafield secties (ingrediënten, gebruik, specs)
4. Related products

### Kritische punten
- `product.selected_or_first_available_variant` voor correcte variant selectie
- Variant selectors via `product.variants` loop — nooit hardcoded
- Prijs altijd via `product.selected_or_first_available_variant.price | money`
- Quantity selector met min=1, geen negatieve waarden
- Add-to-cart form met `action: routes.cart_add_url`

```liquid
{%- form 'product', product, id: 'product-form', novalidate: 'novalidate' -%}
  <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
  <input type="hidden" name="quantity" value="1">
  <button type="submit" name="add">
    {{ 'products.product.add_to_cart' | t }}
  </button>
{%- endform -%}
```

---

## Collection Page

### Structuur
1. Collection hero / banner
2. Filter & sort bar
3. Product grid
4. Pagination

### Kritische punten
- Gebruik `collection.products` met `paginate`
- Filter via `predictive_search` of native Shopify filters
- Altijd `paginate` block afsluiten

```liquid
{% paginate collection.products by 24 %}
  {% for product in collection.products %}
    ...
  {% endfor %}
  {{ paginate | default_pagination }}
{% endpaginate %}
```

---

## Cart / Cart Drawer

### Kritische punten
- Cart drawer via `sections/cart-drawer.liquid` — niet in template
- `cart.item_count` voor badge
- Altijd `routes.cart_url` gebruiken — nooit hardcoded `/cart`
- Subtotaal: `cart.total_price | money`
- Line items via `cart.items` loop

---

## Homepage Secties

### Patroon voor hero sectie
- Achtergrond via schema `image_picker` of `video_url`
- Overlay opacity als schema `range` setting
- CTA via schema `url` type
- Mobile image apart als optionele schema setting

---

## Content Pages

### Patroon
- Gebruik `page.content` voor WYSIWYG content
- Aanvullende secties via sectie-templates
- Breadcrumb via snippet

---

## Drawers (niet-cart)

### Patroon
- Initieer via `details` / `summary` HTML patroon (native, geen JS nodig)
- Of via custom event: `document.dispatchEvent(new CustomEvent('drawer:open', { detail: { id: 'drawer-id' } }))`
- Dawn heeft ingebouwd `<details>` styling — gebruik dat als basis
