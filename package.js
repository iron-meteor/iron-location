Package.describe({
  name: 'iron-location',
  summary: 'Reactive urls that work in IE8/9 and modern browsers.',
  version: '0.1.0',
  githubUrl: 'https://github.com/eventedmind/iron-location'
});

Package.on_use(function (api) {
  // some utils
  api.use('webapp');
  api.use('underscore');
  api.use('deps');
  api.use('jquery');
  api.use('ejson');

  api.use('iron:core');
  api.imply('iron:core');
  api.use('iron:url');

  api.addFiles('lib/utils.js', 'client');
  api.addFiles('lib/state.js', 'client');
  api.addFiles('lib/location.js', 'client');
});

Package.on_test(function (api) {
  api.use('iron:location');
  api.use('tinytest');
  api.use('test-helpers');

  api.addFiles('test/location_test.js', 'client');
});
