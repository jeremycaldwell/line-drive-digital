// Build context. Netlify sets CONTEXT ("production", "deploy-preview", ...);
// analytics only loads on the production site.
module.exports = {
  production: process.env.CONTEXT === 'production',
};
