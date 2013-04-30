module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      html: {
        src: ['src/html/head.html', 'src/html/body.html', 'src/html/footer.html'],
        dest: 'index.html'
      },
      js: {
        src: ['src/calcentralperf.js', 'src/**/*.js'],
        dest: 'js/calcentralperf.js',
        options: {
          separator: ';'
        }
      },
      json: {
        src: ['src/json/*.json'],
        dest: 'json/combined.json',
        options: {
          banner: '{"files": [',
          footer: "]}",
          separator: ','
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js']
    },
    watch: {
      scripts: {
        files: ['**/*.js', '**/*.html', '**/*.json'],
        tasks: ['concat'],
        options: {
          nospawn: true
        }
      }
    }
  });

  // Tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat']);

};
