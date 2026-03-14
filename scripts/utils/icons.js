import { getConfig } from '../ak.js';

const { codeBase } = getConfig();
const svgCache = {};

async function fetchSvg(name) {
  if (!svgCache[name]) {
    svgCache[name] = fetch(`${codeBase}/img/icons/${name}.svg`)
      .then((resp) => (resp.ok ? resp.text() : ''))
      .catch(() => '');
  }
  return svgCache[name];
}

export default function loadIcons(icons) {
  for (const icon of icons) {
    const name = icon.classList[1].substring(5);
    fetchSvg(name).then((svgText) => {
      if (!svgText) return;
      const temp = document.createElement('div');
      temp.innerHTML = svgText;
      const svg = temp.querySelector('svg');
      if (!svg) return;
      svg.setAttribute('class', icon.getAttribute('class'));
      icon.insertAdjacentElement('afterend', svg);
      icon.remove();
    });
  }
}
