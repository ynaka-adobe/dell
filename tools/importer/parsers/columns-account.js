/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-account.
 * Base: columns. Source: https://www.dell.com/en-us. Generated: 2026-03-13.
 *
 * Columns block structure (from library):
 * - Multiple columns per row, each cell can contain text, images, or inline elements
 *
 * Source DOM: .ghpg-support-background:nth-child(8)
 *   .ghpg-login-container > .dds__container--compact
 *   Two-column layout:
 *     Col 1 (.ghpg-login-text-container):
 *       - h3.ghpg-subtitle ("My Account")
 *       - span (description)
 *       - .ghpg-homelogin-button > a (Sign In, Create Account)
 *       - .ghpg-login-items > .ghpg-login-items-container (Easy Ordering, Order Tracking, Dell Rewards)
 *     Col 2: lifestyle image (person using Dell XPS laptop)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Col 1: text content
  const col1 = [];
  const textContainer = element.querySelector('.ghpg-login-text-container, .ghpg-login-static-container');

  if (textContainer) {
    const heading = textContainer.querySelector('h3, .ghpg-subtitle');
    if (heading) col1.push(heading);

    const desc = textContainer.querySelector('span');
    if (desc && desc.textContent.trim()) col1.push(desc);

    // CTA buttons
    const buttons = textContainer.querySelectorAll('.ghpg-homelogin-button a, a.dds__button');
    buttons.forEach((btn) => col1.push(btn));

    // Feature items (Easy Ordering, Order Tracking, Dell Rewards)
    const featureItems = textContainer.querySelectorAll('.ghpg-login-items-container');
    featureItems.forEach((item) => {
      const itemText = item.querySelector('p');
      if (itemText) {
        const p = document.createElement('p');
        p.textContent = itemText.textContent.trim();
        col1.push(p);
      }
    });
  }

  // Col 2: lifestyle image
  const col2 = [];
  const img = element.querySelector('.ghpg-login-image img, .ghpg-home-login-container-row img, picture img');
  if (img) {
    const newImg = document.createElement('img');
    const src = img.getAttribute('src') || img.getAttribute('hp-lazy-src') || '';
    newImg.setAttribute('src', src.startsWith('//') ? `https:${src}` : src);
    newImg.setAttribute('alt', img.getAttribute('alt') || '');
    col2.push(newImg);
  }

  if (col1.length > 0 || col2.length > 0) {
    cells.push([
      col1.length > 0 ? col1 : '',
      col2.length > 0 ? col2 : '',
    ]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-account', cells });
  element.replaceWith(block);
}
