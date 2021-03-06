const fs = require('fs')

const gulp = require('gulp')
const gulpUtil = require('gulp-util')

const browserify = require('browserify')
const envify = require('envify/custom')
const minifyify = require('minifyify')
const tsify = require('tsify')
const watchify = require("watchify")

const ENTRY = {
  src: './src/index.ts',
  test: './test/test.ts',
  demo: './demo/demo.ts'
}
const TSCONFIG = require('./tsconfig.json')
const ENV = {
  dev: { NODE_ENV: 'development' },
  prod: { NODE_ENV: 'production' }
}

gulp.task('default', [])

gulp.task('build', () => {
  
})

gulp.task('build:demo', () => {
  const bundler = browserify({ debug: true })
    .add(ENTRY.demo)
    .plugin(tsify, TSCONFIG.compilerOptions)
    .transform(envify(ENV.dev))
    .plugin(minifyify)    
    .on('update', bundle)
    .on('log', gulpUtil.log)
    .on('error', error => console.error(error.toString()))

  bundle()

  function bundle () {
    bundler.bundle(function () {}).pipe(fs.createWriteStream('./demo/demo.js'))
  }
})

gulp.task('test', () => {

})

gulp.task('test:build', () => {
  const bundler = browserify()
    .add(ENTRY.test)
    .plugin(tsify, TSCONFIG.compilerOptions)
    .plugin(watchify)
    .transform(envify(ENV.dev))
    .on('update', bundle)
    .on('log', gulpUtil.log)
    .on('error', error => console.error(error.toString()))

  bundle()

  function bundle () {
    console.log()
    bundler.bundle().pipe(fs.createWriteStream('./test/test.js'))
  }
})