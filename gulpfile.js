var gulp = require('gulp')
var gulpRename = require('gulp-rename')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')

var browserify = require('browserify')
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify')

gulp.task('build_js', function(){

    var b = browserify({
        entries: './src/js/index.js',
        debug: true,
        transform: [babelify]
      });

    return b.bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./docs'))
})

gulp.task('build_css', function(){
    return gulp.src('./src/css/*.css')
    .pipe(concat('index.css'))
    .pipe(gulp.dest('./docs'))
})

gulp.task('build', ['build_js', 'build_css'], function(){
    return gulp.src(['./src/index.html','./src/manifest.json'])
    .pipe(gulp.dest('./docs'))
})

gulp.task('dev', function(){
    return gulp.watch(['./src/**/*'], ['build'])
})

