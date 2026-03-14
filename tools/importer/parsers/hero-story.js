/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-story.
 * Base: hero. Source: https://www.dell.com/en-us. Generated: 2026-03-13.
 *
 * Hero block structure (from library):
 * - 1 column, 2-3 rows
 * - Row 1 (optional): background image
 * - Row 2: title, subheading, description, CTA
 *
 * Source DOM: .ghpg-video-section
 *   .ghpg-video-container > .ghpg-video-aspect-ratio
 *     - video-js (background video with poster image)
 *     - figure > picture > img (poster/thumbnail image)
 *   .ghpg-video-text-container (overlaid text)
 *     - h2.ghpg-title (eyebrow: "University of Texas Athletics Customer Story")
 *     - h3.ghpg-subtitle (heading: "Texas Athletics Enhances Fan Experiences")
 *     - span (description paragraph)
 *     - button (Play Video)
 *     - a links (Learn More, View All Stories)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: background/poster image from video section
  const posterImg = element.querySelector('.ghpg-video-aspect-ratio figure img, .ghpg-video-aspect-ratio picture img, img[class*="poster"]');
  if (posterImg) {
    const newImg = document.createElement('img');
    const src = posterImg.getAttribute('src') || posterImg.getAttribute('hp-lazy-src') || '';
    newImg.setAttribute('src', src.startsWith('//') ? `https:${src}` : src);
    newImg.setAttribute('alt', posterImg.getAttribute('alt') || '');
    cells.push([newImg]);
  } else {
    // Fallback: use thumbnail URL from meta
    const thumbMeta = element.querySelector('meta[itemprop="thumbnailUrl"]');
    if (thumbMeta) {
      const newImg = document.createElement('img');
      const src = thumbMeta.getAttribute('content') || '';
      newImg.setAttribute('src', src.startsWith('//') ? `https:${src}` : src);
      newImg.setAttribute('alt', '');
      cells.push([newImg]);
    }
  }

  // Row 2: text content
  const contentCell = [];
  const textContainer = element.querySelector('.ghpg-video-text-container, [class*="video-text"]');

  if (textContainer) {
    const eyebrow = textContainer.querySelector('h2, .ghpg-title');
    if (eyebrow) contentCell.push(eyebrow);

    const heading = textContainer.querySelector('h3, .ghpg-subtitle');
    if (heading) contentCell.push(heading);

    const desc = textContainer.querySelector('span, p');
    if (desc && desc.textContent.trim()) contentCell.push(desc);

    // CTA links (skip play video button, get text links)
    const links = textContainer.querySelectorAll('a.dds__link, a[class*="link"], a[href]');
    links.forEach((link) => contentCell.push(link));
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-story', cells });
  element.replaceWith(block);
}
