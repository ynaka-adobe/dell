export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cards-wayfinding-container';

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Find the right product for you');

  const ul = document.createElement('ul');
  ul.className = 'cards-wayfinding-list';
  ul.setAttribute('role', 'none');

  [...block.children].forEach((row, index) => {
    const imageCol = row.querySelector('div:first-child');
    const bodyCol = row.querySelector('div:last-child');
    const link = bodyCol?.querySelector('a[href]');
    const img = imageCol?.querySelector('img') || imageCol?.querySelector('picture img');
    if (!link) return;

    const li = document.createElement('li');
    li.className = 'cards-wayfinding-item';

    const itemWrapper = document.createElement('div');
    itemWrapper.className = 'cards-wayfinding-mobile';
    itemWrapper.setAttribute('role', 'none');
    itemWrapper.dataset.tierId = String(index);

    const href = link.getAttribute('href') || '#';
    const labelText = link.textContent.trim();
    const cardLink = document.createElement('a');
    cardLink.href = href;
    cardLink.className = 'cards-wayfinding-link';
    cardLink.setAttribute('aria-label', `${labelText} ${index + 1} of ${block.children.length}`);

    const figure = document.createElement('figure');
    figure.className = 'cards-wayfinding-img';
    const newImg = document.createElement('img');
    newImg.width = 480;
    newImg.height = 360;
    newImg.alt = img?.getAttribute('alt') || labelText;
    newImg.src = img?.getAttribute('src') || img?.currentSrc || '';
    if (newImg.src.startsWith('//')) newImg.src = `https:${newImg.src}`;
    figure.append(newImg);
    cardLink.append(figure);

    const categoryOverlay = document.createElement('div');
    categoryOverlay.className = 'cards-wayfinding-category';
    categoryOverlay.id = `menu-heading-${index}`;
    categoryOverlay.textContent = labelText;
    cardLink.append(categoryOverlay);

    itemWrapper.append(cardLink);
    li.append(itemWrapper);
    ul.append(li);
  });

  nav.append(ul);
  wrapper.append(nav);
  block.textContent = '';
  block.append(wrapper);
}
