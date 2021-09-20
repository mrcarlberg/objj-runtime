#define DEBUG

#if DEBUG
#define DISPLAY_NAME(name) name.displayName = #name
#else
#define DISPLAY_NAME(name)
#endif

#define GLOBAL(name) name

#define COMMONJS
#define NODEJS

#define ENVIRONMENTS ["CommonJS","ObjJ"]

(function(mod)
{
    if (typeof exports == "object" && typeof module == "object")
        return mod(exports, require("objj-transpiler")); // CommonJS
    if (typeof define == "function" && define.amd)
        return define(["exports", "objj-transpiler"], mod); // AMD
    mod(this.objJRuntime || (this.objJRuntime = {}), ObjJCompiler); // Plain browser env
})(function(exports, ObjJCompiler)
{
    var NODEFILE = require("fs");
    var PATH = require("path");
    var sprintf = require("./printf").sprintf;

    exports.term = require("./term");
    exports.parser = require("./args");

    exports.jake = require("@objj/jake");
    exports.ObjJCompiler = ObjJCompiler;

    var window = exports.window = require("./browser").window;
	// setup OBJJ_HOME, OBJJ_INCLUDE_PATHS, etc
    window.OBJJ_HOME = exports.OBJJ_HOME = module.parent ? PATH.resolve(module.parent.filename, "../..") : process.cwd();

    var defaultFrameworksPath = PATH.join(window.OBJJ_HOME, "Frameworks");
    var frameworksPath = PATH.join(process.cwd(), "Frameworks");
    // FIXME: temporary
    var includepaths = [defaultFrameworksPath];

    if (defaultFrameworksPath !== frameworksPath)
        includepaths.unshift(frameworksPath);

    var OBJJ_INCLUDE_PATHS = global.OBJJ_INCLUDE_PATHS = exports.OBJJ_INCLUDE_PATHS = includepaths;

    var print = console.log;

    // Add extension for .j file so require('myfile.j') fill work

    var BuiltinModule = require("module");
    // Guard against poorly mocked module constructors. Probably unnecessary
    var Module = module.constructor.length > 1 ? module.constructor : BuiltinModule;

    Module._extensions['.j'] = function objJLoader(mod, filename) {
        return objj_importFile(filename, YES);
    }
