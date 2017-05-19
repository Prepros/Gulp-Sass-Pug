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
var plumber         = require('gulp-plumber');
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
        .pipe(plumber())
        .pipe(pug({pretty: '\t'}))
        .pipe(gulp.dest('build/'));
});


// Компиляция Sass в CSS файл
gulp.task('sass', function () {
  return gulp.src('app/sass/**/*.+(sass|scss)')
    // Значения: nested, expanded, compact, compressed
    .pipe(plumber())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gcmq())
    .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
    .pipe(gulp.dest('build/assets/styles'));
});


// Работа с скриптами
gulp.task('scripts', function() {
	return gulp.src([
		'app/assets/scripts/jquery.js',
		'app/assets/scripts/unslider.js',
		'app/assets/scripts/jquery.bpopup.min.js',
		'app/assets/scripts/main.js'        
		])
		.pipe(concat('scripts.js'))
		// .pipe(uglify()) //Minify libs.js
        //.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('build/assets/scripts'));
});


// Перенос файлов
gulp.task('transfer', function() {
    gulp.src(['app/assets/**/*', '!app/assets/scripts/**/*.js'])
        .pipe(gulp.dest('build/assets'));
});


// Общая компиляция проекта
gulp.task('compile', ['pug', 'sass', 'scripts', 'transfer']);


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
    gulp.watch('app/sass/**/*', ['sass']).on('change', browserSync.reload);
    gulp.watch('app/scripts/**/*.js', ['scripts']).on('change', browserSync.reload);
    gulp.watch('build/**/*.html').on('change', browserSync.reload);
});


// Запуск сервера по умолчанию
gulp.task('default', ['browser-sync']);


// Для адаптивной верстки
gulp.task('smartgrid', function() {
    var settings = {
        outputStyle: 'sass', /* less || scss || sass || styl */
        columns: 12, /* number of grid columns */
        offset: "30px", /* gutter width px || % */
        container: {
            maxWidth: '1170px', /* max-width оn very large screen */
            fields: '30px' /* side fields */
        },
        breakPoints: {
            // lg: {
            //     'width': '1170px', /* -> @media (max-width: 1100px) */
            //     'fields': '30px' /* side fields */
            // },
            md: {
                'width': '960px',
                'fields': '30px'
            },
            sm: {
                'width': '780px',
                'fields': '30px'
            },
            xs: {
                'width': '560px',
                'fields': '30px'
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
 
    smartgrid('app/sass/core', settings);
});