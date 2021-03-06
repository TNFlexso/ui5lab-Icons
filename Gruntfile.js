'use strict';

module.exports = function(grunt) {

	grunt.initConfig({

		libraryName: 'ui5lab.tn.icons',

		dir: {
			src: 'src',
			test: 'test',
			dist: 'dist',
			bower_components: 'bower_components',
			ui5lab_browser: 'node_modules/ui5lab-browser/dist'
		},

		connect: {
			options: {
				port: 8080,
				hostname: '*'
			},
			src: {},
			dist: {}
		},

		openui5_connect: {
			src: {
				options: {
					resources: [
						'<%= dir.bower_components %>/openui5-sap.ui.core/resources',
						'<%= dir.bower_components %>/openui5-sap.m/resources',
						'<%= dir.bower_components %>/openui5-sap.ui.unified/resources',
						'<%= dir.bower_components %>/openui5-sap.f/resources',
						'<%= dir.bower_components %>/openui5-sap.ui.layout/resources',
						'<%= dir.bower_components %>/openui5-sap.ui.unified/resources',
						'<%= dir.bower_components %>/openui5-themelib_sap_belize/resources',
						'<%= dir.src %>'
					],
					testresources: [
						'<%= dir.bower_components %>/openui5-sap.ui.core/test-resources',
						'<%= dir.bower_components %>/openui5-sap.m/test-resources',
						'<%= dir.bower_components %>/openui5-sap.ui.unified/test-resources',
						// TODO: how to get rid of these indirect dependencies only needed for the browser (f + layout)
						'<%= dir.bower_components %>/openui5-sap.f/test-resources',
						'<%= dir.bower_components %>/openui5-sap.ui.layout/test-resources',
						'<%= dir.bower_components %>/openui5-sap.ui.unified/test-resources',
						'<%= dir.bower_components %>/openui5-themelib_sap_belize/test-resources',
						'<%= dir.test %>',
						'<%= dir.ui5lab_browser %>/test-resources'
					]
				}
			},
			dist: {
				options: {
					resources: [
						'<%= dir.bower_components %>/openui5-sap.ui.core/resources',
						'<%= dir.bower_components %>/openui5-sap.m/resources',
						'<%= dir.bower_components %>/openui5-sap.ui.unified/resources',
						'<%= dir.bower_components %>/openui5-sap.f/resources',
						'<%= dir.bower_components %>/openui5-sap.ui.layout/resources',
						'<%= dir.bower_components %>/openui5-sap.ui.unified/resources',
						'<%= dir.bower_components %>/openui5-themelib_sap_belize/resources',
						'<%= dir.dist %>/resources'
					],
					testresources: [
						'<%= dir.bower_components %>/openui5-sap.ui.core/test-resources',
						'<%= dir.bower_components %>/openui5-sap.m/test-resources',
						'<%= dir.bower_components %>/openui5-sap.ui.unified/test-resources',
						'<%= dir.bower_components %>/openui5-sap.f/test-resources',
						'<%= dir.bower_components %>/openui5-sap.ui.layout/test-resources',
						'<%= dir.bower_components %>/openui5-sap.ui.unified/test-resources',
						'<%= dir.bower_components %>/openui5-themelib_sap_belize/test-resources',
						'<%= dir.dist %>/test-resources',
						'<%= dir.ui5lab_browser %>/test-resources'
					]
				}
			}
		},

		openui5_theme: {
			theme: {
				files: [{
					expand: true,
					cwd: '<%= dir.src %>',
					src: '**/themes/*/library.source.less',
					dest: '<%= dir.dist %>/resources'
				}],
				options: {
					rootPaths: [
						'<%= dir.bower_components %>/openui5-sap.ui.core/resources',
						'<%= dir.bower_components %>/openui5-themelib_sap_belize/resources',
						'<%= dir.src %>'
					],
					library: {
						name: '<%= libraryName %>'
					}
				}
			}
		},

		openui5_preload: {
			library: {
				options: {
					resources: '<%= dir.src %>',
					dest: '<%= dir.dist %>/resources'
				},
				libraries: true
			}
		},

		clean: {
			dist: '<%= dir.dist %>/'
		},

		copy: {
			lib: {
				expand: true,
				cwd: '<%= dir.src %>',
				src: [
					'**'
				],
				dest: '<%= dir.dist %>/resources'
			},
			test: {
				expand: true,
				cwd: '<%= dir.test %>',
				src: [
					'**'
				],
				dest: '<%= dir.dist %>/test-resources',
				options: {
					noProcess: ['**/*.{png,gif,jpg,ico,pdf}'],
					process: function(content, srcpath) {
						return content.replace("UI5-SDK-PATH", "resources/sap-ui-core.js");
					}
				}
			},
			webide: {
				expand: true,
				cwd: '<%= dir.test %>',
				src: [
					'**'
				],
				dest: '<%= dir.dist %>/test-resources-webide',
				options: {
					noProcess: ['**/*.{png,gif,jpg,ico,pdf}'],
					process: function(content, srcpath) {
						return content.replace("UI5-SDK-PATH", "../resources/sap-ui-core.js");
					}
				}
			}
		},

		eslint: {
			src: ['<%= dir.src %>'],
			test: ['<%= dir.test %>'],
			gruntfile: ['Gruntfile.js']
		}

	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-openui5');
	grunt.loadNpmTasks('grunt-eslint');

	// Server task
	grunt.registerTask('serve', function(target) {
		grunt.task.run('openui5_connect:' + (target || 'src') + ':keepalive');
	});

	// Linting task
	grunt.registerTask('lint', ['eslint']);

	// Build task
	grunt.registerTask('build', ['openui5_theme', 'openui5_preload', 'copy']);

	var hostname = require("os").hostname();
	if (hostname.indexOf("devxbuild") > -1) {
		grunt.log.write("Running in Web IDE");
		// Default task
		grunt.registerTask('default', [
			'clean',
			'build'
		]);
	} else {
		grunt.log.write("Not running in Web IDE");
		// Default task
		grunt.registerTask('default', [
			'clean',
			'build',
			'serve:dist'
		]);
	}
};