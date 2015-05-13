module.exports = function(grunt) {
	var packageData = grunt.file.readJSON('package.json');

	grunt.initConfig({
		pkg: packageData,

		jshint: {
			core: ['js/src/**/*.js']
		},

		'angular-builder': {
      options: {
        mainModule: 'ShelvingGame',
				externalModules: ['ui.sortable', 'cfp.hotkeys']
      },
      app: {
        src:  'js/src/**/*.js',
        dest: 'js/shelving-game.js'
      }
    }
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', ['jshint', 'angular-builder']);
};
