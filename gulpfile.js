'use strict';

var gulp = require('gulp');
var tsd = require('gulp-tsd');
//var browserify = require('browserify');
//var source = require('vinyl-source-stream');
//var buffer = require('vinyl-buffer');
//var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');
//var watch = require('gulp-watch');
//var jsmin = require('gulp-jsmin');
//var rename = require('gulp-rename');
//
var dest = '../dest';
var src = '../src';
var path = require('path');
var relativeSrcPath = path.relative('.', src);
//
var config = {
  minify: {
    src: dest + '/js/*.js',
    dest: dest + '/js/min'
  },
  //
  //tsd: {
  //  json: src + '/tsd.json'
  //},

  ts: {
    src: [
      'client/assets/js/*.ts'
    ],
    dest: 'client/assets/js/',
    options: {
      //noImplicitAny : true,
      target : 'es5',
      module : 'commonjs'
    }
  },

  browserify: {
    entry: {
      entries: src + '/js/main.js',
      debug: true
    },
    dest: dest + '/js',
    output: {
      filename: 'bundle.js'
    }
  },
//--sourcemap $FilePath$ -m commonjs -t es5
  watch: {
    ts: relativeSrcPath + '/ts/*.ts',
    js: relativeSrcPath + '/js/*.js'
  }
};

gulp.task('tsd', function (callback) {
  tsd({
    command: 'reinstall',
    config: 'tsd.json'
  }, callback);
});

gulp.task('tsc', function(){
  gulp.src(config.ts.src)
    .pipe(typescript(config.ts.options))
    .pipe(gulp.dest(config.ts.dest));
});
//
//gulp.task('browserify', function(){
//  return browserify(config.browserify.entry)
//    .bundle()
//    .pipe(source(config.browserify.output.filename))
//    .pipe(buffer())
//    .pipe(sourcemaps.init({loadMaps: true}))
//    .pipe(sourcemaps.write('./'))
//    .pipe(gulp.dest(config.browserify.dest));
//});
//
//gulp.task('watch', function () {
//  // IDEの恩恵を授かる場合は、以下の3行をコメントアウト
//  watch(config.watch.ts, function () {
//    gulp.start(['tsc']);
//  });
//
//  watch(config.watch.js, function () {
//    gulp.start(['browserify']);
//  });
//});
//
//gulp.task('minify', function () {
//  gulp.src(config.js.src)
//    .pipe(jsmin())
//    .pipe(rename({suffix: '.min'}))
//    .pipe(gulp.dest(config.js.dest));
//});
//
//gulp.task('default', ['watch']);
