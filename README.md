# Runway Dawn Starter

Project Runway — AI Dev Starter op basis van Shopify Dawn.
Gebruik dit als startpunt voor elk nieuw Shopify-project binnen het Runway CP3 proces.

---

## Setup (15 minuten)

### 1. Clone de repo
```bash
git clone https://github.com/jouw-org/runway-dawn-starter.git project-naam
cd project-naam
```

### 2. Installeer dependencies
```bash
# Node.js v18+ vereist
npm install -g @anthropic-ai/claude-code
npm install -g @shopify/cli @shopify/theme

# Shopify Liquid Skills (verplicht)
npx skills add benjaminsehl/liquid-skills
```

### 3. Verbind met de Shopify store
Kopieer `.mcp.json.template` naar `.mcp.json` en vul in:
- `JOUW_CLIENT_ID` → Client ID van de Shopify app
- `JOUW_CLIENT_SECRET` → Client Secret
- `jouw-store.myshopify.com` → Store domein

Zie Runway CP2 (Setup) voor de store credentials.

### 4. Vul `runway-ai.json` in
```json
{
  "version": "1.0",
  "project": "Projectnaam",
  "runway_project_id": "proj_xxx",
  "generated_files": []
}
```

### 5. Start Claude Code vanuit deze map
```bash
claude
```

**Belangrijk:** Start Claude altijd vanuit de projectmap. Anders leest het de config niet.

### 6. Test de verbinding
```
List all my products with prices
```

---

## Mapstructuur

```
runway-dawn-starter/
├── .mcp.json.template        ← Kopieer naar .mcp.json en vul in
├── .mcp.json                 ← NOOIT committen (staat in .gitignore)
├── CLAUDE.md                 ← Master Prompt — Claude leest dit automatisch
├── runway-ai.json            ← Manifest van AI-gegenereerde bestanden
├── runway-prompts/
│   ├── patterns.md           ← Bewezen Liquid/JS/CSS patronen
│   ├── errors.md             ← Gekende fouten & oplossingen
│   └── learnings.md          ← Projectleerningen & best practices
├── assets/
├── config/
│   └── settings_data.json    ← Kleurenschema's en fonts
├── layout/
│   └── theme.liquid
├── sections/                 ← Gegenereerde secties komen hier
├── snippets/
└── templates/
```

---

## Werkwijze per pagina (CP3)

Per pagina werk je zo:

1. Open het project in Runway (CP3 tab)
2. Noteer de Figma node URL van de sectie die je gaat bouwen
3. Start Claude: `claude`
4. Geef de context:
   ```
   Ik ga de [PDP hero sectie] bouwen voor [projectnaam].
   Figma node: [URL]
   Metafields: [lijst uit Dev Notes]
   ```
5. Claude leest automatisch CLAUDE.md + alle runway-prompts
6. Bouw sectie per sectie
7. Preview via Shopify CLI: `npx shopify theme dev`
8. QA op 375px, 768px en 1280px
9. PR aanmaken, preview URL + PR URL invullen in Runway

---

## Prompts updaten

De `runway-prompts/` bestanden worden centraal beheerd vanuit Runway.
Sync de laatste versie voor elk nieuw project:

```bash
git pull origin main
```

Of via de VS Code extensie: klik "Sync Runway Prompts".

---

## Bestanden nooit committen

`.gitignore` bevat al:
```
.mcp.json
.env
node_modules/
```

---

## Vragen?

Zie de Prompts pagina in Runway of neem contact op met de HoD.
