# YearCompass Digital Webapp Specification

## Overview

A digital, browser-based version of the YearCompass booklet (yearcompass.com) that allows users to complete yearly reflection and planning exercises with:
- Persistent progress saved in localStorage
- Multi-year data storage and retrieval
- Markdown-compatible text fields
- Optional PDF export of completed entries

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Navigation model | Guided but flexible | Suggested order with ability to skip/jump; gentle nudges keep users on track while respecting autonomy |
| First-time experience | Brief intro + preparation ritual | Mix of quick explanation and grounding exercises to set the reflective mood |
| Year transitions | User-initiated with nudges | Manual "Start New Year" button; app suggests after Jan 1 but doesn't force |
| Triplet input UI | 3 separate text inputs | Cleaner structure, easier to track completion, better mobile UX than free-form |
| Markdown rendering | Use marked.js | Well-tested library (~40KB), full markdown support, not worth building custom |
| Section completion | Any text entered | Simple heuristic; section counts as started/complete if any field has content |
| Partial printing | Allowed | Users can print at any point, incomplete sections included as-is |
| Secret wish | No special treatment | Just another text field; users can self-censor if they want |
| Visual design | Warm/cozy journal style | Soft colors, friendly feel, encourages reflection rather than clinical task completion |
| Life areas | Fixed list of 12 | Use standard YearCompass categories; keeps things simple for v1 |
| Data export | PDF only for v1 | JSON export/import deferred to post-v1 issues |

## Interview Insights

- **UX flow is the biggest uncertainty** - navigation through 20+ sections needs careful design to not feel overwhelming
- **The spec is exploratory** - open to direction changes, not locked in
- **Preparation ritual matters** - the original booklet recommends 4+ hours and breathing exercises; digital version should honor this contemplative aspect
- **Data portability is important** but can be deferred - users want JSON backup/import but it's not blocking v1

## Core Features

### 1. Complete YearCompass Content

All questions and exercises from the official YearCompass booklet, organized into two main parts:

#### Part 1: The Past Year (Closing)

**Section 1.1: Calendar Review**
- Prompt: "Go through last year's calendar week by week. Write down important events, gatherings, and significant moments."
- Large text area for free-form entry (markdown supported)

**Section 1.2: This Year In Review**
Six completion prompts (each gets its own text area):
1. "The wisest decision I made..."
2. "The biggest lesson I learned..."
3. "The biggest risk I took..."
4. "The biggest surprise of the year..."
5. "The most important thing I did for others..."
6. "The biggest thing I completed..."

**Section 1.3: Highlights**
- "Describe your greatest, most memorable, and joyful moments from last year"
- "How did you feel? Who was there? What were you doing?"

**Section 1.4: Accomplishments & Challenges**
- "List your three greatest accomplishments" (3 separate inputs)
- "List your three biggest challenges" (3 separate inputs)

**Section 1.5: Forgiveness**
- "Is there anything that happened during the past year that still needs to be forgiven? Deeds or words that made you feel bad? Who do you need to forgive, or ask forgiveness from?"

**Section 1.6: Letting Go**
- "What are you ready to let go of from the past year?"

**Section 1.7: Life Areas Assessment**
Rate and reflect on these 12 fixed areas (1-10 slider + notes textarea each):
1. Personal growth / Self-care
2. Career / Studies
3. Friends / Community
4. Family
5. Romantic relationship
6. Fun / Recreation
7. Physical health / Fitness
8. Mental health / Spirituality
9. Finances
10. Home / Living environment
11. Creative expression
12. Other (custom label allowed)

**Section 1.8: Summary**
- "Choose three words to define your past year" (3 separate inputs)
- "If a book or movie was made about your past year, what title would you give it?"
- "Write a farewell letter to the past year"

#### Part 2: The Year Ahead (Planning)

**Section 2.1: Dare to Dream**
- "What does the year ahead look like? Why will it be great?"
- "What would happen in an ideal world? Write, draw, let go of expectations and dare to dream."
- Large text area for expansive thinking

