// Responsive <picture> markup via @11ty/eleventy-img. Shared by the {% image %}
// shortcode (.eleventy.js) and data files that pre-render images
// (src/_data/projects.js), since async shortcodes can't run inside Nunjucks loops.
const Image = require("@11ty/eleventy-img");
const path = require("path");

async function imageHtml(src, alt, options = {}) {
  const settings = options;

  let widths = [320, 640, 1280];
  let sizes = settings.sizes || "(min-width: 800px) 800px, 100vw";
  let formats = ["avif", "webp", "jpeg"];
  let fileSrc = path.join(__dirname, "..", "src", src);

  let metadata = await Image(fileSrc, {
    widths: widths,
    formats: formats,
    outputDir: "./_site/images/",
    urlPath: "/images/",
    // id is a hash of the source file, so replacing an image under the same
    // name produces new output files (and busts browser/CDN caches) instead
    // of reusing the old ones.
    filenameFormat: function (id, src, width, format) {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      return `${name}-${id}-${width}.${format}`;
    }
  });

  const highestSrc = metadata.jpeg[metadata.jpeg.length - 1];

  // priority: true loads an above-the-fold image eagerly at high priority
  const loadingAttr = settings.priority
    ? 'fetchpriority="high"'
    : 'loading="lazy"';

  const rawHtml = `<picture>
    ${Object.values(metadata).map(imageFormat => {
      return `<source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
    }).join("")}
      <img
        src="${highestSrc.url}"
        width="${highestSrc.width}"
        height="${highestSrc.height}"
        alt="${alt}"
        ${settings.class ? `class="${settings.class}"` : ''}
        ${loadingAttr}
        decoding="async">
  </picture>`;

  return rawHtml.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
}

module.exports = imageHtml;
