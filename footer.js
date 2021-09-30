// Find all narwhal packages with Objective-J frameworks.
exports.objj_frameworks = [];
exports.objj_debug_frameworks = [];

/*var catalog = require("narwhal/packages").catalog;
for (var name in catalog)
{
    if (!catalog.hasOwnProperty(name))
        continue;

    var info = catalog[name];
    if (!info)
        continue;

    var frameworks = info["objj-frameworks"];
    if (frameworks) {
        if (!Array.isArray(frameworks))
            frameworks = [String(frameworks)];

        exports.objj_frameworks.push.apply(exports.objj_frameworks, frameworks.map(function(aFrameworkPath) {
            return FILE.join(info.directory, aFrameworkPath);
        }));
    }

    var debugFrameworks = info["objj-debug-frameworks"];
    if (debugFrameworks) {
        if (!Array.isArray(debugFrameworks))
            debugFrameworks = [String(debugFrameworks)];

        exports.objj_debug_frameworks.push.apply(exports.objj_debug_frameworks, debugFrameworks.map(function(aFrameworkPath) {
            return FILE.join(info.directory, aFrameworkPath);
        }));
    }
}*/

// push to the front of the array lowest priority first.
OBJJ_INCLUDE_PATHS.unshift.apply(OBJJ_INCLUDE_PATHS, exports.objj_frameworks);
OBJJ_INCLUDE_PATHS.unshift.apply(OBJJ_INCLUDE_PATHS, exports.objj_debug_frameworks);

if (((typeof system !== "undefined" && system) || process).env["OBJJ_INCLUDE_PATHS"])
    OBJJ_INCLUDE_PATHS.unshift.apply(OBJJ_INCLUDE_PATHS, ((typeof system !== "undefined" && system) || process).env["OBJJ_INCLUDE_PATHS"].split(":"));

