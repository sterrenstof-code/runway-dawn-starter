// [BD feat] BD-Example interactie
//
// Referentie JS — demonstreert alle BD JS-patronen.
// Kopieer dit bestand als startpunt voor nieuwe secties.
//
// REGELS:
// - Altijd IIFE (nooit globale variabelen)
// - Guard: vroeg returnen als elementen niet bestaan
// - Cacheer DOM referenties bovenaan
// - Theme editor support via shopify:section:load event
// - 'use strict' altijd aan

(function () {
  'use strict';

  // ------------------------------------------------------------------
  // Guard: alleen uitvoeren als de sectie op de pagina staat.
  // Gebruik data-attributen voor JS hooks — nooit CSS-klassen.
  // ------------------------------------------------------------------
  const section = document.querySelector('[data-section-type="bd-example"]');
  if (!section) return;


  // ------------------------------------------------------------------
  // DOM referenties — cacheer alles bovenaan, nooit herhaald querien.
  // ------------------------------------------------------------------
  const items    = section.querySelectorAll('[data-bd-item]');
  const ctaLink  = section.querySelector('[data-bd-cta]');


  // ------------------------------------------------------------------
  // Initialisatie
  // ------------------------------------------------------------------
  function init() {
    if (!items.length) return;

    items.forEach(function (item) {
      item.addEventListener('click', handleItemClick);
    });

    if (ctaLink) {
      ctaLink.addEventListener('click', handleCtaClick);
    }
  }


  // ------------------------------------------------------------------
  // Event handlers
  // ------------------------------------------------------------------
  function handleItemClick(event) {
    // Voorbeeld: toggle actieve staat
    const isActive = this.classList.contains('bd-example__item--active');
    items.forEach(function (el) {
      el.classList.remove('bd-example__item--active');
      el.removeAttribute('aria-selected');
    });

    if (!isActive) {
      this.classList.add('bd-example__item--active');
      this.setAttribute('aria-selected', 'true');
    }
  }

  function handleCtaClick(event) {
    // Voeg hier analytics tracking toe of andere logica
  }


  // ------------------------------------------------------------------
  // Theme editor support
  // Shopify roept dit event af wanneer een sectie opnieuw geladen wordt
  // in de customizer (bijv. na aanpassen van een instelling).
  // ------------------------------------------------------------------
  document.addEventListener('shopify:section:load', function (event) {
    // Controleer of het event voor DEZE sectie is
    const reloadedSection = event.target.querySelector('[data-section-type="bd-example"]');
    if (!reloadedSection) return;

    // Herinitialiseer indien nodig
    init();
  });

  document.addEventListener('shopify:section:unload', function (event) {
    const unloadedSection = event.target.querySelector('[data-section-type="bd-example"]');
    if (!unloadedSection) return;

    // Ruim event listeners op indien nodig (bijv. bij gebruik van global listeners)
  });


  // ------------------------------------------------------------------
  // Start
  // ------------------------------------------------------------------
  init();

})();
// [BD feat] BD-Example interactie
