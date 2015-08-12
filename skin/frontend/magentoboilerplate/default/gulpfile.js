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
var imageresize = require('gulp-image-resize');
var rename = require('gulp-rename');
var spritesmith = require('gulp.spritesmith');

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


gulp.task('png', ['png:retina', 'png:sprites']);

gulp.task('png:retina', function() {

	// Generate half sizes from retina sprites
	return gulp.src(config.spritesDir + 'source-2x/*.png')
		.pipe(imageresize({
			width: '50%'
		}))
		.pipe(rename(function (path) { path.basename = path.basename.replace('@2x', ''); }))
		.pipe(gulp.dest(config.spritesDir + 'source'));
});

gulp.task('png:sprites', ['png:retina', 'cleanup:png'], function(cb) {

	var timestamp = Date.now();

	var spriteData = gulp.src(config.spritesDir + 'source/*.png')
		.pipe(spritesmith({
			imgName: 'sprite-' + timestamp + '.png',
			cssName: '_sprite.scss',
			cssTemplate: config.scssDir + 'utilities/sprites.styl.mustache',
			cssVarMap: function(sprite) {
				sprite.imagenx = sprite.image.replace('.png', '');
				sprite.name = 'sprite__' + sprite.name;
			},
			padding: 20
		}));

	spriteData.img
		.pipe(imagemin())
		.pipe(gulp.dest(config.spritesDir));
	
	spriteData.css.pipe(gulp.dest(config.scssDir + 'utilities/sprites/'));

	var retinaSpriteData = gulp.src(config.spritesDir + 'source-2x/*.png')
		.pipe(spritesmith({
			imgName: 'sprite-2x-' + timestamp + '.png',
			cssName: '_sprite-2x.scss',
			cssTemplate: config.scssDir + 'utilities/sprites.styl.mustache',
			cssVarMap: function(sprite) {
				// sprite.imagenx = sprite.image.replace('.png', '');
				sprite.name = 'sprite-2x__' + sprite.name;
			},
			padding: 40
		}));

	retinaSpriteData.img
		.pipe(imagemin())
		.pipe(gulp.dest(config.spritesDir));

	retinaSpriteData.css.pipe(gulp.dest(config.scssDir + 'utilities/sprites/'));

	cb();

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

gulp.task('cleanup:png', function(cb) {
	del([
		config.spritesDir + 'sprite-*.png'
	], cb);
});


gulp.task('default', ['build'], function() {
	gulp.start('watch');
});

gulp.task('watch', function() {
	watch(config.spritesDir + 'svg/**/*.svg', function(files) {gulp.start('svg');});
	watch(config.spritesDir + 'source-2x/*', function(files) {gulp.start('png');});
	watch(config.scssDir + '**/*.scss', function(files) {gulp.start('css');});
});

gulp.task('build:css', ['svg', 'png'], function() {
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
