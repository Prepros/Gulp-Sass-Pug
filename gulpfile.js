// Подключаем библиотеки
var gulp            = require('gulp');
var pug             = require('gulp-pug');
var sass            = require('gulp-sass');
var clean           = require('gulp-clean');
var sequence        = require('gulp-sequence');
var imagemin        = require('gulp-imagemin');
var uglify          = require('gulp-uglify');
var concat          = require('gulp-concat');
var autoprefixer    = require('gulp-autoprefixer');
var browserSync     = require('browser-sync').create();

// Запуск сервера
gulp.task('browser-sync', ['watch'], function() {
    browserSync.init({
        server: {
            baseDir: "./build",
            port: 3000
        },
        notify: false
    });
});

// Компиляция Pug в HTML файл
gulp.task('pug', function () {
    return gulp.src(['app/**/*.pug','!app/**/_*.pug'])
        .pipe(pug({pretty: '\t'}))
        .pipe(gulp.dest('build/'));
});

// Компиляция SCSS в CSS файл
gulp.task('scss', function () {
  return gulp.src('app/scss/**/*.scss')
    // Значения: nested, expanded, compact, compressed
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
    .pipe(gulp.dest('build/styles'));
});

// Минификация картинок
gulp.task('images', function() {
    return gulp.src('app/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images'));
});

// Работа с скриптами
gulp.task('scripts', function() {
	return gulp.src([
		// 'app/scripts/modernizr/modernizr.js',
		// 'app/scripts/jquery/jquery-1.11.2.min.js'
		])
		.pipe(concat('libs.js'))
		// .pipe(uglify()) //Minify libs.js
		.pipe(gulp.dest('./app/js/'));
});

// Общая компиляция проекта
gulp.task('compile', ['pug', 'scss', 'images']);

// Удаление каталога build
gulp.task('clean', function() {
    return gulp.src('build/')
        .pipe(clean());
});

// Сборка проекта
gulp.task('build', sequence('clean', 'compile'));

// Отслеживание изменений в файлах
gulp.task('watch', ['build'], function () {
    gulp.watch('app/**/*.pug', ['pug']);
    gulp.watch('app/scss/**/*.scss', ['scss']).on('change', browserSync.reload);
    gulp.watch('build/**/*.html').on('change', browserSync.reload);
});

// Запуск сервера по умолчанию
gulp.task('default', ['browser-sync']);