# grunt-filelist

> Making a filelist

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-filelist --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-filelist');
```

## The "filelist" task

### Overview
In your project's Gruntfile, add a section named `filelist` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  filelist: {
    dist: {
      options: {
        basePath   : 'test/imgs',
        outputPath : './assets/imgs'
      },
      files: {
        './assets/js/filelist.js': ['test/imgs/**/*']
      }
    }
  },
});
```

### Options

#### options.basePath
Type: `String`
Default value: `'img'`

Write an image directory name.

#### options.outputPath
Type: `String`
Default value: `'./assets/img'`

Write a path from a base html file.

## Release History
_(Nothing yet)_