// bring the "window" object into scope.
// TODO: somehow make window object the top scope?
with (window)
{
// runs the objj repl or file provided in args
exports.run = function(args, someCompilerOptions)
{
    if (args)
    {
        function help(status) {
          console.log("usage: " + require('path').basename(process.argv[1]) + " infile [--ecma3|--ecma5] [--strict-semicolons] [--track-comments]");
          console.log("        [--include-comments] [--include-comment-line-break]");
          console.log("        [--formatter <path>]  [--indent-tab] [--indent-width <n>] [--indent-string <string>]");
          console.log("        [--track-spaces] [--track-locations] [--no-objj] [--no-preprocess]");
          console.log("        [--no-debug-symbols] [--no-type-signatures] [--generate-objj]");
          console.log("        [--no-source-map] [-x | --xml] [-m | --multifiles] [-I<objj/include/paths>]");
          console.log("        [-Dmacro[([p1, p2, ...])][=definition]] [--help]");
          process.exit(status);
        }

        // we expect args to be in the format:
        //  1) "objj" [options] path [pgm-options]
        //  2) optional "-I" args
        //  3) real or "virtual" main.j
        //  4) optional program arguments

        var options = someCompilerOptions || {},
            acornOptions = {},
            objjOptions = process.env.OBJJ_OPT,
            argv = (objjOptions ? ObjectiveJ.utils.file.parse(objjOptions) : []).concat(args.slice(1)), // copy the args since we're going to modify them
            argv0 = argv.shift(),
            multipleFiles = false;

        // We loop as long as there is an option that starts with '-'
        while (argv0 && argv0.lastIndexOf('-', 0) === 0) {
            if (argv0 === "--version")
            {
                console.log(exports.fullVersionString());
            }
            else if (argv0 == "--ecma3") acornOptions.ecmaVersion = 3;
            else if (argv0 == "--ecma5") acornOptions.ecmaVersion = 5;
            else if (argv0 == "--strict-semicolons") acornOptions.strictSemicolons = true;
            else if (argv0 == "--track-comments") acornOptions.trackComments = true;
            else if (argv0 == "--include-comment-line-break") acornOptions.trackCommentsIncludeLineBreak = true;
            else if (argv0 == "--include-comments") options.includeComments = true, acornOptions.trackComments = true;
            else if (argv0 == "--track-spaces") acornOptions.trackSpaces = true;
            else if (argv0 == "--track-locations") acornOptions.locations = true;
            else if (argv0 == "--no-objj") acornOptions.objj = false;
            else if (argv0 == "--no-preprocess") acornOptions.preprocess = false;
            else if (argv0 == "--generate-objj") options.generateObjJ = true;
            //else if (argv0 == "--silent") silent = true;
            //else if (argv0 == "--old-safari-bug") options.transformNamedFunctionDeclarationToAssignment = true;
            else if (argv0 == "--no-source-map") options.sourceMap = false;
            else if (argv0 == "--no-debug-symbols") options.includeDebugSymbols = false;
            else if (argv0 == "--no-type-signatures") options.includeTypeSignatures = false;
            else if (argv0 == "--indent-width") options.indentationSpaces = parseInt(argv.shift());
            else if (argv0 == "--indent-string") {
              if (options.indentationType) {
                  console.log("Can't have both '--indent-string' and '--indent-tab'");
                  help(1);
              } else
                  options.indentationType = argv.shift();
            }
            else if (argv0 == "--indent-tab") {
              if (options.indentationType) {
                  console.log("Can't have both '--indent-string' and '--indent-tab'");
                  help(1);
              } else {
                  options.indentationType = "\t";
                  if (!options.indentationSpaces) options.indentationSpaces = 1;
              }
            }
            else if (argv0 == "--formatter") {
            var filePath = argv.shift(),
                relative = filePath.substring(0, 1) !== '/',
                jsonFile = JSON.parse(fs.readFileSync(relative ? path.resolve(process.cwd(), filePath) : filePath,'utf8'));

                options.formatDescription = jsonFile;
            }
            //else if (argv0 == "--output" || argv0 == "-o") output = process.argv[++i];
            else if (argv0.slice(0, 2) == "-D") (acornOptions.macros || (acornOptions.macros = [])).push(argv0.slice(2));
            else if (argv0 === "-x" || argv0 === "--xml") exports.messageOutputFormatInXML = true;
            else if (argv0 === "-m" || argv0 === "--multifiles") multipleFiles = true;
            else if (argv0 == "--help") help(0);
            else if (argv0 == "-") help(1);

            else if (argv0.lastIndexOf('-I', 0) === 0) {
                // If nothing after the '-I' take the next argument as path.
                // If not take the argument directly after the '-I' and allow multiple paths separated by ':'
                var filePaths = argv0.length === 2 ? [argv.shift()] : argv0.substr(2).split(':');
                OBJJ_INCLUDE_PATHS.unshift.apply(OBJJ_INCLUDE_PATHS, filePaths);
            }

            argv0 = argv.shift();
        }
    }

    if (argv0)
    {
        var mainFilePath = PATH.resolve(argv0);

        var callback = function() {
            if (typeof main === "function")
            {
                var arguments = [argv0];
                if (argv && argv.length > 0)
                    arguments = arguments.concat(argv);
                main(arguments);
            }
            else if (multipleFiles && (argv0 = argv.shift())) {
                mainFilePath = PATH.resolve(argv0);
                exports.make_narwhal_factory(mainFilePath, null, null, callback)(require, { }, module, typeof system !== "undefined" && system, console.log);
            }
            else
            {
                console.error("No main function is found for " + mainFilePath);
            }
        }

        // resolve and read all links
        while ((NODEFILE.existsSync(mainFilePath) && NODEFILE.lstatSync(mainFilePath).isSymbolicLink())) {
            var linkPath = NODEFILE.readlinkSync(mainFilePath);
            if (!PATH.isAbsolute(linkPath)) {
               mainFilePath = PATH.join(PATH.dirname(mainFilePath), linkPath);
            }
            mainFilePath = PATH.resolve(mainFilePath);
        }

        options.acornOptions = acornOptions;
        StaticResource.setCurrentCompilerFlags(options);
        exports.make_narwhal_factory(mainFilePath, null, null, callback)(require, { }, module, typeof system !== "undefined" && system, console.log);

        require("./timeout").serviceTimeouts();
    }
    else
    {
        exports.repl();
    }
}

exports.repl = function()
{
    var READLINE = require('readline-history');
    READLINE.createInterface({
        path: "/tmp/history",
        maxLength: 1234,
        input: process.stdin,
        output: process.stdout,
        next: function(rli) {
            rli.setPrompt("objj> ");
            rli.prompt();
            rli.on('line',function(line) {
                try {
                    var result = exports.objj_eval(line);
                    if (result !== undefined)
                        console.log(result);
                } catch (e) {
                    console.log(e);
                }
                require("./timeout").serviceTimeouts();
            });
        }
    });
};

// creates a narwhal factory function in the objj module scope
exports.make_narwhal_factory = function(path, basePath, filenameTranslateDictionary, aCallback)
{
    return function(require, exports, module, system, print)
    {
        Executable.setCommonJSParameters("require", "exports", "module", "system", "print", "window");
        Executable.setCommonJSArguments(require, exports, module, typeof system !== "undefined" && system, print, window);
        filenameTranslateDictionary && Executable.setFilenameTranslateDictionary(filenameTranslateDictionary);
        Executable.fileImporterForURL(basePath ? basePath : PATH.dirname(path))(path, YES, aCallback);
    }
};

} // end "with"

var pkg = null;
function getPackage() {
    if (!pkg)
        //pkg = JSON.parse(FILE.path(module.filename).directory().directory().join("package.json").read({ charset : "UTF-8" }));
        pkg = JSON.parse(NODEFILE.readFileSync(PATH.join("..", "..","package.json"), 'utf8'));
    return pkg;
}

exports.version = function() { return getPackage()["version"]; }
exports.revision = function() { return getPackage()["cappuccino-revision"]; }
exports.timestamp = function() { return new Date(getPackage()["cappuccino-timestamp"]); }

exports.fullVersionString = function() {
    var rev = exports.revision();
    return sprintf("objective-j %s (%04d-%02d-%02d %s)",
        exports.version(),
        exports.timestamp().getUTCFullYear(),
        exports.timestamp().getUTCMonth()+1,
        exports.timestamp().getUTCDate(),
        rev ? rev.slice(0,6) : null
    );
}

global.ObjectiveJ = {};

for (var key in exports)
    if (Object.prototype.hasOwnProperty.call(exports, key))
        global.ObjectiveJ[key] = exports[key];

if (require.main == module.id)
    exports.run((typeof system !== "undefined" && system.args) || process.argv);
});