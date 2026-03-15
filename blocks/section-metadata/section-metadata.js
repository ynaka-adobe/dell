/**
 * Converts a CSS color value to RGB values
 * @param {string} color - CSS color value (hex, rgb, rgba, hsl, hsla, or named color)
 * @returns {Object|null} Object with r, g, b values (0-255) or null if invalid
 */
function parseColor(section) {
  if (!section) return null;

  const computedBg = getComputedStyle(section).backgroundColor;
  const rgbMatch = computedBg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!rgbMatch) return null;
  return {
    r: parseInt(rgbMatch[1], 10),
    g: parseInt(rgbMatch[2], 10),
    b: parseInt(rgbMatch[3], 10),
  };
}

function getRelativeLuminance({ r, g, b }) {
  // Convert to sRGB
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  // Apply gamma correction
  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : ((rsRGB + 0.055) / 1.055) ** 2.4;
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : ((gsRGB + 0.055) / 1.055) ** 2.4;
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : ((bsRGB + 0.055) / 1.055) ** 2.4;

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Determines if a CSS color value is light or dark
 * @param {string} color - CSS color value
 * @param {number} threshold - Luminance threshold (default: 0.5)
 * @returns {boolean} true if light, false if dark, null if invalid color
 */
export function getColorScheme(section) {
  const rgb = parseColor(section);
  if (!rgb) return null;

  return getRelativeLuminance(rgb) > 0.5 ? 'light-scheme' : 'dark-scheme';
}

export function setColorScheme(section) {
  const scheme = getColorScheme(section);
  if (!scheme) return;
  section.querySelectorAll(':scope > *').forEach((el) => {
    // Reset any pre-made color schemes
    el.classList.remove('light-scheme', 'dark-scheme');
    el.classList.add(scheme);
  });
}

function handleBackground(background, section) {
  const pic = background.content.querySelector('picture');
  if (pic) {
    section.classList.add('has-background');
    pic.classList.add('section-background');
    section.prepend(pic);
    return;
  }
  const color = background.text;
  if (color) {
    section.style.backgroundColor = color.startsWith('color-token')
      ? `var(${color.replace('color-token', '--color')})`
      : color;
    setColorScheme(section);
  }
}

function toClassName(name) {
  return typeof name === 'string'
    ? name
      .toLowerCase()
      .replace(/[^0-9a-z]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    : '';
}

async function handleStyle(text, section) {
  const styles = text.split(',').map((style) => toClassName(style));
  section.classList.add(...styles);
}

async function handleLayout(text, section, type) {
  if (text === '0') return;
  if (type === 'grid') section.classList.add('grid');
  section.classList.add(`${type}-${text}`);
}

const getMetadata = (el) => [...el.childNodes].reduce((rdx, row) => {
  if (row.children) {
    const key = row.children[0].textContent.trim().toLowerCase();
    const content = row.children[1];
    const text = content.textContent.trim().toLowerCase();
    if (key && content) rdx[key] = { content, text };
  }
  return rdx;
}, {});

export default async function init(el) {
  const section = el.closest('.section');
  if (!section) return;
  const metadata = getMetadata(el);
  if (metadata.style?.text) await handleStyle(metadata.style.text, section);
  if (metadata.grid?.text) handleLayout(metadata.grid.text, section, 'grid');
  if (metadata.gap?.text) handleLayout(metadata.gap.text, section, 'gap');
  if (metadata.spacing?.text) handleLayout(metadata.spacing.text, section, 'spacing');
  if (metadata.container?.text) handleLayout(metadata.container.text, section, 'container');
  if (metadata.layout?.text) handleLayout(metadata.layout.text, section, 'layout');
  if (metadata['background-color']?.content) handleBackground(metadata['background-color'].content, section);
  if (metadata['background-image']?.content) handleBackground(metadata['background-image'].content, section);
  if (metadata.background?.content) handleBackground(metadata.background, section);

  if (metadata.style?.text?.includes('support')) {
    setTimeout(() => addSupportSectionIcons(section), 0);
  }

  el.remove();
}

const SUPPORT_ICONS = {
  'support home': '<svg class="support-link-icon support-home-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
  'drivers and downloads': '<svg class="support-link-icon support-gear-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#94DCF7" aria-hidden="true"><path d="M19.14 12.94c.04-.31 0-.63-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.39-.31-.61-.22l-2.39.96c-.42-.32-.86-.6-1.33-.83L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35C8.79 5.59 8.33 5.86 7.92 6.18L5.53 5.22c-.22-.09-.49 0-.61.22L2.98 8.76c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.07.63-.07.94s.03.63.07.94l-2.03 1.58c-.2.14-.24.4-.12.61l1.92 3.32c.12.22.39.3.61.22l2.39-.96c.42.32.86.59 1.33.83l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.47-.24.91-.51 1.33-.83l2.39.96c.22.08.49 0 .61-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
  'order support': '<svg class="support-link-icon support-assistance-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#94DCF7" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>',
  'warranty and contracts': '<svg class="support-link-icon support-warranty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#94DCF7" aria-hidden="true"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>',
  'parts and upgrade': '<svg class="support-link-icon support-headset-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#94DCF7" aria-hidden="true"><path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/></svg>',
};

function addSupportSectionIcons(section) {
  section.querySelectorAll('a[href]').forEach((link) => {
    if (link.closest('.support-link-container')) return;
    const text = link.textContent?.trim().toLowerCase();
    const iconKey = Object.keys(SUPPORT_ICONS).find((key) => text.includes(key));
    if (iconKey) {
      link.insertAdjacentHTML('afterbegin', SUPPORT_ICONS[iconKey]);
      const container = document.createElement('span');
      container.className = 'support-link-container';
      while (link.firstChild) container.appendChild(link.firstChild);
      link.appendChild(container);
    }
  });
}
