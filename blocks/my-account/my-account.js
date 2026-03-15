const EASY_ORDERING_ICON = '<svg class="my-account-easy-ordering-icon" style="height:32px;width:32px" fill="#FFFFFF" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
const ORDER_TRACKING_ICON = '<svg class="my-account-order-tracking-icon" style="height:32px;width:32px" fill="#FFFFFF" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>';
const DELL_REWARDS_ICON = '<svg class="my-account-dell-rewards-icon" style="height:32px;width:32px" fill="#FFFFFF" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>';

const FEATURE_ICONS = [
  { match: 'easy ordering', icon: EASY_ORDERING_ICON },
  { match: 'order tracking', icon: ORDER_TRACKING_ICON },
  { match: 'dell rewards', icon: DELL_REWARDS_ICON },
];

/**
 * My Account block - content + image layout
 * Column 1: content (ghpg-login-static-container)
 * Column 2: image (ghpg-login-image)
 */
export default function decorate(block) {
  const row = block.querySelector(':scope > div:first-child');
  if (!row) return;

  const cols = [...row.children];
  if (cols.length < 2) return;

  const contentCol = cols[0];
  const imageCol = cols[1];

  contentCol.classList.add('my-account-content', 'ghpg-login-static-container');
  imageCol.classList.add('my-account-image', 'ghpg-login-image');

  const firstLink = block.querySelector('a[href]');
  if (firstLink) firstLink.classList.add('my-account-first-link');

  // Add icons on top of feature items (Easy Ordering, Order Tracking, Dell Rewards)
  addFeatureIcons(contentCol, 'my-account-feature-icon', 'my-account-features-row', 'my-account-feature-item', FEATURE_ICONS);

  // Wrap sibling feature items in a row for horizontal layout
  wrapSiblingFeatureItems(contentCol, 'my-account-feature-icon', 'my-account-features-row', 'my-account-feature-item');
}

function addFeatureIcons(container, iconClass, rowClass, itemClass, icons) {
  const allElements = container.querySelectorAll('ul li, p, div, span');
  for (const el of allElements) {
    const text = el.textContent.trim().toLowerCase();
    const fullText = el.textContent.trim();

    // Check if element contains multiple feature items (e.g. "Easy Ordering Order Tracking Dell Rewards")
    const items = splitFeatureItems(fullText);
    if (items.length > 1) {
      // Replace content with individual items + icons
      el.innerHTML = '';
      el.classList.add(rowClass);
      items.forEach((itemText) => {
        const match = icons.find(({ match }) =>
          itemText.toLowerCase().trim() === match || itemText.toLowerCase().trim().includes(match));
        if (match) {
          const itemEl = document.createElement('div');
          itemEl.className = itemClass;
          const iconEl = document.createElement('div');
          iconEl.className = iconClass;
          iconEl.innerHTML = match.icon;
          itemEl.appendChild(iconEl);
          itemEl.appendChild(document.createTextNode(itemText.trim()));
          el.appendChild(itemEl);
        }
      });
      break;
    }

    // Single item - add icon directly (exact match only for dell rewards to avoid matching description text)
    for (const { match, icon } of icons) {
      const isExactMatch = text === match;
      const isIncludeMatch = text.includes(match) && match !== 'dell rewards';
      if ((isExactMatch || isIncludeMatch) && !el.querySelector(`.${iconClass}`)) {
        const iconEl = document.createElement('div');
        iconEl.className = iconClass;
        iconEl.innerHTML = icon;
        el.prepend(iconEl);
        break;
      }
    }
  }
}

function splitFeatureItems(text) {
  const items = ['Easy Ordering', 'Order Tracking', 'Dell Rewards'];
  const found = [];
  let remaining = text;
  items.forEach((item) => {
    const idx = remaining.toLowerCase().indexOf(item.toLowerCase());
    if (idx >= 0) {
      found.push(item);
      remaining = remaining.slice(idx + item.length);
    }
  });
  return found.length > 1 ? found : [];
}

function wrapSiblingFeatureItems(container, iconClass, rowClass, itemClass) {
  const withIcons = [...container.querySelectorAll(`.${iconClass}`)].map((icon) => icon.closest('li, p, div'));
  const byParent = new Map();
  withIcons.forEach((el) => {
    if (el && !el.classList.contains(rowClass)) {
      const parent = el.parentElement;
      if (parent && !parent.classList.contains(rowClass)) {
        const siblings = byParent.get(parent) || [];
        if (!siblings.includes(el)) siblings.push(el);
        byParent.set(parent, siblings);
      }
    }
  });
  byParent.forEach((siblings, parent) => {
    if (siblings.length > 1) {
      siblings.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      const wrapper = document.createElement('div');
      wrapper.className = rowClass;
      parent.insertBefore(wrapper, siblings[0]);
      siblings.forEach((el) => {
        const item = document.createElement('div');
        item.className = itemClass;
        item.innerHTML = el.innerHTML;
        wrapper.appendChild(item);
        el.remove();
      });
    }
  });
}
