/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-products.
 * Base: carousel. Source: https://www.dell.com/en-us. Generated: 2026-03-13.
 *
 * Carousel block structure (from library):
 * - 2 columns per row, multiple rows (one per slide)
 * - Col 1: image (mandatory)
 * - Col 2: heading, description, CTA link (optional)
 *
 * Source DOM: #ghpg-promo-section
 *   .ghpg-product-carousal > .ghpg-product-item-container > .owl-stage-outer
 *   Each slide: .owl-item > .ghpg-product-item-container-row
 *     - figure > img (product image)
 *     - .ghpg-product-text-container
 *       - h4.ghpg-title (product name e.g. "XPS")
 *       - h5.ghpg-subtitle (tagline e.g. "Crafted For You")
 *       - span (description)
 *       - a (shop/learn links)
 */
export default function parse(element, { document }) {
  // Get non-cloned product carousel slides
  const slides = element.querySelectorAll('.ghpg-product-item-container .owl-item:not(.cloned) .ghpg-product-item-container-row');
  const cells = [];

  slides.forEach((slide) => {
    // Col 1: product image
    const img = slide.querySelector('figure img, img');
    const imageCell = [];
    if (img) {
      const newImg = document.createElement('img');
      const src = img.getAttribute('src') || img.getAttribute('hp-lazy-src') || img.getAttribute('data-src-set') || '';
      newImg.setAttribute('src', src.startsWith('//') ? `https:${src}` : src);
      newImg.setAttribute('alt', img.getAttribute('alt') || '');
      imageCell.push(newImg);
    }

    // Col 2: product text content
    const contentCell = [];
    const textContainer = slide.querySelector('.ghpg-product-text-container');
    if (textContainer) {
      const title = textContainer.querySelector('h4, .ghpg-title');
      if (title) contentCell.push(title);

      const subtitle = textContainer.querySelector('h5, .ghpg-subtitle');
      if (subtitle) contentCell.push(subtitle);

      const desc = textContainer.querySelector('span');
      if (desc && desc.textContent.trim()) contentCell.push(desc);

      const ctas = textContainer.querySelectorAll('a.dds__link, a[aria-label]');
      ctas.forEach((cta) => contentCell.push(cta));
    }

    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([
        imageCell.length > 0 ? imageCell : '',
        contentCell.length > 0 ? contentCell : '',
      ]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-products', cells });
  element.replaceWith(block);
}
