/**
 * Navigation Module
 * Handles sidebar navigation, progress tracking, and section transitions
 */

import { sections } from '../data/questions.js';
import { getCurrentYear, saveCurrentSection, getCurrentSection, isSectionStarted } from './storage.js';
import { renderSection } from './render.js';

let currentSectionIndex = 0;

/**
 * Announce message to screen readers via live region
 * @param {string} message - Message to announce
 */
export function announceToScreenReader(message) {
  const announcer = document.getElementById('sr-announcements');
  if (announcer) {
    // Clear first to ensure announcement triggers even for same message
    announcer.textContent = '';
    // Use setTimeout to ensure the DOM update triggers announcement
    setTimeout(() => {
      announcer.textContent = message;
    }, 50);
  }
}

/**
 * Initialize navigation
 */
export function initNavigation() {
  renderSidebar();
  setupNavigationListeners();
  setupHashNavigation();
  updateProgress();

  // Navigate to initial section (from URL hash, storage, or default)
  const initialSection = getInitialSection();
  navigateToSection(initialSection, false); // Don't show nudge on initial load
}

/**
 * Get the initial section to display
 * Priority: URL hash > stored currentSection > 'intro'
 */
function getInitialSection() {
  // Check URL hash first
  const hash = window.location.hash.slice(1);
  if (hash && sections.find(s => s.id === hash)) {
    return hash;
  }

  // Check stored currentSection
  const stored = getCurrentSection();
  if (stored && sections.find(s => s.id === stored)) {
    return stored;
  }

  // Default to intro
  return 'intro';
}

/**
 * Render the sidebar navigation
 */
function renderSidebar() {
  const navList = document.getElementById('sidebar-nav');
  if (!navList) return;

  navList.innerHTML = '';

  // Group sections by part
  const parts = [
    { id: 0, title: 'Introduction' },
    { id: 1, title: 'Part 1: The Past Year' },
    { id: 2, title: 'Part 2: The Year Ahead' }
  ];

  parts.forEach(part => {
    const partSections = sections.filter(s => s.part === part.id);
    if (partSections.length === 0) return;

    // Part header
    const partHeader = document.createElement('li');
    partHeader.className = 'nav-part-header';
    partHeader.innerHTML = `<strong>${part.title}</strong>`;
    navList.appendChild(partHeader);

    // Section items
    partSections.forEach(section => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.dataset.sectionId = section.id;
      button.addEventListener('click', () => navigateToSection(section.id));

      // Add completion indicator
      const isStarted = section.type !== 'info' && isSectionStarted(section.id);
      button.innerHTML = `
        <span class="nav-item-title">${section.title}</span>
        ${isStarted ? '<span class="nav-item-check" aria-label="Started">✓</span>' : ''}
      `;

      li.appendChild(button);
      navList.appendChild(li);
    });
  });
}

/**
 * Update completion indicators in sidebar
 */
export function updateSidebarIndicators() {
  const navButtons = document.querySelectorAll('#sidebar-nav button');

  navButtons.forEach(btn => {
    const sectionId = btn.dataset.sectionId;
    if (!sectionId) return;

    const section = sections.find(s => s.id === sectionId);
    if (!section || section.type === 'info') return;

    const isStarted = isSectionStarted(sectionId);
    const existingCheck = btn.querySelector('.nav-item-check');

    if (isStarted && !existingCheck) {
      const check = document.createElement('span');
      check.className = 'nav-item-check';
      check.setAttribute('aria-label', 'Started');
      check.textContent = '✓';
      btn.appendChild(check);
    } else if (!isStarted && existingCheck) {
      existingCheck.remove();
    }
  });
}

/**
 * Set up event listeners for navigation
 */
function setupNavigationListeners() {
  // Previous/Next buttons
  const prevBtn = document.getElementById('prev-section');
  const nextBtn = document.getElementById('next-section');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => navigatePrevious());
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => navigateNext());
  }

  // Sidebar toggle (mobile)
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');

  if (sidebarToggle && sidebar) {
    // Create overlay element for mobile
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.querySelector('.app-layout').appendChild(overlay);
    }

    // Toggle sidebar
    sidebarToggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('open');
      overlay.classList.toggle('visible', isOpen);
      sidebarToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close sidebar when clicking overlay
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
      sidebarToggle.setAttribute('aria-expanded', 'false');
    });
  }
}

/**
 * Set up URL hash navigation
 */
function setupHashNavigation() {
  // Handle back/forward browser navigation
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash && sections.find(s => s.id === hash)) {
      const sectionIndex = sections.findIndex(s => s.id === hash);
      if (sectionIndex !== currentSectionIndex) {
        navigateToSection(hash, false);
      }
    }
  });
}

/**
 * Navigate to a specific section
 * @param {string} sectionId - Section ID to navigate to
 * @param {boolean} showNudge - Whether to show nudge for skipping incomplete section
 */
