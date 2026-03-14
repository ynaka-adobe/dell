/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-wayfinding.
 * Base: cards. Source: https://www.dell.com/en-us. Generated: 2026-03-13.
 *
 * Cards block structure (from library):
 * - 2 columns per row, multiple rows (one per card)
 * - Col 1: image/icon (mandatory)
 * - Col 2: title, description, CTA (optional)
 *
 * Source DOM: #ghpg-productway-section
 *   nav > ul > li.ghpg-productway-item (8 items)
 *     - .ghpg-productway-main-category > a (category label + link)
 *     - .ghpg-productway-img > figure > img (product image)
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.ghpg-productway-item, li[class*="ghpg-productway"]');
  const cells = [];

  items.forEach((item) => {
    // Col 1: product image
    const img = item.querySelector('.ghpg-productway-img img, figure img');
    const imageCell = [];
    if (img) {
      const newImg = document.createElement('img');
      const src = img.getAttribute('src') || img.getAttribute('data-src-set') || img.getAttribute('hp-lazy-src') || '';
      newImg.setAttribute('src', src.startsWith('//') ? `https:${src}` : src);
      newImg.setAttribute('alt', img.getAttribute('alt') || '');
      imageCell.push(newImg);
    }

    // Col 2: category name with link
    const contentCell = [];
    const link = item.querySelector('.ghpg-productway-main-category a, a[aria-label]');
    if (link) {
      const heading = document.createElement('p');
      const anchor = document.createElement('a');
      anchor.setAttribute('href', link.getAttribute('href') || '');
      anchor.textContent = link.textContent.trim();
      heading.appendChild(anchor);
      contentCell.push(heading);
    }

    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([
        imageCell.length > 0 ? imageCell : '',
        contentCell.length > 0 ? contentCell : '',
      ]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-wayfinding', cells });
  element.replaceWith(block);
}
