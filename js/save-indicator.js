/**
 * Save Indicator Module
 * Shows save status and last-saved timestamp
 */

let lastSaveTime = null;
let updateInterval = null;

/**
 * Show "Saving..." indicator
 */
export function showSaving() {
  const statusEl = document.getElementById('save-status');
  if (statusEl) {
    statusEl.textContent = 'Saving...';
    statusEl.classList.add('saving');
    statusEl.classList.remove('saved');
  }
}

/**
 * Show "Saved" confirmation and update timestamp
 */
export function showSaved() {
  lastSaveTime = new Date();

  const statusEl = document.getElementById('save-status');
  if (statusEl) {
    statusEl.textContent = 'Saved';
    statusEl.classList.remove('saving');
    statusEl.classList.add('saved');

    // After brief confirmation, show timestamp
    setTimeout(() => {
      updateTimestamp();
    }, 1500);
  }

  // Start updating timestamp periodically
  startTimestampUpdates();
}

/**
 * Update the timestamp display
 */
function updateTimestamp() {
  if (!lastSaveTime) return;

  const statusEl = document.getElementById('save-status');
  if (statusEl && !statusEl.classList.contains('saving')) {
    statusEl.textContent = formatRelativeTime(lastSaveTime);
    statusEl.classList.remove('saved');
  }
}

/**
 * Format a date as relative time
 * @param {Date} date - Date to format
 * @returns {string} Formatted relative time
 */
function formatRelativeTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 10) {
    return 'Just saved';
  } else if (diffSec < 60) {
    return 'Saved moments ago';
  } else if (diffMin === 1) {
    return 'Saved 1 minute ago';
  } else if (diffMin < 60) {
    return `Saved ${diffMin} minutes ago`;
  } else if (diffHour === 1) {
    return 'Saved 1 hour ago';
  } else if (diffHour < 24) {
    return `Saved ${diffHour} hours ago`;
  } else {
    // Format as absolute time for older saves
    return `Saved ${formatTime(date)}`;
  }
}

/**
 * Format a date as absolute time
 * @param {Date} date - Date to format
 * @returns {string} Formatted time
 */
function formatTime(date) {
  const options = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Start periodic timestamp updates
 */
function startTimestampUpdates() {
  // Clear existing interval
  if (updateInterval) {
    clearInterval(updateInterval);
  }

  // Update every 30 seconds
  updateInterval = setInterval(updateTimestamp, 30000);
}

/**
 * Initialize save indicator with last modified time from storage
 * @param {string} lastModified - ISO timestamp of last modification
 */
export function initSaveIndicator(lastModified) {
  if (lastModified) {
    lastSaveTime = new Date(lastModified);
    updateTimestamp();
    startTimestampUpdates();
  } else {
    const statusEl = document.getElementById('save-status');
    if (statusEl) {
      statusEl.textContent = 'Ready';
    }
  }
}
