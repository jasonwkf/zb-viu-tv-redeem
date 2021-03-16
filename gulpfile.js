'use strict'

const SITE_DEST = './web'
const ASSETS_DEST = './web/dist'
const ASSETS_SRC = './_src'

const gulp = require('gulp')
const browserSync = require('browser-sync')

const pug = require('gulp-pug'); // compile pug
const path = require('path');
const data = require('gulp-data') // complie data
const merge = require('gulp-merge-json') //merge json file

const sass = require('gulp-sass')
const stylelint = require('gulp-stylelint')
const autoprefixer = require('gulp-autoprefixer') // adds vendors prefixes https://autoprefixer.github.io/

const mkdirp = require('mkdirp') // create directory
const del = require('del') // perform del task 
const gulpif = require('gulp-if') //if else condition
const fs = require('file-system') // setting up file directory

const concat = require('gulp-concat')
const babel = require('gulp-babel') //for babel task
const eslint = require('gulp-eslint') //for babel task linter checker
const stripDebug = require('gulp-strip-debug') // console debugging
const uglify = require('gulp-uglify'); // min js babel

const cleanCSS = require('gulp-clean-css'); //<--clean up css to inline css
const sourcemaps = require('gulp-sourcemaps'); 
const gcmq = require('gulp-group-css-media-queries') //<-- group media query together
const argv = require('yargs').argv //create argument values
const isProduction = argv.prod //arguments value 1
const isDev = argv.dev //arguments value 2
const isFixStyle = argv.fix //arguments value 3

const newer = require('gulp-newer')
const svgmin = require('gulp-svgmin')
const imagemin = require('gulp-imagemin')
const imageminPngquant = require('imagemin-pngquant')

//to compile node modules
let vendors = [
  './node_modules/jquery/dist/jquery.min.js',
  './node_modules/popper.js/dist/umd/popper.min.js',
  './node_modules/bootstrap/dist/js/bootstrap.min.js',
  './node_modules/gsap/src/minified/TweenMax.min.js',
  './node_modules/gsap/src/minified/plugins/ScrollToPlugin.min.js',
  './node_modules/moment/min/moment.min.js',
  './node_modules/axios/dist/axios.min.js',
  './node_modules/vanilla-lazyload/dist/lazyload.min.js',
  ASSETS_SRC + '/js/plugins/**/*.js'
]
//delete files and folder
gulp.task('clean:images', function(){
  return del([
    ASSETS_DEST+ '/images'
  ])
})

gulp.task('clean:css', () => {
  return del([
    ASSETS_DEST + '/css'
  ])
})

gulp.task('clean:js', () => {
  return del([
    ASSETS_DEST + '/js'
  ])
})
//reload browswer
gulp.task('reload', (done) => {
  browserSync.reload()
  done()
})

gulp.task('move', () => {
  return gulp.src([
    ASSETS_SRC + '/fonts/**/*.{eot,svg,ttf,woff,woff2,otf}',
    ASSETS_SRC + '/media/**/*.mp4',
    ASSETS_SRC + '/data/static.json',
    ASSETS_SRC + '/css/**/*.css'
  ], { base: ASSETS_SRC })
    .pipe(gulp.dest(ASSETS_DEST))
})

//compile fontawesome
gulp.task('fontawesome-free', function(){
  return gulp.src([
    'node_modules/@fortawesome/fontawesome-free/webfonts/*'
  ])
  .pipe(gulp.dest(ASSETS_DEST + '/fonts/fontawesome-free'))
})

