const mobileMenu = document.querySelector('#mobile-menu');
const menuButton = document.querySelector('[popovertarget="mobile-menu"]');

if (mobileMenu && menuButton) {
  const hasPopover = Object.hasOwn(HTMLElement.prototype, 'popover');

  if (!hasPopover) {
    mobileMenu.hidden = true;
    menuButton.removeAttribute('popovertarget');
    menuButton.setAttribute('aria-expanded', 'false');
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
  }

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (hasPopover && mobileMenu.matches(':popover-open')) mobileMenu.hidePopover();
      if (!hasPopover) {
        mobileMenu.hidden = true;
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

// En Microsoft Edge, con la ficha de Edge Add-ons publicada, los botones de
// instalación y la política de privacidad pasan a los de Edge (assets/stores.mjs).
// Solo se carga el módulo en Edge: el resto de navegadores no hace nada más.
if (typeof navigator !== 'undefined' && /\bEdg\//.test(navigator.userAgent ?? '')) {
  import('/assets/stores.mjs')
    .then((stores) => { if (stores.edgeStoreActive()) stores.applyEdgeStore(document); })
    .catch(() => undefined);
}
