/**
 * YearCompass Questions Data Structure
 * All sections, prompts, and fields for the YearCompass exercise
 *
 * This is a placeholder structure - full content will be added in Issue #3
 */

export const sections = [
  // Part 0: Introduction
  {
    id: 'intro',
    part: 0,
    title: 'Welcome to YearCompass',
    type: 'info',
    skippable: false,
    content: `
      <p>Welcome to YearCompass, your companion for yearly reflection and planning.</p>
      <p>This is a digital version of the free YearCompass booklet.</p>
      <p>Plan for 3-4 hours, or complete over multiple sessions. Your progress saves automatically.</p>
    `
  },
  {
    id: 'preparation',
    part: 0,
    title: 'Preparation',
    type: 'info',
    skippable: true,
    content: `
      <p><strong>Take three deep breaths.</strong> Settle into your space.</p>
      <p>Find a quiet place. Make yourself comfortable.</p>
      <p>Set aside judgment. Be honest with yourself.</p>
    `
  },

  // Part 1: The Past Year - Placeholder sections
  {
    id: 'calendar-review',
    part: 1,
    title: 'Calendar Review',
    description: 'Go through last year\'s calendar week by week. Write down important events, gatherings, and significant moments.',
    fields: [
      { id: 'calendar-notes', type: 'textarea', rows: 10, markdown: true }
    ]
  },
  {
    id: 'year-in-review',
    part: 1,
    title: 'This Year In Review',
    description: 'Complete these sentences to reflect on your past year.',
    fields: [
      { id: 'wisest-decision', type: 'textarea', prompt: 'The wisest decision I made...', rows: 3 },
      { id: 'biggest-lesson', type: 'textarea', prompt: 'The biggest lesson I learned...', rows: 3 },
      { id: 'biggest-risk', type: 'textarea', prompt: 'The biggest risk I took...', rows: 3 },
      { id: 'biggest-surprise', type: 'textarea', prompt: 'The biggest surprise of the year...', rows: 3 },
      { id: 'for-others', type: 'textarea', prompt: 'The most important thing I did for others...', rows: 3 },
      { id: 'biggest-completed', type: 'textarea', prompt: 'The biggest thing I completed...', rows: 3 }
    ]
  },

  // Part 2: The Year Ahead - Placeholder sections
  {
    id: 'dare-to-dream',
    part: 2,
    title: 'Dare to Dream',
    description: 'What does the year ahead look like? Why will it be great? Write, draw, let go of expectations and dare to dream.',
    fields: [
      { id: 'dreams', type: 'textarea', rows: 10, markdown: true }
    ]
  },
  {
    id: 'word-of-year',
    part: 2,
    title: 'Word of the Year',
    description: 'Pick a word to symbolize and define the year ahead. You can look at this word when you need extra energy.',
    fields: [
      { id: 'word', type: 'text', prompt: 'My word for the year:' }
    ]
  }
];

/**
 * Get a section by ID
 * @param {string} id - Section ID
 * @returns {Object|undefined} Section object or undefined
 */
export function getSection(id) {
  return sections.find(s => s.id === id);
}

/**
 * Get all sections for a given part
 * @param {number} part - Part number (0, 1, or 2)
 * @returns {Array} Array of section objects
 */
export function getSectionsByPart(part) {
  return sections.filter(s => s.part === part);
}
