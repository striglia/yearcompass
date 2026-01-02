/**
 * Render Module
 * Dynamically generates section UI from questions data
 */

import { sections } from '../data/questions.js';
import { getCurrentYear, saveAnswer } from './storage.js';
import { updateProgress, updateSidebarIndicators, navigateToSection } from './navigation.js';
import { initMarkdownSupport } from './markdown.js';
import { showSaving, showSaved } from './save-indicator.js';

/**
 * Escape HTML characters to prevent XSS and broken markup
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
 * Render a section by ID
 * @param {string} sectionId - Section ID to render
 */
export function renderSection(sectionId) {
  const section = sections.find(s => s.id === sectionId);
  if (!section) {
    console.error(`Section not found: ${sectionId}`);
    return;
  }

  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  const yearData = getCurrentYear();
  const sectionData = yearData?.sections[sectionId] || { answers: {} };

  // Clear and render
  mainContent.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'section';
  container.dataset.part = section.part;
  container.dataset.sectionId = section.id;

  // Section header
  const header = document.createElement('header');
  header.innerHTML = `
    <h2 class="section-title">${section.title}</h2>
    ${section.description ? `<p class="section-description">${section.description}</p>` : ''}
  `;
  container.appendChild(header);

  // Render based on section type
  switch (section.type) {
    case 'info':
      renderInfoSection(container, section);
      break;
    case 'life-areas':
      renderLifeAreasSection(container, section, sectionData.answers);
      break;
    case 'life-areas-goals':
      renderLifeAreasGoalsSection(container, section, sectionData.answers);
      break;
    case 'triplets':
      renderTripletsSection(container, section, sectionData.answers);
      break;
    default:
      renderStandardSection(container, section, sectionData.answers);
  }

  mainContent.appendChild(container);

  // Initialize markdown support for any markdown-enabled textareas
  initMarkdownSupport(container);
}

/**
 * Render an info section (no inputs)
 */
function renderInfoSection(container, section) {
  if (section.content) {
    const content = document.createElement('div');
    content.className = 'section-content';
    content.innerHTML = section.content;
    container.appendChild(content);
  }

  // Add Skip button for skippable sections
  if (section.skippable) {
    const skipContainer = document.createElement('div');
    skipContainer.className = 'skip-container';

    const skipBtn = document.createElement('button');
    skipBtn.className = 'btn btn-link skip-btn';
    skipBtn.textContent = 'Skip this step';
    skipBtn.setAttribute('aria-label', `Skip ${section.title}`);
    skipBtn.addEventListener('click', () => {
      // Find next section and navigate to it
      const currentIndex = sections.findIndex(s => s.id === section.id);
      if (currentIndex < sections.length - 1) {
        navigateToSection(sections[currentIndex + 1].id, false);
      }
    });

    skipContainer.appendChild(skipBtn);
    container.appendChild(skipContainer);
  }
}

/**
 * Render a standard section with fields
 */
function renderStandardSection(container, section, answers = {}) {
  const fields = section.fields || [];

  fields.forEach(field => {
    const fieldEl = createField(field, answers[field.id]);
    container.appendChild(fieldEl);
  });
}

/**
 * Render a life areas section with ratings
 */
function renderLifeAreasSection(container, section, answers = {}) {
  const fields = section.fields || [];

  fields.forEach(field => {
    const fieldEl = document.createElement('div');
    fieldEl.className = 'life-area field';

    const ratingValue = answers[`${field.id}-rating`] || 5;
    const notesValue = answers[`${field.id}-notes`] || '';

    fieldEl.innerHTML = `
      <h4 id="${field.id}-heading">${escapeHtml(field.label)}</h4>
      <div class="rating-control">
        <input type="range"
               id="${field.id}-rating"
               data-field-id="${field.id}-rating"
               min="1" max="10"
               value="${ratingValue}"
               aria-label="Rating for ${escapeHtml(field.label)}"
               aria-valuetext="${ratingValue} out of 10"
               aria-describedby="${field.id}-heading">
        <span class="rating-value" aria-hidden="true">${ratingValue}</span>
      </div>
      <textarea
        id="${field.id}-notes"
        data-field-id="${field.id}-notes"
        placeholder="Notes..."
        rows="2"
        aria-label="Notes for ${escapeHtml(field.label)}"
      >${escapeHtml(notesValue)}</textarea>
    `;

    // Set up auto-save listeners
    setupFieldListeners(fieldEl);

    container.appendChild(fieldEl);
  });
}

/**
 * Render a life areas goals section (for year ahead planning)
 */
