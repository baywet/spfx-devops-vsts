# sp-fx-devops

The purpose of this repository is to demonstrate how to better integrate SharePoint Framework developments with Visual Studio Team Services in devops processes.

## Unit Tests

### Code coverage results and unit tests results in VSTS

In order to use a custom karmaJS configuration we need to edit the gulpfile provided by the yeoman template (`gulfile.js` L29-31)  
The provided configuration will reuse and override the default one provided by spfx modules `karma.config.js`  

We're doing a few things there:
- Provide a configuration for Junit test reporter: that will output test results in a format VSTS understands
- Provide a remap reporter for Coverage results: that will output code Coverage results in a formart VSTS understands
- Provide a remap reporter for Istanbul results: that will output code coverage results for Istanbul in a format VSTS understands

In order to use that configuration you need to install a few extra modules:
```
npm i karma-junit-reporter karma-remap-coverage karma-remap-istanbul -D
```

### Writing better unit tests
To make it easier writing unit tests we added some extra modules
```
npm i @types/chai-as-promised chai-as-promised@6.0.0 -D
```
*Currently PhantomJS doesn't support es6/2015 and SPFX doesn't provide polyfills for unit tests for 3rd party dependencies [see issue](https://github.com/SharePoint/sp-dev-docs/issues/736)*  
This will help you writing tests against async methods.  
Note that the following lines have been added in the unit test:  
```
/// <reference types="chai-as-promised" />
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
```

## Publishing to SharePoint
Elio Struyf wrote an awesome [blog post on the subject](https://www.eliostruyf.com/automate-publishing-of-your-sharepoint-framework-scripts-to-office-365-public-cdn/)  
However I took the liberty to improve the code a little bit in other to be able to provide credentials as arguments from VSTS.  
Notice the changes in `gulfile.js` L6-26.  
You'll also need to install the following modules:
```
npm i gulp-spsync-creds yargs -D
```

## Configuring VSTS
### Build
You'll find an example of the build definition in the `VSTS/build` directory.
### Release
You'll find an example of the release definition in the `VSTS/Release` directory.