//minify vector image
gulp.task('min:svg', () => {
  return gulp.src([
    ASSETS_SRC + '/images/**/*.svg'
  ])
    .pipe(svgmin((file) => {
      let prefix = path.basename(file.relative, path.extname(file.relative))
      return {
        js2svg: {
          indent: 2
        },
        plugins: [
          {
            removeViewBox: false // remove viewbox attr https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
          },
          {
            removeDoctype: true // Remove DOCTYPE declaration
          },
          {
            removeComments: true // Remove comments
          },
          {
            mergePaths: false // Merge multiple Paths into one.
          },
          {
            convertShapeToPath: false //Converts basic shape to more compact path. http://www.w3.org/TR/SVG/shapes.html
          },
          {
            cleanupIDs: true //Remove unused and minify used IDs
          },
          {
            addClassesToSVGElement: {
              classNames: ['svg', 'svg-' + prefix + ''] //Add classnames to an outer <svg> element
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest(ASSETS_DEST + '/images/'))
})

//minify images
gulp.task('min:images', () => {
  return gulp.src([
    ASSETS_SRC + '/images/**/*.{gif,jpg,png,ico}'
  ])
    .pipe(newer(ASSETS_DEST + '/images/'))
    .pipe(imagemin([
      imagemin.gifsicle({
        optimizationLevel: 3
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imageminPngquant({
        speed: 1,
        quality: [0.7, 0.8]
      })
    ]))
    .pipe(gulp.dest(ASSETS_DEST + '/images/'))
})

gulp.task('imagemin', gulp.series(['min:svg','min:images']))

gulp.task('pug:data', () => {
  return gulp.src([
    ASSETS_SRC + '/data/**/_*.json'
  ])
    .pipe(merge({
      fileName: 'static.json',
      edit: (json, file) => {
        return json
      }
    }))
    .pipe(gulp.dest(ASSETS_SRC + '/data'))
})

gulp.task('pug:html', () => {
  mkdirp(SITE_DEST, (err) => {
    if (err) {
      console.log(err)
    } else {
      // console.log('site folder created!')
    }
  })

  return gulp.src([
    ASSETS_SRC + '/templates/**/*.pug',
    '!' + ASSETS_SRC + '/templates/**/_*/**'
  ])
    .pipe(data((file) => {
      return JSON.parse(
        fs.readFileSync(ASSETS_SRC + '/data/static.json')
      )
    }))
    .pipe(data((file) => {
      // compute relative root path to use within templates
      const relativePath = path.relative(file.base, file.path.replace(/.pug$/, '.html'))
      const depth = (relativePath.match(/\//g) || []).length
      const relativeRootPath = './' + new Array(depth + 1).join('../')
      return {
        relativeRootPath: relativeRootPath
      }
    }))
    .pipe(pug({
      basedir: './',
      pretty: true,
      locals: {
        isProd: isProduction,
        isDev: isDev
      }
    }))
    .pipe(gulp.dest(SITE_DEST))
})
//group task
gulp.task('templates', gulp.series(['pug:data', 'pug:html'])) //group compile html

gulp.task('stylelint', () => {
  return gulp.src([
    ASSETS_SRC + '/scss/**/*.scss',
    '!' + ASSETS_SRC + '/scss/libs/**/*.scss'
  ])
    .pipe(stylelint({
      fix: isFixStyle,
      failAfterError: false,
      reporters: [
        {
          formatter: 'string',
          console: true
        }
      ]
    }))
    .pipe(gulpif(isFixStyle, gulp.dest(ASSETS_SRC + '/scss/')))
})
//sasss compile
gulp.task('sass', function (){
  //1. where is my scss file
return gulp.src( ASSETS_SRC + '/scss/**/*.scss')
  //2. pass the file to compiler
  .pipe(sass({
    includePaths:[
      'node_modules'
    ], //include bootstrap to complie
    outputStyle: 'expanded' //css expand to put end curly bracket to next line
  }).on('error',sass.logError))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 4 version'],
    cascade: false
  }))
  .pipe(gcmq())
  .pipe(gulpif(isProduction, cleanCSS()))//inline css if production gulp build
  .pipe(gulpif(!isProduction, sourcemaps.write('./'))) //
  //3. compile to where
  .pipe(gulp.dest( ASSETS_DEST + '/css/'))
  //4. stream changes to all browser
  // .pipe(browserSync.stream());
})

gulp.task('css', gulp.series(['stylelint', 'sass']))

gulp.task('eslint', () => {
  return gulp.src([
    ASSETS_SRC + '/js/app/**/*.js'
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    // .pipe(eslint.failAfterError())
})
//compile node module
gulp.task('vendor:js', () => {
  return gulp.src(vendors)
    .pipe(gulpif(isProduction, stripDebug()))
    .pipe(concat('vendor.js'))
    .pipe(gulpif(isProduction, uglify()))
    .pipe(gulp.dest(ASSETS_DEST + '/js'))
})

//compile babel
gulp.task('babel:js', () => {
  return gulp.src([
    ASSETS_SRC + '/js/app/**/*.js'
  ])
    .pipe(gulpif(isProduction, stripDebug()))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulpif(isProduction, uglify()))
    .pipe(gulp.dest(ASSETS_DEST + '/js'))
})

gulp.task('js', gulp.series(['eslint','vendor:js','babel:js'])) //group compile js
//gulp default to compile fontawesome, css
gulp.task('default', gulp.series(['fontawesome-free','imagemin','templates','css','js','move']))
// when build perform task
gulp.task('build', gulp.series(['clean:css', 'clean:js', 'clean:images','default']))

gulp.task('watch', () => {
  gulp.watch([
    ASSETS_SRC + '/data/**/_*.json',
    ASSETS_SRC + '/templates/**/*.pug'
  ], gulp.series(['templates', 'reload']))

  gulp.watch([
    ASSETS_SRC + '/images/**/*.{gif,jpg,png,svg,ico}'
  ], gulp.series(['imagemin', 'reload']))

  gulp.watch([
    ASSETS_SRC + '/scss/**/*.scss'
  ], gulp.series(['css', 'reload']))

  gulp.watch([
    ASSETS_SRC + '/js/app/**/*.js'
  ], gulp.series(['js', 'reload']))
})

gulp.task('server:start', () => {
  browserSync({
    server: SITE_DEST
  })
})
//start browerSync and watch chnges
gulp.task('dev', gulp.parallel(['server:start', 'watch']))

//build and start watch and server
gulp.task('serve', gulp.series(['default', 'dev']))