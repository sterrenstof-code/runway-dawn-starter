# Runway — Metafields & Metaobjects
## BD Naming Convention & Aanmaak Workflow

---

## Wanneer metafields aanmaken?

**Altijd vóór de eerste regel code.** Metafields worden aangemaakt in Fase 1, direct na de Figma review. De klant heeft ze zo snel mogelijk nodig.

---

## BD Naamgeving

```
[BD] [Functie] [Sectienaam]
```

Regels:
1. Altijd beginnen met `[BD]`
2. Alleen Engels
3. Geen nummers — gebruik beschrijvende woorden
4. Betekenisvol: `subtitle`, `usp`, `badge`, `subheading`, `featured media`, `icon`, `benefits`
5. Sectienaam = de Liquid bestandsnaam (zonder `bd-` en `.liquid`)

**Goede voorbeelden:**
```
[BD] Subtitle Featured-Product     → namespace: bd, key: subtitle_featured_product
[BD] USP Icon Hero                 → namespace: bd, key: usp_icon_hero
[BD] Badge Label Product-Card      → namespace: bd, key: badge_label_product_card
[BD] Benefits List PDP             → namespace: bd, key: benefits_list_pdp
[BD] Secondary Image Gallery       → namespace: bd, key: secondary_image_gallery
```

**Slechte voorbeelden:**
```
Image 2               ❌  (nummer, geen [BD])
bd subtitle           ❌  (verkeerd formaat)
[BD] text             ❌  (niet betekenisvol)
```

---

## Namespace & Key

- **Namespace:** altijd `bd`
- **Key:** snake_case versie van de naam na `[BD]`
  - `[BD] Subtitle Featured-Product` → `subtitle_featured_product`
  - `[BD] USP Icon Hero` → `usp_icon_hero`

---

## Metafield Types — Keuzetabel

| Content | Shopify Type |
|---|---|
| Korte tekst (badge, label, subtitle) | `single_line_text_field` |
| Lange tekst / HTML | `multi_line_text_field` of `rich_text_field` |
| Nummer | `number_integer` of `number_decimal` |
| Aan/Uit toggle | `boolean` |
| URL | `url` |
| Afbeelding | `file_reference` |
| Meerdere afbeeldingen | `list.file_reference` |
| Kleur | `color` |
| Datum | `date` |
| Structureel JSON | `json` |
| Link naar product | `product_reference` |
| Link naar collectie | `collection_reference` |
| Link naar metaobject | `metaobject_reference` |
| Lijst van metaobjects | `list.metaobject_reference` |

---

## Metafield Owner Types

| Metafield op... | ownerType |
|---|---|
| Producten | `PRODUCT` |
| Varianten | `PRODUCTVARIANT` |
| Collecties | `COLLECTION` |
| Klanten | `CUSTOMER` |
| Bestellingen | `ORDER` |
| Store (globaal) | `SHOP` |
| Pagina's | `PAGE` |
| Blogs/Artikelen | `ARTICLE` |

---

## Aanmaken via shopify-mcp

GraphQL mutatie (via shopify-mcp):

```graphql
mutation {
  metafieldDefinitionCreate(definition: {
    name: "[BD] Subtitle Featured-Product",
    namespace: "bd",
    key: "subtitle_featured_product",
    type: "single_line_text_field",
    ownerType: PRODUCT,
    description: "Korte ondertitel onder producttitel in de Featured Product sectie (bd-featured-product.liquid)."
  }) {
    createdDefinition { id name namespace key }
    userErrors { field message }
  }
}
```

---

## Metaobjects

Voor herhalende gestructureerde content (testimonials, FAQ, USP-kaarten):

**Definitienaam:** `[BD] [ContentType]`
- `[BD] Testimonial`
- `[BD] FAQ Item`
- `[BD] USP Card`
- `[BD] Team Member`

**Verplicht eerste veld:** altijd een `title` veld zodat de klant entries kan onderscheiden.

---

## Beschrijvingen toevoegen

Elke metafield krijgt een korte beschrijving:
- Wat doet het?
- Waar staat het in de theme?

Voorbeeld:
> "Korte subtitel onder de producttitel in de Featured Product sectie. Helpt context toevoegen zonder de hoofdtitel te wijzigen."

---

## Lezen in Liquid

```liquid
{# Tekst #}
{%- assign subtitle = product.metafields.bd.subtitle_featured_product.value -%}
{%- unless subtitle == blank -%}
  <p class="bd-featured-product__subtitle">{{ subtitle | escape }}</p>
{%- endunless -%}

{# Afbeelding #}
{%- assign img = product.metafields.bd.secondary_image_gallery.value -%}
{%- if img != blank -%}
  {{- img | image_url: width: 1200 | image_tag: loading: 'lazy', alt: img.alt | escape -}}
{%- endif -%}

{# Boolean #}
{%- if product.metafields.bd.show_size_guide_pdp.value == true -%}
  {%- render 'bd-size-guide' -%}
{%- endif -%}

{# Metaobject lijst #}
{%- assign entries = product.metafields.bd.testimonials_pdp.value -%}
{%- if entries != blank -%}
  {%- for entry in entries -%}
    <blockquote>{{ entry.fields.bd_quote.value | escape }}</blockquote>
  {%- endfor -%}
{%- endif -%}
```
