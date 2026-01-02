/**
 * Main Application Entry Point
 * Initializes all modules and sets up the YearCompass app
 */

import { initStorage, getCurrentYear } from './storage.js';
import { initNavigation } from './navigation.js';
import { renderSection } from './render.js';
import { initYearSelector, checkNewYearPrompt } from './year.js';
import { initSaveIndicator } from './save-indicator.js';
import { initPdfExport } from './pdf.js';

/**
 * Initialize the YearCompass application
 */
async function init() {
  console.log('YearCompass initializing...');

  try {
    // Initialize storage layer
    const storage = initStorage();

    // Initialize year selector (creates first year if needed)
    initYearSelector();

    // Get current year data
    const currentYear = getCurrentYear();

    // Initialize save indicator with last modified time
    initSaveIndicator(currentYear?.lastModified);

    // Initialize navigation
    initNavigation();

    // Check if we should prompt for new year
    checkNewYearPrompt();

    // Initialize PDF export
    initPdfExport();

    // Remove loading state
    const mainContent = document.getElementById('main-content');
    const loadingState = mainContent.querySelector('.loading-state');
    if (loadingState) {
      loadingState.remove();
    }

    // Render initial section or show intro
    if (!currentYear) {
      // First-time user - show intro
      renderSection('intro');
    } else {
      // Returning user - resume at current section
      const section = currentYear.currentSection || 'intro';
      renderSection(section);
    }

    console.log('YearCompass initialized');

  } catch (error) {
    console.error('Failed to initialize YearCompass:', error);
    showError('Failed to load YearCompass. Please refresh the page.');
  }
}

/**
 * Display an error message to the user
 * @param {string} message - Error message to display
 */
function showError(message) {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <div class="error-state">
      <h2>Something went wrong</h2>
      <p>${message}</p>
      <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
    </div>
  `;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
