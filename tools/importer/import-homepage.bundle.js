var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".owl-item:not(.cloned) .hpg-hero-section-item");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector("img.hpg-hero-img, picture img");
      const imageCell = [];
      if (img) {
        const src = img.getAttribute("src") || "";
        const newImg = document.createElement("img");
        newImg.setAttribute("src", src.startsWith("//") ? `https:${src}` : src);
        newImg.setAttribute("alt", img.getAttribute("alt") || "");
        imageCell.push(newImg);
      }
      const contentCell = [];
      const textContent = slide.querySelector(".hpg-card-text-content");
      if (textContent) {
        const heading = textContent.querySelector("h2, .ghpg-title");
        if (heading) contentCell.push(heading);
        const subtitle = textContent.querySelector("h3, .ghpg-subtitle");
        if (subtitle) contentCell.push(subtitle);
        const desc = textContent.querySelector("span");
        if (desc && desc.textContent.trim()) contentCell.push(desc);
        const ctas = textContent.querySelectorAll(".hpg-banner-cta a, .dds__button");
        ctas.forEach((cta) => contentCell.push(cta));
      }
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([
          imageCell.length > 0 ? imageCell : "",
          contentCell.length > 0 ? contentCell : ""
        ]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-wayfinding.js
  function parse2(element, { document }) {
    const items = element.querySelectorAll('.ghpg-productway-item, li[class*="ghpg-productway"]');
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".ghpg-productway-img img, figure img");
      const imageCell = [];
      if (img) {
        const newImg = document.createElement("img");
        const src = img.getAttribute("src") || img.getAttribute("data-src-set") || img.getAttribute("hp-lazy-src") || "";
        newImg.setAttribute("src", src.startsWith("//") ? `https:${src}` : src);
        newImg.setAttribute("alt", img.getAttribute("alt") || "");
        imageCell.push(newImg);
      }
      const contentCell = [];
      const link = item.querySelector(".ghpg-productway-main-category a, a[aria-label]");
      if (link) {
        const heading = document.createElement("p");
        const anchor = document.createElement("a");
        anchor.setAttribute("href", link.getAttribute("href") || "");
        anchor.textContent = link.textContent.trim();
        heading.appendChild(anchor);
        contentCell.push(heading);
      }
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([
          imageCell.length > 0 ? imageCell : "",
          contentCell.length > 0 ? contentCell : ""
        ]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-wayfinding", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-products.js
  function parse3(element, { document }) {
    const slides = element.querySelectorAll(".ghpg-product-item-container .owl-item:not(.cloned) .ghpg-product-item-container-row");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector("figure img, img");
      const imageCell = [];
      if (img) {
        const newImg = document.createElement("img");
        const src = img.getAttribute("src") || img.getAttribute("hp-lazy-src") || img.getAttribute("data-src-set") || "";
        newImg.setAttribute("src", src.startsWith("//") ? `https:${src}` : src);
        newImg.setAttribute("alt", img.getAttribute("alt") || "");
        imageCell.push(newImg);
      }
      const contentCell = [];
      const textContainer = slide.querySelector(".ghpg-product-text-container");
      if (textContainer) {
        const title = textContainer.querySelector("h4, .ghpg-title");
        if (title) contentCell.push(title);
        const subtitle = textContainer.querySelector("h5, .ghpg-subtitle");
        if (subtitle) contentCell.push(subtitle);
        const desc = textContainer.querySelector("span");
        if (desc && desc.textContent.trim()) contentCell.push(desc);
        const ctas = textContainer.querySelectorAll("a.dds__link, a[aria-label]");
        ctas.forEach((cta) => contentCell.push(cta));
      }
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([
          imageCell.length > 0 ? imageCell : "",
          contentCell.length > 0 ? contentCell : ""
        ]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-products", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-story.js
  function parse4(element, { document }) {
    const cells = [];
    const posterImg = element.querySelector('.ghpg-video-aspect-ratio figure img, .ghpg-video-aspect-ratio picture img, img[class*="poster"]');
    if (posterImg) {
      const newImg = document.createElement("img");
      const src = posterImg.getAttribute("src") || posterImg.getAttribute("hp-lazy-src") || "";
      newImg.setAttribute("src", src.startsWith("//") ? `https:${src}` : src);
      newImg.setAttribute("alt", posterImg.getAttribute("alt") || "");
      cells.push([newImg]);
    } else {
      const thumbMeta = element.querySelector('meta[itemprop="thumbnailUrl"]');
      if (thumbMeta) {
        const newImg = document.createElement("img");
        const src = thumbMeta.getAttribute("content") || "";
        newImg.setAttribute("src", src.startsWith("//") ? `https:${src}` : src);
        newImg.setAttribute("alt", "");
        cells.push([newImg]);
      }
    }
    const contentCell = [];
    const textContainer = element.querySelector('.ghpg-video-text-container, [class*="video-text"]');
    if (textContainer) {
      const eyebrow = textContainer.querySelector("h2, .ghpg-title");
      if (eyebrow) contentCell.push(eyebrow);
      const heading = textContainer.querySelector("h3, .ghpg-subtitle");
      if (heading) contentCell.push(heading);
      const desc = textContainer.querySelector("span, p");
      if (desc && desc.textContent.trim()) contentCell.push(desc);
      const links = textContainer.querySelectorAll('a.dds__link, a[class*="link"], a[href]');
      links.forEach((link) => contentCell.push(link));
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-story", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-support.js
  function parse5(element, { document }) {
    const items = element.querySelectorAll(".ghpg-support-items > div");
    const cells = [];
    items.forEach((item) => {
      const link = item.querySelector("a");
      if (!link) return;
      const svg = item.querySelector("svg");
      const iconCell = [];
      if (svg) {
        const useEl = svg.querySelector("use");
        const iconName = useEl ? (useEl.getAttribute("href") || "").replace("#dds__", "") : "";
        const iconText = document.createElement("p");
        iconText.textContent = iconName || "icon";
        iconCell.push(iconText);
      }
      const contentCell = [];
      const label = item.querySelector("p");
      if (label) {
        const heading = document.createElement("p");
        const anchor = document.createElement("a");
        anchor.setAttribute("href", link.getAttribute("href") || "");
        anchor.textContent = label.textContent.trim();
        heading.appendChild(anchor);
        contentCell.push(heading);
      }
      if (contentCell.length > 0) {
        cells.push([
          iconCell.length > 0 ? iconCell : "",
          contentCell
        ]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-support", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-account.js
  function parse6(element, { document }) {
    const cells = [];
    const col1 = [];
    const textContainer = element.querySelector(".ghpg-login-text-container, .ghpg-login-static-container");
    if (textContainer) {
      const heading = textContainer.querySelector("h3, .ghpg-subtitle");
      if (heading) col1.push(heading);
      const desc = textContainer.querySelector("span");
      if (desc && desc.textContent.trim()) col1.push(desc);
      const buttons = textContainer.querySelectorAll(".ghpg-homelogin-button a, a.dds__button");
      buttons.forEach((btn) => col1.push(btn));
      const featureItems = textContainer.querySelectorAll(".ghpg-login-items-container");
      featureItems.forEach((item) => {
        const itemText = item.querySelector("p");
        if (itemText) {
          const p = document.createElement("p");
          p.textContent = itemText.textContent.trim();
          col1.push(p);
        }
      });
    }
    const col2 = [];
    const img = element.querySelector(".ghpg-login-image img, .ghpg-home-login-container-row img, picture img");
    if (img) {
      const newImg = document.createElement("img");
      const src = img.getAttribute("src") || img.getAttribute("hp-lazy-src") || "";
      newImg.setAttribute("src", src.startsWith("//") ? `https:${src}` : src);
      newImg.setAttribute("alt", img.getAttribute("alt") || "");
      col2.push(newImg);
    }
    if (col1.length > 0 || col2.length > 0) {
      cells.push([
        col1.length > 0 ? col1 : "",
        col2.length > 0 ? col2 : ""
      ]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-account", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse7(element, { document }) {
    const cells = [];
    const col1 = [];
    const img = element.querySelector(".ghpg-ps-image img, .ghpg-premier-image, picture img");
    if (img) {
      const newImg = document.createElement("img");
      const src = img.getAttribute("src") || img.getAttribute("hp-lazy-src") || "";
      newImg.setAttribute("src", src.startsWith("//") ? `https:${src}` : src);
      newImg.setAttribute("alt", img.getAttribute("alt") || "");
      col1.push(newImg);
    }
    const col2 = [];
    const textContainer = element.querySelector(".ghpg-ps-text-container, .ghpg-ps-static-container");
    if (textContainer) {
      const heading = textContainer.querySelector("h3, .ghpg-subtitle");
      if (heading) col2.push(heading);
      const desc = textContainer.querySelector("span");
      if (desc && desc.textContent.trim()) col2.push(desc);
      const links = textContainer.querySelectorAll(".ghpg-premier-button a, a[href]");
      links.forEach((link) => col2.push(link));
      const featureItems = textContainer.querySelectorAll('.ghpg-premier-items-container, [class*="premier-item"]');
      featureItems.forEach((item) => {
        const itemText = item.querySelector("p");
        if (itemText) {
          const p = document.createElement("p");
          p.textContent = itemText.textContent.trim();
          col2.push(p);
        }
      });
    }
    if (col1.length > 0 || col2.length > 0) {
      cells.push([
        col1.length > 0 ? col1 : "",
        col2.length > 0 ? col2 : ""
      ]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse8(element, { document }) {
    const items = element.querySelectorAll(".ghpg-whatshpg-item");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".ghpg-whatshpg-item-img img, figure img");
      const imageCell = [];
      if (img) {
        const newImg = document.createElement("img");
        const src = img.getAttribute("src") || img.getAttribute("hp-lazy-src") || "";
        newImg.setAttribute("src", src.startsWith("//") ? `https:${src}` : src);
        newImg.setAttribute("alt", img.getAttribute("alt") || "");
        imageCell.push(newImg);
      }
      const contentCell = [];
      const titleLink = item.querySelector(".ghpg-whatshpg-img-title a, h4 a");
      if (titleLink) {
        const heading = document.createElement("p");
        const anchor = document.createElement("a");
        anchor.setAttribute("href", titleLink.getAttribute("href") || "");
        anchor.textContent = titleLink.textContent.trim();
        heading.appendChild(anchor);
        contentCell.push(heading);
      }
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([
          imageCell.length > 0 ? imageCell : "",
          contentCell.length > 0 ? contentCell : ""
        ]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-rewards.js
  function parse9(element, { document }) {
    const cells = [];
    const col1 = [];
    const textContainer = element.querySelector(".ghpg_content_structure, .ghpg-pl-module-main");
    if (textContainer) {
      const eyebrow = textContainer.querySelector("h2, .ghpg-title");
      if (eyebrow) col1.push(eyebrow);
      const heading = textContainer.querySelector("h3, .ghpg-subtitle");
      if (heading) col1.push(heading);
      const desc = textContainer.querySelector('span.dds__body-2, span[class*="body"]');
      if (desc && desc.textContent.trim()) col1.push(desc);
      const primaryCta = textContainer.querySelector(".ghpg-pl-button a.dds__button, a.dds__button--primary");
      if (primaryCta) col1.push(primaryCta);
      const secondaryCta = textContainer.querySelector("a.ghpg-pl-link, .ghpg-pl-button a:not(.dds__button)");
      if (secondaryCta) col1.push(secondaryCta);
    }
    const col2 = [];
    const img = element.querySelector(".ghpg-pl-image-aspect-ratio img, figure img, picture img");
    if (img) {
      const newImg = document.createElement("img");
      const src = img.getAttribute("src") || img.getAttribute("hp-lazy-src") || "";
      newImg.setAttribute("src", src.startsWith("//") ? `https:${src}` : src);
      newImg.setAttribute("alt", img.getAttribute("alt") || "");
      col2.push(newImg);
    }
    if (col1.length > 0 || col2.length > 0) {
      cells.push([
        col1.length > 0 ? col1 : "",
        col2.length > 0 ? col2 : ""
      ]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-rewards", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/dell-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        '[class*="cookie"]',
        "#drift-widget",
        ".chat-widget",
        '[id*="CybotCookiebot"]',
        "script",
        "style",
        "noscript"
      ]);
      const clonedItems = element.querySelectorAll(".owl-item.cloned");
      clonedItems.forEach((item) => item.remove());
      element.querySelectorAll("img[hp-lazy-src]").forEach((img) => {
        const lazySrc = img.getAttribute("hp-lazy-src");
        if (lazySrc) {
          img.setAttribute("src", lazySrc.startsWith("//") ? `https:${lazySrc}` : lazySrc);
        }
      });
      element.querySelectorAll("[hp-lazy-srcset]").forEach((el) => {
        const lazySrcset = el.getAttribute("hp-lazy-srcset");
        if (lazySrcset) {
          el.setAttribute("srcset", lazySrcset.startsWith("//") ? `https:${lazySrcset}` : lazySrcset);
        }
      });
      element.querySelectorAll('source[srcset^="//"]').forEach((source) => {
        source.setAttribute("srcset", `https:${source.getAttribute("srcset")}`);
      });
      element.querySelectorAll('img[src^="//"]').forEach((img) => {
        img.setAttribute("src", `https:${img.getAttribute("src")}`);
      });
      element.querySelectorAll("[hp-lazy-style]").forEach((el) => {
        const style = el.getAttribute("hp-lazy-style");
        if (style) {
          el.setAttribute("style", style);
        }
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        'nav:not([aria-label="Find the right product for you"])',
        ".breadcrumb",
        "aside",
        "iframe",
        "link",
        ".hmp-visually-hidden"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".owl-nav",
        ".owl-dots"
      ]);
      WebImporter.DOMUtils.remove(element, [
        'svg[style*="display: none"]',
        'svg[style*="display:none"]'
      ]);
      element.querySelectorAll("[data-metrics]").forEach((el) => {
        el.removeAttribute("data-metrics");
      });
      element.querySelectorAll("[data-track]").forEach((el) => {
        el.removeAttribute("data-track");
      });
    }
  }

  // tools/importer/transformers/dell-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const template = payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectorList) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "cards-wayfinding": parse2,
    "carousel-products": parse3,
    "hero-story": parse4,
    "cards-support": parse5,
    "columns-account": parse6,
    "columns-promo": parse7,
    "cards-news": parse8,
    "columns-rewards": parse9
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Dell US homepage with hero banners, product categories, promotions, and featured content",
    urls: [
      "https://www.dell.com/en-us"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".hpg-hero-section-container"]
      },
      {
        name: "cards-wayfinding",
        instances: ["#ghpg-productway-section"]
      },
      {
        name: "carousel-products",
        instances: ["#ghpg-promo-section"]
      },
      {
        name: "hero-story",
        instances: [".ghpg-video-section"]
      },
      {
        name: "cards-support",
        instances: [".ghpg-support-background:nth-child(7)"]
      },
      {
        name: "columns-account",
        instances: [".ghpg-support-background:nth-child(8)"]
      },
      {
        name: "columns-promo",
        instances: [".ghpg-support-background:nth-child(9)"]
      },
      {
        name: "cards-news",
        instances: [".ghpg-whatshpg-section"]
      },
      {
        name: "columns-rewards",
        instances: [".ghpg-pl-module"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner Carousel",
        selector: ".hpg-hero-section-container",
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Product Wayfinding",
        selector: "#ghpg-productway-section",
        style: "dark",
        blocks: ["cards-wayfinding"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Featured Products",
        selector: "#ghpg-promo-section",
        style: "dark-accent",
        blocks: ["carousel-products"],
        defaultContent: ["#ghpg-promo-section > div:first-child"]
      },
      {
        id: "section-4",
        name: "Customer Story Video",
        selector: ".ghpg-video-section",
        style: null,
        blocks: ["hero-story"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Dell Support",
        selector: ".ghpg-support-background:nth-child(7)",
        style: "navy",
        blocks: ["cards-support"],
        defaultContent: [".ghpg-support-background:nth-child(7) > div > div:first-child"]
      },
      {
        id: "section-6",
        name: "My Account",
        selector: ".ghpg-support-background:nth-child(8)",
        style: "navy",
        blocks: ["columns-account"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Dell Premier",
        selector: ".ghpg-support-background:nth-child(9)",
        style: "navy",
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Whats Happening",
        selector: ".ghpg-whatshpg-section",
        style: "deep-navy",
        blocks: ["cards-news"],
        defaultContent: [".ghpg-whatshpg-section > div > div:first-child", ".ghpg-whatshpg-section > div > div:last-child"]
      },
      {
        id: "section-9",
        name: "Dell Rewards",
        selector: ".ghpg-pl-module",
        style: "deep-navy",
        blocks: ["columns-rewards"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
