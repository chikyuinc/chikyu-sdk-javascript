module.exports = function(g){
  g.initConfig({
    root_dir: './js',
    pkg:g.file.readJSON("package.json"),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ["./src/base.js",
              "./src/common/config.js",
              "./src/common/request.js",
              "./src/common/aws.js",
              "./src/common/signer.js",
              "./src/invoke/open.js",
              "./src/invoke/public.js",
              "./src/invoke/secure.js",
              "./src/resource/session.js",
              "./src/resource/token.js"],
        dest: './dist/js/chikyu-sdk.js',
      },
    },
    uglify: {
      chikyu_sdk_js: {
        files: {
          'dist/js/chikyu-sdk.min.js': ['dist/js/chikyu-sdk.js']
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['concat'],
        options: {
          spawn: false,
        },
      },
    },
    clean: {
      release: ['dist/js']
    }
  });

  g.loadNpmTasks('grunt-contrib-uglify');
  g.loadNpmTasks('grunt-contrib-concat');
  g.loadNpmTasks('grunt-contrib-clean');
  g.loadNpmTasks('grunt-contrib-watch');

  g.registerTask('build', ['clean', 'concat', 'uglify']);
  g.registerTask('default', ['build']);
}
