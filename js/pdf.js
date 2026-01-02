/**
 * PDF Export Module
 * Prepares and renders all content for browser print dialog
 */

import { getCurrentYear } from './storage.js';
import { sections, lifeAreas, magicalTriplets } from '../data/questions.js';
import { renderMarkdown } from './markdown.js';

/**
 * Initialize PDF export functionality
 */
export function initPdfExport() {
  const exportBtn = document.getElementById('export-pdf');

  if (exportBtn) {
    exportBtn.addEventListener('click', exportToPdf);
  }
}

/**
 * Export the current compass to PDF via browser print
 */
export function exportToPdf() {
  const yearData = getCurrentYear();
  if (!yearData) {
    alert('No year data to export. Please fill in some content first.');
    return;
  }

  // Create print container with all content
  const printContainer = createPrintContainer(yearData);
  document.body.appendChild(printContainer);

  // Add print class to body
  document.body.classList.add('printing');

  // Trigger browser print dialog
  window.print();

  // Restore after print
  window.addEventListener('afterprint', () => {
    restoreAfterPrint(printContainer);
  }, { once: true });
}

/**
 * Create the print container with all sections rendered
 * @param {Object} yearData - Current year data from storage
 * @returns {HTMLElement} The print container element
 */
function createPrintContainer(yearData) {
  const container = document.createElement('div');
  container.id = 'print-container';
  container.className = 'print-container';

  // Add print header
  container.appendChild(createPrintHeader(yearData));

  // Track current part for part headers
  let currentPart = null;

  // Render each section (skip info sections)
  sections.forEach(section => {
    if (section.type === 'info') return;

    // Add part header when part changes
    if (section.part !== currentPart && section.part > 0) {
      currentPart = section.part;
      container.appendChild(createPartHeader(currentPart));
    }

    // Get section data
    const sectionData = yearData.sections[section.id] || { answers: {} };

    // Check if section has any content
    if (!hasContent(sectionData.answers)) return;

    // Render the section
    container.appendChild(renderPrintSection(section, sectionData.answers));
  });

  return container;
}

/**
 * Create the print header with year and date
 * @param {Object} yearData - Current year data
 * @returns {HTMLElement} Print header element
 */
function createPrintHeader(yearData) {
  const header = document.createElement('header');
  header.className = 'print-header';

  const title = document.createElement('h1');
  title.textContent = `YearCompass ${yearData.displayName || yearData.id}`;

  const date = document.createElement('div');
  date.className = 'print-date';
  date.textContent = `Exported on ${formatDate(new Date())}`;

  header.appendChild(title);
  header.appendChild(date);

  return header;
}

/**
 * Create a part header
 * @param {number} part - Part number (1 or 2)
 * @returns {HTMLElement} Part header element
 */
function createPartHeader(part) {
  const header = document.createElement('div');
  header.className = 'print-part-header';

  if (part === 1) {
    header.textContent = 'Part One: The Past Year';
  } else if (part === 2) {
    header.textContent = 'Part Two: The Year Ahead';
  }

  return header;
}

/**
 * Render a section for print
 * @param {Object} section - Section definition from questions.js
 * @param {Object} answers - User's answers for this section
 * @returns {HTMLElement} Section element
 */
function renderPrintSection(section, answers) {
  const sectionEl = document.createElement('div');
  sectionEl.className = 'section';
  sectionEl.dataset.part = section.part;

  // Section header
  const header = document.createElement('header');
  header.innerHTML = `
    <h3 class="section-title">${escapeHtml(section.title)}</h3>
    ${section.description ? `<p class="section-description">${escapeHtml(section.description)}</p>` : ''}
  `;
  sectionEl.appendChild(header);

  // Render content based on section type
  switch (section.type) {
    case 'life-areas':
      renderLifeAreasPrint(sectionEl, answers);
      break;
    case 'life-areas-goals':
      renderLifeAreasGoalsPrint(sectionEl, answers);
      break;
    case 'triplets':
      renderTripletsPrint(sectionEl, answers);
      break;
    default:
      renderStandardPrint(sectionEl, section, answers);
  }

  return sectionEl;
}

