/**
 * YearCompass Questions Data Structure
 * All sections, prompts, and fields for the YearCompass exercise
 *
 * Structure follows SPEC.md with three parts:
 * - Part 0: Introduction
 * - Part 1: The Past Year (Closing)
 * - Part 2: The Year Ahead (Planning)
 */

/**
 * Life areas used for assessment and goal-setting
 */
export const lifeAreas = [
  { id: 'personal-growth', label: 'Personal growth / Self-care' },
  { id: 'career', label: 'Career / Studies' },
  { id: 'friends', label: 'Friends / Community' },
  { id: 'family', label: 'Family' },
  { id: 'romantic', label: 'Romantic relationship' },
  { id: 'fun', label: 'Fun / Recreation' },
  { id: 'physical-health', label: 'Physical health / Fitness' },
  { id: 'mental-health', label: 'Mental health / Spirituality' },
  { id: 'finances', label: 'Finances' },
  { id: 'home', label: 'Home / Living environment' },
  { id: 'creativity', label: 'Creative expression' },
  { id: 'other', label: 'Other' }
];

/**
 * Magical triplets for Part 2
 */
export const magicalTriplets = [
  { id: 'love-about-self', prompt: 'Three things I will love about myself' },
  { id: 'let-go', prompt: 'Three things I\'m ready to let go of' },
  { id: 'achieve', prompt: 'Three things I want to achieve the most' },
  { id: 'pillars', prompt: 'Three people who will be my pillars during rough times' },
  { id: 'discover', prompt: 'Three things I will dare to discover' },
  { id: 'say-no', prompt: 'Three things I will have the power to say no to' },
  { id: 'cozy', prompt: 'Three things I will make my surroundings cozy with' },
  { id: 'places', prompt: 'Three places I will visit' },
  { id: 'pamper', prompt: 'Three things I will pamper myself with regularly' },
  { id: 'morning', prompt: 'Three things I will do every morning' },
  { id: 'rewards', prompt: 'Three presents I will reward my successes with' },
  { id: 'connect', prompt: 'Three ways I will connect with my loved ones' }
];

