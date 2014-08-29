Package.describe({
  summary: 'Reactive urls that work in IE8/9 and modern browsers.',
  version: '0.1.0',
  git: 'https://github.com/eventedmind/iron-location.git'
});

Package.on_use(function (api) {
  // some utils
  api.use('underscore@1.0.0');
  api.use('tracker@1.0.2-rc1');
  api.use('jquery@1.0.0');

  api.use('iron:core@0.3.2');
  api.imply('iron:core');
  api.use('iron:url');

  api.add_files('lib/utils.js', 'client');
  api.add_files('lib/state.js', 'client');
  api.add_files('lib/location.js', 'client');
});

Package.on_test(function (api) {
  api.use('iron:location');
  api.use('tinytest');
  api.use('test-helpers');

  api.add_files('test/location_test.js', 'client');
});
