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

if (system.env["OBJJ_INCLUDE_PATHS"])
    OBJJ_INCLUDE_PATHS.unshift.apply(OBJJ_INCLUDE_PATHS, system.env["OBJJ_INCLUDE_PATHS"].split(":"));

// bring the "window" object into scope.
// TODO: somehow make window object the top scope?
with (window)
{
// runs the objj repl or file provided in args
exports.run = function(args)
{
    if (args)
    {
        // we expect args to be in the format:
        //  1) "objj" path
        //  2) optional "-I" args
        //  3) real or "virtual" main.j
        //  4) optional program arguments

        // copy the args since we're going to modify them
        var argv = args.slice(2);

        if (argv[0] === "--version")
        {
            console.log(exports.fullVersionString());
            return;
        }

        while (argv.length && argv[0].indexOf('-I') === 0)
            OBJJ_INCLUDE_PATHS.unshift.apply(OBJJ_INCLUDE_PATHS, argv.shift().substr(2).split(':'));
    }

    if (argv && argv.length > 0)
    {
        var arg0 = argv.shift();
        var mainFilePath = FILE.canonical(arg0);

        exports.make_narwhal_factory(mainFilePath)(require, { }, module, system, console.log);

        if (typeof main === "function")
            main([arg0].concat(argv));

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
exports.make_narwhal_factory = function(path, basePath, filenameTranslateDictionary)
{
    return function(require, exports, module, system, print)
    {
        Executable.setCommonJSParameters("require", "exports", "module", "system", "print", "window");
        Executable.setCommonJSArguments(require, exports, module, system, print, window);
        filenameTranslateDictionary && Executable.setFilenameTranslateDictionary(filenameTranslateDictionary);
        Executable.fileImporterForURL(basePath ? basePath : FILE.directory(path))(path, YES);
    }
};

} // end "with"

var pkg = null;
function getPackage() {
    if (!pkg)
        pkg = JSON.parse(FILE.path(module.filename).directory().directory().join("package.json").read({ charset : "UTF-8" }));
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
    exports.run(system.args);

});