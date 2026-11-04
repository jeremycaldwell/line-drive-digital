---
layout: layout.html
seoTitle: "Our Work | Websites & Apps for Southern Oregon Businesses"
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
      {%- for project in projects %}{% include "project-card.njk" %}{% endfor -%}
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
      <div class="cluster cluster--center cta__actions">
        <a href="/contact/" class="button button--primary">Let's talk</a>
        <a href="/services/" class="button button--secondary">Services &amp; pricing</a>
      </div>
    </div>
  </div>
</section>
