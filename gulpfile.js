var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    browserSync = require('browser-sync'),
    rename = require('gulp-rename'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

sass.compiler = require('node-sass');

gulp.task('clean', async function () {
    del.sync('dist')
});

gulp.task('html', function (done) {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream: true}));
    done()
});

gulp.task('sass', function (done) {
    return gulp.src('src/scss/emails-editor.sass')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true}));
    done()
});

gulp.task('javascript', function (done) {
    return gulp.src('src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(rename({suffix: '.min'}))
        //.pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({stream: true}));
    done()
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "dist/"
        }
    });
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.html', gulp.parallel('html'));
    gulp.watch('src/scss/*.sass', gulp.parallel('sass'));
    gulp.watch('src/js/*.js', gulp.parallel('javascript'))
});

gulp.task('build', gulp.series('clean', 'html', 'sass', 'javascript'));
gulp.task('default', gulp.parallel('html', 'sass', 'javascript', 'browser-sync', 'watch'));