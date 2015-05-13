module.exports = function(grunt) {
	var packageData = grunt.file.readJSON('package.json');

	grunt.initConfig({
		pkg: packageData,

		jshint: {
			core: ['js/**/*.js']
		},

		'angular-builder': {
      options: {
        mainModule: 'shelvingGame',
				externalModules: ['ui.sortable', 'cfp.hotkeys']
      },
      app: {
        src:  'js/**/*.js',
        dest: 'build/project.js'
      }
    }
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', ['jshint', 'angular-builder']);
};
