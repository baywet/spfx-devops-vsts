'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const _ = require('lodash');
const spsync = require('gulp-spsync-creds').sync;
const fs = require('fs');
const sppkgDeploy = require('node-sppkg-deploy');


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
      const folderLocation = `./${deployFolder.deployCdnPath}/**/*.*`;

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

            
      return gulp.src(folderLocation)        .pipe(spsync({          
        "username": environment.username,
                  "password": environment.password,
                  "site": `https://${environment.tenant}.sharepoint.com/${environment.catalogSite}`,
                  "libraryPath": "AppCatalog",
                  "publish": true        
      }))        .on('finish', resolve);    
    });  
  }
});

build.task('deploy-sppkg', {
  execute: (config) => {
    const environment = {
      username: config.args['username'] || "",
      password: config.args['password'] || "",
      tenant: config.args['tenant'] || "",
      catalogSite: config.args['catalogsite'],
    };

    const pkgFile = require('./config/package-solution.json');
    if (pkgFile) {
      // Retrieve the filename from the package solution config file
      let filename = pkgFile.paths.zippedPackage;
      // Remove the solution path from the filename
      filename = filename.split('/').pop();
      // Retrieve the skip feature deployment setting from the package solution config file
      const skipFeatureDeployment = pkgFile.solution.skipFeatureDeployment ? pkgFile.solution.skipFeatureDeployment : false;
      // Deploy the SharePoint package
      return sppkgDeploy.deploy({
        username: environment.username,
        password: environment.password,
        tenant: environment.tenant,
        site: environment.catalogSite,
        filename: filename,
        skipFeatureDeployment: skipFeatureDeployment,
        verbose: true
      });
    }
  }
});

build.initialize(gulp);
var buildConfig = build.getConfig();
var karmaTask = _.find(buildConfig.uniqueTasks, ['name', 'karma']);
karmaTask.taskConfig.configPath = './config/karma.config.js';
