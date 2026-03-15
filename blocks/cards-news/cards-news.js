function createArrowIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'dds__icon');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('viewBox', '0 0 24 24');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', '#dds__icon--arrow-right');
  svg.appendChild(use);
  return svg;
}

function ensureArrowSprite() {
  if (document.getElementById('dds__icon--arrow-right')) return;
  const sprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  sprite.setAttribute('aria-hidden', 'true');
  sprite.style.cssText = 'position:absolute;width:0;height:0';
  const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
  symbol.setAttribute('id', 'dds__icon--arrow-right');
  symbol.setAttribute('viewBox', '0 0 24 24');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z');
  path.setAttribute('fill', 'currentColor');
  symbol.appendChild(path);
  sprite.appendChild(symbol);
  document.body.prepend(sprite);
}

export default function decorate(block) {
  ensureArrowSprite();
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-news-card-image';
      else div.className = 'cards-news-card-body';
    });
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);

  block.querySelectorAll('.cards-news-card-body a').forEach((a) => {
    if (!a.querySelector('.dds__icon')) {
      a.appendChild(createArrowIcon());
    }
  });
}
