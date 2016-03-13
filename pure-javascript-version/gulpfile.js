var gulp = require('gulp');
var minify = require('gulp-minify');
var htmlmin = require('gulp-htmlmin');
var rename = require('gulp-rename');
 

// gulp.task('watch', function() {
//   gulp.watch(['./development/js/*.js']);
// });

// gulp.task('compress', function() {
//   gulp.src('./development/js/compucorp.core.js')
//   .pipe(minify({
//         exclude: ['tasks'],
//         ignoreFiles: ['-min.js']
//     }))
//     .pipe(gulp.dest('./production/bin/'))
// });

// gulp.task('minify', function() {
//   return gulp.src('./development/templates/*.html')
//     .pipe(htmlmin({collapseWhitespace: true}))
//     .pipe(gulp.dest('./production/templates/'))
// });
 
gulp.task('deploy:production', function() {

  /* minify js */
  gulp.src('./development/js/compucorp.core.js')
  .pipe(minify({
        exclude: ['tasks'],
        ignoreFiles: ['-min.js']
    }))
    .pipe(gulp.dest('./production/bin/'));

    /* minify templates */

    gulp.src('./development/templates/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./production/templates/'))


  /* copy bootstrap lib to project folder */

    gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp
              .dest('./production/libs/bootstrap/dist/css'));
/* copy style css to project folder */
    gulp.src('./../css/style.css')
        .pipe(gulp
              .dest('./production/css/'));
/* copy and rename index_production to project folder*/
    gulp.src('./development/index_production.html')
        .pipe(rename('./production/index.html'))
        .pipe(gulp.dest('./'))

});