export const sections = [
  // ==========================================
  // Part 0: Introduction
  // ==========================================
  {
    id: 'intro',
    part: 0,
    title: 'Welcome to YearCompass',
    type: 'info',
    skippable: false,
    content: `
      <div class="intro-content">
        <p class="intro-lead">Welcome to <strong>YearCompass</strong>, your companion for yearly reflection and planning.</p>
        <p>This is a digital version of the free YearCompass booklet from <a href="https://yearcompass.com" target="_blank" rel="noopener">yearcompass.com</a>.</p>
        <h3>Before you begin</h3>
        <ul>
          <li><strong>Plan for 3-4 hours</strong>, or complete over multiple sessions</li>
          <li><strong>Your progress saves automatically</strong> - you can close this anytime and return later</li>
          <li><strong>Be honest with yourself</strong> - this is for your eyes only</li>
          <li><strong>There are no right answers</strong> - write whatever comes to mind</li>
        </ul>
        <p>When you're ready, click <strong>Next</strong> to begin with a short preparation exercise.</p>
      </div>
    `
  },
  {
    id: 'preparation',
    part: 0,
    title: 'Preparation',
    type: 'info',
    skippable: true,
    content: `
      <div class="preparation-content">
        <p class="preparation-lead">Before diving into reflection, take a moment to settle in.</p>

        <h3>Create your space</h3>
        <p>Find a quiet place where you won't be disturbed. Make yourself comfortable. Perhaps make a warm drink.</p>

        <h3>Clear your mind</h3>
        <p><strong>Take three deep breaths.</strong></p>
        <p>Breathe in slowly... hold... and release.</p>
        <p>Let go of the day's concerns. This time is just for you.</p>

        <h3>Set your intention</h3>
        <p>Set aside judgment. Be honest with yourself. Remember: there are no wrong answers here.</p>
        <p>You're about to close one chapter and open another. Approach this with curiosity and kindness toward yourself.</p>

        <p class="preparation-ready">When you feel ready, click <strong>Next</strong> to begin reflecting on your past year.</p>
      </div>
    `
  },

  // ==========================================
  // Part 1: The Past Year (Closing)
  // ==========================================
  {
    id: 'calendar-review',
    part: 1,
    title: 'Calendar Review',
    description: 'Go through last year\'s calendar week by week. Write down important events, gatherings, milestones, and significant moments. What happened in January? February? And so on...',
    fields: [
      {
        id: 'calendar-notes',
        type: 'textarea',
        rows: 15,
        markdown: true,
        prompt: 'Review your year month by month:'
      }
    ]
  },
  {
    id: 'year-in-review',
    part: 1,
    title: 'This Year In Review',
    description: 'Complete these sentences to reflect on key moments and learnings from your past year.',
    fields: [
      { id: 'wisest-decision', type: 'textarea', prompt: 'The wisest decision I made...', rows: 3, markdown: true },
      { id: 'biggest-lesson', type: 'textarea', prompt: 'The biggest lesson I learned...', rows: 3, markdown: true },
      { id: 'biggest-risk', type: 'textarea', prompt: 'The biggest risk I took...', rows: 3, markdown: true },
      { id: 'biggest-surprise', type: 'textarea', prompt: 'The biggest surprise of the year...', rows: 3, markdown: true },
      { id: 'for-others', type: 'textarea', prompt: 'The most important thing I did for others...', rows: 3, markdown: true },
      { id: 'biggest-completed', type: 'textarea', prompt: 'The biggest thing I completed...', rows: 3, markdown: true }
    ]
  },
  {
    id: 'highlights',
    part: 1,
    title: 'Highlights',
    description: 'Recall your greatest, most memorable, and joyful moments from the past year.',
    fields: [
      {
        id: 'greatest-moments',
        type: 'textarea',
        prompt: 'Describe your greatest, most memorable, and joyful moments from last year:',
        rows: 5,
        markdown: true
      },
      {
        id: 'moment-feelings',
        type: 'textarea',
        prompt: 'How did you feel? Who was there? What were you doing?',
        rows: 5,
        markdown: true
      }
    ]
  },
  {
    id: 'accomplishments-challenges',
    part: 1,
    title: 'Accomplishments & Challenges',
    description: 'Reflect on what you achieved and what was difficult.',
    fields: [
      { id: 'accomplishment-1', type: 'text', prompt: 'My greatest accomplishment #1:' },
      { id: 'accomplishment-2', type: 'text', prompt: 'My greatest accomplishment #2:' },
      { id: 'accomplishment-3', type: 'text', prompt: 'My greatest accomplishment #3:' },
      { id: 'challenge-1', type: 'text', prompt: 'My biggest challenge #1:' },
      { id: 'challenge-2', type: 'text', prompt: 'My biggest challenge #2:' },
      { id: 'challenge-3', type: 'text', prompt: 'My biggest challenge #3:' }
    ]
  },
  {
    id: 'forgiveness',
    part: 1,
    title: 'Forgiveness',
    description: 'Is there anything from the past year that still needs to be forgiven? Deeds or words that made you feel bad?',
    fields: [
      {
        id: 'forgiveness-reflection',
        type: 'textarea',
        prompt: 'Who do you need to forgive, or ask forgiveness from? What do you need to forgive yourself for?',
        rows: 6,
        markdown: true
      }
    ]
  },
  {
    id: 'letting-go',
    part: 1,
    title: 'Letting Go',
    description: 'What are you ready to release from the past year? What beliefs, habits, or burdens no longer serve you?',
    fields: [
      {
        id: 'letting-go-reflection',
        type: 'textarea',
        prompt: 'What are you ready to let go of from the past year?',
        rows: 6,
        markdown: true
      }
    ]
  },
  {
    id: 'life-areas-past',
    part: 1,
    title: 'Life Areas Assessment',
    description: 'Rate your satisfaction in each area of life over the past year (1 = very dissatisfied, 10 = very satisfied). Add notes about what contributed to your rating.',
    type: 'life-areas',
    fields: lifeAreas.map(area => ({
      id: area.id,
      label: area.label,
      type: 'rating-with-notes'
    }))
  },
  {
    id: 'past-year-summary',
    part: 1,
    title: 'Summary of the Past Year',
    description: 'Wrap up your reflection on the past year.',
    fields: [
      { id: 'word-1', type: 'text', prompt: 'Word #1 that defines your past year:' },
      { id: 'word-2', type: 'text', prompt: 'Word #2 that defines your past year:' },
      { id: 'word-3', type: 'text', prompt: 'Word #3 that defines your past year:' },
      {
        id: 'book-title',
        type: 'text',
        prompt: 'If a book or movie was made about your past year, what title would you give it?'
      },
      {
        id: 'farewell-letter',
        type: 'textarea',
        prompt: 'Write a farewell letter to the past year. Thank it, acknowledge it, and let it go.',
        rows: 8,
        markdown: true
      }
    ]
  },

  // ==========================================
  // Part 2: The Year Ahead (Planning)
  // ==========================================
  {
    id: 'dare-to-dream',
    part: 2,
    title: 'Dare to Dream',
    description: 'Close your eyes and imagine the year ahead. What does the ideal year look like? Let go of expectations and dare to dream big.',
    fields: [
      {
        id: 'dreams',
        type: 'textarea',
        prompt: 'What does the year ahead look like? Why will it be great? What would happen in an ideal world?',
        rows: 12,
        markdown: true
      }
    ]
  },
  {
    id: 'magical-triplets',
    part: 2,
    title: 'Magical Triplets',
    description: 'Complete each set of three. Don\'t overthink it - write what comes to mind.',
    type: 'triplets',
    triplets: magicalTriplets
  },
  {
    id: 'affirmations',
    part: 2,
    title: 'Affirmations',
    description: 'Complete these sentences to set your intentions for the year ahead.',
    fields: [
      { id: 'special-because', type: 'textarea', prompt: 'This year will be special for me because...', rows: 3, markdown: true },
      { id: 'advise-myself', type: 'textarea', prompt: 'This year I advise myself to...', rows: 3, markdown: true },
      { id: 'say-yes-when', type: 'textarea', prompt: 'This year I will say yes when...', rows: 3, markdown: true },
      { id: 'bravest-when', type: 'textarea', prompt: 'This year I will be the bravest when...', rows: 3, markdown: true },
      { id: 'energy-from', type: 'textarea', prompt: 'This year I will draw the most energy from...', rows: 3, markdown: true },
      { id: 'not-procrastinate', type: 'textarea', prompt: 'This year I will not procrastinate any more on...', rows: 3, markdown: true }
    ]
  },
  {
    id: 'word-of-year',
    part: 2,
    title: 'Word of the Year',
    description: 'Pick a single word to symbolize and define the year ahead. This word can be your anchor - look at it when you need extra energy or direction.',
    fields: [
      {
        id: 'word',
        type: 'text',
        prompt: 'My word for the year:'
      },
      {
        id: 'word-meaning',
        type: 'textarea',
        prompt: 'Why did you choose this word? What does it mean to you?',
        rows: 4,
        markdown: true
      }
    ]
  },
  {
    id: 'secret-wish',
    part: 2,
    title: 'Secret Wish',
    description: 'Unleash your mind. What is your deepest, most secret wish for the year ahead?',
    fields: [
      {
        id: 'secret-wish',
        type: 'textarea',
        prompt: 'My secret wish for this year:',
        rows: 5,
        markdown: true
      }
    ]
  },
  {
    id: 'life-areas-future',
    part: 2,
    title: 'Life Areas Goals',
    description: 'For each area of life, set intentions for the year ahead. What do you want to achieve? What actions will you take?',
    type: 'life-areas-goals',
    fields: lifeAreas.map(area => ({
      id: area.id,
      label: area.label,
      type: 'goal-with-actions'
    }))
  },
  {
    id: 'commitment',
    part: 2,
    title: 'Commitment',
    description: 'Seal your intentions with a commitment to yourself.',
    fields: [
      {
        id: 'commitment-statement',
        type: 'textarea',
        prompt: 'I commit to pursuing my goals and living according to my values. I will be kind to myself when I fall short, and celebrate my progress along the way.',
        rows: 4,
        markdown: true
      },
      {
        id: 'signature',
        type: 'text',
        prompt: 'Your name (as a signature):'
      },
      {
        id: 'date',
        type: 'text',
        prompt: 'Today\'s date:'
      }
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

/**
 * Get total field count for progress calculation
 * @returns {number} Total number of fillable fields
 */
export function getTotalFieldCount() {
  let count = 0;

  sections.forEach(section => {
    if (section.type === 'info') return;

    if (section.type === 'triplets') {
      // 12 triplets × 3 items each = 36 fields
      count += (section.triplets?.length || 0) * 3;
    } else if (section.type === 'life-areas' || section.type === 'life-areas-goals') {
      // Each life area has rating + notes (2 fields) or goal + actions (2 fields)
      count += (section.fields?.length || 0) * 2;
    } else {
      count += section.fields?.length || 0;
    }
  });

  return count;
}
