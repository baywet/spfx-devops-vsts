"use strict";
var existingKarmaConfig = require('@microsoft/sp-build-web/lib/karma/karma.config');
var _ = require('lodash');
var junitReporter = require('karma-junit-reporter');

module.exports = function (config) {
    existingKarmaConfig(config);
    config.reporters.push('junit');
    config.junitReporter = {
      outputDir: 'temp/', // results will be saved as $outputDir/$browserName.xml
      outputFile: 'test-results.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
      suite: 'karma', // suite will become the package name attribute in xml testsuite element
      useBrowserName: true, // add browser name to report and classes names
    };
    config.plugins.push(junitReporter);
};
