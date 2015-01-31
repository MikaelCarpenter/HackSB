var gulp = require('gulp'),
uglify = require('gulp-uglify'),
stylus = require('gulp-stylus'),
jade = require('gulp-jade');

//HTML tasks
gulp.task('templates', function(){
	gulp.src('jade/*.jade')
	.pipe(jade())
	.pipe(gulp.dest('build/html'));
});

//JS tasks
gulp.task('scripts', function(){
	gulp.src('javascript/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('build/js'));
});

//CSS tasks
gulp.task('styles', function(){
	gulp.src('stylus/*.styl')
	.pipe(stylus({
		compressed: true
	}))
	.pipe(gulp.dest('build/css'));
});

// watches runs every time i save a watched file
gulp.task('watch', function(){
	gulp.watch('jade/*.jade', ['templates']);
	gulp.watch('javascript/*.js', ['scripts']);
	gulp.watch('stylus/*.styl', ['styles']);
})

gulp.task('default', ['scripts', 'styles', 'templates', 'watch']);