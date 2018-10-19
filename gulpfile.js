const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const ts = require('gulp-typescript');
const inject = require('gulp-inject');

const esX = ts.createProject('tsconfig.json', { target: 'es5' });

// Transforms SCSS styles into CSS and moves them into distribution folder CSS
gulp.task('sass', () => {
    return gulp.src('src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});

// Transpiles TS files into JS files and moves them into development folder JS
gulp.task('transpile', () => {
    return esX.src()
    .pipe(esX())
    .js.pipe(gulp.dest('src/js'));
});

// Takes the development folder JS and takes all the .js files and applys uglify and puts them all in one place.
gulp.task('scripts', () => {
    return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('samsung_files', () => {
    return gulp.src(['src/config.xml', 'src/icon.png'])
        .pipe(gulp.dest('dist/'));
});

// Takes all the files, both css and js from the distribution folder and injects them into our distribution index.html
gulp.task('inject', () => {
    let target = gulp.src('src/index.html');
    let source = gulp.src(['dist/js/*.js', 'dist/css/*.css'], { read: false });
    return target.pipe(inject(source)).pipe(gulp.dest('dist/'));
});

// Runs all the above task on after the other (sequential execution)
gulp.task('dist', gulp.series('sass', 'transpile', 'scripts', 'samsung_files', 'inject'));
