/**
 * Main Application Entry Point
 * Initializes all modules and sets up the YearCompass app
 */

import { initStorage, getCurrentYear, setStorageErrorCallback, isLocalStorageAvailable, exportData } from './storage.js';
import { initNavigation } from './navigation.js';
import { renderSection } from './render.js';
import { initYearSelector, checkNewYearPrompt } from './year.js';
import { initSaveIndicator } from './save-indicator.js';
import { initPdfExport } from './pdf.js';

// Track if we've shown a persistent error banner
let errorBannerShown = false;

/**
 * Handle storage errors from the storage module
 * @param {Object} error - Error object with type, message, originalError
 */
function handleStorageError({ type, message }) {
  console.error(`Storage error [${type}]:`, message);

  // Show appropriate UI based on error type
  switch (type) {
    case 'unavailable':
      showPersistentError(
        'Storage Unavailable',
        message,
        'Your browser cannot save data. Try disabling private browsing mode or enabling cookies.'
      );
      break;
    case 'quota':
      showPersistentError(
        'Storage Full',
        message,
        'Export your data to create a backup, then try clearing old entries.',
        true // Show export button
      );
      break;
    case 'corrupt':
    case 'parse':
      showTemporaryError(message);
      break;
    default:
      showTemporaryError(message);
  }
}

/**
 * Show a persistent error banner at the top of the page
 * @param {string} title - Error title
 * @param {string} message - Error message
 * @param {string} help - Help text
 * @param {boolean} showExport - Whether to show export button
 */
function showPersistentError(title, message, help, showExport = false) {
  if (errorBannerShown) return;
  errorBannerShown = true;

  const banner = document.createElement('div');
  banner.className = 'error-banner';
  banner.setAttribute('role', 'alert');
  banner.innerHTML = `
    <div class="error-banner-content">
      <strong>${title}</strong>
      <p>${message}</p>
      <p class="error-help">${help}</p>
      ${showExport ? `<button class="btn btn-secondary" id="export-data-btn">Export Data</button>` : ''}
      <button class="btn btn-secondary dismiss-error" aria-label="Dismiss">×</button>
    </div>
  `;

  // Insert at top of body
  document.body.insertBefore(banner, document.body.firstChild);

  // Set up export button if shown
  if (showExport) {
    document.getElementById('export-data-btn')?.addEventListener('click', () => {
      downloadExportData();
    });
  }

  // Set up dismiss button
  banner.querySelector('.dismiss-error')?.addEventListener('click', () => {
    banner.remove();
    errorBannerShown = false;
  });
}

/**
 * Show a temporary toast notification for non-critical errors
 * @param {string} message - Error message
 */
function showTemporaryError(message) {
  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.setAttribute('role', 'alert');
  toast.textContent = message;

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  // Remove after delay
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

/**
 * Download data export as JSON file
 */
function downloadExportData() {
  const data = exportData();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `yearcompass-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Initialize the YearCompass application
 */
async function init() {
  console.log('YearCompass initializing...');

  try {
    // Set up storage error handling before initializing
    setStorageErrorCallback(handleStorageError);

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
