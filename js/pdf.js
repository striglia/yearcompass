/**
 * PDF Export Module
 * Prepares content for browser print dialog
 */

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
  // Prepare content for printing
  prepareForPrint();

  // Trigger browser print dialog
  window.print();

  // Restore after print
  window.addEventListener('afterprint', restoreAfterPrint, { once: true });
}

/**
 * Prepare the document for printing
 * - Renders all markdown content
 * - Expands all sections
 */
function prepareForPrint() {
  // Render markdown in all textareas
  const markdownFields = document.querySelectorAll('[data-markdown="true"]');

  markdownFields.forEach(textarea => {
    const value = textarea.value;
    if (value) {
      const preview = document.createElement('div');
      preview.className = 'markdown-preview print-only';
      preview.innerHTML = renderMarkdown(value);
      textarea.parentElement.appendChild(preview);
    }
  });

  // Add print class to body
  document.body.classList.add('printing');
}

/**
 * Restore the document after printing
 */
function restoreAfterPrint() {
  // Remove print-only previews
  const printPreviews = document.querySelectorAll('.print-only');
  printPreviews.forEach(el => el.remove());

  // Remove print class
  document.body.classList.remove('printing');
}
