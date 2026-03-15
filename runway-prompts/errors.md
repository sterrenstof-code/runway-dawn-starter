# Runway — Gekende Fouten & Oplossingen

_Versie: 1.0 | Laatste update: maart 2026_
_Dit bestand wordt automatisch aangevuld door de Runway Prompt Engine op basis van CP3/CP4 rapporten._

---

## Hoe dit bestand werkt

Elke fout volgt dit formaat:

```
### [FOUT-ID] Korte beschrijving
- Component: PDP / Collection / Cart / Homepage / Content / Drawer / Algemeen
- Ontdekt in: Project naam of "meerdere projecten"
- Symptoom: wat de developer/QA ziet
- Oorzaak: waarom het fout gaat
- Oplossing: exacte fix
- Patroon om te vermijden
```

---

## Algemeen

### [ERR-001] Schema ontbreekt of is incompleet
- **Component:** Algemeen
- **Symptoom:** Sectie niet aanpasbaar in Theme Editor, velden ontbreken
- **Oorzaak:** `{% schema %}` block vergeten of `presets` array ontbreekt
- **Oplossing:** Elk Liquid bestand heeft verplicht een volledig schema block. Zonder `presets` is de sectie niet via "Add section" toe te voegen.
- **Vermijd:** Schema na de `{% endschema %}` tag plaatsen of schema splitsen over meerdere bestanden

### [ERR-002] Hardcoded tekst in Liquid
- **Component:** Algemeen
- **Symptoom:** Tekst niet aanpasbaar in Theme Editor, vertalingen werken niet
- **Oorzaak:** Tekst direct in Liquid geschreven zonder schema setting
- **Oplossing:** Altijd via `{{ section.settings.heading }}` of `{{ 'key' | t }}`
- **Vermijd:** `<h2>Onze producten</h2>` — gebruik `<h2>{{ section.settings.heading }}</h2>`

### [ERR-003] Afbeelding zonder widths parameter
- **Component:** Algemeen
- **Symptoom:** Trage laadtijd, grote afbeeldingen op mobiel
- **Oorzaak:** `image_tag` zonder `widths` parameter
- **Oplossing:** Altijd `widths: '375, 550, 750, 1100, 1500'` meegeven
- **Vermijd:** `{{ image | image_url: width: 2000 | image_tag }}`

### [ERR-004] CSS variabelen niet gebruikt
- **Component:** Algemeen
- **Symptoom:** Kleuren en fonts wijken af van Theme Editor instellingen
- **Oorzaak:** Hardcoded hex-waarden of font-families in CSS
- **Oplossing:** Gebruik altijd `var(--color-base-text)` etc. (zie patterns.md)
- **Vermijd:** `color: #1a1a1a;` — gebruik `color: var(--color-base-text);`

---

## PDP — Product Detail Page

### [ERR-010] Variant selector werkt niet na page load
- **Component:** PDP
- **Symptoom:** Prijs en afbeelding updaten niet bij variant wissel
- **Oorzaak:** Variant change event niet correct geïmplementeerd
- **Oplossing:** Gebruik Dawn's ingebouwde `variant:change` custom event
```javascript
document.addEventListener('variant:change', (event) => {
  const variant = event.detail.variant;
  // update prijs, afbeelding, etc.
});
```

### [ERR-011] Add-to-cart werkt niet
- **Component:** PDP
- **Symptoom:** Klikken op knop doet niets of geeft 422 error
- **Oorzaak:** Form mist `id` attribuut of `name="id"` input
- **Oplossing:** Verplichte form structuur altijd gebruiken (zie patterns.md PDP sectie)

### [ERR-012] Metafield toont lege string ipv niet renderen
- **Component:** PDP
- **Symptoom:** Lege div zichtbaar in layout, witruimte onverwacht
- **Oorzaak:** Metafield gerenderd zonder `{% if ... != blank %}` check
- **Oplossing:** Altijd conditie wrappen rondom metafield output
```liquid
{% if product.metafields.custom.field != blank %}
  <div>{{ product.metafields.custom.field }}</div>
{% endif %}
```

### [ERR-013] Prijs toont niet correct bij sale
- **Component:** PDP
- **Symptoom:** Geen doorgestreepte originele prijs bij korting
- **Oorzaak:** Alleen `price` getoond, `compare_at_price` vergeten
- **Oplossing:**
```liquid
{% if variant.compare_at_price > variant.price %}
  <s>{{ variant.compare_at_price | money }}</s>
{% endif %}
<span>{{ variant.price | money }}</span>
```

---

## Collection Page

### [ERR-020] Paginate block niet gesloten
- **Component:** Collection
- **Symptoom:** Liquid render error, pagina toont niet
- **Oorzaak:** `{% paginate %}` zonder `{% endpaginate %}`
- **Oplossing:** Altijd `{% endpaginate %}` na de product loop

### [ERR-021] Lege collectie toont geen bericht
- **Component:** Collection
- **Symptoom:** Lege pagina bij collectie zonder producten
- **Oorzaak:** Geen `{% if collection.products.size == 0 %}` check
- **Oplossing:**
```liquid
{% if collection.products.size == 0 %}
  <p>{{ 'collections.general.no_matches' | t }}</p>
{% endif %}
```

---

## Cart / Cart Drawer

### [ERR-030] Cart count badge update niet realtime
- **Component:** Cart
- **Symptoom:** Badge toont oud aantal na add-to-cart
- **Oorzaak:** Badge niet gelinkt aan Dawn's cart update event
- **Oplossing:** Luister naar `cart:updated` event van Dawn
```javascript
document.addEventListener('cart:updated', (event) => {
  document.querySelector('.cart-count').textContent = event.detail.cart.item_count;
});
```

### [ERR-031] Hardcoded /cart URL
- **Component:** Cart
- **Symptoom:** Verkeerde redirect in andere taalversies of markets
- **Oorzaak:** `/cart` hardcoded in href of action
- **Oplossing:** Altijd `{{ routes.cart_url }}` gebruiken

---

## Homepage

### [ERR-040] Hero afbeelding te groot op mobiel
- **Component:** Homepage
- **Symptoom:** Trage laadtijd op mobiel, CLS (layout shift)
- **Oorzaak:** Geen aparte mobile image of verkeerde `sizes` parameter
- **Oplossing:** Altijd een `mobile_image` schema setting toevoegen
```liquid
{% assign hero_image = section.settings.mobile_image %}
{% if hero_image == blank %}
  {% assign hero_image = section.settings.image %}
{% endif %}
```

---

## JavaScript

### [ERR-050] jQuery gebruikt
- **Component:** Algemeen
- **Symptoom:** JS werkt niet, console error "$ is not defined"
- **Oorzaak:** jQuery beschikbaar op sommige themes maar niet standaard in Dawn
- **Oplossing:** Altijd vanilla JS. `document.querySelector` ipv `$(...)`

### [ERR-051] console.log in productie
- **Component:** Algemeen
- **Symptoom:** Console vervuild, potentieel sensitive data zichtbaar
- **Oorzaak:** Debug code niet verwijderd
- **Oplossing:** Nooit `console.log` in geleverde code. Gebruik conditionele debug:
```javascript
const DEBUG = false;
if (DEBUG) console.log('...');
```

---

_Nieuwe fouten worden toegevoegd door de Runway Prompt Engine na elke CP3/CP4 rapportagecyclus._
