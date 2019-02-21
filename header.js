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

    var window = exports.window = require("./browser").window;
	// setup OBJJ_HOME, OBJJ_INCLUDE_PATHS, etc
    window.OBJJ_HOME = exports.OBJJ_HOME = PATH.resolve(module.parent.filename, "..");

    var frameworksPath = PATH.join(window.OBJJ_HOME, "Frameworks");

    var OBJJ_INCLUDE_PATHS = global.OBJJ_INCLUDE_PATHS = exports.OBJJ_INCLUDE_PATHS = [frameworksPath];

    var print = console.log;