/**
 * Year Management Module
 * Handles year selection, creation, and lifecycle
 */

import {
  getAllYears,
  getCurrentYear,
  setCurrentYear,
  createNewYear,
  loadYear
} from './storage.js';
import { initNavigation } from './navigation.js';
import { renderSection } from './render.js';

/**
 * Get the suggested year ID based on current date
 * @returns {string} Year ID in format "YYYY-YYYY"
 */
export function getSuggestedYearId() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  // If we're in the first few months, suggest previous year -> current year
  // Otherwise suggest current year -> next year
  if (currentMonth < 3) { // Jan, Feb, Mar
    return `${currentYear - 1}-${currentYear}`;
  } else {
    return `${currentYear}-${currentYear + 1}`;
  }
}

/**
 * Format year ID for display
 * @param {string} yearId - Year ID like "2024-2025"
 * @returns {string} Display format like "2024 → 2025"
 */
export function formatYearDisplay(yearId) {
  return yearId.replace('-', ' → ');
}

/**
 * Initialize year selector
 */
export function initYearSelector() {
  const selector = document.getElementById('year-selector');
  if (!selector) return;

  // Check if we need to create a first year
  const years = getAllYears();
  if (years.length === 0) {
    // First-time user - create suggested year
    const suggestedYear = getSuggestedYearId();
    createNewYear(suggestedYear);
  }

  // Populate the selector
  populateYearSelector();

  // Set up change listener
  selector.addEventListener('change', handleYearChange);
}

/**
 * Populate the year selector dropdown
 */
export function populateYearSelector() {
  const selector = document.getElementById('year-selector');
  if (!selector) return;

  const years = getAllYears();
  const currentYear = getCurrentYear();

  // Clear existing options
  selector.innerHTML = '';

  // Sort years in reverse chronological order (newest first)
  const sortedYears = [...years].sort().reverse();

  // Add year options
  sortedYears.forEach(yearId => {
    const option = document.createElement('option');
    option.value = yearId;
    option.textContent = formatYearDisplay(yearId);
    if (currentYear && yearId === currentYear.id) {
      option.selected = true;
    }
    selector.appendChild(option);
  });

  // Add "New Year" option
  const newYearOption = document.createElement('option');
  newYearOption.value = '__new__';
  newYearOption.textContent = '+ Start New Year';
  selector.appendChild(newYearOption);
}

/**
 * Handle year selector change
 * @param {Event} event - Change event
 */
function handleYearChange(event) {
  const selectedValue = event.target.value;

  if (selectedValue === '__new__') {
    // Show new year dialog
    showNewYearDialog();
    // Reset selector to current year
    const currentYear = getCurrentYear();
    if (currentYear) {
      event.target.value = currentYear.id;
    }
  } else {
    // Switch to selected year
    switchToYear(selectedValue);
  }
}

/**
 * Switch to a different year
 * @param {string} yearId - Year ID to switch to
 */
export function switchToYear(yearId) {
  setCurrentYear(yearId);

  // Re-render the navigation and current section
  const yearData = loadYear(yearId);
  if (yearData) {
    const section = yearData.currentSection || 'intro';

    // Update URL hash
    window.location.hash = section;

    // Re-initialize navigation to update sidebar indicators
    initNavigation();
  }
}

/**
 * Show dialog to create a new year
 */
function showNewYearDialog() {
  const suggestedYear = getSuggestedYearId();
  const years = getAllYears();

  // Check if suggested year already exists
  if (years.includes(suggestedYear)) {
    // Find next available year
    const currentYearNum = new Date().getFullYear();
    let newYearId = `${currentYearNum}-${currentYearNum + 1}`;

    // Keep incrementing until we find an unused year
    while (years.includes(newYearId)) {
      const [start] = newYearId.split('-').map(Number);
      newYearId = `${start + 1}-${start + 2}`;
    }

    if (confirm(`Create a new YearCompass for ${formatYearDisplay(newYearId)}?`)) {
      createAndSwitchToYear(newYearId);
    }
  } else {
    if (confirm(`Start your ${formatYearDisplay(suggestedYear)} YearCompass?`)) {
      createAndSwitchToYear(suggestedYear);
    }
  }
}

/**
 * Create a new year and switch to it
 * @param {string} yearId - Year ID to create
 */
function createAndSwitchToYear(yearId) {
  createNewYear(yearId);
  populateYearSelector();

  // Select the new year in the dropdown
  const selector = document.getElementById('year-selector');
  if (selector) {
    selector.value = yearId;
  }

  // Navigate to intro of new year
  window.location.hash = 'intro';
  initNavigation();
}

/**
 * Check if a year is the current calendar year's compass
 * @param {string} yearId - Year ID to check
 * @returns {boolean} True if this is for the current period
 */
export function isCurrentYearCompass(yearId) {
  const suggestedYear = getSuggestedYearId();
  return yearId === suggestedYear;
}

/**
 * Show a prompt for new year if appropriate
 * Called after January 1st to suggest starting new year
 */
export function checkNewYearPrompt() {
  const now = new Date();
  const currentMonth = now.getMonth();

  // Only show prompt in January-February
  if (currentMonth > 1) return;

  const suggestedYear = getSuggestedYearId();
  const years = getAllYears();
  const currentYear = getCurrentYear();

  // If suggested year doesn't exist and we have at least one old year
  if (!years.includes(suggestedYear) && years.length > 0 && currentYear) {
    // Check if we've already dismissed this prompt
    const dismissedKey = `yearcompass_dismissed_${suggestedYear}`;
    if (localStorage.getItem(dismissedKey)) return;

    // Show a gentle prompt
    showNewYearBanner(suggestedYear);
  }
}

/**
 * Show a banner prompting to start new year
 * @param {string} yearId - Suggested year ID
 */
function showNewYearBanner(yearId) {
  // Create banner element
  const banner = document.createElement('div');
  banner.className = 'new-year-banner';
  banner.innerHTML = `
    <p>Ready to start your ${formatYearDisplay(yearId)} YearCompass?</p>
    <div class="banner-actions">
      <button class="btn btn-primary" id="start-new-year">Let's Begin</button>
      <button class="btn btn-secondary" id="dismiss-new-year">Not Yet</button>
    </div>
  `;

  // Insert at top of main content
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.insertBefore(banner, mainContent.firstChild);
  }

  // Set up button handlers
  document.getElementById('start-new-year')?.addEventListener('click', () => {
    createAndSwitchToYear(yearId);
    banner.remove();
  });

  document.getElementById('dismiss-new-year')?.addEventListener('click', () => {
    localStorage.setItem(`yearcompass_dismissed_${yearId}`, 'true');
    banner.remove();
  });
}
