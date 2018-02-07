module.exports = function(g){
  g.initConfig({
    root_dir: './js',
    pkg:g.file.readJSON("package.json"),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ["./js/base.js",
              "./js/common/init.js",
              "./js/common/const.js",
              "./js/common/request.js",
              "./js/common/aws.js",
              "./js/common/signer.js",
              "./js/invoke/open.js",
              "./js/invoke/public.js",
              "./js/invoke/secure.js",
              "./js/resource/session.js",
              "./js/resource/token.js"],
        dest: 'dist/chikyu-sdk.js',
      },
    },
    uglify: {
      chikyu_sdk_js: {
        files: {
          'dist/chikyu-sdk.min.js': ['dist/chikyu-sdk.js']
        }
      }
    },
    clean: {
      release: ['dist']
    }
  });

  g.loadNpmTasks('grunt-contrib-uglify');
  g.loadNpmTasks('grunt-contrib-concat');
  g.loadNpmTasks('grunt-contrib-clean');
  g.registerTask('build', ['clean', 'concat', 'uglify']);
  g.registerTask('default', ['build']);
}
