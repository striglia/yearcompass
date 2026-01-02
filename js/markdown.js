/**
 * Markdown Module
 * Wrapper for marked.js with XSS sanitization
 */

// Import marked.js (vendored)
// Note: marked.js will be loaded as a global from lib/marked.min.js
// For module usage, we check if it's available

/**
 * Render markdown text to HTML
 * @param {string} text - Markdown text to render
 * @returns {string} Rendered HTML
 */
export function renderMarkdown(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Check if marked is available
  if (typeof marked === 'undefined') {
    console.warn('marked.js not loaded, returning raw text');
    return escapeHtml(text);
  }

  try {
    // Configure marked options
    marked.setOptions({
      gfm: true,         // GitHub Flavored Markdown
      breaks: true,      // Convert \n to <br>
      headerIds: false,  // Don't add IDs to headers
      mangle: false      // Don't mangle email addresses
    });

    const html = marked.parse(text);

    // Basic XSS sanitization
    return sanitizeHtml(html);

  } catch (error) {
    console.error('Markdown rendering error:', error);
    return escapeHtml(text);
  }
}

/**
 * Escape HTML characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Basic HTML sanitization
 * Removes dangerous tags and attributes
 * @param {string} html - HTML to sanitize
 * @returns {string} Sanitized HTML
 */
function sanitizeHtml(html) {
  // Create a temporary element
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Remove dangerous elements
  const dangerous = ['script', 'iframe', 'object', 'embed', 'form'];
  dangerous.forEach(tag => {
    const elements = temp.getElementsByTagName(tag);
    while (elements.length > 0) {
      elements[0].remove();
    }
  });

  // Remove dangerous attributes
  const allElements = temp.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];

    // Remove event handlers
    const attrs = el.attributes;
    for (let j = attrs.length - 1; j >= 0; j--) {
      const attrName = attrs[j].name.toLowerCase();
      if (attrName.startsWith('on') || attrName === 'href' && attrs[j].value.startsWith('javascript:')) {
        el.removeAttribute(attrs[j].name);
      }
    }
  }

  return temp.innerHTML;
}

/**
 * Toggle between edit and preview mode for a textarea
 * @param {HTMLTextAreaElement} textarea - The textarea element
 * @param {boolean} showPreview - Whether to show preview mode
 */
export function togglePreview(textarea, showPreview) {
  const wrapper = textarea.closest('.markdown-wrapper');
  if (!wrapper) return;

  const preview = wrapper.querySelector('.markdown-preview');
  const toggleBtn = wrapper.querySelector('.markdown-toggle');

  if (showPreview && textarea.value.trim()) {
    if (preview) {
      preview.innerHTML = renderMarkdown(textarea.value);
      textarea.style.display = 'none';
      preview.style.display = 'block';
      if (toggleBtn) {
        toggleBtn.textContent = 'Edit';
        toggleBtn.setAttribute('aria-pressed', 'true');
      }
    }
  } else {
    textarea.style.display = 'block';
    if (preview) {
      preview.style.display = 'none';
    }
    if (toggleBtn) {
      toggleBtn.textContent = 'Preview';
      toggleBtn.setAttribute('aria-pressed', 'false');
    }
    // Focus the textarea when switching to edit
    if (showPreview === false) {
      textarea.focus();
    }
  }
}

/**
 * Set up markdown support for a textarea
 * @param {HTMLTextAreaElement} textarea - The textarea element
 */
export function setupMarkdownTextarea(textarea) {
  // Skip if already set up or not markdown-enabled
  if (textarea.dataset.markdownSetup || textarea.dataset.markdown !== 'true') {
    return;
  }

  // Mark as set up
  textarea.dataset.markdownSetup = 'true';

  // Create wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'markdown-wrapper';

  // Create toggle button
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'markdown-toggle btn btn-secondary';
  toggle.textContent = 'Preview';
  toggle.setAttribute('aria-pressed', 'false');
  toggle.setAttribute('aria-label', 'Toggle markdown preview');

  // Create preview container
  const preview = document.createElement('div');
  preview.className = 'markdown-preview';
  preview.style.display = 'none';

  // Wrap the textarea
  textarea.parentNode.insertBefore(wrapper, textarea);
  wrapper.appendChild(toggle);
  wrapper.appendChild(textarea);
  wrapper.appendChild(preview);

  // Toggle button click
  toggle.addEventListener('click', () => {
    const isPreview = preview.style.display !== 'none';
    togglePreview(textarea, !isPreview);
  });

  // Preview on blur (if content exists)
  textarea.addEventListener('blur', () => {
    if (textarea.value.trim()) {
      // Small delay to allow click on toggle button
      setTimeout(() => {
        if (document.activeElement !== toggle) {
          togglePreview(textarea, true);
        }
      }, 150);
    }
  });

  // Edit on focus (click on preview)
  preview.addEventListener('click', () => {
    togglePreview(textarea, false);
  });
}

/**
 * Initialize markdown support for all markdown-enabled textareas in a container
 * @param {HTMLElement} container - Container to search for textareas
 */
export function initMarkdownSupport(container = document) {
  const textareas = container.querySelectorAll('textarea[data-markdown="true"]');
  textareas.forEach(setupMarkdownTextarea);
}
