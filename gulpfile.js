'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const _ = require('lodash');
const spsync = require('gulp-spsync-creds').sync;
const argv = require('yargs').argv;


build.task('upload-to-sharepoint', {
  execute: (config) => {
    if (config.production) {
      environment.username =  config.production ? config.args['username'] || "";
      environment.password = config.args['password'] || "";
      environment.tenant = config.args['tenant'] || "";
      environment.cdnSite = config.args['cdnsite'] || "";
      environment.cdnLib = config.args['cdnlib'] || "";
    }

    return new Promise((resolve, reject) => {
      const deployFolder = require('./config/copy-assets.json');
      const folderLocation = `./${deployFolder.deployCdnPath}/**/*.js`;

      return gulp.src(folderLocation)
        .pipe(spsync({
          "username": environment.username,
          "password": config.environment ? environment.password : development.password,
          "site": `https://${config.environment ? environment.tenant : development.tenant}.sharepoint.com/${config.environment ? environment.cdnSite : development.cdnSite}`,
          "libraryPath": config.environment ? environment.cdnLib : development.cdnLib,
          "publish": true
        }))
        .on('finish', resolve);
    });
  }
});

build.initialize(gulp);
var buildConfig = build.getConfig();
var karmaTask = _.find(buildConfig.uniqueTasks, ['name', 'karma']);
karmaTask.taskConfig.configPath = './config/karma.config.js';

