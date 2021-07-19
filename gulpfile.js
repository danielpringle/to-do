// Initialize modules

// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');

// Lets define our paths
const paths = {
  rootPath: './',
  scssPath: 'src/sass',
  cssPath: 'css',
  srcPath: 'src',
  buildPath: './',
  imgSrcPath: 'src/images',
  imgBuildPath: 'images',
  jsSrcPath: 'src/js',
  jsBuildPath: 'js',
};

// Import all our Gulp-related packages that we will use

// Sass/CSS processes
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssMinify = require('gulp-cssnano');
const sassLint = require('gulp-sass-lint');
// Utilities
const notify = require('gulp-notify');
const del = require('del');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const replace = require('gulp-replace');
const htmlreplace = require('gulp-html-replace');
// JS
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
// Images
const imagemin = require('gulp-imagemin');

/*
 *  we’ve adding the cb() callback function, setting it as a parameter and then invoking it at the end of the function.
 *  Adding this will signal async completion, and should fix errors:
 *  “The following tasks did not complete… Did you forget to signal async completion?”
 */

/**
 * Error handling
 * https://www.npmjs.com/package/gulp-notify
 * @function
 */
function handleErrors(cb) {
  var args = Array.prototype.slice.call(arguments);

  notify
    .onError({
      title: 'Task Failed [<%= error.message %>',
      message: 'See console.',
      sound: 'Sosumi', // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
    })
    .apply(this, args);

  gutil.beep(); // Beep 'sosumi' again

  // Prevent the 'watch' task from stopping
  this.emit('end');
  cb();
}

/*
 * CSS Tasks
 */

/**
 * Delete style.css and style.min.css before we minify and optimize
 * https://www.npmjs.com/package/del
 */
async function cleanStyles(cb) {
  await del([`${paths.cssPath}/style.css`, `${paths.cssPath}/style.min.css`]);
  await del(`${paths.jsBuildPath}/scripts.js`);
  cb();
}

async function deleteBuild(cb) {
  await del(`${paths.buildPath}/css`);
  await del(`${paths.buildPath}/js`);
  await del(`${paths.buildPath}/images`);
  await del(`${paths.buildPath}/index.html`);
  cb();
}

/**
 * Sass linting.
 *
 * https://www.npmjs.com/package/gulp-sass-lint
 */
function runSassLint(cb) {
  src([
    `!${paths.scssPath}/**/*.scss`,
    `!${paths.scssPath}/base/html5-reset/_normalize.scss`,
    `!${paths.scssPath}/utilities/animate/**/*.*`,
  ])
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
  cb();
}

/**
 * Minify and optimize style.css.
 *
 * https://www.npmjs.com/package/gulp-cssnano
 * https://www.npmjs.com/package/gulp-plumber
 * https://www.npmjs.com/package/gulp-notify
 * https://www.npmjs.com/package/gulp-rename
 */
function minifycss(cb) {
  return (
    src(`${paths.cssPath}/style.css`)
      // Error handling
      .pipe(
        plumber({
          errorHandler: handleErrors,
        })
      )

      .pipe(
        cssMinify({
          safe: true, // Use safe optimizations.
        })
      )
      .pipe(rename('style.min.css'))
      .pipe(dest(paths.cssPath))
      .pipe(
        notify({
          message: 'Styles are built.',
        })
      )
  );

  cb();
}

/**
 * Compile Sass and run stylesheet through PostCSS.
 *
 * https://www.npmjs.com/package/gulp-sass
 * https://www.npmjs.com/package/gulp-postcss
 * https://www.npmjs.com/package/autoprefixer
 * https://www.npmjs.com/package/gulp-sourcemaps
 * https://www.npmjs.com/package/gulp-plumber
 */
function runPostCss(cb) {
  return (
    src(`${paths.scssPath}/style.scss`)
      // Deal with errors.
      .pipe(
        plumber({
          errorHandler: handleErrors,
        })
      )

      // Wrap tasks in a sourcemap
      .pipe(sourcemaps.init())
      // Compile Sass
      .pipe(
        sass({
          //includePaths: [].concat(bourbon, neat),
          errLogToConsole: true,
          outputStyle: 'expanded', // Options: nested, expanded, compact, compressed
        })
      )
      // Parse with PostCSS plugins.
      .pipe(
        postcss([
          autoprefixer(), // browserslist key added to package.json
        ])
      )

      // create the sourcemap
      .pipe(sourcemaps.write())

      // Create style.css.
      .pipe(dest(paths.cssPath))
      //SASS + CSS Injecting
      .pipe(browserSync.stream())
  );

  cb();
}
/**
 * Deal with our html files
 *
 */
function html(cb) {
  src(`${paths.srcPath}/**/*.html`).pipe(dest(paths.buildPath));
  cb();
}
/**
 *
 *
 */
