// Work page projects (also the first three on the homepage).
// Edit this list to add projects. image is relative to src/.
const imageHtml = require('../../lib/image.js');

const projects = [
  {
    name: 'Vance Fabrication LLC',
    type: 'SEO website · Location & service pages',
    description:
      'Service pages for a welding, fencing and construction company in Eastern Washington.',
    image: 'images/work/vance-fabrication.jpg',
    alt: 'Vance Fabrication LLC general construction services page',
    category: 'web',
  },
  {
    name: 'M&G Creative Concrete',
    type: 'Site rebuild + Google Business Profile',
    description:
      'Service pages and project galleries for a concrete contractor in Eastern Washington.',
    image: 'images/work/mg-creative-concrete.jpg',
    alt: 'M&G Creative Concrete website services page',
    category: 'web',
  },
  {
    name: 'Business Finance Tracker',
    type: 'Custom finance dashboard',
    description: 'Clients, invoicing, timesheets and projections in one place.',
    image: 'images/work/business-finance-tracker.jpg',
    alt: 'Business Finance Tracker app dashboard',
    category: 'ai',
  },
  {
    name: 'Scripture Study',
    type: 'Scripture reading tracker',
    description:
      'Read, search and bookmark scriptures, with chapter-by-chapter progress.',
    image: 'images/work/scripture-study.jpg',
    alt: 'Scripture Study app, Old Testament reading progress',
    category: 'ai',
  },
];

const escapeAttr = (text) =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

// Images are rendered here because async shortcodes cannot run inside a
// Nunjucks for loop.
module.exports = async () =>
  Promise.all(
    projects.map(async (project) => ({
      ...project,
      imageHtml: await imageHtml(project.image, escapeAttr(project.alt), {
        class: 'screenshot',
        sizes: '(max-width: 56.25rem) calc(100vw - 2rem), 38rem',
      }),
    })),
  );
