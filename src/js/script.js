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
   * Animated mockups (floating circles, rank chart, chat, tool list, About
   * illustration) and .reveal groups: start their animation when their panel
   * is half in view, by adding .is-visible to the panel. The panel is
   * observed because the circles are cropped by it; tool lists and reveal
   * groups are their own panel, since their section can be too tall to ever
   * be half in view on phones. Chats, tool lists and reveal groups are armed
   * (hidden) only here, so without JS they show. Each animated child gets an
   * index (--i) for its stagger.
   */
  const panels = new Set(
    [
      ...document.querySelectorAll(
        '.decor, .trajectory__sun, .rank, .chat, .tool-list, .reveal',
      ),
    ].map((el) =>
      el.matches('.tool-list, .reveal')
        ? el
        : el.closest('.card, .feature, .cta') || el.parentElement,
    ),
  );

  if (panels.size && 'IntersectionObserver' in window) {
    document
      .querySelectorAll('.chat')
      .forEach((chat) => chat.classList.add('chat--armed'));
    document.querySelectorAll('.tool-list').forEach((list) => {
      list.classList.add('tool-list--armed');
      list
        .querySelectorAll('.tool-list__item, .chip')
        .forEach((el, i) => el.style.setProperty('--i', i));
    });
    document.querySelectorAll('.reveal').forEach((group) => {
      group.classList.add('reveal--armed');
      [...group.children]
        .filter((el) => !el.matches('.decor'))
        .forEach((el, i) => el.style.setProperty('--i', i));
    });
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
   * Live mockups (hero lead inbox, estimate builder). Each runs on its own
   * clock that only advances while it is on screen, its tab is in front,
   * reduced motion is off, and its Pause button has not been pressed, so
   * pausing freezes every pending step and Play resumes exactly where it
   * stopped. Steps move with transforms and opacity, and heights are held,
   * so the page never shifts. Without JS or with reduced motion, the static
   * sample shows and no Pause button appears.
   */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canAnimate = !reduceMotion.matches && 'animate' in Element.prototype;
  const easing = 'cubic-bezier(0.3, 0, 0.2, 1)';
  const pop = 'cubic-bezier(0.3, 1.6, 0.5, 1)';

  const liveFeed = (root, name, delay, start) => {
    const tick = 100;
    let clock = 0;
    let queue = [];
    let paused = false;
    let onScreen = false;
    const later = (wait, step) => queue.push({ at: clock + wait, step });

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'live-toggle';
    const render = () => {
      toggle.classList.toggle('is-paused', paused);
      toggle.textContent = paused ? 'Play' : 'Pause';
      toggle.setAttribute('aria-label', `${toggle.textContent} ${name}`);
    };
    toggle.addEventListener('click', () => {
      paused = !paused;
      render();
    });
    render();

    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    }).observe(root);

    later(delay, () => start(later, toggle));

    setInterval(() => {
      if (paused || !onScreen || document.hidden || reduceMotion.matches) {
        return;
      }
      clock += tick;
      const due = queue.filter((item) => item.at <= clock);
      queue = queue.filter((item) => item.at > clock);
      due.forEach((item) => item.step());
    }, tick);
  };

  const setChip = (chip, label, tone) => {
    const dot = document.createElement('span');
    dot.className = 'chip__dot';
    chip.className = tone ? `chip chip--${tone}` : 'chip';
    chip.replaceChildren(dot, label);
    chip.animate(
      { transform: ['scale(0.8)', 'none'], opacity: [0.4, 1] },
      { duration: 350, easing: pop },
    );
  };

  /**
   * Hero lead inbox: after the headline settles (about 1.55s, typography.css),
   * a new lead arrives at the top every 6s, the others slide down, the oldest
   * drops off, and the new lead's status moves from new, to drafted, to its
   * outcome. Booked leads also replace the toast on the hero photo.
   */
  const inbox = document.querySelector('.inbox');

  if (inbox && canAnimate) {
    const list = inbox.querySelector('.inbox__list');
    const template = list.querySelector('.inbox__row');
    const ages = ['Just now', '6 min ago', '22 min ago', '1 hr ago'];
    // Booked leads are AC / heat pump jobs, to match the technician in the
    // hero photo, since they also show in its toast
    const leads = [
      ['AC tune-up', 'Google search · Sutherlin', 'Booked', 'success'],
      ['Gutter cleaning', 'Quote form · Roseburg', 'Estimate sent', 'success'],
      ['Heat pump repair', 'After-hours chat · Winston', 'Booked', 'success'],
      [
        'Panel upgrade',
        'Google Maps call · Oakland',
        'Needs callback',
        'danger',
      ],
      [
        'AC unit not cooling',
        'Google search · Myrtle Creek',
        'Booked',
        'success',
      ],
      [
        'Mini-split install',
        'Quote form · Sutherlin',
        'Estimate sent',
        'success',
      ],
    ];
    let next = 0;

    liveFeed(inbox, 'live inbox', 2050, (later, toggle) => {
      inbox.querySelector('.inbox__period').replaceWith(toggle);

      // The "New lead booked" toast on the hero photo follows the inbox: when
      // a lead is booked, the old toast drops away and the new one pops up.
      const toast = document.querySelector('.toast');
      const showToast = (subject, source) => {
        if (!toast) return;
        toast.animate(
          { opacity: [1, 0], transform: ['none', 'translateY(0.5rem)'] },
          { duration: 200, easing, fill: 'forwards' },
        );
        later(300, () => {
          toast.getAnimations().forEach((a) => a.cancel());
          toast.querySelector('.toast__title').textContent = 'New lead booked';
          toast.querySelector('.toast__meta').textContent =
            `${subject} · ${source.split(' · ')[1]}`;
          toast.animate(
            { opacity: [0, 1], transform: ['translateY(0.75rem)', 'none'] },
            { duration: 400, easing: pop },
          );
        });
      };

      const addLead = () => {
        const [subject, source, outcome, tone] = leads[next % leads.length];
        next += 1;

        const row = template.cloneNode(true);
        row.querySelector('.inbox__subject').textContent = subject;
        row.querySelector('.inbox__source').textContent = source;
        const chip = row.querySelector('.chip');
        setChip(chip, 'New lead', '');

        const others = [...list.children];
        list.style.height = `${list.offsetHeight}px`;
        list.prepend(row);
        [...list.children].forEach((item, i) => {
          item.querySelector('.inbox__time').textContent = ages[i] || '';
        });

        const shift =
          row.offsetHeight + parseFloat(getComputedStyle(list).rowGap);
        others.forEach((item) =>
          item.animate(
            { transform: [`translateY(${-shift}px)`, 'none'] },
            { duration: 500, easing },
          ),
        );
        row.animate(
          { opacity: [0, 1], transform: ['translateY(-0.75rem)', 'none'] },
          { duration: 450, delay: 150, easing, fill: 'backwards' },
        );

        later(650, () => {
          [...list.children]
            .slice(ages.length)
            .forEach((item) => item.remove());
          list.style.height = '';
        });
        later(1600, () => setChip(chip, 'AI reply drafted', 'warning'));
        later(3400, () => {
          setChip(chip, outcome, tone);
          if (outcome === 'Booked') showToast(subject, source);
        });
        later(6000, addLead);
      };

      addLead();
    });
  }

  /**
   * Estimate builder: once on screen, it builds a new estimate from job notes
   * on a loop. The notes come in word by word, each line item appears with
   * its price counting up, the total adds up, the draft waits for review,
   * then "Review & send" is pressed and it's sent. Always three line items,
   * and the notes box keeps its height, so the card never changes size.
   */
  const estimate = document.querySelector('.estimate');

  if (estimate && canAnimate) {
    const notes = estimate.querySelector('.estimate__notes');
    const lines = [...estimate.querySelectorAll('.estimate__line')];
    const items = lines.slice(0, 3);
    const total = lines[3].querySelector('dd');
    const chip = estimate.querySelector('.chip');
    const send = estimate.querySelector('.button');
    const money = (n) => `$${Math.round(n).toLocaleString('en-US')}`;
    const jobs = [
      [
        'Job notes: AC not cooling, replace capacitor, recharge, clean coils.',
        [
          ['Capacitor replacement', 245],
          ['Refrigerant recharge (2 lb)', 320],
          ['Coil cleaning', 150],
        ],
      ],
      [
        'Job notes: roof valley leak, replace 12 shingles, reseal two vents.',
        [
          ['Valley flashing repair', 640],
          ['Shingle replacement (12)', 360],
          ['Vent boot reseal (2)', 180],
        ],
      ],
      [
        'Job notes: kitchen drain clogged, camera inspection, new P-trap.',
        [
          ['Drain clearing', 225],
          ['Camera inspection', 175],
          ['P-trap replacement', 95],
        ],
      ],
      [
        'Job notes: replace 50-gal water heater, haul away old unit, new expansion tank.',
        [
          ['50-gal water heater, installed', 1850],
          ['Expansion tank', 185],
          ['Haul-away & disposal', 125],
        ],
      ],
    ];
    let next = 0;

    // Count a price up over 0.5s in clock steps (so it pauses too)
    const countUp = (later, el, to, from = 0) => {
      for (let step = 1; step <= 5; step += 1) {
        later(step * 100, () => {
          el.textContent = money(from + ((to - from) * step) / 5);
        });
      }
    };

    liveFeed(estimate, 'estimate builder', 1500, (later, toggle) => {
      estimate.querySelector('.estimate__header').append(toggle);
      notes.style.minHeight = `${notes.offsetHeight}px`;

      const build = () => {
        const [text, rows] = jobs[next % jobs.length];
        next += 1;
        let at = 0;

        // Clear the last estimate
        [notes, ...items, lines[3]].forEach((el) =>
          el.animate(
            { opacity: [1, 0] },
            {
              duration: 250,
              fill: 'forwards',
            },
          ),
        );
        later((at += 300), () => {
          notes.getAnimations().forEach((a) => a.cancel());
          lines[3].getAnimations().forEach((a) => a.cancel());
          notes.textContent = '';
          total.textContent = money(0);
          setChip(chip, 'Writing estimate…', '');
        });

        // Notes come in word by word
        text.split(' ').forEach((word, i) => {
          later((at += 100), () => {
            notes.textContent += `${i ? ' ' : ''}${word}`;
          });
        });

        // Line items, one at a time, prices counting up
        let sum = 0;
        rows.forEach(([desc, price], i) => {
          later((at += 500), () => {
            const line = items[i];
            line.getAnimations().forEach((a) => a.cancel());
            line.querySelector('dt').textContent = desc;
            const dd = line.querySelector('dd');
            dd.textContent = money(0);
            line.animate(
              { opacity: [0, 1], transform: ['translateX(-0.5rem)', 'none'] },
              { duration: 350, easing },
            );
            countUp(later, dd, price);
            const before = sum;
            sum += price;
            countUp(later, total, sum, before);
          });
        });

        // Draft ready, then reviewed and sent
        later((at += 800), () =>
          setChip(chip, 'Draft — needs your review', 'warning'),
        );
        later((at += 2500), () => {
          send.animate(
            { transform: ['none', 'scale(0.92)', 'none'] },
            { duration: 300, easing },
          );
          setChip(chip, 'Sent to customer', 'success');
        });
        later((at += 3000), build);
      };

      build();
    });
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

    // Pre-select a "What do you need?" option from the link, e.g.
    // /contact/?need=free-audit ticks "Free audit" (value lowercased, spaces → -).
    const need = new URLSearchParams(window.location.search).get('need');
    form.querySelectorAll('input[name="needs"]').forEach((option) => {
      if (option.value.toLowerCase().replace(/\s+/g, '-') === need) {
        option.checked = true;
      }
    });

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
