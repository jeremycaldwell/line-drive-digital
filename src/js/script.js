window.addEventListener('DOMContentLoaded', () => {
  /**
   * Mobile menu. Without JS the toggle stays hidden and the nav stays visible.
   */
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');

  if (header && menuToggle) {
    const setOpen = (open) => {
      menuToggle.setAttribute('aria-expanded', String(open));
      header.classList.toggle('header--open', open);
    };

    header.classList.add('header--collapsible');
    menuToggle.hidden = false;
    menuToggle.addEventListener('click', () => {
      setOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && header.classList.contains('header--open')) {
        setOpen(false);
        menuToggle.focus();
      }
    });
  }

  /**
   * Decorative dots (floating circles, shot ball, About illustration): start
   * their animation when their panel is half in view, by adding .is-visible
   * to the panel. The panel is observed because the circles are cropped by it.
   */
  const panels = new Set(
    [...document.querySelectorAll('.decor, .trajectory__sun')].map(
      (dot) => dot.closest('.card, .feature, .cta') || dot.parentElement,
    ),
  );

  if (panels.size && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 },
    );
    panels.forEach((panel) => observer.observe(panel));
  }

  /**
   * Work page filters.
   */
  const filters = document.querySelectorAll('[data-filter]');

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filters.forEach((other) => {
        other.setAttribute(
          'aria-selected',
          other === button ? 'true' : 'false',
        );
      });
      document.querySelectorAll('article[data-cat]').forEach((article) => {
        article.hidden = !(filter === 'all' || article.dataset.cat === filter);
      });
    });
  });

  /**
   * Contact form (Netlify Forms). Posts in the background and shows the
   * thank-you message; without JS the form posts normally to Netlify.
   */
  const form = document.getElementById('contact-form');

  if (form) {
    const sent = document.getElementById('sent');
    const error = document.getElementById('form-error');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      error.hidden = true;
      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString(),
        });
        if (!response.ok) throw new Error(response.statusText);
        form.hidden = true;
        sent.hidden = false;
      } catch {
        error.hidden = false;
      }
    });

    document.getElementById('send-another').addEventListener('click', () => {
      form.reset();
      sent.hidden = true;
      form.hidden = false;
    });
  }
});
