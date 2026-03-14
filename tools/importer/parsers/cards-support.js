/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-support.
 * Base: cards. Source: https://www.dell.com/en-us. Generated: 2026-03-13.
 *
 * Cards block structure (from library):
 * - 2 columns per row, multiple rows (one per card)
 * - Col 1: image/icon (mandatory)
 * - Col 2: title, description, CTA (optional)
 *
 * Source DOM: .ghpg-support-background:nth-child(7)
 *   .ghpg-support-items > div (5 support tiles)
 *   Each tile: a > .ghpg-items-container
 *     - svg (icon)
 *     - p (label: "Support Home", "Drivers and Downloads", etc.)
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.ghpg-support-items > div');
  const cells = [];

  items.forEach((item) => {
    const link = item.querySelector('a');
    if (!link) return;

    // Col 1: icon - use SVG use href as placeholder, create text-based icon reference
    const svg = item.querySelector('svg');
    const iconCell = [];
    if (svg) {
      const useEl = svg.querySelector('use');
      const iconName = useEl ? (useEl.getAttribute('href') || '').replace('#dds__', '') : '';
      const iconText = document.createElement('p');
      iconText.textContent = iconName || 'icon';
      iconCell.push(iconText);
    }

    // Col 2: label with link
    const contentCell = [];
    const label = item.querySelector('p');
    if (label) {
      const heading = document.createElement('p');
      const anchor = document.createElement('a');
      anchor.setAttribute('href', link.getAttribute('href') || '');
      anchor.textContent = label.textContent.trim();
      heading.appendChild(anchor);
      contentCell.push(heading);
    }

    if (contentCell.length > 0) {
      cells.push([
        iconCell.length > 0 ? iconCell : '',
        contentCell,
      ]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-support', cells });
  element.replaceWith(block);
}