**Section 2.2: Magical Triplets**
12 sets of 3 items each. **Each item gets its own text input** (36 total inputs organized in 12 groups):

1. "Three things I will love about myself"
2. "Three things I'm ready to let go of"
3. "Three things I want to achieve the most"
4. "Three people who will be my pillars during rough times"
5. "Three things I will dare to discover"
6. "Three things I will have the power to say no to"
7. "Three things I will make my surroundings cozy with"
8. "Three places I will visit"
9. "Three things I will pamper myself with regularly"
10. "Three things I will do every morning"
11. "Three presents I will reward my successes with"
12. "Three ways I will connect with my loved ones"

**Section 2.3: Affirmations**
Completion prompts (each its own text area):
1. "This year will be special for me because..."
2. "This year I advise myself to..."
3. "This year I will say yes when..."
4. "This year I will be the bravest when..."
5. "This year I will draw the most energy from..."
6. "This year I will not procrastinate any more on..."

**Section 2.4: Word of the Year**
- "Pick a word to symbolize and define the year ahead"
- Single text input, prominently styled
- "You can look at this word when you need extra energy"

**Section 2.5: Secret Wish**
- "Unleash your mind. What is your secret wish for the next year?"
- Regular text area, no special privacy treatment

**Section 2.6: Life Areas Goals**
For each of the 12 life areas from Part 1, set intentions:
- "What do you want to achieve in [area]?"
- "What actions will you take?"
- Two text areas per life area

**Section 2.7: Commitment**
- Text input for name/signature
- Auto-filled date
- Optional: "Share this commitment with someone you trust" (copy link functionality deferred)

### 2. First-Time User Experience

**Intro Screen** (shown once on first visit):
- Brief explanation of what YearCompass is
- "This is a digital version of the free YearCompass booklet"
- Estimated time: "Plan for 3-4 hours, or complete over multiple sessions"
- "Your progress saves automatically"
- Button: "Begin Your Journey"

**Preparation Ritual** (Section 0):
- Breathing exercise prompt: "Take three deep breaths. Settle into your space."
- Space preparation: "Find a quiet place. Make yourself comfortable."
- Mindset prompt: "Set aside judgment. Be honest with yourself."
- Optional skip button for returning users

### 3. Navigation & Progress

**Guided but Flexible Model:**
- Sidebar shows all sections with completion indicators
- Current section highlighted
- Can click any section to jump
- "Previous" / "Next" buttons encourage linear flow
- Gentle nudge if skipping incomplete sections: "You can come back to this anytime"

**Progress Tracking:**
- Overall progress bar in header (% of fields with content)
- Section-level completion: checkmark if any field in section has content
- "Last saved: [timestamp]" in footer

### 4. Multi-Year Storage

- Year selector dropdown in header
- Format: "2024 → 2025" (using arrow, not hyphen, for clarity)
- "Start New Year" button creates fresh entry
- After January 1, prompt: "Ready to start your 2025 → 2026 compass?"
- Past years are viewable but read-only (with "Edit" unlock option)
- No automatic year creation; always user-initiated

### 5. Markdown Support

**Using marked.js library** for rendering.

- All text areas accept markdown
- Toggle button per field: "Edit" (raw) / "Preview" (rendered)
- Default to Edit mode while typing, Preview on blur
- Supported syntax rendered nicely: **bold**, *italic*, - lists, > quotes, `code`, [links]
- XSS sanitization via DOMPurify or marked's sanitize option

### 6. PDF Export

- "Export to PDF" button in footer
- Uses browser's native print dialog (Ctrl/Cmd+P)
- Clean print stylesheet:
  - Hide navigation, buttons, UI chrome
  - Show all content in reading order
  - Include year and export date in header/footer
  - Render markdown as formatted text
