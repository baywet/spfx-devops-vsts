'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const _ = require('lodash');
const spsync = require('gulp-spsync-creds').sync;
const argv = require('yargs').argv;


build.task('upload-to-sharepoint', { 
    execute: (config) => {
        return new Promise((resolve, reject) => {
            const deployFolder = require('./config/copy-assets.json');
            const folderLocation = `./${deployFolder.deployCdnPath}/**/*.js*`;
            return gulp.src(folderLocation)
            .pipe(spsync({
                "username": argv.username,
                "password": argv.password,
                "site": argv.targetUrl,
                "libraryPath": "SiteAssets/spfx",
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

