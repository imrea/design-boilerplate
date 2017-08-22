import bs from 'browser-sync';
import gulp from 'gulp';
import loadGulpPlugins from 'gulp-load-plugins';
import path from 'path';
import rs from 'run-sequence';
import del from 'del';
import webpack from 'webpack-stream';

const $ = loadGulpPlugins();

const server = bs.create();

const PATH = {
  src: './',
  dest: './assets',
  fonts: [
    'node_modules/font-awesome/fonts/*'
  ]
};

const BABEL_OPTS = {
  presets: [
    [
      "env",
      {
        "targets": {
          "browsers": ["last 2 versions", "ie >= 7"]
        },
        "modules": false
      }
    ]
  ]
};

function getInjectStreamFor(componentName) {
  // Watch out, to pass this array to gulp-inject with the spread syntax (...)
  return [
    gulp.src(path.join(PATH.src, 'scss', componentName, '**/*.scss'), { read: false }),
    {
      name: componentName,
      relative: true,
      // Disable inject logging
      quiet: true,
      // removeTags: true,
      // https://github.com/klei/gulp-inject/issues/135
      // empty: true
    }
  ];
}

gulp.task('clean', done => {
  del(path.join(PATH.dest, '{css,js,fonts}')).then(_paths => done());
})

gulp.task('fonts', _done => {
  return gulp
    .src(PATH.fonts)
    .pipe(gulp.dest(path.join(PATH.dest, 'fonts')))
})

gulp.task('css', _done => {
  return gulp
    .src(path.join(PATH.src, 'scss', '*.scss'))
    .pipe($.inject(...getInjectStreamFor('layout')))
    .pipe($.inject(...getInjectStreamFor('components')))
    .pipe($.inject(...getInjectStreamFor('pages')))
    .pipe($.inject(...getInjectStreamFor('themes')))
    .pipe($.inject(...getInjectStreamFor('overrides')))
    .pipe($.sourcemaps.init())
      .pipe($.sass({ includePaths: [ './node_modules' ] }).on('error', $.sass.logError))
      .pipe($.autoprefixer({ browsers: [ 'last 2 versions' ] }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(PATH.dest, 'css')))
    .pipe(server.stream({ match: '**/*.css' }))
})

gulp.task('js', done => {
  return gulp.src('js/main.js')
    .pipe(webpack({
      output: {
        filename: 'main.js'
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: BABEL_OPTS
            }
          }
        ]
      },
      // devtool: 'inline-source-map'
      devtool: false
    }))
    .on('error', function(error) { this.emit('end'); })
    .pipe(gulp.dest(path.join(PATH.dest, 'js')));
})

gulp.task('browsersync', done => {
  server.init(
    {
      server: PATH.src,
      open: false,
      files: [
        '*.html',
        // 'assets/css/*.css'
        'assets/js/*.js',
        'assets/img/**/*'
      ]
    },
    done
  );
})

gulp.task('watch', done => {
  gulp.watch(path.join('scss', '**/*'), { cwd: './' }, ['css']);
  gulp.watch(path.join('js', '**/*'), { cwd: './' }, ['js']);
})

gulp.task('build', done => {
  rs('clean', ['fonts', 'css', 'js'], done);
});

gulp.task('serve', done => {
  rs('build', 'browsersync', 'watch', done);
});
