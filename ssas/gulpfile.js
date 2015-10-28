var events = require('events');

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['./www/js/cart.js']
};

gulp.task('default', ['sass', 'lint']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('lint', function(done) {
  gulp.src('./www/js/cart.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', {
      verbose: true
    }))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

var bower = require('bower');
var del = require('del');
var angularFilesort = require('gulp-angular-filesort');
var cached = require('gulp-cached');
var html2js = require('gulp-html2js');
var inject = require('gulp-inject');
var jshint = require('gulp-jshint');
var ngAnnotate = require('gulp-ng-annotate');
var remember = require('gulp-remember');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var lazypipe = require('lazypipe');
var map = require('map-stream');
var notifier = require('node-notifier');
var sh = require('shelljs');
var series = require('stream-series');

var del = require('del');
var taskNu = 0;

var config = {
  clean: {
    src: [
      'www/dist/**/*'
    ]
  },
  libJs: {
    src: [
      'ionic/js/ionic.bundle.min.js',
      'angular-translate/angular-translate.min.js',
      'ngCordova/dist/ng-cordova.min.js',
      'js-md5/build/md5.min.js',
      'angular-ios9-uiwebview/angular-ios9-uiwebview.patch.js'
    ],
    opt: {
      cwd: 'www/lib/',
      base: 'www/',
    },
    dest: './www/dist/'
  },
  libFonts: {
    src: [
      '**/fonts/**/*'
    ],
    opt: {
      cwd: 'www/lib/',
      base: 'www/',
    },
    dest: './www/dist/'
  },
  userJs: {
    src: [
      '**/*.js',
      '!lib/**/*',
      '!dist/**/*'
    ],
    opt: {
      cwd: 'www/',
      base: 'www/'
    },
    dest: './www/dist/',
  },
  injectHtmlProd: {
    src: 'index.html',
    opt: {
      cwd: 'www/',
      base: 'www/'
    },
    source: [
      '!www/dist/lib*.js',
      'www/dist/production*.js',
      'www/dist/template-app*.js'
    ],
    dest: 'www/',
  },
  injectHtmlDev: {
    src: 'index.html',
    opt: {
      cwd: 'www/',
      base: 'www/'
    },
    source: [
      'www/dist/js/services.js',
      'www/dist/js/app.js',
      'www/dist/**/*.js',
      '!www/dist/template-app.js',
      '!www/dist/lib.js'
    ],
    sourceOpt: {
      read: false
    },
    dest: 'www/',
  },
  'html2js': {
    'src': [
      '**/*.html',
      '!lib/**/*',
      '!dist/**/*',
      '!index.html'
    ],
    'opt': {
      'cwd': 'www/',
      'base': 'www/'
    },
    'config': {
      'outputModuleName': 'starter',
      'base': 'www/',
      'useStrict': false
    },
    'name': 'template-app.js',
    'dest': 'www/dist'
  },
};

var myReporter = function() {
  return map(function(file, cb) {
    if (!file.jshint.success) {
      var isFirst = true;
      file.jshint.results.forEach(function(data) {
        if (data.error) {
          console.log(file.path + ': line ' + data.error.line + ', col ' + data.error.character + ', code ' + data.error.code + ', ' + data.error.reason);
          if (isFirst) {
            notifier.notify({
              'title': (data.error.line + ':' + data.error.character + ' ' + data.error.reason),
              'subtitle': file.relative.replace(/.*\//gi, ''),
              'message': ' '
            });
            isFirst = false;
          }
        }
      });
    }
    cb(null, file);
  });
};


gulp.task('clean', function(cb) {
  return del(config.clean.src, cb);
});

// 非lib压缩脚本
gulp.task('userJsProd', function() {
  return gulp.src(config.userJs.src, config.userJs.opt)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default')) // Console output
    .pipe(ngAnnotate())
    .pipe(angularFilesort())
    .pipe(concat('production.js'))
    .pipe(uglify({
      compress: {
        drop_console: true
      }
    }))
    .pipe(gulp.dest(config.userJs.dest));
});

gulp.task('injectHtmlProd', ['htmljs', 'userJsProd', 'sassProd', 'copyFonts'], function() {
  return gulp
    .src(config.injectHtmlProd.src, config.injectHtmlProd.opt)
    .pipe(inject(
      series(
        gulp
        .src([
          'www/dist/css/**/*.min.css'
        ]),
        gulp
        .src([
          'www/css/**/*.css',
          '!www/css/ionic.app*'
        ])
        .pipe(concat('user.css'))
        .pipe(minifyCss({
          keepSpecialComments: 0
        }))
        .pipe(rename({
          extname: '.min.css'
        }))
        .pipe(gulp.dest('./www/dist/css')),
        // lib 在前, 其它js在后
        gulp
        .src(config.libJs.src, config.libJs.opt)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('www/dist/')),

        gulp
        .src(config.injectHtmlProd.source)
      ), {
        transform: function(filepath) {
          arguments[0] = filepath.replace('/www/', '');
          return inject.transform.apply(inject.transform, arguments);
        }
      }
    ))
    .pipe(gulp.dest('www/'));
});


gulp.task('htmljs', function() {
  return gulp.src(config.html2js.src, config.html2js.opt)
    .pipe(html2js(config.html2js.config))
    .pipe(concat(config.html2js.name))
    .pipe(gulp.dest(config.html2js.dest));
});




gulp.task('copyFonts', function() {
  return gulp.src(config.libFonts.src, config.libFonts.opt)
    .pipe(gulp.dest(config.libFonts.dest))
});

gulp.task('userJsDev', function() {
  return gulp.src(config.userJs.src, config.userJs.opt)
    // .pipe(cached('js')) // 只传递更改过的文件
    // .pipe(jshint('.jshintrc'))
    // .pipe(myReporter()) // 对这些更改过的文件做一些特殊的处理...
    // .pipe(remember('js')) // 把所有的文件放回 stream
    .pipe(gulp.dest(config.userJs.dest))
});

gulp.task('injectHtmlDev', ['userJsDev', 'htmljs', 'sassDev'], function() {
  gulp
    .src(config.injectHtmlDev.src, config.injectHtmlDev.opt)
    .pipe(inject(
      series(
        gulp.src([
          'www/css/ionic.app.css',
          'www/css/style.css',
          'www/css/toast.css'
        ]),
        // lib 在前, 其它js在后
        gulp
        .src(config.libJs.src, config.libJs.opt)
        // .pipe(concat('lib.js'))
        .pipe(gulp.dest('www/dist/')),
        // 其它js在后
        gulp.src([
          'www/dist/**/*.js',
          '!www/dist/lib/**/*.js',
          '!www/dist/lib.js'
        ])
        .pipe(angularFilesort())
      ), {
        transform: function(filepath) {
          arguments[0] = filepath.replace('/www/', '');
          return inject.transform.apply(inject.transform, arguments);
        }
      }
    ))
    .pipe(gulp.dest(config.injectHtmlDev.dest))
    .on('end', function() {
      taskNu--;
      if (taskNu >= 1) {
        gulp
          .start('injectHtmlDev');
      }
      else {
        taskNu = 0;
      }
    });
});

gulp.task('watchDev', function() {
  var watcher = gulp.watch([
    'scss/**/*.scss',
    'www/**/*',
    '!www/dist/**/*',
    '!www/index.html',
    '!www/css/**/*'
  ]);
  watcher
    .on('change', function(event) {
      console.info(event.type, event.path);
      taskNu++;
      if (taskNu === 1) {
        gulp
          .start('injectHtmlDev');
      }
      else if (taskNu >= 2) {
        taskNu = 2;
      }
    });
});

gulp.task('dev', ['injectHtmlDev'], function() {
  gulp.start('watchDev');
});

gulp.task('prod', ['clean'], function() {
  gulp.start('injectHtmlProd');
});

gulp.task('sassDev', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('sassProd', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./www/dist/css'))
    .on('end', done);
});


// change  `ssas/ionic.project` to next text to start gulp dev
/* 
{
  "name": "ssas",
  "app_id": "608e6e24",
  "proxies": [
    {
      "path": "/m",
      "proxyUrl": "http://zdf.jooau.com/index.php/m"
    },
    {
      "path": "/data",
      "proxyUrl": "http://bbc.jooau.com/zhongshihua/data"
    }
  ],
  "gulpStartupTasks": [
    "sass",
    "dev"
  ],
  "watchPatterns": [
    "www/index.html"
  ]
}
 */
