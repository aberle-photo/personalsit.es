// @ts-check

const toggleTheme = (e) => {
  document.documentElement.toggleAttribute('dark');
};
const toggleActiveTray = (e) => {
  const items = [...document.querySelectorAll('.item')];
  const parentContainer = e.target.closest('.items');
  const parentItem = e.target.closest('.item');
  const containerStyle = window.getComputedStyle(parentContainer);
  const isActive = parentItem.classList.contains('item--active');
  const tray = parentItem.querySelector('.item-tray');

  items.forEach((item) => item.classList.remove('item--active'));
  isActive
    ? parentItem.classList.remove('item--active')
    : parentItem.classList.add('item--active');
  tray.style.width = `calc(${containerStyle.width} - (2 * ${containerStyle.paddingLeft}))`;
};

const lazyLoader = new IntersectionObserver((entries, observer) => {
  entries.forEach(({ isIntersecting, target: image }) => {
    if (isIntersecting) {
      image.src = image.dataset.src;
      lazyLoader.unobserve(image);
    }
  });
});
const headerToggle = new IntersectionObserver((entries) => {
  entries.forEach(({ isIntersecting }) => {
    const fixedNav = document.querySelector('.fixed-nav');
    if (!isIntersecting) {
      fixedNav.classList.add('fixed-nav--active');
    } else {
      fixedNav.classList.remove('fixed-nav--active');
    }
  });
});
headerToggle.observe(document.querySelector('.site-head'));

const initTagFilter = () => {
  const filterSection = document.querySelector('.tag-filter');
  if (!filterSection) return;

  const pills = [...filterSection.querySelectorAll('.tag-filter__pill')];
  const items = [...document.querySelectorAll('.item')];

  const validTags = new Set(pills.map((pill) => pill.dataset.tag));

  const selected = new Set(
    new URLSearchParams(window.location.search)
      .get('tags')
      ?.split(',')
      .map((tag) => tag.trim())
      .filter((tag) => validTags.has(tag)) ?? []
  );

  const applyFilter = () => {
    items.forEach((item) => {
      const itemTags = new Set((item.dataset.tags || '').split(','));
      const isVisible =
        selected.size === 0 ||
        [...selected].some((tag) => itemTags.has(tag));
      item.hidden = !isVisible;
    });
    pills.forEach((pill) => {
      const isActive = selected.has(pill.dataset.tag);
      pill.setAttribute('aria-pressed', String(isActive));
    });
    const url = new URL(window.location.href);
    if (selected.size > 0) {
      url.searchParams.set('tags', [...selected].sort().join(','));
    } else {
      url.searchParams.delete('tags');
    }
    window.history.replaceState(null, '', url);
  };

  pills.forEach((pill) =>
    pill.addEventListener('click', () => {
      const tag = pill.dataset.tag;
      if (selected.has(tag)) {
        selected.delete(tag);
      } else {
        selected.add(tag);
      }
      applyFilter();
    })
  );

  applyFilter();
};

document.addEventListener('DOMContentLoaded', () => {
  [
    ...document.querySelectorAll('.item__image, .item-tray__image'),
  ].forEach((img) => lazyLoader.observe(img));
});
document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
[...document.querySelectorAll('.item__toggle')].forEach((button) =>
  button.addEventListener('click', toggleActiveTray)
);
initTagFilter();

console.log(` ▄▄▄       ▄████▄   ▄▄▄       ▄▄▄▄   
▒████▄    ▒██▀ ▀█  ▒████▄    ▓█████▄ 
▒██  ▀█▄  ▒▓█    ▄ ▒██  ▀█▄  ▒██▒ ▄██
░██▄▄▄▄██ ▒▓▓▄ ▄██▒░██▄▄▄▄██ ▒██░█▀  
 ▓█   ▓██▒▒ ▓███▀ ░ ▓█   ▓██▒░▓█  ▀█▓
 ▒▒   ▓▒█░░ ░▒ ▒  ░ ▒▒   ▓▒█░░▒▓███▀▒
  ▒   ▒▒ ░  ░  ▒     ▒   ▒▒ ░▒░▒   ░ 
  ░   ▒   ░          ░   ▒    ░    ░ 
      ░  ░░ ░            ░  ░ ░      
          ░                        ░ `);
