/**
 * Storage Module
 * Handles localStorage persistence for YearCompass data
 */

const STORAGE_KEY = 'yearcompass_data';
const DATA_VERSION = 1;

// In-memory cache of storage data
let storageData = null;

/**
 * Default storage structure
 */
function getDefaultData() {
  return {
    version: DATA_VERSION,
    currentYear: null,
    settings: {
      theme: 'light',
      fontSize: 'medium',
      markdownPreview: 'onBlur'
    },
    years: {}
  };
}

/**
 * Initialize storage - load existing data or create new
 * @returns {Object} The storage data object
 */
export function initStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      storageData = JSON.parse(stored);
      // TODO: Handle data migration if version differs
    } else {
      storageData = getDefaultData();
      saveToLocalStorage();
    }
  } catch (error) {
    console.error('Failed to load storage:', error);
    storageData = getDefaultData();
  }

  return storageData;
}

/**
 * Save current data to localStorage
 */
function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    // TODO: Handle quota exceeded error
  }
}

/**
 * Get the current active year data
 * @returns {Object|null} Current year data or null if none
 */
export function getCurrentYear() {
  if (!storageData || !storageData.currentYear) {
    return null;
  }
  return storageData.years[storageData.currentYear] || null;
}

/**
 * Get all available years
 * @returns {Array} Array of year IDs
 */
export function getAllYears() {
  if (!storageData) return [];
  return Object.keys(storageData.years);
}

/**
 * Set the current active year
 * @param {string} yearId - Year ID to set as current
 */
export function setCurrentYear(yearId) {
  if (storageData.years[yearId]) {
    storageData.currentYear = yearId;
    saveToLocalStorage();
  }
}

/**
 * Create a new year entry
 * @param {string} yearId - Year ID (e.g., "2024-2025")
 * @returns {Object} The new year data
 */
export function createNewYear(yearId) {
  const now = new Date().toISOString();
  const displayName = yearId.replace('-', ' → ');

  storageData.years[yearId] = {
    id: yearId,
    displayName,
    createdAt: now,
    lastModified: now,
    currentSection: 'intro',
    sections: {}
  };

  storageData.currentYear = yearId;
  saveToLocalStorage();

  return storageData.years[yearId];
}

/**
 * Load a specific year's data
 * @param {string} yearId - Year ID to load
 * @returns {Object|null} Year data or null if not found
 */
export function loadYear(yearId) {
  if (!storageData) return null;
  return storageData.years[yearId] || null;
}

/**
 * Save a year's data
 * @param {string} yearId - Year ID
 * @param {Object} data - Year data to save
 */
export function saveYear(yearId, data) {
  data.lastModified = new Date().toISOString();
  storageData.years[yearId] = data;
  saveToLocalStorage();
}

/**
 * Save an individual answer
 * @param {string} yearId - Year ID
 * @param {string} sectionId - Section ID
 * @param {string} fieldId - Field ID
 * @param {*} value - Value to save
 */
export function saveAnswer(yearId, sectionId, fieldId, value) {
  const year = storageData.years[yearId];
  if (!year) return;

  if (!year.sections[sectionId]) {
    year.sections[sectionId] = { completed: false, answers: {} };
  }

  year.sections[sectionId].answers[fieldId] = value;
  year.lastModified = new Date().toISOString();

  // Debounced save
  debouncedSave();
}

/**
 * Get application settings
 * @returns {Object} Settings object
 */
export function getSettings() {
  return storageData?.settings || getDefaultData().settings;
}

/**
 * Save application settings
 * @param {Object} settings - Settings to save
 */
export function saveSettings(settings) {
  storageData.settings = { ...storageData.settings, ...settings };
  saveToLocalStorage();
}

/**
 * Get the current section for the active year
 * @returns {string} Current section ID or 'intro' as default
 */
export function getCurrentSection() {
  const year = getCurrentYear();
  return year?.currentSection || 'intro';
}

/**
 * Save the current section for the active year
 * @param {string} sectionId - Section ID to save
 */
export function saveCurrentSection(sectionId) {
  const year = getCurrentYear();
  if (year) {
    year.currentSection = sectionId;
    year.lastModified = new Date().toISOString();
    debouncedSave();
  }
}

/**
 * Check if a section has any content filled
 * @param {string} sectionId - Section ID to check
 * @returns {boolean} True if section has any filled fields
 */
export function isSectionStarted(sectionId) {
  const year = getCurrentYear();
  if (!year?.sections[sectionId]?.answers) return false;

  const answers = year.sections[sectionId].answers;
  return Object.values(answers).some(value =>
    value && typeof value === 'string' && value.trim().length > 0
  );
}

// Debounce save operations
let saveTimeout = null;
function debouncedSave() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    saveToLocalStorage();
    saveTimeout = null;
  }, 300);
}
