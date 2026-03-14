/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-rewards.
 * Base: columns. Source: https://www.dell.com/en-us. Generated: 2026-03-13.
 *
 * Columns block structure (from library):
 * - Multiple columns per row, each cell can contain text, images, or inline elements
 *
 * Source DOM: .ghpg-pl-module
 *   .ghpg-pl-module-main > .ghpg_content > .ghpg_content_structure
 *   Two-column layout (text left, image right):
 *     Col 1 (text):
 *       - h2.ghpg-title ("Dell Rewards")
 *       - h3.ghpg-subtitle ("Shop More. Earn More.")
 *       - span (description about rewards)
 *       - .ghpg-pl-button > a (Learn More), a.ghpg-pl-link (Sign In)
 *     Col 2 (image):
 *       - figure.ghpg-pl-image-aspect-ratio > picture > img (rewards promo image)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Col 1: text content
  const col1 = [];
  const textContainer = element.querySelector('.ghpg_content_structure, .ghpg-pl-module-main');

  if (textContainer) {
    const eyebrow = textContainer.querySelector('h2, .ghpg-title');
    if (eyebrow) col1.push(eyebrow);

    const heading = textContainer.querySelector('h3, .ghpg-subtitle');
    if (heading) col1.push(heading);

    const desc = textContainer.querySelector('span.dds__body-2, span[class*="body"]');
    if (desc && desc.textContent.trim()) col1.push(desc);

    // CTA buttons
    const primaryCta = textContainer.querySelector('.ghpg-pl-button a.dds__button, a.dds__button--primary');
    if (primaryCta) col1.push(primaryCta);

    const secondaryCta = textContainer.querySelector('a.ghpg-pl-link, .ghpg-pl-button a:not(.dds__button)');
    if (secondaryCta) col1.push(secondaryCta);
  }

  // Col 2: promotional image
  const col2 = [];
  const img = element.querySelector('.ghpg-pl-image-aspect-ratio img, figure img, picture img');
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-rewards', cells });
  element.replaceWith(block);
}
