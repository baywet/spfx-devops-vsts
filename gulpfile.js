'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const _ = require('lodash');
const spsync = require('gulp-spsync-creds').sync;
const fs = require('fs');


build.task('upload-to-sharepoint', {
  execute: (config) => {
    if (config.production) {
      environment.username = config.args['username'] || "";
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

build.task('update-manifest', {
  execute: (config) => {
    return new Promise((resolve, reject) => {
      const cdnPath = config.args['cdnpath'] || "";
      let json = JSON.parse(fs.readFileSync('./config/write-manifests.json'));
      json.cdnBasePath = cdnPath;
      fs.writeFileSync('./config/write-manifests.json', JSON.stringify(json));
      resolve();
    });
  }
});

build.task('upload-app-pkg', {
  execute: (config) => {
    environmentInfo.username = config.args['username'] || environmentInfo.username;
    environmentInfo.password = config.args['password'] || environmentInfo.password;
    environmentInfo.tenant = config.args['tenant'] || environmentInfo.tenant;
    environmentInfo.catalogSite = config.args['catalogsite'] || environmentInfo.catalogSite;
 
    return new Promise((resolve, reject) => {
      const pkgFile = require('./config/package-solution.json');
      const folderLocation = `./sharepoint/${pkgFile.paths.zippedPackage}`;
 
      return gulp.src(folderLocation)
        .pipe(spsync({
          "username": environmentInfo.username,
          "password": environmentInfo.password,
          "site": `https://${environmentInfo.tenant}.sharepoint.com/${environmentInfo.catalogSite}`,
          "libraryPath": "AppCatalog",
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