function renderLifeAreasGoalsSection(container, section, answers = {}) {
  const fields = section.fields || [];

  fields.forEach(field => {
    const fieldEl = document.createElement('div');
    fieldEl.className = 'life-area-goal field';

    const goalValue = answers[`${field.id}-goal`] || '';
    const actionsValue = answers[`${field.id}-actions`] || '';

    fieldEl.innerHTML = `
      <h4>${escapeHtml(field.label)}</h4>
      <div class="goal-field">
        <label for="${field.id}-goal" class="field-prompt">What do you want to achieve?</label>
        <textarea
          id="${field.id}-goal"
          data-field-id="${field.id}-goal"
          rows="2"
          aria-label="Goal for ${escapeHtml(field.label)}"
        >${escapeHtml(goalValue)}</textarea>
      </div>
      <div class="actions-field">
        <label for="${field.id}-actions" class="field-prompt">What actions will you take?</label>
        <textarea
          id="${field.id}-actions"
          data-field-id="${field.id}-actions"
          rows="2"
          aria-label="Actions for ${escapeHtml(field.label)}"
        >${escapeHtml(actionsValue)}</textarea>
      </div>
    `;

    // Set up auto-save listeners
    setupFieldListeners(fieldEl);

    container.appendChild(fieldEl);
  });
}

/**
 * Render a triplets section
 */
function renderTripletsSection(container, section, answers = {}) {
  const triplets = section.triplets || [];

  triplets.forEach(triplet => {
    const groupEl = document.createElement('div');
    groupEl.className = 'triplet-group field';

    groupEl.innerHTML = `<h4>${escapeHtml(triplet.prompt)}</h4>`;

    for (let i = 1; i <= 3; i++) {
      const fieldId = `${triplet.id}-${i}`;
      const value = answers[fieldId] || '';

      const input = document.createElement('input');
      input.type = 'text';
      input.id = fieldId;
      input.dataset.fieldId = fieldId;
      input.value = value;
      input.placeholder = `${i}.`;
      input.setAttribute('aria-label', `${triplet.prompt} - item ${i}`);

      groupEl.appendChild(input);
    }

    // Set up auto-save listeners
    setupFieldListeners(groupEl);

    container.appendChild(groupEl);
  });
}

/**
 * Create a field element
 */
function createField(field, value = '') {
  const fieldEl = document.createElement('div');
  fieldEl.className = 'field';

  let inputHtml = '';

  switch (field.type) {
    case 'textarea':
      inputHtml = `
        <textarea
          id="${field.id}"
          data-field-id="${field.id}"
          rows="${field.rows || 3}"
          ${field.markdown ? 'data-markdown="true"' : ''}
          aria-label="${escapeHtml(field.prompt || field.id)}"
        >${escapeHtml(value)}</textarea>
      `;
      break;
    case 'text':
      inputHtml = `
        <input
          type="text"
          id="${field.id}"
          data-field-id="${field.id}"
          value="${escapeHtml(value)}"
          aria-label="${escapeHtml(field.prompt || field.id)}"
        >
      `;
      break;
    default:
      inputHtml = `
        <textarea
          id="${field.id}"
          data-field-id="${field.id}"
          rows="3"
          aria-label="${escapeHtml(field.prompt || field.id)}"
        >${escapeHtml(value)}</textarea>
      `;
  }

  fieldEl.innerHTML = `
    ${field.prompt ? `<label for="${field.id}" class="field-prompt">${field.prompt}</label>` : ''}
    ${inputHtml}
  `;

  setupFieldListeners(fieldEl);

  return fieldEl;
}

/**
 * Set up auto-save listeners for a field container
 */
function setupFieldListeners(container) {
  const inputs = container.querySelectorAll('input, textarea');

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const yearData = getCurrentYear();
      if (!yearData) return;

      const sectionEl = container.closest('.section');
      const sectionId = sectionEl?.dataset.sectionId;
      const fieldId = input.dataset.fieldId;

      if (sectionId && fieldId) {
        saveAnswer(yearData.id, sectionId, fieldId, input.value);
        showSaving();

        // Update save status after debounce
        setTimeout(() => {
          showSaved();
        }, 400);

        // Update progress and sidebar indicators
        updateProgress();
        updateSidebarIndicators();
      }
    });

    // Update rating display for range inputs
    if (input.type === 'range') {
      input.addEventListener('input', (e) => {
        const display = input.parentElement.querySelector('.rating-value');
        if (display) {
          display.textContent = e.target.value;
        }
        // Update aria-valuetext for screen readers
        input.setAttribute('aria-valuetext', `${e.target.value} out of 10`);
      });
    }
  });
}

