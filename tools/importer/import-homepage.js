/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for the homepage template
import carouselHeroParser from './parsers/carousel-hero.js';
import cardsWayfindingParser from './parsers/cards-wayfinding.js';
import carouselProductsParser from './parsers/carousel-products.js';
import heroStoryParser from './parsers/hero-story.js';
import cardsSupportParser from './parsers/cards-support.js';
import columnsAccountParser from './parsers/columns-account.js';
import columnsPromoParser from './parsers/columns-promo.js';
import cardsNewsParser from './parsers/cards-news.js';
import columnsRewardsParser from './parsers/columns-rewards.js';

// TRANSFORMER IMPORTS - Import all transformers
import cleanupTransformer from './transformers/dell-cleanup.js';
import sectionsTransformer from './transformers/dell-sections.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-wayfinding': cardsWayfindingParser,
  'carousel-products': carouselProductsParser,
  'hero-story': heroStoryParser,
  'cards-support': cardsSupportParser,
  'columns-account': columnsAccountParser,
  'columns-promo': columnsPromoParser,
  'cards-news': cardsNewsParser,
  'columns-rewards': columnsRewardsParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Dell US homepage with hero banners, product categories, promotions, and featured content',
  urls: [
    'https://www.dell.com/en-us',
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.hpg-hero-section-container'],
    },
    {
      name: 'cards-wayfinding',
      instances: ['#ghpg-productway-section'],
    },
    {
      name: 'carousel-products',
      instances: ['#ghpg-promo-section'],
    },
    {
      name: 'hero-story',
      instances: ['.ghpg-video-section'],
    },
    {
      name: 'cards-support',
      instances: ['.ghpg-support-background:nth-child(7)'],
    },
    {
      name: 'columns-account',
      instances: ['.ghpg-support-background:nth-child(8)'],
    },
    {
      name: 'columns-promo',
      instances: ['.ghpg-support-background:nth-child(9)'],
    },
    {
      name: 'cards-news',
      instances: ['.ghpg-whatshpg-section'],
    },
    {
      name: 'columns-rewards',
      instances: ['.ghpg-pl-module'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner Carousel',
      selector: '.hpg-hero-section-container',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Product Wayfinding',
      selector: '#ghpg-productway-section',
      style: 'dark',
      blocks: ['cards-wayfinding'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Featured Products',
      selector: '#ghpg-promo-section',
      style: 'dark-accent',
      blocks: ['carousel-products'],
      defaultContent: ['#ghpg-promo-section > div:first-child'],
    },
    {
      id: 'section-4',
      name: 'Customer Story Video',
      selector: '.ghpg-video-section',
      style: null,
      blocks: ['hero-story'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Dell Support',
      selector: '.ghpg-support-background:nth-child(7)',
      style: 'navy',
      blocks: ['cards-support'],
      defaultContent: ['.ghpg-support-background:nth-child(7) > div > div:first-child'],
    },
    {
      id: 'section-6',
      name: 'My Account',
      selector: '.ghpg-support-background:nth-child(8)',
      style: 'navy',
      blocks: ['columns-account'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Dell Premier',
      selector: '.ghpg-support-background:nth-child(9)',
      style: 'navy',
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Whats Happening',
      selector: '.ghpg-whatshpg-section',
      style: 'deep-navy',
      blocks: ['cards-news'],
      defaultContent: ['.ghpg-whatshpg-section > div > div:first-child', '.ghpg-whatshpg-section > div > div:last-child'],
    },
    {
      id: 'section-9',
      name: 'Dell Rewards',
      selector: '.ghpg-pl-module',
      style: 'deep-navy',
      blocks: ['columns-rewards'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY - Array of transformer functions
// Section transformer runs after cleanup (in afterTransform hook)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
