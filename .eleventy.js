const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const Image = require("@11ty/eleventy-img");
const path = require("path");
const postcss = require("postcss");
const fs = require("fs").promises;

module.exports = function(eleventyConfig) {

  // ==========================================
  // ⚡ UNIFIED POSTCSS BUNDLER (Single Output File)
  // ==========================================
  eleventyConfig.on("eleventy.after", async () => {
    const inputPath = path.join(__dirname, "src/css/styles.css");
    const outputDir = path.join(__dirname, "_site/css");
    const outputPath = path.join(outputDir, "styles.css");

    try {
      const rawCss = await fs.readFile(inputPath, "utf-8");
      const result = await postcss(require("./postcss.config.js").plugins).process(rawCss, { from: inputPath, to: outputPath });

      // Ensure the output folder structure exists and save the stylesheet bundle
      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(outputPath, result.css, "utf-8");

      console.log(`[PostCSS Engine]: Successfully compiled single bundle -> _site/css/styles.css`);
    } catch (err) {
      console.error(`[PostCSS Bundling Error]:`, err);
    }
  });

  // Tell Eleventy to monitor all nested sub-folders recursively for styling changes
  eleventyConfig.addWatchTarget("src/css/**/*.css");

  // ==========================================
  // 📦 RESPONSIVE IMAGE SHORTCODE
  // {% image "images/photo.jpg", "Alt text" %} — src is relative to src/.
  // {% image "images/photo.jpg", "Alt text", { class: "css-class" } %} adds a class.
  // Pass { hero: true, isFirstHero: true } for the above-the-fold image.
  // ==========================================
  eleventyConfig.addAsyncShortcode("image", async function(src, alt, options = {}) {
    const settings = {
      hero: false,
      isFirstHero: false,
      ...options
    };

    let widths = settings.hero ? [400, 800, 1280, 1920] : [320, 640, 1280];
    let sizes = settings.hero ? "100vw" : "(min-width: 800px) 800px, 100vw";
    let formats = ["avif", "webp", "jpeg"];
    let fileSrc = path.join(__dirname, "src", src);

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

    // Assign fetch priority high only to the primary visible image
    const loadingAttr = settings.hero && settings.isFirstHero
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
  });

  // Plugins.
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Server options.
  eleventyConfig.setServerOptions({
    watch: ["_site/css/*.css"],
  });

  // Shortcodes.
  eleventyConfig.addShortcode('year', () => {
    return `${new Date().getFullYear()}`;
  });

  // Passthrough copies.
  [
    'src/_redirects',
    'src/_headers',
    'src/robots.txt',
    'src/js/',
    'src/fonts/',
    {'src/images/favicon': '/'}
  ].forEach(path =>
    eleventyConfig.addPassthroughCopy(path)
  );

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes'
    },
    markdownTemplateEngine: "njk"
  };
};
