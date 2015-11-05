module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
        options: {
          separator: ';'
        },
        vendor: {
          src  : ['public/lib/jquery.js', 'public/lib/underscore.js', 'public/lib/backbone.js', 'public/lib/handlebars.js'],
          dest : 'public/dist/vendor.js'
        },
        css: {
          src  : ['public/style.css'],
          dest : 'public/dist/style.css'
        },
        js: {
          src  : ['public/client/*.js'],
          dest : 'public/dist/client.js'
        }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      target : {
        files: {
          'public/min/vendor.min.js' : 'public/dist/vendor.js',
          'public/min/client.min.js' : 'public/dist/client.js'
        }
      }
    },

    jshint: {
      files: {
        src: ['public/client/*.js']
      },
      options: {
        force: 'true',
        jshintrc: '.jshintrc'
        // Note: We removed this ignore
        // ignores: [
        //   'public/lib/**/*.js',
        //   'public/dist/**/*.js'
        // ]
      }
    },

    cssmin: {
        target : {
          files : {
            'public/min/style.min.css' : 'public/dist/style.css'
          }
        }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push azure master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'cssmin']);

  grunt.registerTask('shellcommand', ['shell'] );

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // TODO: add your production server task here
      grunt.task.run( ['shellcommand']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
      'build', 'upload'
  ]);


};
