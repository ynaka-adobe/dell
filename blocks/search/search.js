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
  btn.innerHTML = '<svg class="icon icon-search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/></svg>';

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
