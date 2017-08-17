var gulp = require('gulp');
var ts = require('gulp-typescript');

var paths = {
    pages: ['./examples/*.html']
};
gulp.task('default', function() {

})

gulp.task('watch', function() {
    gulp.watch('./src/**/*.ts', ['ts', 'copy-html']);
})


gulp.task('ts', function() {
    gulp.src('./src/**/*.ts') //*表示所有的scss文件
        .pipe(ts())
        .pipe(gulp.dest('dist'))
})

gulp.task("copy-html", function() {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

