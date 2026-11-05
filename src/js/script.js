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
   * Animated mockups (floating circles, rank chart, chat, About illustration)
   * and .reveal groups start when script.js adds .is-visible to their panel.
   * Mockup panels (the card, feature or CTA that crops the circles) start
   * when half in view, so the whole scene is on screen. Reveal groups start
   * as soon as their top is 10% up the screen: content is never left hidden
   * below the fold on load, and tall groups on phones still start. Rank
   * charts, trajectories, chats and reveal groups are armed (hidden) only
   * here, so without JS they show. Each reveal child gets an index (--i) for
   * its stagger.
   */
  const panels = new Set(
    [
      ...document.querySelectorAll(
        '.decor, .trajectory__sun, .rank, .chat, .reveal',
      ),
    ].map((el) =>
      el.matches('.reveal')
        ? el
        : el.closest('.card, .feature, .cta') || el.parentElement,
    ),
  );

  if (panels.size && 'IntersectionObserver' in window) {
    document
      .querySelectorAll('.rank, .trajectory, .chat, .reveal')
      .forEach((el) => el.classList.add('is-armed'));
    document.querySelectorAll('.reveal').forEach((group) => {
      [...group.children]
        .filter((el) => !el.matches('.decor'))
        .forEach((el, i) => el.style.setProperty('--i', i));
    });

    const watch = (options) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, options);
      return observer;
    };
    const mockups = watch({ threshold: 0.5 });
    const reveals = watch({ rootMargin: '0px 0px -10% 0px' });
    panels.forEach((panel) =>
      (panel.matches('.reveal') ? reveals : mockups).observe(panel),
    );
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
  // Mirror --motion-ease-out and --motion-ease-pop (variables.css)
  const easing = 'cubic-bezier(0.2, 0.7, 0.3, 1)';
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
   * Hero lead inbox: after the headline and logo hit (4.1s, see the timing
   * map in variables.css), a new lead arrives at the top every 6s, the others
   * slide down, the oldest drops off, and the new lead's status moves from new, to drafted, to its
   * outcome. Booked leads also show in the toast on the hero photo, which
   * stays hidden until the first lead is booked.
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

    // Hidden until the first booking (without JS or with reduced motion it
    // just shows)
    const toast = document.querySelector('.toast');
    toast?.classList.add('is-armed');

    liveFeed(inbox, 'live inbox', 4100, (later, toggle) => {
      inbox.querySelector('.inbox__period').replaceWith(toggle);

      // The "New lead booked" toast on the hero photo follows the inbox: the
      // first booking fades it in; after that, the old toast drops away and
      // the new one pops up.
      const showToast = (subject, source) => {
        if (!toast) return;
        const popIn = () => {
          toast.getAnimations().forEach((a) => a.cancel());
          toast.querySelector('.toast__title').textContent = 'New lead booked';
          toast.querySelector('.toast__meta').textContent =
            `${subject} · ${source.split(' · ')[1]}`;
          toast.classList.remove('is-armed');
          toast.animate(
            { opacity: [0, 1], transform: ['translateY(0.75rem)', 'none'] },
            { duration: 400, easing: pop },
          );
        };
        if (toast.classList.contains('is-armed')) {
          popIn();
          return;
        }
        toast.animate(
          { opacity: [1, 0], transform: ['none', 'translateY(0.5rem)'] },
          { duration: 200, easing, fill: 'forwards' },
        );
        later(300, popIn);
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
          // The toast shows the booking at the same moment as the chip
          if (outcome === 'Booked') showToast(subject, source);
        });
        later(6000, addLead);
      };

      addLead();
    });
  }

  /**
   * Estimate builder: once on screen, it builds one estimate from job notes,
   * then stops. The notes come in word by word, each line item appears with
   * its price counting up, the total adds up, the draft waits for review,
   * then "Review & send" is pressed and it's sent. When it's done, the Pause
   * button becomes Replay, which builds the next job's estimate. Always three
   * line items, and the notes box keeps its height, so the card never changes
   * size.
   */
  const estimate = document.querySelector('.estimate');

  if (estimate && canAnimate) {
    const notes = estimate.querySelector('.estimate__notes');
    const lines = [...estimate.querySelectorAll('.estimate__line')];
    const items = lines.slice(0, 3);
    const total = lines[3].querySelector('dd');
    const chip = estimate.querySelector('.chip');
    const send = estimate.querySelector('.estimate__send');
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

      // Shown in place of Pause once an estimate is sent
      const replay = document.createElement('button');
      replay.type = 'button';
      replay.className = 'live-toggle live-toggle--replay';
      replay.setAttribute('aria-label', 'Replay estimate builder');
      replay.innerHTML =
        '<svg class="icon icon--bold icon--round" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.6"></path><path d="M4 4v4.5h4.5"></path></svg>Replay';

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

        // Done: swap Pause for Replay (keeping focus on the control)
        later((at += 1000), () => {
          const hadFocus = document.activeElement === toggle;
          toggle.replaceWith(replay);
          if (hadFocus) replay.focus();
        });
      };

      replay.addEventListener('click', () => {
        replay.replaceWith(toggle);
        toggle.focus();
        build();
      });

      build();
    });
  }

  /**
   * Homepage search mockup: once its card is half in view (with the rank
   * chart behind it), the query types itself in, then the result rises in.
   * Plays once. Without JS or with reduced motion the finished search shows.
   */
  const serp = document.querySelector('.serp');

  if (serp && canAnimate && 'IntersectionObserver' in window) {
    const text = serp.querySelector('.serp__text');
    const query = text.textContent;
    text.textContent = '';
    serp.classList.add('is-armed', 'is-typing');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let typed = 0;
        const type = () => {
          typed += 1;
          text.textContent = query.slice(0, typed);
          if (typed < query.length) {
            setTimeout(type, 70);
            return;
          }
          // A short pause after the last letter, as if pressing Enter
          setTimeout(() => {
            serp.classList.remove('is-typing');
            serp.classList.add('is-visible');
          }, 350);
        };
        setTimeout(type, 300);
      },
      { threshold: 0.5 },
    );
    observer.observe(serp.closest('.card') || serp);
  }

  /**
   * Work page filters: toggle buttons (aria-pressed) that show one category.
   * Where the browser supports View Transitions (and reduced motion is off),
   * hidden cards fade out and the rest glide into their new places; each
   * card needs its own view-transition-name for that. Otherwise the cards
   * switch instantly.
   */
  const filters = document.querySelectorAll('[data-filter]');
  const projects = filters.length
    ? document.querySelectorAll('article[data-cat]')
    : [];

  projects.forEach((article, i) => {
    article.style.viewTransitionName = `project-${i}`;
  });

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filters.forEach((other) => {
        other.setAttribute('aria-pressed', String(other === button));
      });
      const apply = () =>
        projects.forEach((article) => {
          article.hidden = !(
            filter === 'all' || article.dataset.cat === filter
          );
        });
      if (document.startViewTransition && !reduceMotion.matches) {
        document.startViewTransition(apply);
      } else {
        apply();
      }
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
        // The Send button just disappeared: move focus to the confirmation so
        // keyboard and screen reader users land on it (and hear it)
        document.getElementById('sent-heading').focus();
      } catch {
        error.hidden = false;
      }
    });

    document.getElementById('send-another').addEventListener('click', () => {
      form.reset();
      sent.hidden = true;
      form.hidden = false;
      form.querySelector('input').focus();
    });
  }
});