/**
 * Render standard fields for print
 */
function renderStandardPrint(container, section, answers) {
  const fields = section.fields || [];

  fields.forEach(field => {
    const value = answers[field.id];
    if (!value || (typeof value === 'string' && !value.trim())) return;

    const fieldEl = document.createElement('div');
    fieldEl.className = 'field';

    if (field.prompt) {
      const prompt = document.createElement('span');
      prompt.className = 'field-prompt';
      prompt.textContent = field.prompt;
      fieldEl.appendChild(prompt);
    }

    const content = document.createElement('div');
    content.className = 'markdown-preview';

    if (field.markdown) {
      content.innerHTML = renderMarkdown(value);
    } else {
      content.textContent = value;
    }

    fieldEl.appendChild(content);
    container.appendChild(fieldEl);
  });
}

/**
 * Render life areas section for print
 */
function renderLifeAreasPrint(container, answers) {
  lifeAreas.forEach(area => {
    const rating = answers[`${area.id}-rating`];
    const notes = answers[`${area.id}-notes`];

    if (!rating && !notes) return;

    const areaEl = document.createElement('div');
    areaEl.className = 'life-area';

    areaEl.innerHTML = `
      <h4>${escapeHtml(area.label)}</h4>
      ${rating ? `<div class="rating-control"><span class="rating-value">${rating}</span></div>` : ''}
      ${notes ? `<div class="markdown-preview">${renderMarkdown(notes)}</div>` : ''}
    `;

    container.appendChild(areaEl);
  });
}

/**
 * Render life areas goals section for print
 */
function renderLifeAreasGoalsPrint(container, answers) {
  lifeAreas.forEach(area => {
    const goal = answers[`${area.id}-goal`];
    const actions = answers[`${area.id}-actions`];

    if (!goal && !actions) return;

    const areaEl = document.createElement('div');
    areaEl.className = 'life-area-goal';

    let content = `<h4>${escapeHtml(area.label)}</h4>`;

    if (goal) {
      content += `
        <div class="goal-field">
          <label class="field-prompt">What do you want to achieve?</label>
          <div class="markdown-preview">${renderMarkdown(goal)}</div>
        </div>
      `;
    }

    if (actions) {
      content += `
        <div class="actions-field">
          <label class="field-prompt">What actions will you take?</label>
          <div class="markdown-preview">${renderMarkdown(actions)}</div>
        </div>
      `;
    }

    areaEl.innerHTML = content;
    container.appendChild(areaEl);
  });
}

/**
 * Render triplets section for print
 */
function renderTripletsPrint(container, answers) {
  magicalTriplets.forEach(triplet => {
    const items = [];
    for (let i = 1; i <= 3; i++) {
      const value = answers[`${triplet.id}-${i}`];
      if (value && value.trim()) {
        items.push(value);
      }
    }

    if (items.length === 0) return;

    const groupEl = document.createElement('div');
    groupEl.className = 'triplet-group';

    groupEl.innerHTML = `
      <h4>${escapeHtml(triplet.prompt)}</h4>
      <ol>
        ${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
      </ol>
    `;

    container.appendChild(groupEl);
  });
}

/**
 * Check if answers object has any content
 * @param {Object} answers - Answers object
 * @returns {boolean} True if any non-empty values exist
 */
function hasContent(answers) {
  if (!answers) return false;
  return Object.values(answers).some(value =>
    value && typeof value === 'string' ? value.trim().length > 0 : !!value
  );
}

/**
 * Format a date for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Restore the document after printing
 * @param {HTMLElement} printContainer - The container to remove
 */
function restoreAfterPrint(printContainer) {
  // Remove print container
  if (printContainer && printContainer.parentNode) {
    printContainer.parentNode.removeChild(printContainer);
  }

  // Remove print class
  document.body.classList.remove('printing');
}
