# YearCompass

Digital webapp version of YearCompass - the free booklet that helps close your year and plan the next one.

## Quick Reference

| Task | Command |
|------|---------|
| Run | `open index.html` or use local server |
| Serve | `python -m http.server 8000` |
| Test | Open in browser, test manually |

## Architecture

Pure HTML/JS/CSS webapp with zero build step. All data persists in localStorage.

### Key Files
- `index.html` - Main entry point, single-page app shell
- `css/styles.css` - All styling including print styles for PDF
- `js/app.js` - Main application logic, navigation, state management
- `js/storage.js` - localStorage wrapper for multi-year data persistence
- `js/markdown.js` - Markdown to HTML rendering for text fields
- `js/pdf.js` - PDF generation from filled content
- `data/questions.json` - Complete YearCompass question structure

### Data Model
```
localStorage["yearcompass"] = {
  years: {
    "2024-2025": {
      startedAt: timestamp,
      lastModified: timestamp,
      sections: {
        "past-year": { ... },
        "year-ahead": { ... }
      }
    }
  },
  currentYear: "2024-2025",
  settings: { ... }
}
```

### YearCompass Structure
Two main parts:
1. **Past Year (Closing)**: Calendar review, accomplishments, challenges, lessons, forgiveness, life areas assessment
2. **Year Ahead (Planning)**: Dreams/visualization, "magical triplets" (sets of 3 things), affirmations, word of the year, secret wish

### Key Patterns
- **Single Page App**: All navigation via JS, no page reloads
- **Progressive Save**: Auto-save on every field change to localStorage
- **Multi-year Support**: Year selector to switch between different year entries
- **Markdown Fields**: Text inputs support markdown, rendered for display
- **Print-First PDF**: Use CSS print styles + window.print() for PDF generation

## Conventions

- No frameworks - vanilla HTML/JS/CSS only
- ES6+ modules with `<script type="module">`
- CSS custom properties for theming
- Semantic HTML for accessibility
- Mobile-first responsive design
- All text content in English (future: i18n via JSON)

## Gotchas

- localStorage has ~5MB limit per origin - should be plenty but monitor large entries
- Print to PDF quality varies by browser - Chrome recommended
- Markdown rendering must handle XSS (sanitize HTML output)
- Year transitions happen at arbitrary times - don't assume calendar year boundaries

## Dependencies

None (pure HTML/JS/CSS). Optional considerations:
- Marked.js or similar for markdown (or implement minimal subset)
- Could add service worker for offline support later
