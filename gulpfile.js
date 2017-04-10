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
var smartgrid       = require('smart-grid');
var gcmq            = require('gulp-group-css-media-queries');
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
    .pipe(gcmq())
    .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
    .pipe(gulp.dest('build/styles'));
});


// Перенос файлов
gulp.task('transfer', function() {
    gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('build/fonts'));

    gulp.src('app/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images'));
});


// Для адаптивной верстки
gulp.task('smartgrid', function() {
    var settings = {
        outputStyle: 'scss', /* less || scss || sass || styl */
        columns: 12, /* number of grid columns */
        offset: "30px", /* gutter width px || % */
        container: {
            maxWidth: '1170px', /* max-width оn very large screen */
            fields: '30px' /* side fields */
        },
        breakPoints: {
            lg: {
                'width': '1170px', /* -> @media (max-width: 1100px) */
                'fields': '30px' /* side fields */
            },
            md: {
                'width': '960px',
                'fields': '15px'
            },
            sm: {
                'width': '780px',
                'fields': '15px'
            },
            xs: {
                'width': '560px',
                'fields': '15px'
            }
            /* 
            We can create any quantity of break points.
    
            some_name: {
                some_width: 'Npx',
                some_offset: 'N(px|%)'
            }
            */
        }
    };
 
    smartgrid('app/scss/core', settings);
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
gulp.task('compile', ['pug', 'scss', 'transfer']);

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