module.exports = {
  map: false,
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('postcss-custom-media'),
    require('autoprefixer'),
    require('cssnano')({
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
      }],
    }),
  ],
};
