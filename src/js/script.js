window.addEventListener('DOMContentLoaded', () => {
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
   * Contact form.
   * Demo behaviour only: wire the form to a form handler (e.g. Netlify Forms,
   * Formspree) before launch.
   */
  const form = document.getElementById('contact-form');

  if (form) {
    const sent = document.getElementById('sent');
    const needs = document.querySelectorAll('[data-need]');

    needs.forEach((button) => {
      button.addEventListener('click', () => {
        const pressed = button.getAttribute('aria-pressed') === 'true';
        button.setAttribute('aria-pressed', pressed ? 'false' : 'true');
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.hidden = true;
      sent.hidden = false;
    });

    document.getElementById('send-another').addEventListener('click', () => {
      form.reset();
      needs.forEach((button) => button.setAttribute('aria-pressed', 'false'));
      sent.hidden = true;
      form.hidden = false;
    });
  }
});
