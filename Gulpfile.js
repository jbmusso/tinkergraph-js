var gulp = require('gulp');
var mocha = require('gulp-mocha');
var args = require('yargs').argv;
var chai = require('chai');

function printError(error) {
  console.error('\nError:', error.plugin);
  console.error(error.message);
}

function printEvent(event) {
  console.log('File', event.type +':', event.path);
}


gulp.task('test', function() {
  assert = chai.assert;

  gulp.src(['test/structure/**/*'])
      .pipe(mocha({
        reporter: 'spec',
        bail: !!args.bail,
      }))
      .on('error', printError);
});

gulp.task('default', ['dev']);

gulp.task('watch', function() {
  gulp.watch(['src/**/*', 'test/**/*', 'node_modules/gremlin-core-js/**/*', '!node_modules/gremlin-core-js/node_modules/**/*', 'index.js'], ['test'])
    .on('change', printEvent);
});

gulp.task('dev', ['test', 'watch']);
