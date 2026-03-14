/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-promo.
 * Base: columns. Source: https://www.dell.com/en-us. Generated: 2026-03-13.
 *
 * Columns block structure (from library):
 * - Multiple columns per row, each cell can contain text, images, or inline elements
 *
 * Source DOM: .ghpg-support-background:nth-child(9)
 *   .ghpg-premier-solution-container > .dds__container--compact
 *   Two-column layout (image left, text right):
 *     Col 1 (.ghpg-ps-image): picture > img (lifestyle image of person using Latitude laptop)
 *     Col 2 (.ghpg-ps-text-container):
 *       - h3.ghpg-subtitle ("One Hub For All Your IT Needs")
 *       - span (description about Dell Premier)
 *       - .ghpg-premier-button > a links (Sign In, Learn about Dell Premier)
 *       - .ghpg-premier-items > div (Personalized Solutions, Buy at Best Price, IT Lifecycle Mgmt)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Col 1: lifestyle image
  const col1 = [];
  const img = element.querySelector('.ghpg-ps-image img, .ghpg-premier-image, picture img');
  if (img) {
    const newImg = document.createElement('img');
    const src = img.getAttribute('src') || img.getAttribute('hp-lazy-src') || '';
    newImg.setAttribute('src', src.startsWith('//') ? `https:${src}` : src);
    newImg.setAttribute('alt', img.getAttribute('alt') || '');
    col1.push(newImg);
  }

  // Col 2: text content
  const col2 = [];
  const textContainer = element.querySelector('.ghpg-ps-text-container, .ghpg-ps-static-container');

  if (textContainer) {
    const heading = textContainer.querySelector('h3, .ghpg-subtitle');
    if (heading) col2.push(heading);

    const desc = textContainer.querySelector('span');
    if (desc && desc.textContent.trim()) col2.push(desc);

    // CTA links
    const links = textContainer.querySelectorAll('.ghpg-premier-button a, a[href]');
    links.forEach((link) => col2.push(link));

    // Feature items
    const featureItems = textContainer.querySelectorAll('.ghpg-premier-items-container, [class*="premier-item"]');
    featureItems.forEach((item) => {
      const itemText = item.querySelector('p');
      if (itemText) {
        const p = document.createElement('p');
        p.textContent = itemText.textContent.trim();
        col2.push(p);
      }
    });
  }

  if (col1.length > 0 || col2.length > 0) {
    cells.push([
      col1.length > 0 ? col1 : '',
      col2.length > 0 ? col2 : '',
    ]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
