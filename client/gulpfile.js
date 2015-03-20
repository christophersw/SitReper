var gulp = require('gulp');
var util = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');

gulp.task('sitrep', function (cb) {
    gulp.src('./src/sitrep.js')
        .pipe(browserify({
            basedir: './',
            debug: !util.env.production
        }))
        .pipe(concat('sitrep.js'))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('sitrep-min', function (cb) {
    gulp.src('./src/sitrep.js')
        .pipe(browserify({
            basedir: './',
            debug: !util.env.production
        }))
        .pipe(concat('sitrep.min.js'))
        .pipe(uglify({mangle: true}).on('error', util.log))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('default', ['sitrep', 'sitrep-min']);