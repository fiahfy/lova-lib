'use strict';

var gulp = require('gulp');
var tsd = require('gulp-tsd');
var tsc = require('gulp-typescript');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');

var config = {
  minify: {
    src: 'client/assets/js/bundle.js',
    dest: 'client/assets/js/'
  },
  tsd: {
    optoins: {
      command: 'reinstall',
      config: 'tsd.json'
    }
  },
  tsc: {
    src: 'client/assets/js/**/*.ts',
    dest: 'client/assets/js/',
    options: {
      noImplicitAny : true,
      target : 'es5',
      module : 'commonjs'
    }
  },
  browserify: {
    options: {
      entries: [
        'client/assets/js/app.js'
      ],
      debug: true
    },
    dest: 'client/assets/js/',
    output: {
      filename: 'bundle.js'
    }
  },
  watch: {
    ts: 'client/assets/js/**/*.ts',
    js: ['client/assets/js/**/*.js', '!client/assets/js/bundle.js'],
    bundle: 'client/assets/js/bundle.js'
  }
};

gulp.task('tsd', function (callback) {
  tsd(config.tsd.optoins, callback);
});

gulp.task('tsc', function() {
  return gulp.src(config.tsc.src)
    .pipe(tsc(config.tsc.options))
    .pipe(gulp.dest(config.tsc.dest));
});

gulp.task('browserify', function() {
  return browserify(config.browserify.options)
    .bundle()
    .pipe(source(config.browserify.output.filename))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.browserify.dest));
});

gulp.task('watch', ['build'], function() {
  watch(config.watch.ts, function() {
    gulp.start(['tsc']);
  });

  watch(config.watch.js, function() {
    gulp.start(['browserify']);
  });

  watch(config.watch.bundle, function() {
    gulp.start(['minify']);
  });
});

gulp.task('minify', function() {
  return gulp.src(config.minify.src)
    .pipe(jsmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.minify.dest));
});

gulp.task('build', function(callback) {
  runSequence(
    'tsd', 'tsc', 'browserify', 'minify', callback
  );
});
