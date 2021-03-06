Package.describe({summary: "Telescope grab app icons from Google/Apple stores"});

Package.on_use(function (api) {

  api.use(['telescope-base', 'webapp'], ['client', 'server']);

  api.use(['templating'], ['client']);

  api.add_files([
    'lib/app_icons.js'
  ], ['client', 'server']);

  api.add_files([
    'lib/server/get_app_icon.js'
  ], ['server']);

  api.add_files([
    'lib/client/post_app_icon.html',
    'lib/client/post_app_icon.js',
    'lib/client/post_app_icon.css'
  ], ['client']);
});
