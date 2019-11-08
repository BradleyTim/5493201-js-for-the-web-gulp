const gulp = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const jshint = require("gulp-jshint");
const runSequence = require("run-sequence");
const browserSync = require("browser-sync").create();

gulp.task("processHTML", function() {
  return gulp.src("*.html").pipe(gulp.dest("dist"));
});

gulp.task("processJS", function() {
  return gulp
    .src("*.js")
    .pipe(
      jshint({esversion: 8})
    )
    .pipe(jshint.reporter("default"))
    .pipe(
      babel({
        presets: ["env"]
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
});

gulp.task("babelPolyfill", function() {
  return gulp
    .src("node_modules/babel-polyfill/browser.js")
    .pipe(gulp.dest("dist/node_modules/babel-polyfill"));
});

gulp.task("browserSync", function() {
  browserSync.init({
    server: "./dist",
    port: 8080,
    ui: {
        port: 8081
      }
  });
});
      
gulp.task("watch", ["browserSync"], function() {
  gulp.watch("*.js", ["processJS"]);
  gulp.watch("*.html", ["processHTML"]);

  gulp.watch("dist/*.js", browserSync.reload);
  gulp.watch("dist/*.html", browserSync.reload);
});
  
gulp.task("default", function(callback) {
  runSequence(["processHTML", "processJS", "babelPolyfill"], 'watch', callback);
});