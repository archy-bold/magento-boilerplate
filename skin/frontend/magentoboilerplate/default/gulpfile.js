var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var config = {
	cssBuildDir: './css/',
	jsBuildDir: './js/build/'
};

gulp.task('css', function() {
	return gulp.src('./scss/*.scss')
		.pipe(sass({
			includePaths: [
				// config.bootstrapDir + '/assets/stylesheets',
			],
		}))
		.pipe(gulp.dest(config.cssBuildDir));
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

gulp.task('default', ['build'], function() {
	gulp.start('watch');
});

gulp.task('watch', function() {
	watch('./scss/**/*.scss', function(files) {gulp.start('css');});
});

gulp.task('build:css', [], function() {
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
