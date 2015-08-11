var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var svgSprite = require('gulp-svg-sprite');
var svg2png = require('gulp-svg2png');
var filter = require('gulp-filter');
var imagemin = require('gulp-imagemin');
var del = require("del");

var config = {
	scssDir: './scss/',
	spritesDir: './images/sprites/',
	cssBuildDir: './css/',
	jsBuildDir: './js/build/'
};


gulp.task('css', function() {
	return gulp.src(config.scssDir + '*.scss')
		.pipe(sass({
			includePaths: [
				// config.bootstrapDir + '/assets/stylesheets',
			],
		}))
		.pipe(gulp.dest(config.cssBuildDir));
});


gulp.task('svg', ['cleanup:svg'], function() {
	var svgConfig = {
		mode: {
			view: {
				dest: '.',
				sprite: 'svg-sprite.svg',
				render: {
					scss: {
						template: config.scssDir + 'utilities/svg.sass.mustache',
						dest: '../../' + config.scssDir + 'utilities/_svg-sprites.scss' // Needs slash at start
					}
				},
				example: true
			}
		},
		variables: {
			png: function() {
				return function(sprite, render) {
					return render(sprite).split('.svg').join('.png');
				};
			}
		}
	};

	return gulp.src(config.spritesDir + 'svg/*.svg')
		.pipe(svgSprite(svgConfig))
		.pipe(gulp.dest(config.spritesDir))
		.pipe(filter("**/*.svg"))
		.pipe(svg2png())
		.pipe(imagemin())
		.pipe(gulp.dest(config.spritesDir));
});


gulp.task('js', function() {
	return gulp.src([
		'js/lib/enquire.min.js',
        'js/lib/toggle.single.js'
		])
		.pipe(concat('libs.js'))
		.pipe(gulp.dest(config.jsBuildDir));
});

gulp.task('js-uglify', function() {
	return gulp.src(config.jsBuildDir + 'libs.js')
		.pipe(concat('libs.min.js'))
		.pipe(uglify({compress:false}))
		.pipe(concat('libs.min.js'))
		.pipe(gulp.dest(config.jsBuildDir + 'min/'));
});


gulp.task('cleanup:svg', function(cb) {
	del([
		config.spritesDir + 'svg-sprite-*'
	], cb);
});


gulp.task('default', ['build'], function() {
	gulp.start('watch');
});

gulp.task('watch', function() {
	watch(config.spritesDir + 'svg/**/*', ['svg']);
	watch(config.scssDir + '**/*.scss', function(files) {gulp.start('css');});
});

gulp.task('build:css', ['svg'], function() {
	gulp.start('css');
});

gulp.task('build:js', ['js'], function() {
	gulp.start('js-uglify');
});

gulp.task('build', ['build:css', 'build:js']);

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}
