var gulp = require("gulp"),
    source = require('vinyl-source-stream'),
    watchify = require('watchify'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    inject = require('gulp-inject'),
    concat = require('gulp-concat'),
    series = require('stream-series'),
    package = require('./package')

gulp.task('mdl', function () {
    return gulp.src([
                "node_modules/react-mdl/extra/material.js",
                "node_modules/react-mdl/extra/material.css"
            ])
        .pipe(gulp.dest(package.dest.vendor));
});

gulp.task('jsx', function () {
  return browserify({
    entries: './index.jsx',
    extensions: ['.jsx'],
    debug: true,

    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  })
  .transform(babelify.configure({
    optional: ["es7.classProperties", "es7.decorators"],
    sourceMapRelative: "/cloud/projects/cloud/"
  }))

    .bundle() // Create the initial bundle when starting the task
    .pipe(source(package.dest.app))
    .pipe(gulp.dest(package.dest.dist));;



});

// gulp.task('jsx-reload', function () {

//   var watcher = watchify(bundler);
//   return watcher
//     .on('update', function () { // When any files update
//         var updateStart = Date.now();
//         console.log('Updating!');
        
//         watcher.bundle() // Create new bundle that uses the cache for high performance
//         .pipe(source(package.dest.app))
//     // This is where you add uglifying etc.
//         .pipe(gulp.dest(package.dest.dist));
//         console.log('Updated!', (Date.now() - updateStart) + 'ms');
//     })
//     .bundle() // Create the initial bundle when starting the task
//     .pipe(source(package.dest.app))
//     .pipe(gulp.dest(package.dest.dist));
// })


gulp.task('css', function () {
    return gulp.src([package.paths.css])
        .pipe(concat('app.css'))
        .pipe(gulp.dest(package.dest.dist));
});

gulp.task('index', ['jsx', 'css'], function () {

  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var vendor = gulp.src([package.dest.vendor + '/*'], {read: false});
  var app = gulp.src([package.dest.dist + "/*.js", package.dest.dist + "/*.css"], {read: false});
 
  return gulp.src(package.paths.html)
    .pipe(inject(series(vendor, app), {
        ignorePath: package.dest.dist,
        addRootSlash: false
    }))
    .pipe(gulp.dest(package.dest.dist));
});

gulp.task('build', ['mdl', 'index']);

gulp.task('default', ['build'], function () {
    return gulp.watch([
        package.paths.html,
        package.paths.jsx,
        package.paths.css
    ], [
        'index'
    ]);
});