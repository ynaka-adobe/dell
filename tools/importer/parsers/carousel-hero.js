/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-hero.
 * Base: carousel. Source: https://www.dell.com/en-us. Generated: 2026-03-13.
 *
 * Carousel block structure (from library):
 * - 2 columns per row, multiple rows (one per slide)
 * - Col 1: image (mandatory)
 * - Col 2: heading, description, CTA link (optional)
 *
 * Source DOM: .hpg-hero-section-container > section.owl-carousel > .owl-stage-outer
 *   Each slide: .owl-item > .hpg-hero-section-item
 *     - picture > img.hpg-hero-img (background image)
 *     - .hpg-card-text-container > .hpg-card-text > .hpg-card-text-content
 *       - h2.ghpg-title (product name)
 *       - h3.ghpg-subtitle (price/subheading)
 *       - span (description)
 *       - .hpg-banner-cta > a (CTA buttons)
 */
export default function parse(element, { document }) {
  // Get all non-cloned carousel slides
  const slides = element.querySelectorAll('.owl-item:not(.cloned) .hpg-hero-section-item');
  const cells = [];

  slides.forEach((slide) => {
    // Col 1: slide background image
    const img = slide.querySelector('img.hpg-hero-img, picture img');
    const imageCell = [];
    if (img) {
      // Use the highest quality src
      const src = img.getAttribute('src') || '';
      const newImg = document.createElement('img');
      newImg.setAttribute('src', src.startsWith('//') ? `https:${src}` : src);
      newImg.setAttribute('alt', img.getAttribute('alt') || '');
      imageCell.push(newImg);
    }

    // Col 2: text content
    const contentCell = [];
    const textContent = slide.querySelector('.hpg-card-text-content');
    if (textContent) {
      const heading = textContent.querySelector('h2, .ghpg-title');
      if (heading) contentCell.push(heading);

      const subtitle = textContent.querySelector('h3, .ghpg-subtitle');
      if (subtitle) contentCell.push(subtitle);

      const desc = textContent.querySelector('span');
      if (desc && desc.textContent.trim()) contentCell.push(desc);

      const ctas = textContent.querySelectorAll('.hpg-banner-cta a, .dds__button');
      ctas.forEach((cta) => contentCell.push(cta));
    }

    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([
        imageCell.length > 0 ? imageCell : '',
        contentCell.length > 0 ? contentCell : '',
      ]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
