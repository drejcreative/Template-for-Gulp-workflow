var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    concat = require('gulp-concat');

    // Variables ==========================================================
  var env,
      jsSources,
      sassSources,
      htmlSources,
      outputDir,
      sassStyle;

    // Enviroment ==========================================================
    env = 'development';

    if (env==='development') {
      outputDir = 'builds/development/';
      sassStyle = 'expanded'; //nested ,compressed, expanded, compact
    } else {
      outputDir = 'builds/production/';
      sassStyle = 'compressed';
    }


    // Sources ==========================================================
    jsSources = [
      'components/scripts/jqloader.js',
      'components/scripts/script.js'
    ];
    sassSources = ['components/sass/style.scss'];
    htmlSources = [outputDir + '*.html'];

    // Gulp tasks ==========================================================

    gulp.task('js', function() {
      gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .on('error', gutil.log)
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
    });


    gulp.task('compass', function() {
      gulp.src(sassSources)
        .pipe(compass({
          sass: 'components/sass',
          css: outputDir + 'css',
          image: outputDir + 'images',
          style: sassStyle,
          require: ['susy', 'breakpoint']
        })
    .on('error', gutil.log))
    //    .pipe(gulp.dest( outputDir + 'css'))
    .pipe(connect.reload())
  });

  gulp.task('watch', function() {
    gulp.watch(jsSources, ['js']);
    gulp.watch(['components/sass/*.scss', 'components/sass/*/*.scss'], ['compass']);
    gulp.watch('builds/development/*.html', ['html']);
  });

  gulp.task('connect', function() {
    connect.server({
      root: outputDir,
      port: 9999,
      livereload: true
    });
  });

  gulp.task('html', function() {
    gulp.src('builds/development/*.html')
      .pipe(gulpif(env === 'production', minifyHTML()))
      .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
      .pipe(connect.reload())
  });

  // Copy images to production
  gulp.task('move', function() {
    gulp.src('builds/development/images/**/*.*')
    .pipe(gulpif(env === 'production', gulp.dest(outputDir+'images')))
  });


// Run gulp tasks ========================================================
gulp.task('default', ['watch', 'html', 'js', 'compass', 'move', 'connect']);
