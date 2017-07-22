'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const _ = require('lodash');
const spsync = require('gulp-spsync-creds').sync;
const fs = require('fs');


build.task('upload-to-sharepoint', {
    execute: (config) => {
        const environment = {
            username: config.args['username'] || "",
            password: config.args['password'] || "",
            tenant: config.args['tenant'] || "",
            cdnSite: config.args['cdnsite'] || "",
            cdnLib: config.args['cdnlib'] || "",
        };

        return new Promise((resolve, reject) => {
            const deployFolder = require('./config/copy-assets.json');
            const folderLocation = `./${deployFolder.deployCdnPath}/**/*.js`;

            return gulp.src(folderLocation)
                .pipe(spsync({
                    "username": environment.username,
                    "password": environment.password,
                    "site": `https://${environment.tenant}.sharepoint.com/${environment.cdnSite}`,
                    "libraryPath": environment.cdnLib,
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
            const environment = {
                username: config.args['username'] || "",
                password: config.args['password'] || "",
                tenant: config.args['tenant'] || "",
                catalogSite: config.args['catalogsite'],
            };

            return new Promise((resolve, reject) => {
                  const pkgFile = require('./config/package-solution.json');
                  const folderLocation = `./sharepoint/${pkgFile.paths.zippedPackage}`;

                  return gulp.src(folderLocation)
                        .pipe(spsync({
                              "username": environment.username,
                              "password": environment.password,
                              "site": `https://${environment.tenant}.sharepoint.com/${environment.catalogSite}`,
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

