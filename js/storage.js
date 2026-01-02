/**
 * Storage Module
 * Handles localStorage persistence for YearCompass data
 */

const STORAGE_KEY = 'yearcompass_data';
const DATA_VERSION = 1;

// In-memory cache of storage data
let storageData = null;

// Error callback for notifying UI of storage issues
let onStorageError = null;

/**
 * Set the error callback for storage errors
 * @param {Function} callback - Function to call on storage errors
 */
export function setStorageErrorCallback(callback) {
  onStorageError = callback;
}

/**
 * Report a storage error to the UI
 * @param {string} type - Error type ('unavailable', 'quota', 'corrupt', 'parse')
 * @param {string} message - User-friendly message
 * @param {Error} originalError - Original error object (optional)
 */
function reportStorageError(type, message, originalError = null) {
  console.error(`Storage error [${type}]:`, message, originalError);
  if (onStorageError) {
    onStorageError({ type, message, originalError });
  }
}

/**
 * Check if localStorage is available and working
 * @returns {boolean} True if localStorage is available
 */
export function isLocalStorageAvailable() {
  try {
    const testKey = '__yearcompass_test__';
    localStorage.setItem(testKey, 'test');
    const result = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    return result === 'test';
  } catch (error) {
    return false;
  }
}

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
 * Validate the structure of stored data
 * @param {Object} data - Data to validate
 * @returns {Object} Object with { valid: boolean, repaired: boolean, data: Object }
 */
function validateAndRepairData(data) {
  let repaired = false;

  // Must be an object
  if (!data || typeof data !== 'object') {
    reportStorageError('corrupt', 'Stored data is not a valid object. Starting fresh.');
    return { valid: false, repaired: false, data: getDefaultData() };
  }

  // Ensure required properties exist
  if (typeof data.version !== 'number') {
    data.version = DATA_VERSION;
    repaired = true;
  }

  if (!data.settings || typeof data.settings !== 'object') {
    data.settings = getDefaultData().settings;
    repaired = true;
  }

  if (!data.years || typeof data.years !== 'object') {
    data.years = {};
    repaired = true;
  }

  // Validate currentYear points to existing year
  if (data.currentYear && !data.years[data.currentYear]) {
    const yearIds = Object.keys(data.years);
    data.currentYear = yearIds.length > 0 ? yearIds[yearIds.length - 1] : null;
    repaired = true;
  }

  // Validate each year's structure
  for (const yearId of Object.keys(data.years)) {
    const year = data.years[yearId];

    if (!year || typeof year !== 'object') {
      delete data.years[yearId];
      repaired = true;
      continue;
    }

    // Ensure year has required properties
    if (!year.id) year.id = yearId;
    if (!year.displayName) year.displayName = yearId.replace('-', ' → ');
    if (!year.createdAt) year.createdAt = new Date().toISOString();
    if (!year.lastModified) year.lastModified = year.createdAt;
    if (!year.sections || typeof year.sections !== 'object') {
      year.sections = {};
      repaired = true;
    }

    // Validate each section
    for (const sectionId of Object.keys(year.sections)) {
      const section = year.sections[sectionId];
      if (!section || typeof section !== 'object') {
        year.sections[sectionId] = { completed: false, answers: {} };
        repaired = true;
      } else if (!section.answers || typeof section.answers !== 'object') {
        section.answers = {};
        repaired = true;
      }
    }
  }

  if (repaired) {
    console.warn('Data structure was repaired during validation');
  }

  return { valid: true, repaired, data };
}

/**
 * Initialize storage - load existing data or create new
 * @returns {Object} The storage data object
 * @throws {Error} If localStorage is unavailable
 */
export function initStorage() {
  // Check localStorage availability first
  if (!isLocalStorageAvailable()) {
    reportStorageError(
      'unavailable',
      'Local storage is not available. Your browser may be in private mode or have storage disabled. Your progress cannot be saved.'
    );
    // Return default data but it won't persist
    storageData = getDefaultData();
    return storageData;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      let parsed;
      try {
        parsed = JSON.parse(stored);
      } catch (parseError) {
        reportStorageError(
          'parse',
          'Your saved data appears to be corrupted. Starting with a fresh workspace.',
          parseError
        );
        storageData = getDefaultData();
        saveToLocalStorage();
        return storageData;
      }

      // Validate and repair data
      const { valid, repaired, data } = validateAndRepairData(parsed);
      storageData = data;

      if (repaired) {
        // Save repaired data
        saveToLocalStorage();
      }
    } else {
      storageData = getDefaultData();
      saveToLocalStorage();
    }
  } catch (error) {
    reportStorageError('unknown', 'An unexpected error occurred while loading your data.', error);
    storageData = getDefaultData();
  }

  return storageData;
}

/**
 * Save current data to localStorage
 * @returns {boolean} True if save succeeded
 */
function saveToLocalStorage() {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const dataString = JSON.stringify(storageData);
    localStorage.setItem(STORAGE_KEY, dataString);
    return true;
  } catch (error) {
    // Check if it's a quota exceeded error
    if (error.name === 'QuotaExceededError' ||
        error.code === 22 ||
        error.code === 1014 ||
        (error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
      reportStorageError(
        'quota',
        'Storage is full. Please export your data and clear old entries to continue saving.',
        error
      );
    } else {
      reportStorageError(
        'save',
        'Failed to save your progress. Please try again or export your data.',
        error
      );
    }
    return false;
  }
}

/**
 * Get the current storage usage in bytes
 * @returns {Object} { used: number, total: number, percentage: number }
 */
export function getStorageUsage() {
  try {
    const dataString = localStorage.getItem(STORAGE_KEY) || '';
    const used = new Blob([dataString]).size;
    // Most browsers have ~5MB limit, but we'll estimate conservatively
    const total = 5 * 1024 * 1024; // 5MB
    return {
      used,
      total,
      percentage: Math.round((used / total) * 100)
    };
  } catch (error) {
    return { used: 0, total: 5 * 1024 * 1024, percentage: 0 };
  }
}

/**
 * Export all data as JSON string for backup
 * @returns {string} JSON string of all data
 */
export function exportData() {
  return JSON.stringify(storageData, null, 2);
}

/**
 * Import data from JSON string
 * @param {string} jsonString - JSON data to import
 * @returns {Object} { success: boolean, message: string }
 */
export function importData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    const { valid, data: validatedData } = validateAndRepairData(data);

    if (!valid) {
      return { success: false, message: 'The imported data is not valid YearCompass data.' };
    }

    storageData = validatedData;
    const saved = saveToLocalStorage();

    if (!saved) {
      return { success: false, message: 'Could not save imported data. Storage may be full.' };
    }

    return { success: true, message: 'Data imported successfully.' };
  } catch (error) {
    return { success: false, message: 'The file is not valid JSON data.' };
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
