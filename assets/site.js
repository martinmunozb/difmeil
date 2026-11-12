const mobileMenu = document.querySelector('#mobile-menu');
const menuButton = document.querySelector('[popovertarget="mobile-menu"]');

if (mobileMenu && menuButton) {
  const hasPopover = Object.hasOwn(HTMLElement.prototype, 'popover');

  if (!hasPopover) {
    mobileMenu.hidden = true;
    menuButton.removeAttribute('popovertarget');
    menuButton.addEventListener('click', () => {
      const willOpen = mobileMenu.hidden;
      mobileMenu.hidden = !willOpen;
      menuButton.setAttribute('aria-expanded', String(willOpen));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !mobileMenu.hidden) {
        mobileMenu.hidden = true;
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.focus();
      }
    });
  } else {
    mobileMenu.addEventListener('toggle', (event) => {
      menuButton.setAttribute('aria-expanded', String(event.newState === 'open'));
    });
  }

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (hasPopover && mobileMenu.matches(':popover-open')) mobileMenu.hidePopover();
      if (!hasPopover) mobileMenu.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});