- Works with incomplete entries (prints what's filled)
- Section headers included for structure

### 7. Visual Design

**Warm/Cozy Journal Style:**
- Soft, muted color palette (warm neutrals, gentle accent colors)
- Serif or friendly sans-serif fonts for readability
- Generous whitespace and padding
- Subtle textures or paper-like backgrounds (optional)
- Rounded corners on cards and inputs
- Focus on readability and calm, contemplative feel

**Color Palette (suggested):**
- Background: Warm off-white (#FAF8F5)
- Text: Soft charcoal (#3D3D3D)
- Accent: Muted teal or warm coral
- Success: Gentle green for completion indicators
- Borders: Very light warm gray

## Technical Architecture

### File Structure
```
yearcompass/
├── index.html           # Main SPA shell
├── css/
│   ├── styles.css       # Main styles
│   ├── print.css        # Print-specific styles
│   └── variables.css    # CSS custom properties for theming
├── js/
│   ├── app.js           # Main app initialization
│   ├── storage.js       # localStorage wrapper
│   ├── navigation.js    # Section navigation logic
│   ├── render.js        # Section rendering
│   ├── markdown.js      # Marked.js wrapper + sanitization
│   └── pdf.js           # Print preparation
├── data/
│   └── questions.js     # All YearCompass content as JS module
├── lib/
│   └── marked.min.js    # Markdown library (vendored)
├── CLAUDE.md
├── SPEC.md
└── README.md
```

### Data Model

```javascript
// localStorage key: "yearcompass_data"
{
  version: 1,
  currentYear: "2024-2025",
  settings: {
    theme: "light",
    fontSize: "medium",
    markdownPreview: "onBlur" // "always" | "onBlur" | "manual"
  },
  years: {
    "2024-2025": {
      id: "2024-2025",
      displayName: "2024 → 2025",
      createdAt: "2024-12-01T00:00:00Z",
      lastModified: "2024-12-15T14:30:00Z",
      currentSection: "calendar-review",
      sections: {
        "intro": { completed: true, skipped: false },
        "preparation": { completed: true, skipped: false },
        "calendar-review": {
          completed: false,
          answers: {
            "calendar-notes": "January: Started new job..."
          }
        },
        "year-in-review": {
          completed: false,
          answers: {
            "wisest-decision": "Leaving my old job...",
            "biggest-lesson": "",
            "biggest-risk": "",
            "biggest-surprise": "",
            "for-others": "",
            "biggest-completed": ""
          }
        },
        "magical-triplets": {
          completed: false,
          answers: {
            "love-about-self-1": "",
            "love-about-self-2": "",
            "love-about-self-3": "",
            // ... 33 more fields
          }
        }
        // ... all sections
      }
    }
  }
}
```

### Section Structure Definition

```javascript
// data/questions.js
export const sections = [
  {
    id: "intro",
    part: 0,
    title: "Welcome to YearCompass",
    type: "info", // no inputs, just content
    content: "..."
  },
  {
    id: "preparation",
    part: 0,
    title: "Preparation",
    type: "info",
    skippable: true,
    content: "..."
  },
  {
    id: "calendar-review",
    part: 1,
    title: "Calendar Review",
    description: "Go through last year's calendar...",
    fields: [
      { id: "calendar-notes", type: "textarea", rows: 10, markdown: true }
    ]
  },
  {
    id: "year-in-review",
    part: 1,
    title: "This Year In Review",
    fields: [
      { id: "wisest-decision", type: "textarea", prompt: "The wisest decision I made...", rows: 3 },
      { id: "biggest-lesson", type: "textarea", prompt: "The biggest lesson I learned...", rows: 3 },
      // ...
    ]
  },
  {
    id: "life-areas-past",
    part: 1,
    title: "Life Areas Assessment",
    type: "life-areas",
    fields: [
      { id: "personal-growth", label: "Personal growth / Self-care", type: "rating-with-notes" },
      // ...12 total
    ]
  },
  {
    id: "magical-triplets",
    part: 2,
    title: "Magical Triplets",
    type: "triplets",
    triplets: [
      { id: "love-about-self", prompt: "Three things I will love about myself" },
      { id: "let-go", prompt: "Three things I'm ready to let go of" },
      // ...12 total
    ]
  }
  // ... etc
];
```

## UI States

### Loading State
- Brief spinner/skeleton on initial load
- Should be <500ms for localStorage reads

### Empty State (First Visit)
- Show intro screen
- No year data exists yet
- Guide user to create first year entry

### In-Progress State
- Section content displayed
- Auto-save indicator ("Saving..." → "Saved")
- Navigation enabled
- Progress visible

### Viewing Past Year (Read-Only)
- All fields disabled/non-editable
- "This is from a past year" banner
- "Edit This Year" button to unlock

### Print Preview
- Clean layout, no UI chrome
- All sections in order
- Markdown rendered as formatted text

## Edge Cases & Error Handling

| Scenario | Behavior | Rationale |
|----------|----------|-----------|
| localStorage full (~5MB) | Show warning, suggest exporting data | Unlikely but handle gracefully |
| localStorage disabled | Show error explaining requirement | App cannot function without storage |
| Corrupt data on load | Attempt recovery, offer reset option | Don't lose user data silently |
| User clears browser data | Data is gone; this is expected | No cloud backup in v1, users should export |
| Very long text entry | Allow it; no hard limits | Users should write freely |
| Browser doesn't support print | PDF button still opens print dialog | Let browser handle compatibility |
| User navigates away mid-type | Data already auto-saved | Debounced save on every keystroke |
| Year naming collision | Prevent duplicate year IDs | Use year range as unique key |

## Testing Strategy

### Manual Testing Checklist
- [ ] First-time user flow (intro → prep → first section)
- [ ] Navigation between all sections
- [ ] Progress tracking accuracy
- [ ] Auto-save functionality (edit, refresh, verify data persists)
- [ ] Create new year
- [ ] Switch between years
- [ ] View past year (read-only)
- [ ] Markdown preview toggle
- [ ] PDF export (check print preview)
- [ ] Mobile responsive layout
- [ ] Keyboard navigation

### Browser Testing
- Chrome (primary)
- Firefox
- Safari
- Edge
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Implementation Notes

1. **Start with structure** - Get all sections rendering with correct fields before styling
2. **Storage early** - Implement save/load before adding features
3. **Mobile-first CSS** - Build responsive from the start
4. **Vendor marked.js** - Include in lib/ folder, don't use CDN (works offline)
5. **Print stylesheet separate** - Easier to maintain and debug

## Out of Scope (v1)

| Feature | Why Deferred |
|---------|--------------|
| JSON export/import | Important but not blocking; add post-launch |
| Cloud sync | Requires backend; localStorage sufficient for v1 |
| Multiple languages | Content translation is significant work |
| User accounts | Unnecessary complexity for local-first app |
| Collaborative features | Out of scope entirely |
| Mobile app | Web works on mobile; native app not needed |
| Year-over-year analytics | Nice-to-have; focus on core experience first |
| Reminders/notifications | Would need PWA; defer to later |
| Dark mode | Start with warm light theme; add dark later |
| Customizable life areas | Keep fixed for simplicity; maybe v2 |

## Open Questions (Resolved)

1. ~~Should there be a "getting started" intro screen?~~ **Yes, brief intro + preparation ritual**
2. ~~How to handle year transitions?~~ **User-initiated with gentle nudge after Jan 1**
3. ~~Include preparation/grounding exercises?~~ **Yes, as skippable Section 0**
4. ~~Export format options beyond PDF?~~ **Deferred: JSON export/import as post-v1 issues**
5. ~~Secret wish privacy?~~ **No special treatment**
6. ~~Include timer/pomodoro?~~ **No, keep it simple**

## Remaining Open Questions

1. Exact color palette values for warm/cozy theme
2. Font choices (serif vs sans-serif, specific families)
3. Whether to add subtle animations/transitions
4. Exact wording for nudge messages ("You skipped X...")

---
*Authoritative spec developed using `/enrich-plan`. Future implementers should treat this document as the source of truth.*
