var gulp = require('gulp'),
  shell =  require('gulp-shell')

gulp.task('test', shell.task('./node_modules/.bin/mocha --require node_modules/mithril-testing/common.js test/*.js'))

gulp.task('coverage', shell.task('./node_modules/istanbul/lib/cli.js cover node_modules/.bin/_mocha --require node_modules/mithril-testing/common.js test/*.js -- -R spec'))