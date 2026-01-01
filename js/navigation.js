/**
 * Navigation Module
 * Handles sidebar navigation, progress tracking, and section transitions
 */

import { sections } from '../data/questions.js';
import { getCurrentYear, saveAnswer } from './storage.js';
import { renderSection } from './render.js';

let currentSectionIndex = 0;

/**
 * Initialize navigation
 */
export function initNavigation() {
  renderSidebar();
  setupNavigationListeners();
  updateProgress();
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
      button.textContent = section.title;
      button.dataset.sectionId = section.id;
      button.addEventListener('click', () => navigateToSection(section.id));
      li.appendChild(button);
      navList.appendChild(li);
    });
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
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarToggle.setAttribute(
        'aria-expanded',
        sidebar.classList.contains('open')
      );
    });
  }
}

/**
 * Navigate to a specific section
 * @param {string} sectionId - Section ID to navigate to
 */
export function navigateToSection(sectionId) {
  const sectionIndex = sections.findIndex(s => s.id === sectionId);
  if (sectionIndex === -1) return;

  currentSectionIndex = sectionIndex;

  // Update active state in sidebar
  const navButtons = document.querySelectorAll('#sidebar-nav button');
  navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sectionId === sectionId);
  });

  // Render the section
  renderSection(sectionId);

  // Update prev/next button states
  updateNavigationButtons();

  // Update progress
  updateProgress();

  // Scroll to top of content
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.scrollTop = 0;
  }
}

/**
 * Navigate to the previous section
 */
function navigatePrevious() {
  if (currentSectionIndex > 0) {
    navigateToSection(sections[currentSectionIndex - 1].id);
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
    const fields = section.fields || [];

    totalFields += fields.length;

    if (sectionData?.answers) {
      fields.forEach(field => {
        if (sectionData.answers[field.id]?.trim()) {
          filledFields++;
        }
      });
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
