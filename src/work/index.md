---
layout: layout.html
title: Work
description: "Websites and AI tools built for local businesses in Southern Oregon."
eleventyNavigation:
  key: Work
  order: 2
---

<section class="section section--intro">
  <div class="container">
    <div class="intro">
      <div>
        <p class="eyebrow intro__eyebrow">Our work</p>
        <h1 class="heading heading--xl">Built for the businesses down the road.</h1>
      </div>
      <p class="lead">
        Websites that rank in their towns, and the tools that help the people behind them get home on time.
      </p>
    </div>
    <div class="cluster cluster--spaced" role="tablist" aria-label="Filter projects">
      <button
        role="tab"
        type="button"
        class="button button--secondary button--small button--toggle"
        data-filter="all"
        aria-selected="true"
      >
        All work
      </button>
      <button
        role="tab"
        type="button"
        class="button button--secondary button--small button--toggle"
        data-filter="web"
        aria-selected="false"
      >
        Websites
      </button>
      <button
        role="tab"
        type="button"
        class="button button--secondary button--small button--toggle"
        data-filter="ai"
        aria-selected="false"
      >
        AI tools &amp; apps
      </button>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="grid grid--2 grid--rows-40">
      <article class="stack" data-cat="web">
        {% image "images/work/vance-fabrication.jpg", "Vance Fabrication LLC general construction services page", { class: "screenshot" } %}
        <p class="eyebrow eyebrow--muted">SEO website · Kettle Falls, WA</p>
        <h2 class="heading heading--md">Vance Fabrication LLC</h2>
        <p class="text text--muted">
          Service pages for a welding, fencing and construction company in Eastern Washington.
        </p>
        <div>
          <span class="chip chip--success chip--on-light">
            <span class="chip__dot"></span>
            [RESULT]
          </span>
        </div>
      </article>
      <article class="stack" data-cat="web">
        {% image "images/work/mg-creative-concrete.jpg", "M&amp;G Creative Concrete website services page", { class: "screenshot" } %}
        <p class="eyebrow eyebrow--muted">Site rebuild + Google Business Profile</p>
        <h2 class="heading heading--md">M&amp;G Creative Concrete</h2>
        <p class="text text--muted">Service pages and project galleries for a concrete contractor in Eastern Washington.</p>
        <div>
          <span class="chip chip--success chip--on-light">
            <span class="chip__dot"></span>
            [RESULT]
          </span>
        </div>
      </article>
      <article class="stack" data-cat="ai">
        {% image "images/work/business-finance-tracker.jpg", "Business Finance Tracker app dashboard", { class: "screenshot" } %}
        <p class="eyebrow eyebrow--muted">Custom finance dashboard</p>
        <h2 class="heading heading--md">Business Finance Tracker</h2>
        <p class="text text--muted">
          Clients, invoicing, timesheets and projections in one place.
        </p>
        <div>
          <span class="chip chip--success chip--on-light">
            <span class="chip__dot"></span>
            [RESULT]
          </span>
        </div>
      </article>
      <article class="stack" data-cat="ai">
        {% image "images/work/scripture-study.jpg", "Scripture Study app, Old Testament reading progress", { class: "screenshot" } %}
        <p class="eyebrow eyebrow--muted">Scripture reading tracker</p>
        <h2 class="heading heading--md">Scripture Study</h2>
        <p class="text text--muted">Read, search and bookmark scriptures, with chapter-by-chapter progress.</p>
        <div>
          <span class="chip chip--success chip--on-light">
            <span class="chip__dot"></span>
            [RESULT]
          </span>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="feature feature--dark">
      <div
        class="placeholder placeholder--dark placeholder--landscape"
        role="img"
        aria-label="Client photo placeholder"
      >
        [FEATURED CLIENT PHOTO]
      </div>
      <figure class="feature__content">
        <p class="eyebrow eyebrow--on-dark">Featured story · [Client] · [Town]</p>
        <blockquote class="quote">“[CLIENT TESTIMONIAL — the problem, what we built, and what changed.]”</blockquote>
        <figcaption class="text text--on-dark-muted">[Client name], [Role]</figcaption>
        <div class="cluster">
          <span class="chip chip--success">
            <span class="chip__dot"></span>
            [KEY RESULT]
          </span>
          <span class="chip">SEO website + AI intake</span>
        </div>
      </figure>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="cta cta--light">
      <div class="decor decor--large decor--bottom-left" aria-hidden="true"></div>
      <p class="eyebrow">Your project</p>
      <h2 class="heading heading--lg cta__title">Your business could be next.</h2>
      <p class="lead cta__text">
        Tell us what you do and where you do it. We'll show you what's possible before you spend a dollar.
      </p>
      <div class="cta__actions"><a href="/contact/" class="button button--primary">Let's talk</a></div>
    </div>
  </div>
</section>