export function navigateToSection(sectionId, showNudge = true) {
  const sectionIndex = sections.findIndex(s => s.id === sectionId);
  if (sectionIndex === -1) return;

  // Check if skipping an incomplete section (only for forward navigation)
  if (showNudge && sectionIndex > currentSectionIndex) {
    const currentSection = sections[currentSectionIndex];
    if (currentSection.type !== 'info' && !isSectionStarted(currentSection.id)) {
      showSkipNudge();
    }
  }

  currentSectionIndex = sectionIndex;

  // Update active state in sidebar
  const navButtons = document.querySelectorAll('#sidebar-nav button');
  navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sectionId === sectionId);
  });

  // Update URL hash (without triggering hashchange)
  const newHash = `#${sectionId}`;
  if (window.location.hash !== newHash) {
    history.replaceState(null, '', newHash);
  }

  // Save current section to storage
  saveCurrentSection(sectionId);

  // Render the section
  renderSection(sectionId);

  // Update prev/next button states
  updateNavigationButtons();

  // Update progress
  updateProgress();

  // Update sidebar indicators
  updateSidebarIndicators();

  // Close mobile sidebar if open
  const sidebar = document.querySelector('.sidebar');
  if (sidebar?.classList.contains('open')) {
    sidebar.classList.remove('open');
    document.querySelector('.sidebar-overlay')?.classList.remove('visible');
    document.querySelector('.sidebar-toggle')?.setAttribute('aria-expanded', 'false');
  }

  // Scroll to top of content
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.scrollTop = 0;
  }

  // Announce section change to screen readers
  const section = sections[sectionIndex];
  announceToScreenReader(`Navigated to ${section.title}`);

  // Focus on section title for keyboard users (after a brief delay for render)
  setTimeout(() => {
    const sectionTitle = mainContent?.querySelector('.section-title');
    if (sectionTitle) {
      sectionTitle.setAttribute('tabindex', '-1');
      sectionTitle.focus();
    }
  }, 100);
}

/**
 * Show a gentle nudge when skipping an incomplete section
 */
function showSkipNudge() {
  // Create nudge element if it doesn't exist
  let nudge = document.querySelector('.skip-nudge');
  if (!nudge) {
    nudge = document.createElement('div');
    nudge.className = 'skip-nudge';
    nudge.setAttribute('role', 'status');
    nudge.setAttribute('aria-live', 'polite');
    document.body.appendChild(nudge);
  }

  // Show the nudge
  nudge.textContent = 'You can come back to this anytime';
  nudge.classList.add('visible');

  // Hide after a few seconds
  setTimeout(() => {
    nudge.classList.remove('visible');
  }, 3000);
}

/**
 * Navigate to the previous section
 */
function navigatePrevious() {
  if (currentSectionIndex > 0) {
    navigateToSection(sections[currentSectionIndex - 1].id, false);
  }
}

/**
 * Navigate to the next section
 */
function navigateNext() {
  if (currentSectionIndex < sections.length - 1) {
    navigateToSection(sections[currentSectionIndex + 1].id);
  }
}

/**
 * Update the state of prev/next navigation buttons
 */
function updateNavigationButtons() {
  const prevBtn = document.getElementById('prev-section');
  const nextBtn = document.getElementById('next-section');

  if (prevBtn) {
    prevBtn.disabled = currentSectionIndex === 0;
  }

  if (nextBtn) {
    nextBtn.disabled = currentSectionIndex === sections.length - 1;

    // Customize button text for intro section
    const currentSection = sections[currentSectionIndex];
    if (currentSection?.id === 'intro') {
      nextBtn.textContent = 'Begin Your Journey';
    } else {
      nextBtn.textContent = 'Next';
    }
  }
}

/**
 * Calculate and update progress display
 */
export function updateProgress() {
  const yearData = getCurrentYear();
  if (!yearData) {
    setProgressDisplay(0);
    return;
  }

  let totalFields = 0;
  let filledFields = 0;

  sections.forEach(section => {
    if (section.type === 'info') return;

    const sectionData = yearData.sections[section.id];

    // Count fields based on section type
    if (section.type === 'triplets') {
      const tripletCount = section.triplets?.length || 0;
      totalFields += tripletCount * 3;

      if (sectionData?.answers) {
        section.triplets?.forEach(triplet => {
          for (let i = 1; i <= 3; i++) {
            if (sectionData.answers[`${triplet.id}-${i}`]?.trim()) {
              filledFields++;
            }
          }
        });
      }
    } else if (section.type === 'life-areas') {
      const areaCount = section.fields?.length || 0;
      totalFields += areaCount * 2; // rating + notes

      if (sectionData?.answers) {
        section.fields?.forEach(field => {
          // Rating always has a default value, so check if notes are filled
          if (sectionData.answers[`${field.id}-notes`]?.trim()) {
            filledFields += 2; // Count both as filled if notes present
          }
        });
      }
    } else if (section.type === 'life-areas-goals') {
      const areaCount = section.fields?.length || 0;
      totalFields += areaCount * 2; // goal + actions

      if (sectionData?.answers) {
        section.fields?.forEach(field => {
          if (sectionData.answers[`${field.id}-goal`]?.trim()) {
            filledFields++;
          }
          if (sectionData.answers[`${field.id}-actions`]?.trim()) {
            filledFields++;
          }
        });
      }
    } else {
      const fields = section.fields || [];
      totalFields += fields.length;

      if (sectionData?.answers) {
        fields.forEach(field => {
          if (sectionData.answers[field.id]?.trim()) {
            filledFields++;
          }
        });
      }
    }
  });

  const progress = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  setProgressDisplay(progress);
}

/**
 * Update the progress bar display
 * @param {number} percent - Progress percentage
 */
function setProgressDisplay(percent) {
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.progress-text');
  const progressBar = document.querySelector('.progress-bar');

  if (progressFill) {
    progressFill.style.width = `${percent}%`;
  }

  if (progressText) {
    progressText.textContent = `${percent}% complete`;
  }

  if (progressBar) {
    progressBar.setAttribute('aria-valuenow', percent);
  }
}
