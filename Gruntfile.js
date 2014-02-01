module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    mochaTest: {
      options: {
        reporter: 'spec',
        require: ['should'],
        clearRequireCache: true
      },
      src: ['test/*.js']
    },
    watch: {
      scripts: {
        files: ['test/*.js', 'index.js', 'lib/**/*.js'],
        tasks: ['jshint', 'mochaTest'],
        options: {
          spawn: false,
        },
      },
    },
    jshint: {
      options: {
        jshintrc: true
      },
      all: ['lib/**/*.js', 'index.js']
    }
  });

  grunt.registerTask('default', ['jshint', 'mochaTest', 'watch']);

};