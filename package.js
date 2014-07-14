Package.describe({
  name: 'iron-location',
  summary: 'Reactive urls and pushState handling.',
  version: '0.1.0',
  githubUrl: 'https://github.com/eventedmind/iron-location'
});

Package.on_use(function (api) {
  // some utils
  api.use('underscore');
  api.use('deps');

  api.use('iron-core');
  api.imply('iron-core');

  api.add('lib/location', 'client');
});

Package.on_test(function (api) {
  api.use('iron-location');
  api.use('tinytest');
  api.use('test-helpers');

  api.add_files('location_test.js', 'client');
});

