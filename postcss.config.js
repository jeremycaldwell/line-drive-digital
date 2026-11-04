module.exports = {
  map: false,
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('postcss-custom-media'),
    require('postcss-pxtorem')({
      rootValue: 16,
      propList: ['*'],
    }),
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
