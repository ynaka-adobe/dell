export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-support-card-image';
      else div.className = 'cards-support-card-body';
    });
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);

  ul.querySelectorAll('li').forEach((li) => {
    const firstCol = li.querySelector(':scope > div:first-child');
    const link = li.querySelector('a[href]');
    const linkText = link?.textContent?.trim().toLowerCase() || '';
    const isPlaceholderIcon = /^(icon|home|gear|assistance|warranty|headset)$/i.test(firstCol?.textContent?.trim());
    const hasSupportLink = /support\s+home|drivers\s+and\s+downloads|order\s+support|warranty\s+and\s+contracts|parts\s+and\s+upgrade/i.test(linkText);
    if (firstCol && link && isPlaceholderIcon && hasSupportLink) {
      firstCol.textContent = '';
    }
  });
}
