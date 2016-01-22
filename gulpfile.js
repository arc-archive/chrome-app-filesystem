'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');
var $ = require('gulp-load-plugins')();


// Lint JavaScript files
gulp.task('lint', function() {
  return gulp.src([
      './*.js',
      './*.html'
      'gulpfile.js'
    ])
    // JSCS has not yet a extract option
    .pipe($.if('*.html', $.htmlExtract({
      strip: true
    })))
    .pipe($.jshint())
    .pipe($.jscs())
    .pipe($.jscsStylish.combineWithHintResults())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});
gulp.task('connect', function() {
  connect.server({
    root: [__dirname + '/'],
    livereload: true,
    port: 8888
  });
});
gulp.task('html', function() {
  gulp.src(['./*.html', './*.js'])
    .pipe(connect.reload());
});
gulp.task('watch', function() {
  gulp.watch(['./*.html','./*.js'], ['html']);
});
gulp.task('elements-webserver', ['connect', 'watch']);