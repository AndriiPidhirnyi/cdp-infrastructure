var gulp = require('gulp');
var less = require('gulp-less');
var util = require('gulp-util');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');
var mainBowerFiles = require('main-bower-files');
var replaceHTML = require('gulp-html-replace');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

/**
 * Configure objects
 */
var conf = {
  source: {
    less: {
      bootstrap: 'assets/bower_components/bootstrap/less/bootstrap.less',
      all: 'assets/styles/*.less',
      target: 'assets/styles/all.less'
    },
    js: {
      script: 'assets/js/*.js',
      vendor: [
        'assets/bower_components/jquery/dist/jquery.js',
        'assets/bower_components/bootstrap/dist/js/bootstrap.js'
      ]
    },
    html: 'assets/index.html'
  },
  build: {
    cssName: 'all.min.css',
    cssPath: 'build/css',
    jsName: 'all.min.js',
    jsPath: 'build/js',
    htmlPath: 'build'
  },
  release: {
    cssPath: 'build/css',
    cssName: 'all.min.css',
    htmlPath: 'build',
    jsPath: 'build/js',
    jsName: 'all.min.js'
  }
};

/**
 * Tasks list
 */
gulp.task('less', function() {
  return gulp.src([conf.source.less.target, conf.source.less.bootstrap])
    .pipe(less())
    .pipe(autoprefixer(['last 2 versions']))
    .on('error', handleError)
    .pipe(gulp.dest(conf.build.cssPath));
});

gulp.task('js', function() {
  return gulp.src([conf.source.js.script, conf.source.js.vendor])
    .pipe(gulp.dest(conf.build.jsPath))
});

gulp.task('html', function() {
  return gulp.src(conf.source.html)
    .pipe(replaceHTML({
      'css': ['css/all.css', 'css/bootstrap.css'],
      'js': ['js/all.js', 'js/jquery.js' ,'js/bootstrap.js']
    }))
    .pipe(gulp.dest(conf.build.htmlPath));
});

gulp.task('styles:build', function() {
  return gulp.src([conf.source.less.target, conf.source.less.bootstrap])
    .pipe(less())
    .pipe(autoprefixer(['last 2 versions']))
    .pipe(concat(conf.build.cssName))
    .pipe(minifyCSS({
      keepSpecialComments: 0
    }))
    .on('error', handleError)
    .pipe(gulp.dest(conf.build.cssPath));
});

gulp.task('js:build',function() {
  return gulp.src([conf.source.js.script].concat(mainBowerFiles({includeDev: true})))
    .pipe(filter('*.js'))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jscs())
    .on('error', handleError)
    .pipe(concat(conf.build.jsName))
    .pipe(uglify())
    .on('error', handleError)
    .pipe(gulp.dest(conf.build.jsPath));
});

gulp.task('html:build', function() {
  return gulp.src(conf.source.html)
    .pipe(replaceHTML({
      'css':  'css/' + conf.build.cssName,
      'js': 'js/' + conf.build.jsName
    }))
    .pipe(gulp.dest(conf.build.htmlPath));
});

gulp.task('lint', function() {
  return gulp.src(conf.source.js.script)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jscs())
    .on('error', handleError)
});

/**
 * Watches styles change
 */
gulp.task('watch', ['less', 'js', 'html'], function() {
  return gulp.watch(conf.source.less.all, ['less']);
});

/**
 * Builds the whole project
 */
gulp.task('release', ['styles:build', 'js:build','html:build']);

/**
 * Handles errors occurs during files process
 *
 * @method handleError
 * @param {object} err
 * @return {void}
 */
function handleError(err) {
  util.log(util.colors.red('Error'), err.message);
  this.end();
}