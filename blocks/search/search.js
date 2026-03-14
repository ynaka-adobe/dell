export default function decorate(block) {
  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'search-form';
  wrapper.setAttribute('role', 'search');

  const input = document.createElement('input');
  input.type = 'search';
  input.className = 'search-input';
  input.placeholder = 'Search Dell';
  input.setAttribute('aria-label', 'Search Dell');
  input.autocomplete = 'off';

  const btn = document.createElement('button');
  btn.className = 'search-btn';
  btn.setAttribute('aria-label', 'Search Dell');
  btn.innerHTML = '<svg class="icon icon-search"><use href="/img/icons/search.svg#search"></use></svg>';

  btn.addEventListener('click', () => {
    const query = input.value.trim();
    if (query) {
      window.location.href = `https://www.dell.com/en-us/search/${encodeURIComponent(query)}`;
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      btn.click();
    }
  });

  wrapper.append(input, btn);
  block.append(wrapper);
}