function js(cb) {
  src(`${paths.jsSrcPath}/lib/**/*.js`).pipe(dest(`${paths.jsBuildPath}/lib`));
  `${paths.jsBuildPath}/lib`;

  src(`${paths.jsSrcPath}/*.js`)
    // Deal with errors.
    .pipe(plumber({ errorHandler: handleErrors }))
    // Start a sourcemap.
    .pipe(sourcemaps.init())
    // Convert ES6+ to ES2015.
    .pipe(
      babel({
        presets: [
          [
            '@babel/env',
            {
              targets: {
                browsers: ['last 2 versions'],
              },
            },
          ],
        ],
      })
    )
    // Append the sourcemap to project.js.
    .pipe(sourcemaps.write())
    .pipe(dest(paths.jsBuildPath))
    .pipe(browserSync.stream());
  cb();
}
/**
 * ConCatinate our JavaScipt
 *
 * https://www.npmjs.com/package/gulp-concat
 * https://www.npmjs.com/package/gulp-babel
 * https://www.npmjs.com/package/gulp-replace
 * https://www.npmjs.com/package/gulp-plumber
 */
function concatJs(cb) {
  src(`${paths.jsSrcPath}/*.js`)
    // Deal with errors.
    .pipe(plumber({ errorHandler: handleErrors }))
    // Start a sourcemap.
    .pipe(sourcemaps.init())
    // Convert ES6+ to ES2015.
    .pipe(
      babel({
        presets: [
          [
            '@babel/env',
            {
              targets: {
                browsers: ['last 2 versions'],
              },
            },
          ],
        ],
      })
    )
    // Concatenate partials into a single script.
    .pipe(concat(`theme.js`))
    // Append the sourcemap to project.js.
    .pipe(sourcemaps.write())
    .pipe(replace('    ', '\t'))
    // Save project.js
    .pipe(dest(paths.jsBuildPath))
    .pipe(browserSync.stream());

  cb();
}

/**
 * Uglify our JavaScript
 *
 * https://www.npmjs.com/package/gulp-uglify
 * https://www.npmjs.com/package/@babel/core
 * https://www.npmjs.com/package/gulp-plumber
 */
function uglifyJs(cb) {
  src(`${paths.jsBuildPath}/*.js`)
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(
      babel({
        presets: [
          [
            '@babel/env',
            {
              targets: {
                browsers: ['last 2 versions'],
              },
            },
          ],
        ],
      })
    )
    .pipe(
      uglify({
        mangle: false,
      })
    )
    .pipe(
      notify({
        message: 'Styles are built.',
      })
    )
    .pipe(dest(paths.jsBuildPath));

  cb(); // callback function
}

function jsLint(cb) {
  src([
    'src/js/*.js',
    '!src/js/*.min.js',
    '!Gruntfile.js',
    '!Gulpfile.js',
    '!node_modules/**',
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

  cb(); // callback function
}

/**
 * Compress our images
 * https://www.npmjs.com/package/gulp-imagemin
 */
function images(cb) {
  src(`${paths.imgSrcPath}/*`)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(paths.imgBuildPath));
  // body omitted
  cb();
}
/**
 *
 *
 */
function watcher(cb) {
  watch('src/**/*.html').on('change', series(html, browserSync.reload));
  watch(`${paths.scssPath}/**/*.scss`).on(
    'change',
    series(runPostCss, browserSync.reload)
  );
  watch('src/js/**/*.js').on('change', series(js, browserSync.reload));
  cb();
}

/**
 *
 *
 */
function server(cb) {
  browserSync.init({
    notify: false,
    open: false,
    server: {
      baseDir: paths.buildPath,
    },
  });
  cb();
}

function replacehtml(cb) {
  src(`${paths.srcPath}/index.html`)
    .pipe(
      htmlreplace({
        css: 'css/style.min.css',
        js: 'js/scripts.min.js',
      })
    )
    .pipe(dest(paths.buildPath));
  cb();
}

exports.cleanStyles = cleanStyles;

exports.html = html;

exports.js = js;

exports.runPostCss = runPostCss;

exports.minifycss = minifycss;

exports.images = images;

exports.concatJs = concatJs;

exports.uglifyJs = uglifyJs;

exports.runSassLint = runSassLint;

exports.jsLint = jsLint;

exports.replacehtml = replacehtml;

exports.deleteBuild = deleteBuild;

exports.styles = series(cleanStyles, runPostCss, minifycss);

exports.default = series(
  cleanStyles,
  parallel(html, series(runPostCss, minifycss), js),
  server,
  watcher
);

exports.build = series(
  deleteBuild,
  parallel(html, series(runPostCss, minifycss), js, images),
  uglifyJs,
  replacehtml,
  server,
  watcher
);
