/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-news.
 * Base: cards. Source: https://www.dell.com/en-us. Generated: 2026-03-13.
 *
 * Cards block structure (from library):
 * - 2 columns per row, multiple rows (one per card)
 * - Col 1: image (mandatory)
 * - Col 2: title, description, CTA (optional)
 *
 * Source DOM: .ghpg-whatshpg-section
 *   .ghpg-whatshpg-item-container > .ghpg-whatshpg-item (4 items)
 *   Each item:
 *     - .ghpg-whatshpg-item-img > figure > img (thumbnail image)
 *     - .ghpg-whatshpg-item-title
 *       - h4.ghpg-whatshpg-img-title > a (card title with link)
 *       - a.ghpg-whatshpg-readmore-link (read more link)
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.ghpg-whatshpg-item');
  const cells = [];

  items.forEach((item) => {
    // Col 1: thumbnail image
    const img = item.querySelector('.ghpg-whatshpg-item-img img, figure img');
    const imageCell = [];
    if (img) {
      const newImg = document.createElement('img');
      const src = img.getAttribute('src') || img.getAttribute('hp-lazy-src') || '';
      newImg.setAttribute('src', src.startsWith('//') ? `https:${src}` : src);
      newImg.setAttribute('alt', img.getAttribute('alt') || '');
      imageCell.push(newImg);
    }

    // Col 2: title with link
    const contentCell = [];
    const titleLink = item.querySelector('.ghpg-whatshpg-img-title a, h4 a');
    if (titleLink) {
      const heading = document.createElement('p');
      const anchor = document.createElement('a');
      anchor.setAttribute('href', titleLink.getAttribute('href') || '');
      anchor.textContent = titleLink.textContent.trim();
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
