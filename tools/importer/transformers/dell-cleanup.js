/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Dell homepage cleanup.
 * Removes non-authorable site shell content (header, footer, nav, cookie banners, chat widgets).
 * Selectors from captured DOM of https://www.dell.com/en-us.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent, chat widgets, overlays that may interfere with parsing
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="cookie"]',
      '#drift-widget',
      '.chat-widget',
      '[id*="CybotCookiebot"]',
      'script',
      'style',
      'noscript',
    ]);

    // Remove cloned owl carousel items (duplicates that would cause double-parsing)
    const clonedItems = element.querySelectorAll('.owl-item.cloned');
    clonedItems.forEach((item) => item.remove());

    // Fix lazy-loaded images: copy hp-lazy-src to src, hp-lazy-srcset to srcset
    element.querySelectorAll('img[hp-lazy-src]').forEach((img) => {
      const lazySrc = img.getAttribute('hp-lazy-src');
      if (lazySrc) {
        img.setAttribute('src', lazySrc.startsWith('//') ? `https:${lazySrc}` : lazySrc);
      }
    });

    element.querySelectorAll('[hp-lazy-srcset]').forEach((el) => {
      const lazySrcset = el.getAttribute('hp-lazy-srcset');
      if (lazySrcset) {
        el.setAttribute('srcset', lazySrcset.startsWith('//') ? `https:${lazySrcset}` : lazySrcset);
      }
    });

    // Fix protocol-relative image URLs in srcset
    element.querySelectorAll('source[srcset^="//"]').forEach((source) => {
      source.setAttribute('srcset', `https:${source.getAttribute('srcset')}`);
    });
    element.querySelectorAll('img[src^="//"]').forEach((img) => {
      img.setAttribute('src', `https:${img.getAttribute('src')}`);
    });

    // Fix lazy background images
    element.querySelectorAll('[hp-lazy-style]').forEach((el) => {
      const style = el.getAttribute('hp-lazy-style');
      if (style) {
        el.setAttribute('style', style);
      }
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable content: header, footer, nav
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav:not([aria-label="Find the right product for you"])',
      '.breadcrumb',
      'aside',
      'iframe',
      'link',
      '.hmp-visually-hidden',
    ]);

    // Remove owl carousel navigation dots/buttons (UI controls, not content)
    WebImporter.DOMUtils.remove(element, [
      '.owl-nav',
      '.owl-dots',
    ]);

    // Remove SVG sprite definitions (not authorable content)
    WebImporter.DOMUtils.remove(element, [
      'svg[style*="display: none"]',
      'svg[style*="display:none"]',
    ]);

    // Remove tracking/analytics attributes
    element.querySelectorAll('[data-metrics]').forEach((el) => {
      el.removeAttribute('data-metrics');
    });
    element.querySelectorAll('[data-track]').forEach((el) => {
      el.removeAttribute('data-track');
    });
  }
}
