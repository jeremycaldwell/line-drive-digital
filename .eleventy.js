const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const imageHtml = require("./lib/image.js");
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
  eleventyConfig.addAsyncShortcode("image", imageHtml);

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
