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
  const container = textarea.parentElement;
  let preview = container.querySelector('.markdown-preview');

  if (showPreview) {
    if (!preview) {
      preview = document.createElement('div');
      preview.className = 'markdown-preview';
      container.appendChild(preview);
    }

    preview.innerHTML = renderMarkdown(textarea.value);
    textarea.style.display = 'none';
    preview.style.display = 'block';
  } else {
    textarea.style.display = 'block';
    if (preview) {
      preview.style.display = 'none';
    }
  }
}
