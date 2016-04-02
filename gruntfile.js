module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '\n'
      },
      dist: {
        src: [
          'header.js',
          'Objective-J/OldBrowserCompatibility.js',
          'Objective-J/DebugOptions.js',
          'Objective-J/json2.js',
          'Objective-J/sprintf.js',
          'Objective-J/CPLog.js',
          'Objective-J/Constants.js',
          'Objective-J/EventDispatcher.js',
          'Objective-J/CFHTTPRequest.js',
          'Objective-J/CFPropertyList.js',
          'Objective-J/CFDictionary.js',
          'Objective-J/CFError.js',
          'Objective-J/CFNetworkErrors.js',
          'Objective-J/CFData.js',
          'Objective-J/CFURL.js',
          'Objective-J/MarkedStream.js',
          'Objective-J/CFBundle.js',
          'Objective-J/StaticResource.js',
//          'Objective-J/Preprocessor.js',
//          'Objective-J/acorn.js',
//          'Objective-J/acornwalk.js',
//          'Objective-J/ObjJAcornCompiler.js',
          'Objective-J/FileDependency.js',
          'Objective-J/Executable.js',
          'Objective-J/FileExecutable.js',
          'Objective-J/Runtime.js',
          'Objective-J/Eval.js',
          'Objective-J/Debug.js',
          'Objective-J/Bootstrap.js',
          'footer.js'
        ],
        dest: 'build/objective-j.js',
        nonull: true
      }
    },
    preprocess: {

    }
  });

  grunt.registerTask('preprocess', 'Preprocess the concated Javascript file', function() {
    var fs = require('fs');
    var compiler = require("objj-transpiler");
    var infile = "build/objective-j.js";
    var source = fs.readFileSync(infile, "utf8");

    compiled = compiler.compile(source, infile, null);
    var warnings = compiler.warningsAndErrors,
        anyErrors = false;

    if (warnings) for (var i = 0; i < warnings.length; i++)
    {
        var warning = warnings[i],
            message = compiler.prettifyMessage(warning);

        // Set anyErrors to 'true' if there are any errors in the list
        anyErrors = anyErrors || warning.messageType === "ERROR";
        console.log(message);
    }
    if (anyErrors) throw "Compiler Error";
    fs.writeFileSync("lib/objective-j.js", compiled.code());
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat', 'preprocess']);
};