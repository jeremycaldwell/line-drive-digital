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
