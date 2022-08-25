(function(mod)
{
    if (typeof exports == "object" && typeof module == "object")
        return mod(exports, require("objj-transpiler"));
    if (typeof define == "function" && define.amd)
        return define(["exports", "objj-transpiler"], mod);
    mod(this.objJRuntime || (this.objJRuntime = {}), ObjJCompiler);
})(function(exports, ObjJCompiler)
{
    var NODEFILE = require("fs");
    var PATH = require("path");
    var sprintf = require("./printf").sprintf;
    exports.utils = require("@objj/utils");
    exports.parser = exports.utils.args;
    exports.term = exports.utils.term;
    exports.jake = require("@objj/jake");
    exports.ObjJCompiler = ObjJCompiler;
    var window = exports.window = require("./browser").window;
    window.OBJJ_HOME = exports.OBJJ_HOME = module.parent ? PATH.resolve(module.parent.filename, "../..") : process.cwd();
    var defaultFrameworksPath = PATH.join(window.OBJJ_HOME, "Frameworks");
    var defaultCappuccinoFrameworkPath = PATH.join(window.OBJJ_HOME, "../cappuccino/Frameworks");
    var frameworksPath = PATH.join(process.cwd(), "Frameworks");
    var includepaths = [defaultFrameworksPath, defaultCappuccinoFrameworkPath];
    if (defaultFrameworksPath !== frameworksPath)
        includepaths.unshift(frameworksPath);
    var OBJJ_INCLUDE_PATHS = global.OBJJ_INCLUDE_PATHS = exports.OBJJ_INCLUDE_PATHS = includepaths;
    var print = console.log;
    var BuiltinModule = require("module");
    var Module = module.constructor.length > 1 ? module.constructor : BuiltinModule;
    Module._extensions['.j'] =     function objJLoader(mod, filename)
    {
        return objj_importFile(filename, YES);
    };
    if (!Object.create)
    {
        Object.create =         function(o)
        {
            if (arguments.length > 1)
                throw new Error('Object.create implementation only accepts the first parameter.');
            function F()
            {
            }
            F.prototype = o;
            return new F();
        };
    }
    if (!Object.keys)
    {
        Object.keys = (        function()
        {
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !{toString: null}.propertyIsEnumerable('toString'),
                dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
                dontEnumsLength = dontEnums.length;
            return             function(obj)
            {
                if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null)
                    throw new TypeError('Object.keys called on non-object');
                var result = [];
                for (var prop in obj)
                {
                    if (hasOwnProperty.call(obj, prop))
                        result.push(prop);
                }
                if (hasDontEnumBug)
                {
                    for (var i = 0; i < dontEnumsLength; i++)
                    {
                        if (hasOwnProperty.call(obj, dontEnums[i]))
                            result.push(dontEnums[i]);
                    }
                }
                return result;
            };
        })();
    }
    if (!Array.prototype.indexOf)
    {
        Array.prototype.indexOf =         function(searchElement)
        {
            "use strict";
            if (this === null)
                throw new TypeError();
            var t = new Object(this),
                len = t.length >>> 0;
            if (len === 0)
                return -1;
            var n = 0;
            if (arguments.length > 1)
            {
                n = Number(arguments[1]);
                if (n != n)
                    n = 0;
                else if (n !== 0 && n != Infinity && n != -Infinity)
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
            if (n >= len)
                return -1;
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++)
            {
                if (k in t && t[k] === searchElement)
                    return k;
            }
            return -1;
        };
    }
    if (!Array.prototype.findIndex)
    {
        Object.defineProperty(Array.prototype, 'findIndex', {value:         function(predicate)
        {
            if (this == null)
            {
                throw new TypeError('"this" is null or not defined');
            }
            var o = Object(this);
            var len = o.length >>> 0;
            if (typeof predicate !== 'function')
            {
                throw new TypeError('predicate must be a function');
            }
            var thisArg = arguments[1];
            var k = 0;
            while (k < len)
            {
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o))
                {
                    return k;
                }
                k++;
            }
            return -1;
        }, configurable: true, writable: true});
    }
    if (!String.prototype.startsWith)
    {
        String.prototype.startsWith =         function(searchString, position)
        {
            position = position || 0;
            return this.substr(position, searchString.length) === searchString;
        };
    }
    if (!String.prototype.endsWith)
    {
        String.prototype.endsWith =         function(searchString, position)
        {
            var subjectString = this.toString();
            if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length)
            {
                position = subjectString.length;
            }
            position -= searchString.length;
            var lastIndex = subjectString.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        };
    }
;
    if (!Array.prototype.includes)
    {
        Object.defineProperty(Array.prototype, 'includes', {value:         function(searchElement, fromIndex)
        {
            if (this == null)
            {
                throw new TypeError('"this" is null or not defined');
            }
            var o = Object(this);
            var len = o.length >>> 0;
            if (len === 0)
            {
                return false;
            }
            var n = fromIndex | 0;
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            while (k < len)
            {
                if (o[k] === searchElement)
                {
                    return true;
                }
                k++;
            }
            return false;
        }});
    }
    if (!Array.prototype.find)
    {
        Object.defineProperty(Array.prototype, 'find', {value:         function(predicate)
        {
            if (this == null)
            {
                throw TypeError('"this" is null or not defined');
            }
            var o = Object(this);
            var len = o.length >>> 0;
            if (typeof predicate !== 'function')
            {
                throw TypeError('predicate must be a function');
            }
            var thisArg = arguments[1];
            var k = 0;
            while (k < len)
            {
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o))
                {
                    return kValue;
                }
                k++;
            }
            return undefined;
        }, configurable: true, writable: true});
    }
    if (typeof Object.assign !== 'function')
    {
        Object.defineProperty(Object, "assign", {value:         function assign(target, varArgs)
        {
            'use strict';
            if (target === null || target === undefined)
            {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            var to = Object(target);
            for (var index = 1; index < arguments.length; index++)
            {
                var nextSource = arguments[index];
                if (nextSource !== null && nextSource !== undefined)
                {
                    for (var nextKey in nextSource)
                    {
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey))
                        {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        }, writable: true, configurable: true});
    }
    if (!this.JSON)
    {
        JSON = {};
    }
    (    function()
    {
        function f(n)
        {
            return n < 10 ? '0' + n : n;
        }
        if (typeof Date.prototype.toJSON !== 'function')
        {
            Date.prototype.toJSON =             function(key)
            {
                return this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z';
            };
            String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON =             function(key)
            {
                return this.valueOf();
            };
        }
        var cx = new RegExp('[\\u0000\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]', "g");
        var escapable = new RegExp('[\\\\\\"\\x00-\\x1f\\x7f-\\x9f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]', "g");
        var gap,
            indent,
            meta = {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\'},
            rep;
        function quote(string)
        {
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable,             function(a)
            {
                var c = meta[a];
                return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        }
        function str(key, holder)
        {
            var i,
                k,
                v,
                length,
                mind = gap,
                partial,
                value = holder[key];
            if (value && typeof value === 'object' && typeof value.toJSON === 'function')
            {
                value = value.toJSON(key);
            }
            if (typeof rep === 'function')
            {
                value = rep.call(holder, key, value);
            }
            switch(typeof value) {
                case 'string':
                    return quote(value);
                case 'number':
                    return isFinite(value) ? String(value) : 'null';
                case 'boolean':
                case 'null':
                    return String(value);
                case 'object':
                    if (!value)
                    {
                        return 'null';
                    }
                    gap += indent;
                    partial = [];
                    if (Object.prototype.toString.apply(value) === '[object Array]')
                    {
                        length = value.length;
                        for (i = 0; i < length; i += 1)
                        {
                            partial[i] = str(i, value) || 'null';
                        }
                        v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }
                    if (rep && typeof rep === 'object')
                    {
                        length = rep.length;
                        for (i = 0; i < length; i += 1)
                        {
                            k = rep[i];
                            if (typeof k === 'string')
                            {
                                v = str(k, value);
                                if (v)
                                {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }
                    else
                    {
                        for (k in value)
                        {
                            if (Object.hasOwnProperty.call(value, k))
                            {
                                v = str(k, value);
                                if (v)
                                {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }
                    v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        }
        if (typeof JSON.stringify !== 'function')
        {
            JSON.stringify =             function(value, replacer, space)
            {
                var i;
                gap = '';
                indent = '';
                if (typeof space === 'number')
                {
                    for (i = 0; i < space; i += 1)
                    {
                        indent += ' ';
                    }
                }
                else if (typeof space === 'string')
                {
                    indent = space;
                }
                rep = replacer;
                if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number'))
                {
                    throw new Error('JSON.stringify');
                }
                return str('', {'': value});
            };
        }
        if (typeof JSON.parse !== 'function')
        {
            JSON.parse =             function(text, reviver)
            {
                var j;
                function walk(holder, key)
                {
                    var k,
                        v,
                        value = holder[key];
                    if (value && typeof value === 'object')
                    {
                        for (k in value)
                        {
                            if (Object.hasOwnProperty.call(value, k))
                            {
                                v = walk(value, k);
                                if (v !== undefined)
                                {
                                    value[k] = v;
                                }
                                else
                                {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }
                cx.lastIndex = 0;
                if (cx.test(text))
                {
                    text = text.replace(cx,                     function(a)
                    {
                        return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }
                if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '')))
                {
                    j = eval('(' + text + ')');
                    return typeof reviver === 'function' ? walk({'': j}, '') : j;
                }
                throw new SyntaxError('JSON.parse');
            };
        }
    })();
    var formatRegex = /([^%]+|%(?:\d+\$)?[\+\-\ \#0]*[0-9\*]*(.[0-9\*]+)?[hlL]?[cbBdieEfgGosuxXpn%@])/g,
        tagRegex = /(%)(?:(\d+)\$)?([\+\-\ \#0]*)([0-9\*]*)((?:.[0-9\*]+)?)([hlL]?)([cbBdieEfgGosuxXpn%@])/;
    exports.sprintf =     function(format)
    {
        var format = arguments[0],
            tokens = format.match(formatRegex),
            index = 0,
            result = "",
            arg = 1;
        for (var i = 0; i < tokens.length; i++)
        {
            var t = tokens[i];
            if (format.substring(index, index + t.length) !== t)
                return result;
            index += t.length;
            if (t.charAt(0) !== "%")
                result += t;
            else if (t === "%%")
                result += "%";
            else
            {
                var subtokens = t.match(tagRegex);
                if (subtokens.length !== 8 || subtokens[0] !== t)
                    return result;
                var percentSign = subtokens[1],
                    argIndex = subtokens[2],
                    flags = subtokens[3],
                    widthString = subtokens[4],
                    precisionString = subtokens[5],
                    length = subtokens[6],
                    specifier = subtokens[7];
                if (argIndex === undefined || argIndex === null || argIndex === "")
                    argIndex = arg++;
                else
                    argIndex = Number(argIndex);
                var width = null;
                if (widthString == "*")
                    width = arguments[argIndex];
                else if (widthString !== "")
                    width = Number(widthString);
                var precision = null;
                if (precisionString === ".*")
                    precision = arguments[argIndex];
                else if (precisionString !== "")
                    precision = Number(precisionString.substring(1));
                var leftJustify = flags.indexOf("-") >= 0,
                    padZeros = flags.indexOf("0") >= 0,
                    subresult = "";
                if (/[bBdiufeExXo]/.test(specifier))
                {
                    var num = Number(arguments[argIndex]),
                        sign = "";
                    if (num < 0)
                    {
                        sign = "-";
                    }
                    else
                    {
                        if (flags.indexOf("+") >= 0)
                            sign = "+";
                        else if (flags.indexOf(" ") >= 0)
                            sign = " ";
                    }
                    if (specifier === "d" || specifier === "i" || specifier === "u")
                    {
                        var number = String(Math.abs(Math.floor(num)));
                        subresult = justify(sign, "", number, "", width, leftJustify, padZeros);
                    }
                    if (specifier == "f")
                    {
                        var number = String(precision !== null ? Math.abs(num).toFixed(precision) : Math.abs(num)),
                            suffix = flags.indexOf("#") >= 0 && number.indexOf(".") < 0 ? "." : "";
                        subresult = justify(sign, "", number, suffix, width, leftJustify, padZeros);
                    }
                    if (specifier === "e" || specifier === "E")
                    {
                        var number = String(Math.abs(num).toExponential(precision !== null ? precision : 21)),
                            suffix = flags.indexOf("#") >= 0 && number.indexOf(".") < 0 ? "." : "";
                        subresult = justify(sign, "", number, suffix, width, leftJustify, padZeros);
                    }
                    if (specifier == "x" || specifier == "X")
                    {
                        var number = String(Math.abs(num).toString(16));
                        var prefix = flags.indexOf("#") >= 0 && num != 0 ? "0x" : "";
                        subresult = justify(sign, prefix, number, "", width, leftJustify, padZeros);
                    }
                    if (specifier == "b" || specifier == "B")
                    {
                        var number = String(Math.abs(num).toString(2));
                        var prefix = flags.indexOf("#") >= 0 && num != 0 ? "0b" : "";
                        subresult = justify(sign, prefix, number, "", width, leftJustify, padZeros);
                    }
                    if (specifier == "o")
                    {
                        var number = String(Math.abs(num).toString(8));
                        var prefix = flags.indexOf("#") >= 0 && num != 0 ? "0" : "";
                        subresult = justify(sign, prefix, number, "", width, leftJustify, padZeros);
                    }
                    if (/[A-Z]/.test(specifier))
                        subresult = subresult.toUpperCase();
                    else
                        subresult = subresult.toLowerCase();
                }
                else
                {
                    var subresult = "";
                    if (specifier === "%")
                        subresult = "%";
                    else if (specifier === "c")
                        subresult = String(arguments[argIndex]).charAt(0);
                    else if (specifier === "s" || specifier === "@")
                        subresult = String(arguments[argIndex]);
                    else if (specifier === "p" || specifier === "n")
                        subresult = "";
                    subresult = justify("", "", subresult, "", width, leftJustify, false);
                }
                result += subresult;
            }
        }
        return result;
    };
    function justify(sign, prefix, string, suffix, width, leftJustify, padZeros)
    {
        var length = sign.length + prefix.length + string.length + suffix.length;
        if (leftJustify)
        {
            return sign + prefix + string + suffix + pad(width - length, " ");
        }
        else
        {
            if (padZeros)
                return sign + prefix + pad(width - length, "0") + string + suffix;
            else
                return pad(width - length, " ") + sign + prefix + string + suffix;
        }
    }
    function pad(n, ch)
    {
        return Array(MAX(0, n) + 1).join(ch);
    }
;
    CPLogDisable = false;
    var CPLogDefaultTitle = "Cappuccino";
    var CPLogLevels = ["fatal", "error", "warn", "info", "debug", "trace"];
    var CPLogDefaultLevel = CPLogLevels[3];
    var _CPLogLevelsInverted = {};
    for (var i = 0; i < CPLogLevels.length; i++)
        _CPLogLevelsInverted[CPLogLevels[i]] = i;
    var _CPLogRegistrations = {};
    CPLogRegister =     function(aProvider, aMaxLevel, aFormatter)
    {
        CPLogRegisterRange(aProvider, CPLogLevels[0], aMaxLevel || CPLogLevels[CPLogLevels.length - 1], aFormatter);
    };
    CPLogRegisterRange =     function(aProvider, aMinLevel, aMaxLevel, aFormatter)
    {
        var min = _CPLogLevelsInverted[aMinLevel];
        var max = _CPLogLevelsInverted[aMaxLevel];
        if (min !== undefined && max !== undefined && min <= max)
            for (var i = min; i <= max; i++)
                CPLogRegisterSingle(aProvider, CPLogLevels[i], aFormatter);
    };
    CPLogRegisterSingle =     function(aProvider, aLevel, aFormatter)
    {
        if (!_CPLogRegistrations[aLevel])
            _CPLogRegistrations[aLevel] = [];
        for (var i = 0; i < _CPLogRegistrations[aLevel].length; i++)
            if (_CPLogRegistrations[aLevel][i][0] === aProvider)
            {
                _CPLogRegistrations[aLevel][i][1] = aFormatter;
                return;
            }
        _CPLogRegistrations[aLevel].push([aProvider, aFormatter]);
    };
    CPLogUnregister =     function(aProvider)
    {
        for (var aLevel in _CPLogRegistrations)
            for (var i = 0; i < _CPLogRegistrations[aLevel].length; i++)
                if (_CPLogRegistrations[aLevel][i][0] === aProvider)
                    _CPLogRegistrations[aLevel].splice(i--, 1);
    };
    function _CPLogDispatch(parameters, aLevel, aTitle)
    {
        if (aTitle == undefined)
            aTitle = CPLogDefaultTitle;
        if (aLevel == undefined)
            aLevel = CPLogDefaultLevel;
        var message = typeof parameters[0] == "string" && parameters.length > 1 ? exports.sprintf.apply(null, parameters) : String(parameters[0]);
        if (_CPLogRegistrations[aLevel])
            for (var i = 0; i < _CPLogRegistrations[aLevel].length; i++)
            {
                var logger = _CPLogRegistrations[aLevel][i];
                logger[0](message, aLevel, aTitle, logger[1]);
            }
    }
    CPLog =     function()
    {
        _CPLogDispatch(arguments);
    };
    for (var i = 0; i < CPLogLevels.length; i++)
        CPLog[CPLogLevels[i]] = (        function(level)
        {
            return             function()
            {
                _CPLogDispatch(arguments, level);
            };
        })(CPLogLevels[i]);
    var _CPFormatLogMessage =     function(aString, aLevel, aTitle)
    {
        var now = new Date(),
            titleAndLevel;
        if (aLevel === null)
            aLevel = "";
        else
        {
            aLevel = aLevel || "info";
            aLevel = "[" + CPLogColorize(aLevel, aLevel) + "]";
        }
        aTitle = aTitle || "";
        if (aTitle && aLevel)
            aTitle += " ";
        titleAndLevel = aTitle + aLevel;
        if (titleAndLevel)
            titleAndLevel += ": ";
        if (typeof exports.sprintf == "function")
            return exports.sprintf("%4d-%02d-%02d %02d:%02d:%02d.%03d %s%s", now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds(), titleAndLevel, aString);
        else
            return now + " " + titleAndLevel + ": " + aString;
    };
    CPLogConsole =     function(aString, aLevel, aTitle, aFormatter)
    {
        if (typeof console != "undefined")
        {
            var message = (aFormatter || _CPFormatLogMessage)(aString, aLevel, aTitle),
                logger = {"fatal": "error", "error": "error", "warn": "warn", "info": "info", "debug": "debug", "trace": "debug"}[aLevel];
            if (logger && console[logger])
                console[logger](message);
            else if (console.log)
                console.log(message);
        }
    };
    var levelColorMap = {"fatal": "red", "error": "red", "warn": "yellow", "info": "green", "debug": "cyan", "trace": "blue"};
    try {
        var SYSTEM = require("system");
        var FILE = require("file");
        if (SYSTEM.args[0])
            CPLogDefaultTitle = FILE.basename(SYSTEM.args[0]);
    }
    catch(e) {
    }
    var stream;
    CPLogColorize =     function(aString, aLevel)
    {
        if (/^.*\x00\w+\([^\x00]*$/.test(aString))
            return aString;
        else
            return "\0" + (levelColorMap[aLevel] || "info") + "(" + aString + "\0)";
    };
    CPLogPrint =     function(aString, aLevel, aTitle, aFormatter)
    {
        if (CPLogDisable)
            return;
        if (stream === undefined)
        {
            try {
                stream = exports.term.stream;
            }
            catch(e) {
                stream = null;
            }
        }
        var formatter = aFormatter || _CPFormatLogMessage;
        if (stream)
        {
            if (aLevel == "fatal" || aLevel == "error" || aLevel == "warn")
                stream.print(CPLogColorize(formatter(aString, aLevel, aTitle), aLevel));
            else
                stream.print(formatter(aString, aLevel, aTitle));
        }
        else if (typeof print != "undefined")
        {
            print(formatter(aString, aLevel, aTitle));
        }
    };
    CPLogDefault = CPLogPrint;
    var undefined;
    if (typeof window !== "undefined")
    {
        window.setNativeTimeout = window.setTimeout || setTimeout;
        window.clearNativeTimeout = window.clearTimeout || clearTimeout;
        window.setNativeInterval = window.setInterval || setInterval;
        window.clearNativeInterval = window.clearInterval || clearInterval;
    }
    NO = false;
    YES = true;
    nil = null;
    Nil = null;
    NULL = null;
    ABS = Math.abs;
    ASIN = Math.asin;
    ACOS = Math.acos;
    ATAN = Math.atan;
    ATAN2 = Math.atan2;
    SIN = Math.sin;
    COS = Math.cos;
    TAN = Math.tan;
    EXP = Math.exp;
    POW = Math.pow;
    CEIL = Math.ceil;
    FLOOR = Math.floor;
    ROUND = Math.round;
    MIN = Math.min;
    MAX = Math.max;
    RAND = Math.random;
    SQRT = Math.sqrt;
    E = Math.E;
    LN2 = Math.LN2;
    LN10 = Math.LN10;
    LOG = Math.log;
    LOG2E = Math.LOG2E;
    LOG10E = Math.LOG10E;
    PI = Math.PI;
    PI2 = Math.PI * 2.0;
    PI_2 = Math.PI / 2.0;
    SQRT1_2 = Math.SQRT1_2;
    SQRT2 = Math.SQRT2;
    function EventDispatcher(anOwner)
    {
        this._eventListenersForEventNames = {};
        this._owner = anOwner;
    }
    EventDispatcher.prototype.addEventListener =     function(anEventName, anEventListener)
    {
        var eventListenersForEventNames = this._eventListenersForEventNames;
        if (!hasOwnProperty.call(eventListenersForEventNames, anEventName))
        {
            var eventListenersForEventName = [];
            eventListenersForEventNames[anEventName] = eventListenersForEventName;
        }
        else
            var eventListenersForEventName = eventListenersForEventNames[anEventName];
        var index = eventListenersForEventName.length;
        while (index--)
            if (eventListenersForEventName[index] === anEventListener)
                return;
        eventListenersForEventName.push(anEventListener);
    };
    EventDispatcher.prototype.removeEventListener =     function(anEventName, anEventListener)
    {
        var eventListenersForEventNames = this._eventListenersForEventNames;
        if (!hasOwnProperty.call(eventListenersForEventNames, anEventName))
            return;
        var eventListenersForEventName = eventListenersForEventNames[anEventName],
            index = eventListenersForEventName.length;
        while (index--)
            if (eventListenersForEventName[index] === anEventListener)
                return eventListenersForEventName.splice(index, 1);
    };
    EventDispatcher.prototype.dispatchEvent =     function(anEvent)
    {
        var type = anEvent.type,
            eventListenersForEventNames = this._eventListenersForEventNames;
        if (hasOwnProperty.call(eventListenersForEventNames, type))
        {
            var eventListenersForEventName = this._eventListenersForEventNames[type],
                index = 0,
                count = eventListenersForEventName.length;
            for (; index < count; ++index)
                eventListenersForEventName[index](anEvent);
        }
        var manual = (this._owner || this)["on" + type];
        if (manual)
            manual(anEvent);
    };
    var asynchronousTimeoutCount = 0,
        asynchronousTimeoutId = null,
        asynchronousFunctionQueue = [];
    function Asynchronous(aFunction)
    {
        var currentAsynchronousTimeoutCount = asynchronousTimeoutCount;
        if (asynchronousTimeoutId === null)
        {
            window.setNativeTimeout(            function()
            {
                var queue = asynchronousFunctionQueue,
                    index = 0,
                    count = asynchronousFunctionQueue.length;
                ++asynchronousTimeoutCount;
                asynchronousTimeoutId = null;
                asynchronousFunctionQueue = [];
                for (; index < count; ++index)
                    queue[index]();
            }, 0);
        }
        return         function()
        {
            var args = arguments;
            if (asynchronousTimeoutCount > currentAsynchronousTimeoutCount)
                aFunction.apply(this, args);
            else
                asynchronousFunctionQueue.push(                function()
                {
                    aFunction.apply(this, args);
                });
        };
    }
    var NativeRequest = null;
    if (window.XMLHttpRequest)
    {
        NativeRequest = window.XMLHttpRequest;
    }
    else if (window.ActiveXObject !== undefined)
    {
        var MSXML_XMLHTTP_OBJECTS = ["Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP.6.0"],
            index = MSXML_XMLHTTP_OBJECTS.length;
        while (index--)
        {
            try {
                var MSXML_XMLHTTP = MSXML_XMLHTTP_OBJECTS[index];
                new ActiveXObject(MSXML_XMLHTTP);
                NativeRequest =                 function()
                {
                    return new ActiveXObject(MSXML_XMLHTTP);
                };
                break;
            }
            catch(anException) {
            }
        }
    }
    CFHTTPRequest =     function()
    {
        this._isOpen = false;
        this._requestHeaders = {};
        this._mimeType = null;
        this._eventDispatcher = new EventDispatcher(this);
        this._nativeRequest = new NativeRequest();
        this._withCredentials = false;
        this._timeout = 60000;
        var self = this;
        this._stateChangeHandler =         function()
        {
            determineAndDispatchHTTPRequestEvents(self);
        };
        this._timeoutHandler =         function()
        {
            dispatchTimeoutHTTPRequestEvents(self);
        };
        this._nativeRequest.onreadystatechange = this._stateChangeHandler;
        this._nativeRequest.ontimeout = this._timeoutHandler;
        if (CFHTTPRequest.AuthenticationDelegate !== nil)
            this._eventDispatcher.addEventListener("HTTP403",             function()
            {
                CFHTTPRequest.AuthenticationDelegate(self);
            });
    };
    CFHTTPRequest.UninitializedState = 0;
    CFHTTPRequest.LoadingState = 1;
    CFHTTPRequest.LoadedState = 2;
    CFHTTPRequest.InteractiveState = 3;
    CFHTTPRequest.CompleteState = 4;
    CFHTTPRequest.AuthenticationDelegate = nil;
    CFHTTPRequest.prototype.status =     function()
    {
        try {
            return this._nativeRequest.status || 0;
        }
        catch(anException) {
            return 0;
        }
    };
    CFHTTPRequest.prototype.statusText =     function()
    {
        try {
            return this._nativeRequest.statusText || "";
        }
        catch(anException) {
            return "";
        }
    };
    CFHTTPRequest.prototype.readyState =     function()
    {
        return this._nativeRequest.readyState;
    };
    CFHTTPRequest.prototype.success =     function()
    {
        var status = this.status();
        if (status >= 200 && status < 300)
            return YES;
        return status === 0 && this.responseText() && this.responseText().length;
    };
    CFHTTPRequest.prototype.responseXML =     function()
    {
        var responseXML = this._nativeRequest.responseXML;
        if (responseXML && NativeRequest === window.XMLHttpRequest && responseXML.documentRoot)
            return responseXML;
        return parseXML(this.responseText());
    };
    CFHTTPRequest.prototype.responsePropertyList =     function()
    {
        var responseText = this.responseText();
        if (CFPropertyList.sniffedFormatOfString(responseText) === CFPropertyList.FormatXML_v1_0)
            return CFPropertyList.propertyListFromXML(this.responseXML());
        return CFPropertyList.propertyListFromString(responseText);
    };
    CFHTTPRequest.prototype.responseText =     function()
    {
        return this._nativeRequest.responseText;
    };
    CFHTTPRequest.prototype.setRequestHeader =     function(aHeader, aValue)
    {
        this._requestHeaders[aHeader] = aValue;
    };
    CFHTTPRequest.prototype.getResponseHeader =     function(aHeader)
    {
        return this._nativeRequest.getResponseHeader(aHeader);
    };
    CFHTTPRequest.prototype.setTimeout =     function(aTimeout)
    {
        this._timeout = aTimeout;
        if (this._isOpen)
            this._nativeRequest.timeout = aTimeout;
    };
    CFHTTPRequest.prototype.getTimeout =     function(aTimeout)
    {
        return this._timeout;
    };
    CFHTTPRequest.prototype.getAllResponseHeaders =     function()
    {
        return this._nativeRequest.getAllResponseHeaders();
    };
    CFHTTPRequest.prototype.overrideMimeType =     function(aMimeType)
    {
        this._mimeType = aMimeType;
    };
    CFHTTPRequest.prototype.open =     function(aMethod, aURL, isAsynchronous, aUser, aPassword)
    {
        var retval;
        this._isOpen = true;
        this._URL = aURL;
        this._async = isAsynchronous;
        this._method = aMethod;
        this._user = aUser;
        this._password = aPassword;
        requestReturnValue = this._nativeRequest.open(aMethod, aURL, isAsynchronous, aUser, aPassword);
        if (this._async)
        {
            this._nativeRequest.withCredentials = this._withCredentials;
            this._nativeRequest.timeout = this._timeout;
        }
        return requestReturnValue;
    };
    CFHTTPRequest.prototype.send =     function(aBody)
    {
        if (!this._isOpen)
        {
            delete this._nativeRequest.onreadystatechange;
            delete this._nativeRequest.ontimeout;
            this._nativeRequest.open(this._method, this._URL, this._async, this._user, this._password);
            this._nativeRequest.ontimeout = this._timeoutHandler;
            this._nativeRequest.onreadystatechange = this._stateChangeHandler;
        }
        for (var i in this._requestHeaders)
        {
            if (this._requestHeaders.hasOwnProperty(i))
                this._nativeRequest.setRequestHeader(i, this._requestHeaders[i]);
        }
        if (this._mimeType && "overrideMimeType" in this._nativeRequest)
            this._nativeRequest.overrideMimeType(this._mimeType);
        this._isOpen = false;
        try {
            return this._nativeRequest.send(aBody);
        }
        catch(anException) {
            this._eventDispatcher.dispatchEvent({type: "failure", request: this});
        }
    };
    CFHTTPRequest.prototype.abort =     function()
    {
        this._isOpen = false;
        return this._nativeRequest.abort();
    };
    CFHTTPRequest.prototype.addEventListener =     function(anEventName, anEventListener)
    {
        this._eventDispatcher.addEventListener(anEventName, anEventListener);
    };
    CFHTTPRequest.prototype.removeEventListener =     function(anEventName, anEventListener)
    {
        this._eventDispatcher.removeEventListener(anEventName, anEventListener);
    };
    CFHTTPRequest.prototype.setWithCredentials =     function(willSendWithCredentials)
    {
        this._withCredentials = willSendWithCredentials;
        if (this._isOpen && this._async)
            this._nativeRequest.withCredentials = willSendWithCredentials;
    };
    CFHTTPRequest.prototype.withCredentials =     function()
    {
        return this._withCredentials;
    };
    CFHTTPRequest.prototype.isTimeoutRequest =     function()
    {
        return !this.success() && !this._nativeRequest.response && !this._nativeRequest.responseText && !this._nativeRequest.responseType && !this._nativeRequest.responseURL && !this._nativeRequest.responseXML;
    };
    function dispatchTimeoutHTTPRequestEvents(aRequest)
    {
        aRequest._eventDispatcher.dispatchEvent({type: "timeout", request: aRequest});
    }
    function determineAndDispatchHTTPRequestEvents(aRequest)
    {
        var eventDispatcher = aRequest._eventDispatcher,
            readyStates = ["uninitialized", "loading", "loaded", "interactive", "complete"];
        eventDispatcher.dispatchEvent({type: "readystatechange", request: aRequest});
        if (readyStates[aRequest.readyState()] === "complete")
        {
            var status = "HTTP" + aRequest.status();
            eventDispatcher.dispatchEvent({type: status, request: aRequest});
            var result = aRequest.success() ? "success" : "failure";
            eventDispatcher.dispatchEvent({type: result, request: aRequest});
            eventDispatcher.dispatchEvent({type: readyStates[aRequest.readyState()], request: aRequest});
        }
        else
        {
            eventDispatcher.dispatchEvent({type: readyStates[aRequest.readyState()], request: aRequest});
        }
    }
    function FileRequest(aURL, onsuccess, onfailure, onprogress)
    {
        var request = new CFHTTPRequest();
        if (aURL.pathExtension() === "plist")
            request.overrideMimeType("text/xml");
        var loaded = 0,
            progressHandler = null;
        function progress(progressEvent)
        {
            onprogress(progressEvent.loaded - loaded);
            loaded = progressEvent.loaded;
        }
        function success(anEvent)
        {
            if (onprogress && progressHandler === null)
                onprogress(anEvent.request.responseText().length);
            onsuccess(anEvent);
        }
        if (exports.asyncLoader)
        {
            request.onsuccess = Asynchronous(success);
            request.onfailure = Asynchronous(onfailure);
        }
        else
        {
            request.onsuccess = success;
            request.onfailure = onfailure;
        }
        request.open("GET", aURL.absoluteString(), exports.asyncLoader);
        request.send("");
    }
    exports.asyncLoader = NO;
    exports.Asynchronous = Asynchronous;
    exports.determineAndDispatchHTTPRequestEvents = determineAndDispatchHTTPRequestEvents;
    var fs = require("fs");
    var OBJECT_COUNT = 0;
    objj_generateObjectUID =     function()
    {
        return OBJECT_COUNT++;
    };
    CFPropertyList =     function()
    {
        this._UID = objj_generateObjectUID();
    };
    CFPropertyList.DTDRE = /^\s*(?:<\?\s*xml\s+version\s*=\s*\"1.0\"[^>]*\?>\s*)?(?:<\!DOCTYPE[^>]*>\s*)?/i;
    CFPropertyList.XMLRE = /^\s*(?:<\?\s*xml\s+version\s*=\s*\"1.0\"[^>]*\?>\s*)?(?:<\!DOCTYPE[^>]*>\s*)?<\s*plist[^>]*\>/i;
    CFPropertyList.FormatXMLDTD = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">";
    CFPropertyList.Format280NorthMagicNumber = "280NPLIST";
    (CFPropertyList.FormatOpenStep = 1, CFPropertyList.FormatXML_v1_0 = 100, CFPropertyList.FormatBinary_v1_0 = 200, CFPropertyList.Format280North_v1_0 = -1000);
    CFPropertyList.sniffedFormatOfString =     function(aString)
    {
        if (aString.match(CFPropertyList.XMLRE))
            return CFPropertyList.FormatXML_v1_0;
        if (aString.substr(0, CFPropertyList.Format280NorthMagicNumber.length) === CFPropertyList.Format280NorthMagicNumber)
            return CFPropertyList.Format280North_v1_0;
        return NULL;
    };
    CFPropertyList.dataFromPropertyList =     function(aPropertyList, aFormat)
    {
        var data = new CFMutableData();
        data.setRawString(CFPropertyList.stringFromPropertyList(aPropertyList, aFormat));
        return data;
    };
    CFPropertyList.stringFromPropertyList =     function(aPropertyList, aFormat)
    {
        if (!aFormat)
            aFormat = CFPropertyList.Format280North_v1_0;
        var serializers = CFPropertyListSerializers[aFormat];
        return serializers["start"]() + serializePropertyList(aPropertyList, serializers) + serializers["finish"]();
    };
    CFPropertyList.readPropertyListFromFile =     function(aFilePath)
    {
        return CFPropertyList.propertyListFromString(fs.readFileSync(aFilePath, {encoding: "utf8"}));
    };
    CFPropertyList.writePropertyListToFile =     function(aPropertyList, aFilePath, aFormat)
    {
        return fs.writeFileSync(aFilePath, CFPropertyList.stringFromPropertyList(aPropertyList, aFormat), {encoding: "utf8"});
    };
    CFPropertyList.modifyPlist =     function(aFilePath, aCallback, aFormat)
    {
        var string = FILE.read(aFilePath, {charset: "UTF-8"});
        var format = CFPropertyList.sniffedFormatOfString(string);
        var plist = CFPropertyList.propertyListFromString(string, format);
        aCallback(plist);
        CFPropertyList.writePropertyListToFile(plist, aFilePath, aFormat || format);
    };
    function serializePropertyList(aPropertyList, serializers)
    {
        var type = typeof aPropertyList,
            valueOf = aPropertyList.valueOf(),
            typeValueOf = typeof valueOf;
        if (type !== typeValueOf)
        {
            type = typeValueOf;
            aPropertyList = valueOf;
        }
        if (aPropertyList === YES || aPropertyList === NO)
            type = "boolean";
        else if (type === "number")
        {
            if (FLOOR(aPropertyList) === aPropertyList && ("" + aPropertyList).indexOf('e') == -1)
                type = "integer";
            else
                type = "real";
        }
        else if (type !== "string")
        {
            if (aPropertyList.slice)
                type = "array";
            else
                type = "dictionary";
        }
        return serializers[type](aPropertyList, serializers);
    }
    var CFPropertyListSerializers = {};
    CFPropertyListSerializers[CFPropertyList.FormatXML_v1_0] = {"start":     function()
    {
        return CFPropertyList.FormatXMLDTD + "<plist version = \"1.0\">";
    }, "finish":     function()
    {
        return "</plist>";
    }, "string":     function(aString)
    {
        return "<string>" + encodeHTMLComponent(aString) + "</string>";
    }, "boolean":     function(aBoolean)
    {
        return aBoolean ? "<true/>" : "<false/>";
    }, "integer":     function(anInteger)
    {
        return "<integer>" + anInteger + "</integer>";
    }, "real":     function(aFloat)
    {
        return "<real>" + aFloat + "</real>";
    }, "array":     function(anArray, serializers)
    {
        var index = 0,
            count = anArray.length,
            string = "<array>";
        for (; index < count; ++index)
            string += serializePropertyList(anArray[index], serializers);
        return string + "</array>";
    }, "dictionary":     function(aDictionary, serializers)
    {
        var keys = aDictionary._keys,
            index = 0,
            count = keys.length,
            string = "<dict>";
        for (; index < count; ++index)
        {
            var key = keys[index];
            string += "<key>" + key + "</key>";
            string += serializePropertyList(aDictionary.valueForKey(key), serializers);
        }
        return string + "</dict>";
    }};
    var ARRAY_MARKER = "A",
        DICTIONARY_MARKER = "D",
        FLOAT_MARKER = "f",
        INTEGER_MARKER = "d",
        STRING_MARKER = "S",
        TRUE_MARKER = "T",
        FALSE_MARKER = "F",
        KEY_MARKER = "K",
        END_MARKER = "E";
    CFPropertyListSerializers[CFPropertyList.Format280North_v1_0] = {"start":     function()
    {
        return CFPropertyList.Format280NorthMagicNumber + ";1.0;";
    }, "finish":     function()
    {
        return "";
    }, "string":     function(aString)
    {
        return STRING_MARKER + ';' + aString.length + ';' + aString;
    }, "boolean":     function(aBoolean)
    {
        return (aBoolean ? TRUE_MARKER : FALSE_MARKER) + ';';
    }, "integer":     function(anInteger)
    {
        var string = "" + anInteger;
        return INTEGER_MARKER + ';' + string.length + ';' + string;
    }, "real":     function(aFloat)
    {
        var string = "" + aFloat;
        return FLOAT_MARKER + ';' + string.length + ';' + string;
    }, "array":     function(anArray, serializers)
    {
        var index = 0,
            count = anArray.length,
            string = ARRAY_MARKER + ';';
        for (; index < count; ++index)
            string += serializePropertyList(anArray[index], serializers);
        return string + END_MARKER + ';';
    }, "dictionary":     function(aDictionary, serializers)
    {
        var keys = aDictionary._keys,
            index = 0,
            count = keys.length,
            string = DICTIONARY_MARKER + ';';
        for (; index < count; ++index)
        {
            var key = keys[index];
            string += KEY_MARKER + ';' + key.length + ';' + key;
            string += serializePropertyList(aDictionary.valueForKey(key), serializers);
        }
        return string + END_MARKER + ';';
    }};
    var XML_XML = "xml",
        XML_DOCUMENT = "#document",
        PLIST_PLIST = "plist",
        PLIST_KEY = "key",
        PLIST_DICTIONARY = "dict",
        PLIST_ARRAY = "array",
        PLIST_STRING = "string",
        PLIST_DATE = "date",
        PLIST_BOOLEAN_TRUE = "true",
        PLIST_BOOLEAN_FALSE = "false",
        PLIST_NUMBER_REAL = "real",
        PLIST_NUMBER_INTEGER = "integer",
        PLIST_DATA = "data";
    var textContent =     function(nodes)
    {
        var text = "",
            index = 0,
            count = nodes.length;
        for (; index < count; ++index)
        {
            var node = nodes[index];
            if (node.nodeType === 3 || node.nodeType === 4)
                text += node.nodeValue;
            else if (node.nodeType !== 8)
                text += textContent(node.childNodes);
        }
        return text;
    };
    var _plist_traverseNextNode =     function(anXMLNode, stayWithin, stack)
    {
        var node = anXMLNode;
        {
            node = node.firstChild;
            if (node != NULL && (node.nodeType === 8 || node.nodeType === 3 || node.nodeType === 7))
                while ((node = node.nextSibling) && (node.nodeType === 8 || node.nodeType === 3 || node.nodeType === 7));
        }
;
        if (node)
            return node;
        if (String(anXMLNode.nodeName) === PLIST_ARRAY || String(anXMLNode.nodeName) === PLIST_DICTIONARY)
            stack.pop();
        else
        {
            if (node === stayWithin)
                return NULL;
            node = anXMLNode;
            while ((node = node.nextSibling) && (node.nodeType === 8 || node.nodeType === 3 || node.nodeType === 7));
;
            if (node)
                return node;
        }
        node = anXMLNode;
        while (node)
        {
            var next = node;
            while ((next = next.nextSibling) && (next.nodeType === 8 || next.nodeType === 3 || next.nodeType === 7));
;
            if (next)
                return next;
            var node = node.parentNode;
            if (stayWithin && node === stayWithin)
                return NULL;
            stack.pop();
        }
        return NULL;
    };
    CFPropertyList.propertyListFromData =     function(aData, aFormat)
    {
        return CFPropertyList.propertyListFromString(aData.rawString(), aFormat);
    };
    CFPropertyList.propertyListFromString =     function(aString, aFormat)
    {
        if (!aFormat)
            aFormat = CFPropertyList.sniffedFormatOfString(aString);
        if (aFormat === CFPropertyList.FormatXML_v1_0)
            return CFPropertyList.propertyListFromXML(aString);
        if (aFormat === CFPropertyList.Format280North_v1_0)
            return propertyListFrom280NorthString(aString);
        return NULL;
    };
    var ARRAY_MARKER = "A",
        DICTIONARY_MARKER = "D",
        FLOAT_MARKER = "f",
        INTEGER_MARKER = "d",
        STRING_MARKER = "S",
        TRUE_MARKER = "T",
        FALSE_MARKER = "F",
        KEY_MARKER = "K",
        END_MARKER = "E";
    function propertyListFrom280NorthString(aString)
    {
        var stream = new MarkedStream(aString),
            marker = NULL,
            key = "",
            object = NULL,
            plistObject = NULL,
            containers = [],
            currentContainer = NULL;
        while (marker = stream.getMarker())
        {
            if (marker === END_MARKER)
            {
                containers.pop();
                continue;
            }
            var count = containers.length;
            if (count)
                currentContainer = containers[count - 1];
            if (marker === KEY_MARKER)
            {
                key = stream.getString();
                marker = stream.getMarker();
            }
            switch(marker) {
                case ARRAY_MARKER:
                    object = [];
                    containers.push(object);
                    break;
                case DICTIONARY_MARKER:
                    object = new CFMutableDictionary();
                    containers.push(object);
                    break;
                case FLOAT_MARKER:
                    object = parseFloat(stream.getString());
                    break;
                case INTEGER_MARKER:
                    object = parseInt(stream.getString(), 10);
                    break;
                case STRING_MARKER:
                    object = stream.getString();
                    break;
                case TRUE_MARKER:
                    object = YES;
                    break;
                case FALSE_MARKER:
                    object = NO;
                    break;
default:
                    throw new Error("*** " + marker + " marker not recognized in Plist.");
            }
            if (!plistObject)
                plistObject = object;
            else if (currentContainer)
                if (currentContainer.slice)
                    currentContainer.push(object);
                else
                    currentContainer.setValueForKey(key, object);
        }
        return plistObject;
    }
    function encodeHTMLComponent(aString)
    {
        return aString.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function decodeHTMLComponent(aString)
    {
        return aString.replace(/&quot;/g, '"').replace(/&apos;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    }
    function parseXML(aString)
    {
        if (window.DOMParser)
            return new window.DOMParser().parseFromString(aString, "text/xml") && new window.DOMParser().parseFromString(aString, "text/xml").documentElement;
        else if (window.ActiveXObject)
        {
            XMLNode = new ActiveXObject("Microsoft.XMLDOM");
            var matches = aString.match(CFPropertyList.DTDRE);
            if (matches)
                aString = aString.substr(matches[0].length);
            XMLNode.loadXML(aString);
            return XMLNode;
        }
        return NULL;
    }
    CFPropertyList.propertyListFromXML =     function(aStringOrXMLNode)
    {
        var XMLNode = aStringOrXMLNode;
        if (aStringOrXMLNode.valueOf && typeof aStringOrXMLNode.valueOf() === "string")
            XMLNode = parseXML(aStringOrXMLNode);
        while (XMLNode && (String(XMLNode.nodeName) === XML_DOCUMENT || String(XMLNode.nodeName) === XML_XML))
        {
            {
                XMLNode = XMLNode.firstChild;
                if (XMLNode != NULL && (XMLNode.nodeType === 8 || XMLNode.nodeType === 3 || XMLNode.nodeType === 7))
                    while ((XMLNode = XMLNode.nextSibling) && (XMLNode.nodeType === 8 || XMLNode.nodeType === 3 || XMLNode.nodeType === 7));
            }
;
        }
        if (XMLNode && XMLNode.nodeType === 10)
            while ((XMLNode = XMLNode.nextSibling) && (XMLNode.nodeType === 8 || XMLNode.nodeType === 3 || XMLNode.nodeType === 7));
;
        if (!XMLNode || !(String(XMLNode.nodeName) === PLIST_PLIST))
            return NULL;
        var key = "",
            object = NULL,
            plistObject = NULL,
            plistNode = XMLNode,
            containers = [],
            currentContainer = NULL;
        while (XMLNode = _plist_traverseNextNode(XMLNode, plistNode, containers))
        {
            var count = containers.length;
            if (count)
                currentContainer = containers[count - 1];
            if (String(XMLNode.nodeName) === PLIST_KEY)
            {
                key = XMLNode.textContent || XMLNode.textContent !== "" && textContent([XMLNode]);
                while ((XMLNode = XMLNode.nextSibling) && (XMLNode.nodeType === 8 || XMLNode.nodeType === 3 || XMLNode.nodeType === 7));
;
            }
            switch(String(String(XMLNode.nodeName))) {
                case PLIST_ARRAY:
                    object = [];
                    containers.push(object);
                    break;
                case PLIST_DICTIONARY:
                    object = new CFMutableDictionary();
                    containers.push(object);
                    break;
                case PLIST_NUMBER_REAL:
                    object = parseFloat(XMLNode.textContent || XMLNode.textContent !== "" && textContent([XMLNode]));
                    break;
                case PLIST_NUMBER_INTEGER:
                    object = parseInt(XMLNode.textContent || XMLNode.textContent !== "" && textContent([XMLNode]), 10);
                    break;
                case PLIST_STRING:
                    if (XMLNode.getAttribute("type") === "base64")
                        object = XMLNode.firstChild ? CFData.decodeBase64ToString(XMLNode.textContent || XMLNode.textContent !== "" && textContent([XMLNode])) : "";
                    else
                        object = decodeHTMLComponent(XMLNode.firstChild ? XMLNode.textContent || XMLNode.textContent !== "" && textContent([XMLNode]) : "");
                    break;
                case PLIST_DATE:
                    var timestamp = Date.parseISO8601(XMLNode.textContent || XMLNode.textContent !== "" && textContent([XMLNode]));
                    object = isNaN(timestamp) ? new Date() : new Date(timestamp);
                    break;
                case PLIST_BOOLEAN_TRUE:
                    object = YES;
                    break;
                case PLIST_BOOLEAN_FALSE:
                    object = NO;
                    break;
                case PLIST_DATA:
                    object = new CFMutableData();
                    var data_bytes = XMLNode.firstChild ? CFData.decodeBase64ToArray(XMLNode.textContent || XMLNode.textContent !== "" && textContent([XMLNode]), YES) : [];
                    object.setBytes(data_bytes);
                    break;
default:
                    throw new Error("*** " + String(XMLNode.nodeName) + " tag not recognized in Plist.");
            }
            if (!plistObject)
                plistObject = object;
            else if (currentContainer)
                if (currentContainer.slice)
                    currentContainer.push(object);
                else
                    currentContainer.setValueForKey(key, object);
        }
        return plistObject;
    };
    kCFPropertyListOpenStepFormat = CFPropertyList.FormatOpenStep;
    kCFPropertyListXMLFormat_v1_0 = CFPropertyList.FormatXML_v1_0;
    kCFPropertyListBinaryFormat_v1_0 = CFPropertyList.FormatBinary_v1_0;
    kCFPropertyList280NorthFormat_v1_0 = CFPropertyList.Format280North_v1_0;
    CFPropertyListCreate =     function()
    {
        return new CFPropertyList();
    };
    CFPropertyListCreateFromXMLData =     function(data)
    {
        return CFPropertyList.propertyListFromData(data, CFPropertyList.FormatXML_v1_0);
    };
    CFPropertyListCreateXMLData =     function(aPropertyList)
    {
        return CFPropertyList.dataFromPropertyList(aPropertyList, CFPropertyList.FormatXML_v1_0);
    };
    CFPropertyListCreateFrom280NorthData =     function(data)
    {
        return CFPropertyList.propertyListFromData(data, CFPropertyList.Format280North_v1_0);
    };
    CFPropertyListCreate280NorthData =     function(aPropertyList)
    {
        return CFPropertyList.dataFromPropertyList(aPropertyList, CFPropertyList.Format280North_v1_0);
    };
    CPPropertyListCreateFromData =     function(data, aFormat)
    {
        return CFPropertyList.propertyListFromData(data, aFormat);
    };
    CPPropertyListCreateData =     function(aPropertyList, aFormat)
    {
        return CFPropertyList.dataFromPropertyList(aPropertyList, aFormat);
    };
    CFDictionary =     function(aDictionary)
    {
        this._keys = [];
        this._count = 0;
        this._buckets = {};
        this._UID = objj_generateObjectUID();
    };
    var indexOf = Array.prototype.indexOf,
        hasOwnProperty = Object.prototype.hasOwnProperty;
    CFDictionary.prototype.copy =     function()
    {
        return this;
    };
    CFDictionary.prototype.mutableCopy =     function()
    {
        var newDictionary = new CFMutableDictionary(),
            keys = this._keys,
            count = this._count;
        newDictionary._keys = keys.slice();
        newDictionary._count = count;
        var index = 0,
            buckets = this._buckets,
            newBuckets = newDictionary._buckets;
        for (; index < count; ++index)
        {
            var key = keys[index];
            newBuckets[key] = buckets[key];
        }
        return newDictionary;
    };
    CFDictionary.prototype.containsKey =     function(aKey)
    {
        return hasOwnProperty.apply(this._buckets, [aKey]);
    };
    CFDictionary.prototype.containsKey.displayName = "CFDictionary . prototype . containsKey";
    CFDictionary.prototype.containsValue =     function(anObject)
    {
        var keys = this._keys,
            buckets = this._buckets,
            index = 0,
            count = keys.length;
        for (; index < count; ++index)
            if (buckets[keys[index]] === anObject)
                return YES;
        return NO;
    };
    CFDictionary.prototype.containsValue.displayName = "CFDictionary . prototype . containsValue";
    CFDictionary.prototype.count =     function()
    {
        return this._count;
    };
    CFDictionary.prototype.count.displayName = "CFDictionary . prototype . count";
    CFDictionary.prototype.countOfKey =     function(aKey)
    {
        return this.containsKey(aKey) ? 1 : 0;
    };
    CFDictionary.prototype.countOfKey.displayName = "CFDictionary . prototype . countOfKey";
    CFDictionary.prototype.countOfValue =     function(anObject)
    {
        var keys = this._keys,
            buckets = this._buckets,
            index = 0,
            count = keys.length,
            countOfValue = 0;
        for (; index < count; ++index)
            if (buckets[keys[index]] === anObject)
                ++countOfValue;
        return countOfValue;
    };
    CFDictionary.prototype.countOfValue.displayName = "CFDictionary . prototype . countOfValue";
    CFDictionary.prototype.keys =     function()
    {
        return this._keys.slice();
    };
    CFDictionary.prototype.keys.displayName = "CFDictionary . prototype . keys";
    CFDictionary.prototype.valueForKey =     function(aKey)
    {
        var buckets = this._buckets;
        if (!hasOwnProperty.apply(buckets, [aKey]))
            return nil;
        return buckets[aKey];
    };
    CFDictionary.prototype.valueForKey.displayName = "CFDictionary . prototype . valueForKey";
    CFDictionary.prototype.toString =     function()
    {
        var string = "{\n",
            keys = this._keys,
            index = 0,
            count = this._count;
        for (; index < count; ++index)
        {
            var key = keys[index];
            string += "\t" + key + " = \"" + String(this.valueForKey(key)).split('\n').join("\n\t") + "\"\n";
        }
        return string + "}";
    };
    CFDictionary.prototype.toString.displayName = "CFDictionary . prototype . toString";
    CFDictionary.prototype.toJSObject =     function()
    {
        var jsObject = new Object(),
            keys = this._keys,
            index = 0,
            count = this._count;
        for (; index < count; ++index)
        {
            var key = keys[index];
            jsObject[key] = this.valueForKey(key);
        }
        return jsObject;
    };
    CFDictionary.prototype.toJSObject.displayName = "CFDictionary . prototype . toJSObject";
    CFMutableDictionary =     function(aDictionary)
    {
        CFDictionary.apply(this, []);
    };
    CFMutableDictionary.prototype = new CFDictionary();
    CFMutableDictionary.prototype.copy =     function()
    {
        return this.mutableCopy();
    };
    CFMutableDictionary.prototype.addValueForKey =     function(aKey, aValue)
    {
        if (this.containsKey(aKey))
            return;
        ++this._count;
        this._keys.push(aKey);
        this._buckets[aKey] = aValue;
    };
    CFMutableDictionary.prototype.addValueForKey.displayName = "CFMutableDictionary . prototype . addValueForKey";
    CFMutableDictionary.prototype.removeValueForKey =     function(aKey)
    {
        var indexOfKey = -1;
        if (indexOf)
            indexOfKey = indexOf.call(this._keys, aKey);
        else
        {
            var keys = this._keys,
                index = 0,
                count = keys.length;
            for (; index < count; ++index)
                if (keys[index] === aKey)
                {
                    indexOfKey = index;
                    break;
                }
        }
        if (indexOfKey === -1)
            return;
        --this._count;
        this._keys.splice(indexOfKey, 1);
        delete this._buckets[aKey];
    };
    CFMutableDictionary.prototype.removeValueForKey.displayName = "CFMutableDictionary . prototype . removeValueForKey";
    CFMutableDictionary.prototype.removeAllValues =     function()
    {
        this._count = 0;
        this._keys = [];
        this._buckets = {};
    };
    CFMutableDictionary.prototype.removeAllValues.displayName = "CFMutableDictionary . prototype . removeAllValues";
    CFMutableDictionary.prototype.replaceValueForKey =     function(aKey, aValue)
    {
        if (!this.containsKey(aKey))
            return;
        this._buckets[aKey] = aValue;
    };
    CFMutableDictionary.prototype.replaceValueForKey.displayName = "CFMutableDictionary . prototype . replaceValueForKey";
    CFMutableDictionary.prototype.setValueForKey =     function(aKey, aValue)
    {
        if (aValue == nil)
            this.removeValueForKey(aKey);
        else if (this.containsKey(aKey))
            this.replaceValueForKey(aKey, aValue);
        else
            this.addValueForKey(aKey, aValue);
    };
    CFMutableDictionary.prototype.setValueForKey.displayName = "CFMutableDictionary . prototype . setValueForKey";
    kCFErrorLocalizedDescriptionKey = "CPLocalizedDescription";
    kCFErrorLocalizedFailureReasonKey = "CPLocalizedFailureReason";
    kCFErrorLocalizedRecoverySuggestionKey = "CPLocalizedRecoverySuggestion";
    kCFErrorDescriptionKey = "CPDescription";
    kCFErrorUnderlyingErrorKey = "CPUnderlyingError";
    kCFErrorURLKey = "CPURL";
    kCFErrorFilePathKey = "CPFilePath";
    kCFErrorDomainCappuccino = "CPCappuccinoErrorDomain";
    kCFErrorDomainCocoa = kCFErrorDomainCappuccino;
    CFError =     function(domain, code, userInfo)
    {
        this._domain = domain || NULL;
        this._code = code || 0;
        this._userInfo = userInfo || new CFDictionary();
        this._UID = objj_generateObjectUID();
    };
    CFError.prototype.domain =     function()
    {
        return this._domain;
    };
    CFError.prototype.domain.displayName = "CFError . prototype . domain";
    CFError.prototype.code =     function()
    {
        return this._code;
    };
    CFError.prototype.code.displayName = "CFError . prototype . code";
    CFError.prototype.description =     function()
    {
        var localizedDesc = this._userInfo.valueForKey(kCFErrorLocalizedDescriptionKey);
        if (localizedDesc)
            return localizedDesc;
        var reason = this._userInfo.valueForKey(kCFErrorLocalizedFailureReasonKey);
        if (reason)
        {
            var operationFailedStr = "The operation couldn\u2019t be completed. " + reason;
            return operationFailedStr;
        }
        var result = "",
            desc = this._userInfo.valueForKey(kCFErrorDescriptionKey);
        if (desc)
        {
            var result = "The operation couldn\u2019t be completed. (error " + this._code + " - " + desc + ")";
        }
        else
        {
            var result = "The operation couldn\u2019t be completed. (error " + this._code + ")";
        }
        return result;
    };
    CFError.prototype.description.displayName = "CFError . prototype . description";
    CFError.prototype.failureReason =     function()
    {
        return this._userInfo.valueForKey(kCFErrorLocalizedFailureReasonKey);
    };
    CFError.prototype.failureReason.displayName = "CFError . prototype . failureReason";
    CFError.prototype.recoverySuggestion =     function()
    {
        return this._userInfo.valueForKey(kCFErrorLocalizedRecoverySuggestionKey);
    };
    CFError.prototype.recoverySuggestion.displayName = "CFError . prototype . recoverySuggestion";
    CFError.prototype.userInfo =     function()
    {
        return this._userInfo;
    };
    CFError.prototype.userInfo.displayName = "CFError . prototype . userInfo";
    CFErrorCreate =     function(domain, code, userInfo)
    {
        return new CFError(domain, code, userInfo);
    };
    CFErrorCreateWithUserInfoKeysAndValues =     function(domain, code, userInfoKeys, userInfoValues, numUserInfoValues)
    {
        var userInfo = new CFMutableDictionary();
        while (numUserInfoValues--)
            userInfo.setValueForKey(userInfoKeys[numUserInfoValues], userInfoValues[numUserInfoValues]);
        return new CFError(domain, code, userInfo);
    };
    CFErrorGetCode =     function(err)
    {
        return err.code();
    };
    CFErrorGetDomain =     function(err)
    {
        return err.domain();
    };
    CFErrorCopyDescription =     function(err)
    {
        return err.description();
    };
    CFErrorCopyUserInfo =     function(err)
    {
        return err.userInfo();
    };
    CFErrorCopyFailureReason =     function(err)
    {
        return err.failureReason();
    };
    CFErrorCopyRecoverySuggestion =     function(err)
    {
        return err.recoverySuggestion();
    };
    kCFURLErrorUnknown = -998;
    kCFURLErrorCancelled = -999;
    kCFURLErrorBadURL = -1000;
    kCFURLErrorTimedOut = -1001;
    kCFURLErrorUnsupportedURL = -1002;
    kCFURLErrorCannotFindHost = -1003;
    kCFURLErrorCannotConnectToHost = -1004;
    kCFURLErrorNetworkConnectionLost = -1005;
    kCFURLErrorDNSLookupFailed = -1006;
    kCFURLErrorHTTPTooManyRedirects = -1007;
    kCFURLErrorResourceUnavailable = -1008;
    kCFURLErrorNotConnectedToInternet = -1009;
    kCFURLErrorRedirectToNonExistentLocation = -1010;
    kCFURLErrorBadServerResponse = -1011;
    kCFURLErrorUserCancelledAuthentication = -1012;
    kCFURLErrorUserAuthenticationRequired = -1013;
    kCFURLErrorZeroByteResource = -1014;
    kCFURLErrorCannotDecodeRawData = -1015;
    kCFURLErrorCannotDecodeContentData = -1016;
    kCFURLErrorCannotParseResponse = -1017;
    kCFURLErrorRequestBodyStreamExhausted = -1021;
    kCFURLErrorFileDoesNotExist = -1100;
    kCFURLErrorFileIsDirectory = -1101;
    kCFURLErrorNoPermissionsToReadFile = -1102;
    kCFURLErrorDataLengthExceedsMaximum = -1103;
    CFData =     function()
    {
        this._rawString = NULL;
        this._propertyList = NULL;
        this._propertyListFormat = NULL;
        this._JSONObject = NULL;
        this._bytes = NULL;
        this._base64 = NULL;
    };
    CFData.prototype.propertyList =     function()
    {
        if (!this._propertyList)
            this._propertyList = CFPropertyList.propertyListFromString(this.rawString());
        return this._propertyList;
    };
    CFData.prototype.JSONObject =     function()
    {
        if (!this._JSONObject)
        {
            try {
                this._JSONObject = JSON.parse(this.rawString());
            }
            catch(anException) {
            }
        }
        return this._JSONObject;
    };
    CFData.prototype.rawString =     function()
    {
        if (this._rawString === NULL)
        {
            if (this._propertyList)
                this._rawString = CFPropertyList.stringFromPropertyList(this._propertyList, this._propertyListFormat);
            else if (this._JSONObject)
                this._rawString = JSON.stringify(this._JSONObject);
            else if (this._bytes)
                this._rawString = CFData.bytesToString(this._bytes);
            else if (this._base64)
                this._rawString = CFData.decodeBase64ToString(this._base64, true);
            else
                throw new Error("Can't convert data to string.");
        }
        return this._rawString;
    };
    CFData.prototype.bytes =     function()
    {
        if (this._bytes === NULL)
        {
            var bytes = CFData.stringToBytes(this.rawString());
            this.setBytes(bytes);
        }
        return this._bytes;
    };
    CFData.prototype.base64 =     function()
    {
        if (this._base64 === NULL)
        {
            var base64;
            if (this._bytes)
                base64 = CFData.encodeBase64Array(this._bytes);
            else
                base64 = CFData.encodeBase64String(this.rawString());
            this.setBase64String(base64);
        }
        return this._base64;
    };
    CFMutableData =     function()
    {
        CFData.call(this);
    };
    CFMutableData.prototype = new CFData();
    function clearMutableData(aData)
    {
        this._rawString = NULL;
        this._propertyList = NULL;
        this._propertyListFormat = NULL;
        this._JSONObject = NULL;
        this._bytes = NULL;
        this._base64 = NULL;
    }
    CFMutableData.prototype.setPropertyList =     function(aPropertyList, aFormat)
    {
        clearMutableData(this);
        this._propertyList = aPropertyList;
        this._propertyListFormat = aFormat;
    };
    CFMutableData.prototype.setJSONObject =     function(anObject)
    {
        clearMutableData(this);
        this._JSONObject = anObject;
    };
    CFMutableData.prototype.setRawString =     function(aString)
    {
        clearMutableData(this);
        this._rawString = aString;
    };
    CFMutableData.prototype.setBytes =     function(bytes)
    {
        clearMutableData(this);
        this._bytes = bytes;
    };
    CFMutableData.prototype.setBase64String =     function(aBase64String)
    {
        clearMutableData(this);
        this._base64 = aBase64String;
    };
    var base64_map_to = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/", "="],
        base64_map_from = [];
    for (var i = 0; i < base64_map_to.length; i++)
        base64_map_from[base64_map_to[i].charCodeAt(0)] = i;
    CFData.decodeBase64ToArray =     function(input, strip)
    {
        if (strip)
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        var pad = (input[input.length - 1] == "=" ? 1 : 0) + (input[input.length - 2] == "=" ? 1 : 0),
            length = input.length,
            output = [];
        var i = 0;
        while (i < length)
        {
            var bits = base64_map_from[input.charCodeAt(i++)] << 18 | base64_map_from[input.charCodeAt(i++)] << 12 | base64_map_from[input.charCodeAt(i++)] << 6 | base64_map_from[input.charCodeAt(i++)];
            output.push((bits & 0xFF0000) >> 16);
            output.push((bits & 0xFF00) >> 8);
            output.push(bits & 0xFF);
        }
        if (pad > 0)
            return output.slice(0, -1 * pad);
        return output;
    };
    CFData.encodeBase64Array =     function(input)
    {
        var pad = (3 - input.length % 3) % 3,
            length = input.length + pad,
            output = [];
        if (pad > 0)
            input.push(0);
        if (pad > 1)
            input.push(0);
        var i = 0;
        while (i < length)
        {
            var bits = input[i++] << 16 | input[i++] << 8 | input[i++];
            output.push(base64_map_to[(bits & 0xFC0000) >> 18]);
            output.push(base64_map_to[(bits & 0x3F000) >> 12]);
            output.push(base64_map_to[(bits & 0xFC0) >> 6]);
            output.push(base64_map_to[bits & 0x3F]);
        }
        if (pad > 0)
        {
            output[output.length - 1] = "=";
            input.pop();
        }
        if (pad > 1)
        {
            output[output.length - 2] = "=";
            input.pop();
        }
        return output.join("");
    };
    CFData.decodeBase64ToString =     function(input, strip)
    {
        return CFData.bytesToString(CFData.decodeBase64ToArray(input, strip));
    };
    CFData.decodeBase64ToUtf16String =     function(input, strip)
    {
        return CFData.bytesToUtf16String(CFData.decodeBase64ToArray(input, strip));
    };
    CFData.bytesToString =     function(bytes)
    {
        return String.fromCharCode.apply(NULL, bytes);
    };
    CFData.stringToBytes =     function(input)
    {
        var temp = [];
        for (var i = 0; i < input.length; i++)
            temp.push(input.charCodeAt(i));
        return temp;
    };
    CFData.encodeBase64String =     function(input)
    {
        var temp = [];
        for (var i = 0; i < input.length; i++)
            temp.push(input.charCodeAt(i));
        return CFData.encodeBase64Array(temp);
    };
    CFData.bytesToUtf16String =     function(bytes)
    {
        var temp = [];
        for (var i = 0; i < bytes.length; i += 2)
            temp.push(bytes[i + 1] << 8 | bytes[i]);
        return String.fromCharCode.apply(NULL, temp);
    };
    CFData.encodeBase64Utf16String =     function(input)
    {
        var temp = [];
        for (var i = 0; i < input.length; i++)
        {
            var c = input.charCodeAt(i);
            temp.push(c & 0xFF);
            temp.push((c & 0xFF00) >> 8);
        }
        return CFData.encodeBase64Array(temp);
    };
    var CFURLsForCachedUIDs,
        CFURLPartsForURLStrings,
        CFURLCachingEnableCount = 0;
    function enableCFURLCaching()
    {
        if (++CFURLCachingEnableCount !== 1)
            return;
        CFURLsForCachedUIDs = {};
        CFURLPartsForURLStrings = {};
    }
    function disableCFURLCaching()
    {
        CFURLCachingEnableCount = MAX(CFURLCachingEnableCount - 1, 0);
        if (CFURLCachingEnableCount !== 0)
            return;
        delete CFURLsForCachedUIDs;
        delete CFURLPartsForURLStrings;
    }
    var URL_RE = new RegExp("^" + "(?:" + "([^:/?#]+):" + ")?" + "(?:" + "(//)" + "(" + "(?:" + "(" + "([^:@]*)" + ":?" + "([^:@]*)" + ")?" + "@" + ")?" + "([^:/?#]*)" + "(?::(\\d*))?" + ")" + ")?" + "([^?#]*)" + "(?:\\?([^#]*))?" + "(?:#(.*))?");
    var URI_KEYS = ["url", "scheme", "authorityRoot", "authority", "userInfo", "user", "password", "domain", "portNumber", "path", "queryString", "fragment"];
    function CFURLGetParts(aURL)
    {
        if (aURL._parts)
            return aURL._parts;
        var URLString = aURL.string(),
            isMHTMLURL = URLString.match(/^mhtml:/);
        if (isMHTMLURL)
            URLString = URLString.substr("mhtml:".length);
        if (CFURLCachingEnableCount > 0 && hasOwnProperty.call(CFURLPartsForURLStrings, URLString))
        {
            aURL._parts = CFURLPartsForURLStrings[URLString];
            return aURL._parts;
        }
        aURL._parts = {};
        var parts = aURL._parts,
            results = URL_RE.exec(URLString),
            index = results.length;
        while (index--)
            parts[URI_KEYS[index]] = results[index] || NULL;
        parts.portNumber = parseInt(parts.portNumber, 10);
        if (isNaN(parts.portNumber))
            parts.portNumber = -1;
        parts.pathComponents = [];
        if (parts.path)
        {
            var split = parts.path.split("/"),
                pathComponents = parts.pathComponents,
                count = split.length;
            for (index = 0; index < count; ++index)
            {
                var component = split[index];
                if (component)
                    pathComponents.push(component);
                else if (index === 0)
                    pathComponents.push("/");
            }
            parts.pathComponents = pathComponents;
        }
        if (isMHTMLURL)
        {
            parts.url = "mhtml:" + parts.url;
            parts.scheme = "mhtml:" + parts.scheme;
        }
        if (CFURLCachingEnableCount > 0)
            CFURLPartsForURLStrings[URLString] = parts;
        return parts;
    }
    CFURL =     function(aURL, aBaseURL)
    {
        aURL = aURL || "";
        if (aURL instanceof CFURL)
        {
            if (!aBaseURL)
                return new CFURL(aURL.absoluteString());
            var existingBaseURL = aURL.baseURL();
            if (existingBaseURL)
                aBaseURL = new CFURL(existingBaseURL.absoluteURL(), aBaseURL);
            aURL = aURL.string();
        }
        if (CFURLCachingEnableCount > 0)
        {
            var cacheUID = aURL + " " + (aBaseURL && aBaseURL.UID() || "");
            if (hasOwnProperty.call(CFURLsForCachedUIDs, cacheUID))
                return CFURLsForCachedUIDs[cacheUID];
            CFURLsForCachedUIDs[cacheUID] = this;
        }
        if (aURL.match(/^data:/))
        {
            var parts = {},
                index = URI_KEYS.length;
            while (index--)
                parts[URI_KEYS[index]] = "";
            parts.url = aURL;
            parts.scheme = "data";
            parts.pathComponents = [];
            this._parts = parts;
            this._standardizedURL = this;
            this._absoluteURL = this;
        }
        this._UID = objj_generateObjectUID();
        this._string = aURL;
        this._baseURL = aBaseURL;
    };
    CFURL.displayName = "CFURL";
    CFURL.prototype.UID =     function()
    {
        return this._UID;
    };
    CFURL.prototype.UID.displayName = "CFURL . prototype . UID";
    var URLMap = {};
    CFURL.prototype.mappedURL =     function()
    {
        return URLMap[this.absoluteString()] || this;
    };
    CFURL.prototype.mappedURL.displayName = "CFURL . prototype . mappedURL";
    CFURL.setMappedURLForURL =     function(fromURL, toURL)
    {
        URLMap[fromURL.absoluteString()] = toURL;
    };
    CFURL.setMappedURLForURL.displayName = "CFURL . setMappedURLForURL";
    CFURL.prototype.schemeAndAuthority =     function()
    {
        var string = "",
            scheme = this.scheme();
        if (scheme)
            string += scheme + ":";
        var authority = this.authority();
        if (authority)
            string += "//" + authority;
        return string;
    };
    CFURL.prototype.schemeAndAuthority.displayName = "CFURL . prototype . schemeAndAuthority";
    CFURL.prototype.absoluteString =     function()
    {
        if (this._absoluteString === undefined)
            this._absoluteString = this.absoluteURL().string();
        return this._absoluteString;
    };
    CFURL.prototype.absoluteString.displayName = "CFURL . prototype . absoluteString";
    CFURL.prototype.toString =     function()
    {
        return this.absoluteString();
    };
    CFURL.prototype.toString.displayName = "CFURL . prototype . toString";
    function resolveURL(aURL)
    {
        aURL = aURL.standardizedURL();
        var baseURL = aURL.baseURL();
        if (!baseURL)
            return aURL;
        var parts = aURL._parts || CFURLGetParts(aURL),
            resolvedParts,
            absoluteBaseURL = baseURL.absoluteURL(),
            baseParts = absoluteBaseURL._parts || CFURLGetParts(absoluteBaseURL);
        if (!parts.scheme && parts.authorityRoot)
        {
            resolvedParts = CFURLPartsCreateCopy(parts);
            resolvedParts.scheme = baseURL.scheme();
        }
        else if (parts.scheme || parts.authority)
        {
            resolvedParts = parts;
        }
        else
        {
            resolvedParts = {};
            resolvedParts.scheme = baseParts.scheme;
            resolvedParts.authority = baseParts.authority;
            resolvedParts.userInfo = baseParts.userInfo;
            resolvedParts.user = baseParts.user;
            resolvedParts.password = baseParts.password;
            resolvedParts.domain = baseParts.domain;
            resolvedParts.portNumber = baseParts.portNumber;
            resolvedParts.queryString = parts.queryString;
            resolvedParts.fragment = parts.fragment;
            var pathComponents = parts.pathComponents;
            if (pathComponents.length && pathComponents[0] === "/")
            {
                resolvedParts.path = parts.path;
                resolvedParts.pathComponents = pathComponents;
            }
            else
            {
                var basePathComponents = baseParts.pathComponents,
                    resolvedPathComponents = basePathComponents.concat(pathComponents);
                if (!baseURL.hasDirectoryPath() && basePathComponents.length)
                    resolvedPathComponents.splice(basePathComponents.length - 1, 1);
                if (pathComponents.length && (pathComponents[0] === ".." || pathComponents[0] === "."))
                    standardizePathComponents(resolvedPathComponents, YES);
                resolvedParts.pathComponents = resolvedPathComponents;
                resolvedParts.path = pathFromPathComponents(resolvedPathComponents, pathComponents.length <= 0 || aURL.hasDirectoryPath());
            }
        }
        var resolvedString = URLStringFromParts(resolvedParts),
            resolvedURL = new CFURL(resolvedString);
        resolvedURL._parts = resolvedParts;
        resolvedURL._standardizedURL = resolvedURL;
        resolvedURL._standardizedString = resolvedString;
        resolvedURL._absoluteURL = resolvedURL;
        resolvedURL._absoluteString = resolvedString;
        return resolvedURL;
    }
    function pathFromPathComponents(pathComponents, isDirectoryPath)
    {
        var path = pathComponents.join("/");
        if (path.length && path.charAt(0) === "/")
            path = path.substr(1);
        if (isDirectoryPath)
            path += "/";
        return path;
    }
    function standardizePathComponents(pathComponents, inPlace)
    {
        var index = 0,
            resultIndex = 0,
            count = pathComponents.length,
            result = inPlace ? pathComponents : [],
            startsWithPeriod = NO;
        for (; index < count; ++index)
        {
            var component = pathComponents[index];
            if (component === "")
                continue;
            if (component === ".")
            {
                startsWithPeriod = resultIndex === 0;
                continue;
            }
            if (component !== ".." || resultIndex === 0 || result[resultIndex - 1] === "..")
            {
                result[resultIndex] = component;
                resultIndex++;
                continue;
            }
            if (resultIndex > 0 && result[resultIndex - 1] !== "/")
                --resultIndex;
        }
        if (startsWithPeriod && resultIndex === 0)
            result[resultIndex++] = ".";
        result.length = resultIndex;
        return result;
    }
    function URLStringFromParts(parts)
    {
        var string = "",
            scheme = parts.scheme;
        if (scheme)
            string += scheme + ":";
        var authority = parts.authority;
        if (authority)
            string += "//" + authority;
        string += parts.path;
        var queryString = parts.queryString;
        if (queryString)
            string += "?" + queryString;
        var fragment = parts.fragment;
        if (fragment)
            string += "#" + fragment;
        return string;
    }
    CFURL.prototype.absoluteURL =     function()
    {
        if (this._absoluteURL === undefined)
            this._absoluteURL = resolveURL(this);
        return this._absoluteURL;
    };
    CFURL.prototype.absoluteURL.displayName = "CFURL . prototype . absoluteURL";
    CFURL.prototype.standardizedURL =     function()
    {
        if (this._standardizedURL === undefined)
        {
            var parts = this._parts || CFURLGetParts(this),
                pathComponents = parts.pathComponents,
                standardizedPathComponents = standardizePathComponents(pathComponents, NO);
            var standardizedPath = pathFromPathComponents(standardizedPathComponents, this.hasDirectoryPath());
            if (parts.path === standardizedPath)
                this._standardizedURL = this;
            else
            {
                var standardizedParts = CFURLPartsCreateCopy(parts);
                standardizedParts.pathComponents = standardizedPathComponents;
                standardizedParts.path = standardizedPath;
                var standardizedURL = new CFURL(URLStringFromParts(standardizedParts), this.baseURL());
                standardizedURL._parts = standardizedParts;
                standardizedURL._standardizedURL = standardizedURL;
                this._standardizedURL = standardizedURL;
            }
        }
        return this._standardizedURL;
    };
    CFURL.prototype.standardizedURL.displayName = "CFURL . prototype . standardizedURL";
    function CFURLPartsCreateCopy(parts)
    {
        var copiedParts = {},
            count = URI_KEYS.length;
        while (count--)
        {
            var partName = URI_KEYS[count];
            copiedParts[partName] = parts[partName];
        }
        return copiedParts;
    }
    CFURL.prototype.string =     function()
    {
        return this._string;
    };
    CFURL.prototype.string.displayName = "CFURL . prototype . string";
    CFURL.prototype.authority =     function()
    {
        var authority = (this._parts || CFURLGetParts(this)).authority;
        if (authority)
            return authority;
        var baseURL = this.baseURL();
        return baseURL && baseURL.authority() || "";
    };
    CFURL.prototype.authority.displayName = "CFURL . prototype . authority";
    CFURL.prototype.hasDirectoryPath =     function()
    {
        var hasDirectoryPath = this._hasDirectoryPath;
        if (hasDirectoryPath === undefined)
        {
            var path = this.path();
            if (!path)
                return NO;
            if (path.charAt(path.length - 1) === "/")
                return YES;
            var lastPathComponent = this.lastPathComponent();
            hasDirectoryPath = lastPathComponent === "." || lastPathComponent === "..";
            this._hasDirectoryPath = hasDirectoryPath;
        }
        return hasDirectoryPath;
    };
    CFURL.prototype.hasDirectoryPath.displayName = "CFURL . prototype . hasDirectoryPath";
    CFURL.prototype.hostName =     function()
    {
        return this.authority();
    };
    CFURL.prototype.hostName.displayName = "CFURL . prototype . hostName";
    CFURL.prototype.fragment =     function()
    {
        return (this._parts || CFURLGetParts(this)).fragment;
    };
    CFURL.prototype.fragment.displayName = "CFURL . prototype . fragment";
    CFURL.prototype.lastPathComponent =     function()
    {
        if (this._lastPathComponent === undefined)
        {
            var pathComponents = this.pathComponents(),
                pathComponentCount = pathComponents.length;
            if (!pathComponentCount)
                this._lastPathComponent = "";
            else
                this._lastPathComponent = pathComponents[pathComponentCount - 1];
        }
        return this._lastPathComponent;
    };
    CFURL.prototype.lastPathComponent.displayName = "CFURL . prototype . lastPathComponent";
    CFURL.prototype.path =     function()
    {
        return (this._parts || CFURLGetParts(this)).path;
    };
    CFURL.prototype.path.displayName = "CFURL . prototype . path";
    CFURL.prototype.createCopyDeletingLastPathComponent =     function()
    {
        var parts = this._parts || CFURLGetParts(this),
            components = standardizePathComponents(parts.pathComponents, NO);
        if (components.length > 0)
            if (components.length > 1 || components[0] !== "/")
                components.pop();
        var isRoot = components.length === 1 && components[0] === "/";
        parts.pathComponents = components;
        parts.path = isRoot ? "/" : pathFromPathComponents(components, NO);
        return new CFURL(URLStringFromParts(parts));
    };
    CFURL.prototype.createCopyDeletingLastPathComponent.displayName = "CFURL . prototype . createCopyDeletingLastPathComponent";
    CFURL.prototype.pathComponents =     function()
    {
        return (this._parts || CFURLGetParts(this)).pathComponents;
    };
    CFURL.prototype.pathComponents.displayName = "CFURL . prototype . pathComponents";
    CFURL.prototype.pathExtension =     function()
    {
        var lastPathComponent = this.lastPathComponent();
        if (!lastPathComponent)
            return NULL;
        lastPathComponent = lastPathComponent.replace(/^\.*/, '');
        var index = lastPathComponent.lastIndexOf(".");
        return index <= 0 ? "" : lastPathComponent.substring(index + 1);
    };
    CFURL.prototype.pathExtension.displayName = "CFURL . prototype . pathExtension";
    CFURL.prototype.queryString =     function()
    {
        return (this._parts || CFURLGetParts(this)).queryString;
    };
    CFURL.prototype.queryString.displayName = "CFURL . prototype . queryString";
    CFURL.prototype.scheme =     function()
    {
        var scheme = this._scheme;
        if (scheme === undefined)
        {
            scheme = (this._parts || CFURLGetParts(this)).scheme;
            if (!scheme)
            {
                var baseURL = this.baseURL();
                scheme = baseURL && baseURL.scheme();
            }
            this._scheme = scheme;
        }
        return scheme;
    };
    CFURL.prototype.scheme.displayName = "CFURL . prototype . scheme";
    CFURL.prototype.user =     function()
    {
        return (this._parts || CFURLGetParts(this)).user;
    };
    CFURL.prototype.user.displayName = "CFURL . prototype . user";
    CFURL.prototype.password =     function()
    {
        return (this._parts || CFURLGetParts(this)).password;
    };
    CFURL.prototype.password.displayName = "CFURL . prototype . password";
    CFURL.prototype.portNumber =     function()
    {
        return (this._parts || CFURLGetParts(this)).portNumber;
    };
    CFURL.prototype.portNumber.displayName = "CFURL . prototype . portNumber";
    CFURL.prototype.domain =     function()
    {
        return (this._parts || CFURLGetParts(this)).domain;
    };
    CFURL.prototype.domain.displayName = "CFURL . prototype . domain";
    CFURL.prototype.baseURL =     function()
    {
        return this._baseURL;
    };
    CFURL.prototype.baseURL.displayName = "CFURL . prototype . baseURL";
    CFURL.prototype.asDirectoryPathURL =     function()
    {
        if (this.hasDirectoryPath())
            return this;
        var lastPathComponent = this.lastPathComponent();
        if (lastPathComponent !== "/")
            lastPathComponent = "./" + lastPathComponent;
        return new CFURL(lastPathComponent + "/", this);
    };
    CFURL.prototype.asDirectoryPathURL.displayName = "CFURL . prototype . asDirectoryPathURL";
    function CFURLGetResourcePropertiesForKeys(aURL)
    {
        if (!aURL._resourcePropertiesForKeys)
            aURL._resourcePropertiesForKeys = new CFMutableDictionary();
        return aURL._resourcePropertiesForKeys;
    }
    CFURL.prototype.resourcePropertyForKey =     function(aKey)
    {
        return CFURLGetResourcePropertiesForKeys(this).valueForKey(aKey);
    };
    CFURL.prototype.resourcePropertyForKey.displayName = "CFURL . prototype . resourcePropertyForKey";
    CFURL.prototype.setResourcePropertyForKey =     function(aKey, aValue)
    {
        CFURLGetResourcePropertiesForKeys(this).setValueForKey(aKey, aValue);
    };
    CFURL.prototype.setResourcePropertyForKey.displayName = "CFURL . prototype . setResourcePropertyForKey";
    CFURL.prototype.staticResourceData =     function()
    {
        var data = new CFMutableData();
        data.setRawString(StaticResource.resourceAtURL(this).contents());
        return data;
    };
    CFURL.prototype.staticResourceData.displayName = "CFURL . prototype . staticResourceData";
    function MarkedStream(aString)
    {
        this._string = aString;
        var index = aString.indexOf(";");
        this._magicNumber = aString.substr(0, index);
        this._location = aString.indexOf(";", ++index);
        this._version = aString.substring(index, this._location++);
    }
    MarkedStream.prototype.magicNumber =     function()
    {
        return this._magicNumber;
    };
    MarkedStream.prototype.magicNumber.displayName = "MarkedStream . prototype . magicNumber";
    MarkedStream.prototype.version =     function()
    {
        return this._version;
    };
    MarkedStream.prototype.version.displayName = "MarkedStream . prototype . version";
    MarkedStream.prototype.getMarker =     function()
    {
        var string = this._string,
            location = this._location;
        if (location >= string.length)
            return null;
        var next = string.indexOf(';', location);
        if (next < 0)
            return null;
        var marker = string.substring(location, next);
        if (marker === 'e')
            return null;
        this._location = next + 1;
        return marker;
    };
    MarkedStream.prototype.getMarker.displayName = "MarkedStream . prototype . getMarker";
    MarkedStream.prototype.getString =     function()
    {
        var string = this._string,
            location = this._location;
        if (location >= string.length)
            return null;
        var next = string.indexOf(';', location);
        if (next < 0)
            return null;
        var size = parseInt(string.substring(location, next), 10),
            text = string.substr(next + 1, size);
        this._location = next + 1 + size;
        return text;
    };
    MarkedStream.prototype.getString.displayName = "MarkedStream . prototype . getString";
    var CFBundleUnloaded = 0,
        CFBundleLoading = 1 << 0,
        CFBundleLoadingInfoPlist = 1 << 1,
        CFBundleLoadingExecutable = 1 << 2,
        CFBundleLoadingSpritedImages = 1 << 3,
        CFBundleLoadingLocalizableStrings = 1 << 4,
        CFBundleLoaded = 1 << 5;
    var CFBundlesForURLStrings = {},
        CFBundlesForClasses = {},
        CFBundlesWithIdentifiers = {},
        CFCacheBuster = new Date().getTime(),
        CFTotalBytesLoaded = 0,
        CPApplicationSizeInBytes = 0;
    var CPBundleDefaultBrowserLanguage = "CPBundleDefaultBrowserLanguage",
        CPBundleDefaultLanguage = "CPBundleDefaultLanguage";
    CFBundle =     function(aURL)
    {
        aURL = makeAbsoluteURL(aURL).asDirectoryPathURL();
        var URLString = aURL.absoluteString(),
            existingBundle = CFBundlesForURLStrings[URLString];
        if (existingBundle)
            return existingBundle;
        CFBundlesForURLStrings[URLString] = this;
        this._bundleURL = aURL;
        this._resourcesDirectoryURL = new CFURL("Resources/", aURL);
        this._staticResource = NULL;
        this._isValid = NO;
        this._loadStatus = CFBundleUnloaded;
        this._loadRequests = [];
        this._infoDictionary = new CFDictionary();
        this._eventDispatcher = new EventDispatcher(this);
        this._localizableStrings = [];
        this._loadedLanguage = NULL;
    };
    CFBundle.displayName = "CFBundle";
    CFBundle.environments =     function()
    {
        return ["CommonJS", "ObjJ"];
    };
    CFBundle.environments.displayName = "CFBundle . environments";
    CFBundle.bundleContainingURL =     function(aURL)
    {
        aURL = new CFURL(".", makeAbsoluteURL(aURL));
        var previousURLString,
            URLString = aURL.absoluteString();
        while (!previousURLString || previousURLString !== URLString)
        {
            var bundle = CFBundlesForURLStrings[URLString];
            if (bundle && bundle._isValid)
                return bundle;
            aURL = new CFURL("..", aURL);
            previousURLString = URLString;
            URLString = aURL.absoluteString();
        }
        return NULL;
    };
    CFBundle.bundleContainingURL.displayName = "CFBundle . bundleContainingURL";
    CFBundle.mainBundle =     function()
    {
        return new CFBundle(mainBundleURL);
    };
    CFBundle.mainBundle.displayName = "CFBundle . mainBundle";
    function addClassToBundle(aClass, aBundle)
    {
        if (aBundle)
            CFBundlesForClasses[aClass.name] = aBundle;
    }
    function resetBundle()
    {
        CFBundlesForURLStrings = {};
        CFBundlesForClasses = {};
        CFBundlesWithIdentifiers = {};
        CFTotalBytesLoaded = 0;
        CPApplicationSizeInBytes = 0;
    }
    CFBundle.bundleForClass =     function(aClass)
    {
        return CFBundlesForClasses[aClass.name] || CFBundle.mainBundle();
    };
    CFBundle.bundleForClass.displayName = "CFBundle . bundleForClass";
    CFBundle.bundleWithIdentifier =     function(bundleID)
    {
        return CFBundlesWithIdentifiers[bundleID] || NULL;
    };
    CFBundle.bundleWithIdentifier.displayName = "CFBundle . bundleWithIdentifier";
    CFBundle.prototype.bundleURL =     function()
    {
        return this._bundleURL.absoluteURL();
    };
    CFBundle.prototype.bundleURL.displayName = "CFBundle . prototype . bundleURL";
    CFBundle.prototype.resourcesDirectoryURL =     function()
    {
        return this._resourcesDirectoryURL;
    };
    CFBundle.prototype.resourcesDirectoryURL.displayName = "CFBundle . prototype . resourcesDirectoryURL";
    CFBundle.prototype.resourceURL =     function(aResourceName, aType, aSubDirectory, localizationName)
    {
        if (aType)
            aResourceName = aResourceName + "." + aType;
        if (localizationName)
            aResourceName = localizationName + aResourceName;
        if (aSubDirectory)
            aResourceName = aSubDirectory + "/" + aResourceName;
        var resourceURL = new CFURL(aResourceName, this.resourcesDirectoryURL()).mappedURL();
        return resourceURL.absoluteURL();
    };
    CFBundle.prototype.resourceURL.displayName = "CFBundle . prototype . resourceURL";
    CFBundle.prototype.mostEligibleEnvironmentURL =     function()
    {
        if (this._mostEligibleEnvironmentURL === undefined)
            this._mostEligibleEnvironmentURL = new CFURL(this.mostEligibleEnvironment() + ".environment/", this.bundleURL());
        return this._mostEligibleEnvironmentURL;
    };
    CFBundle.prototype.mostEligibleEnvironmentURL.displayName = "CFBundle . prototype . mostEligibleEnvironmentURL";
    CFBundle.prototype.executableURL =     function()
    {
        if (this._executableURL === undefined)
        {
            var executableSubPath = this.valueForInfoDictionaryKey("CPBundleExecutable");
            if (!executableSubPath)
                this._executableURL = NULL;
            else
                this._executableURL = new CFURL(executableSubPath, this.mostEligibleEnvironmentURL());
        }
        return this._executableURL;
    };
    CFBundle.prototype.executableURL.displayName = "CFBundle . prototype . executableURL";
    CFBundle.prototype.infoDictionary =     function()
    {
        return this._infoDictionary;
    };
    CFBundle.prototype.infoDictionary.displayName = "CFBundle . prototype . infoDictionary";
    CFBundle.prototype.loadedLanguage =     function()
    {
        return this._loadedLanguage;
    };
    CFBundle.prototype.valueForInfoDictionaryKey =     function(aKey)
    {
        return this._infoDictionary.valueForKey(aKey);
    };
    CFBundle.prototype.valueForInfoDictionaryKey.displayName = "CFBundle . prototype . valueForInfoDictionaryKey";
    CFBundle.prototype.identifier =     function()
    {
        return this._infoDictionary.valueForKey("CPBundleIdentifier");
    };
    CFBundle.prototype.identifier.displayName = "CFBundle . prototype . identifier";
    CFBundle.prototype.hasSpritedImages =     function()
    {
        var environments = this._infoDictionary.valueForKey("CPBundleEnvironmentsWithImageSprites") || [],
            index = environments.length,
            mostEligibleEnvironment = this.mostEligibleEnvironment();
        while (index--)
            if (environments[index] === mostEligibleEnvironment)
                return YES;
        return NO;
    };
    CFBundle.prototype.hasSpritedImages.displayName = "CFBundle . prototype . hasSpritedImages";
    CFBundle.prototype.environments =     function()
    {
        return this._infoDictionary.valueForKey("CPBundleEnvironments") || ["ObjJ"];
    };
    CFBundle.prototype.environments.displayName = "CFBundle . prototype . environments";
    CFBundle.prototype.mostEligibleEnvironment =     function(environments)
    {
        environments = environments || this.environments();
        var objj_environments = CFBundle.environments(),
            index = 0,
            count = objj_environments.length,
            innerCount = environments.length;
        for (; index < count; ++index)
        {
            var innerIndex = 0,
                environment = objj_environments[index];
            for (; innerIndex < innerCount; ++innerIndex)
                if (environment === environments[innerIndex])
                    return environment;
        }
        return NULL;
    };
    CFBundle.prototype.mostEligibleEnvironment.displayName = "CFBundle . prototype . mostEligibleEnvironment";
    CFBundle.prototype.isLoading =     function()
    {
        return this._loadStatus & CFBundleLoading;
    };
    CFBundle.prototype.isLoading.displayName = "CFBundle . prototype . isLoading";
    CFBundle.prototype.isLoaded =     function()
    {
        return !!(this._loadStatus & CFBundleLoaded);
    };
    CFBundle.prototype.isLoaded.displayName = "CFBundle . prototype . isLoaded";
    CFBundle.prototype.load =     async function(shouldExecute)
    {
        if (this._loadStatus !== CFBundleUnloaded)
            return;
        var self = this;
        return new Promise(        function(resolve, reject)
        {
            var resolveAndRemoveListener =             function()
            {
                self.removeEventListener("load", resolveAndRemoveListener);
                self.removeEventListener("error", resolveAndRemoveListener);
                resolve();
            };
            self.addEventListener("load", resolveAndRemoveListener);
            self.addEventListener("error", resolveAndRemoveListener);
            self._loadStatus = CFBundleLoading | CFBundleLoadingInfoPlist;
            var bundleURL = self.bundleURL(),
                parentURL = new CFURL("..", bundleURL);
            if (parentURL.absoluteString() === bundleURL.absoluteString())
                parentURL = parentURL.schemeAndAuthority();
            StaticResource.resolveResourceAtURL(parentURL, YES,             function(aStaticResource)
            {
                var resourceName = bundleURL.lastPathComponent();
                self._staticResource = aStaticResource._children[resourceName] || new StaticResource(bundleURL, aStaticResource, YES, NO);
                function onsuccess(anEvent)
                {
                    self._loadStatus &= ~CFBundleLoadingInfoPlist;
                    var infoDictionary = anEvent.request.responsePropertyList();
                    self._isValid = !!infoDictionary || CFBundle.mainBundle() === self;
                    if (infoDictionary)
                    {
                        self._infoDictionary = infoDictionary;
                        var identifier = self._infoDictionary.valueForKey("CPBundleIdentifier");
                        if (identifier)
                            CFBundlesWithIdentifiers[identifier] = self;
                    }
                    if (!self._infoDictionary)
                    {
                        finishBundleLoadingWithError(self, new Error("Could not load bundle at \"" + self.bundleURL() + "\""));
                        return;
                    }
                    if (self === CFBundle.mainBundle() && self.valueForInfoDictionaryKey("CPApplicationSize"))
                        CPApplicationSizeInBytes = self.valueForInfoDictionaryKey("CPApplicationSize").valueForKey("executable") || 0;
                    loadLanguageForBundle(self);
                    loadExecutableAndResources(self, shouldExecute);
                }
                function onfailure()
                {
                    self._isValid = CFBundle.mainBundle() === self;
                    self._loadStatus = CFBundleUnloaded;
                    finishBundleLoadingWithError(self, new Error("Could not load bundle at \"" + self.bundleURL() + "\""));
                }
                new FileRequest(new CFURL("Info.plist", bundleURL), onsuccess, onfailure);
            });
        });
    };
    CFBundle.prototype.load.displayName = "CFBundle . prototype . load";
    function finishBundleLoadingWithError(aBundle, anError)
    {
        resolveStaticResource(aBundle._staticResource);
        aBundle._eventDispatcher.dispatchEvent({type: "error", error: anError, bundle: aBundle});
    }
    function loadExecutableAndResources(aBundle, shouldExecute)
    {
        if (!aBundle.mostEligibleEnvironment())
            return failure();
        loadExecutableForBundle(aBundle, success, failure, progress);
        loadSpritedImagesForBundle(aBundle, success, failure, progress);
        loadLocalizableStringsForBundle(aBundle, success, failure, progress);
        if (aBundle._loadStatus === CFBundleLoading)
            return success();
        function failure(anError)
        {
            var loadRequests = aBundle._loadRequests,
                count = loadRequests.length;
            while (count--)
                loadRequests[count].abort();
            this._loadRequests = [];
            aBundle._loadStatus = CFBundleUnloaded;
            finishBundleLoadingWithError(aBundle, anError || new Error("Could not recognize executable code format in Bundle " + aBundle));
        }
        function progress(bytesLoaded)
        {
            if ((typeof CPApp === "undefined" || !CPApp || !CPApp._finishedLaunching) && typeof OBJJ_PROGRESS_CALLBACK === "function")
            {
                CFTotalBytesLoaded += bytesLoaded;
                var percent = CPApplicationSizeInBytes ? MAX(MIN(1.0, CFTotalBytesLoaded / CPApplicationSizeInBytes), 0.0) : 0;
                OBJJ_PROGRESS_CALLBACK(percent, CPApplicationSizeInBytes, aBundle.bundlePath());
            }
        }
        function success()
        {
            if (aBundle._loadStatus === CFBundleLoading)
                aBundle._loadStatus = CFBundleLoaded;
            else
                return;
            resolveStaticResource(aBundle._staticResource);
            function complete()
            {
                aBundle._eventDispatcher.dispatchEvent({type: "load", bundle: aBundle});
            }
            if (shouldExecute)
                executeBundle(aBundle, complete);
            else
                complete();
        }
    }
    function loadExecutableForBundle(aBundle, success, failure, progress)
    {
        var executableURL = aBundle.executableURL();
        if (!executableURL)
            return;
        aBundle._loadStatus |= CFBundleLoadingExecutable;
        new FileRequest(executableURL,         function(anEvent)
        {
            try {
                decompileStaticFile(aBundle, anEvent.request.responseText(), executableURL);
                aBundle._loadStatus &= ~CFBundleLoadingExecutable;
                success();
            }
            catch(anException) {
                failure(anException);
            }
        }, failure, progress);
    }
    function spritedImagesTestURLStringForBundle(aBundle)
    {
        return "mhtml:" + new CFURL("MHTMLTest.txt", aBundle.mostEligibleEnvironmentURL());
    }
    function spritedImagesURLForBundle(aBundle)
    {
        if (CFBundleSupportedSpriteType === CFBundleDataURLSpriteType)
            return new CFURL("dataURLs.txt", aBundle.mostEligibleEnvironmentURL());
        if (CFBundleSupportedSpriteType === CFBundleMHTMLSpriteType || CFBundleSupportedSpriteType === CFBundleMHTMLUncachedSpriteType)
            return new CFURL("MHTMLPaths.txt", aBundle.mostEligibleEnvironmentURL());
        return NULL;
    }
    function loadSpritedImagesForBundle(aBundle, success, failure, progress)
    {
        if (!aBundle.hasSpritedImages())
            return;
        aBundle._loadStatus |= CFBundleLoadingSpritedImages;
        if (!CFBundleHasTestedSpriteSupport())
            return CFBundleTestSpriteSupport(spritedImagesTestURLStringForBundle(aBundle),             function()
            {
                loadSpritedImagesForBundle(aBundle, success, failure, progress);
            });
        var spritedImagesURL = spritedImagesURLForBundle(aBundle);
        if (!spritedImagesURL)
        {
            aBundle._loadStatus &= ~CFBundleLoadingSpritedImages;
            return success();
        }
        new FileRequest(spritedImagesURL,         function(anEvent)
        {
            try {
                decompileStaticFile(aBundle, anEvent.request.responseText(), spritedImagesURL);
                aBundle._loadStatus &= ~CFBundleLoadingSpritedImages;
                success();
            }
            catch(anException) {
                failure(anException);
            }
        }, failure, progress);
    }
    function loadLocalizableStringsForBundle(aBundle, success, failure, progress)
    {
        var language = aBundle._loadedLanguage;
        if (!language)
            return;
        var localizableStrings = aBundle.valueForInfoDictionaryKey("CPBundleLocalizableStrings");
        if (!localizableStrings)
            return;
        var self = aBundle,
            length = localizableStrings.length,
            languagePathURL = new CFURL(language + ".lproj/", self.resourcesDirectoryURL()),
            fileSuccessed = 0;
        for (var i = 0; i < length; i++)
        {
            var localizableString = localizableStrings[i];
            function onsuccess(anEvent)
            {
                var contentFile = anEvent.request.responseText(),
                    tableName = new CFURL(anEvent.request._URL).lastPathComponent();
                try {
                    loadLocalizableContentForFileInBundle(self, contentFile, tableName);
                    if (++fileSuccessed == length)
                    {
                        aBundle._loadStatus &= ~CFBundleLoadingLocalizableStrings;
                        success();
                    }
                }
                catch(e) {
                    failure(new Error("Error when parsing the localizable file " + tableName));
                }
            }
            aBundle._loadStatus |= CFBundleLoadingLocalizableStrings;
            new FileRequest(new CFURL(localizableString, languagePathURL), onsuccess, failure, progress);
        }
    }
    function loadLocalizableContentForFileInBundle(bundle, contentFile, tableName)
    {
        var values = {},
            lines = contentFile.split("\n"),
            currentContext;
        bundle._localizableStrings[tableName] = values;
        for (var i = 0; i < lines.length; i++)
        {
            var line = lines[i];
            if (line[0] == "/")
            {
                currentContext = line.substring(2, line.length - 2).trim();
                continue;
            }
            if (line[0] == "\"")
            {
                var split = line.split("\"");
                var key = split[1];
                if (!(key in values))
                    values[key] = split[3];
                key += currentContext;
                if (!(key in values))
                    values[key] = split[3];
                continue;
            }
        }
    }
    function loadLanguageForBundle(aBundle)
    {
        if (aBundle._loadedLanguage)
            return;
        var defaultLanguage = aBundle.valueForInfoDictionaryKey(CPBundleDefaultLanguage);
        if (defaultLanguage != CPBundleDefaultBrowserLanguage && defaultLanguage)
        {
            aBundle._loadedLanguage = defaultLanguage;
            return;
        }
        if (typeof navigator == "undefined")
            return;
        var language = typeof navigator.language !== "undefined" ? navigator.language : navigator.userLanguage;
        if (!language)
            return;
        aBundle._loadedLanguage = language.substring(0, 2);
    }
    var CFBundleSpriteSupportListeners = [],
        CFBundleSupportedSpriteType = -1,
        CFBundleNoSpriteType = 0,
        CFBundleDataURLSpriteType = 1,
        CFBundleMHTMLSpriteType = 2,
        CFBundleMHTMLUncachedSpriteType = 3;
    function CFBundleHasTestedSpriteSupport()
    {
        return CFBundleSupportedSpriteType !== -1;
    }
    function CFBundleTestSpriteSupport(MHTMLPath, aCallback)
    {
        if (CFBundleHasTestedSpriteSupport())
            return;
        CFBundleSpriteSupportListeners.push(aCallback);
        if (CFBundleSpriteSupportListeners.length > 1)
            return;
        CFBundleSpriteSupportListeners.push(        function()
        {
            var size = 0,
                sizeDictionary = CFBundle.mainBundle().valueForInfoDictionaryKey("CPApplicationSize");
            if (!sizeDictionary)
                return;
            switch(CFBundleSupportedSpriteType) {
                case CFBundleDataURLSpriteType:
                    size = sizeDictionary.valueForKey("data");
                    break;
                case CFBundleMHTMLSpriteType:
                case CFBundleMHTMLUncachedSpriteType:
                    size = sizeDictionary.valueForKey("mhtml");
                    break;
            }
            CPApplicationSizeInBytes += size;
        });
        CFBundleTestSpriteTypes([CFBundleDataURLSpriteType, "data:image/gif;base64,R0lGODlhAQABAIAAAMc9BQAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==", CFBundleMHTMLSpriteType, MHTMLPath + "!test", CFBundleMHTMLUncachedSpriteType, MHTMLPath + "?" + CFCacheBuster + "!test"]);
    }
    function CFBundleNotifySpriteSupportListeners()
    {
        var count = CFBundleSpriteSupportListeners.length;
        while (count--)
            CFBundleSpriteSupportListeners[count]();
    }
    function CFBundleTestSpriteTypes(spriteTypes)
    {
        if (!("Image" in global) || spriteTypes.length < 2)
        {
            CFBundleSupportedSpriteType = CFBundleNoSpriteType;
            CFBundleNotifySpriteSupportListeners();
            return;
        }
        var image = new Image();
        image.onload =         function()
        {
            if (image.width === 1 && image.height === 1)
            {
                CFBundleSupportedSpriteType = spriteTypes[0];
                CFBundleNotifySpriteSupportListeners();
            }
            else
                image.onerror();
        };
        image.onerror =         function()
        {
            CFBundleTestSpriteTypes(spriteTypes.slice(2));
        };
        image.src = spriteTypes[1];
    }
    function executeBundle(aBundle, aCallback)
    {
        var staticResources = [aBundle._staticResource];
        function executeStaticResources(index)
        {
            for (; index < staticResources.length; ++index)
            {
                var staticResource = staticResources[index];
                if (staticResource.isNotFound())
                    continue;
                if (staticResource.isFile())
                {
                    var executable = new FileExecutable(staticResource.URL());
                    if (executable.hasLoadedFileDependencies())
                        executable.execute();
                    else
                    {
                        executable.loadFileDependencies(                        function()
                        {
                            executeStaticResources(index);
                        });
                        return;
                    }
                }
                else
                {
                    if (staticResource.URL().absoluteString() === aBundle.resourcesDirectoryURL().absoluteString())
                        continue;
                    var children = staticResource.children();
                    for (var name in children)
                        if (hasOwnProperty.call(children, name))
                            staticResources.push(children[name]);
                }
            }
            aCallback();
        }
        executeStaticResources(0);
    }
    var STATIC_MAGIC_NUMBER = "@STATIC",
        MARKER_PATH = "p",
        MARKER_URI = "u",
        MARKER_CODE = "c",
        MARKER_TEXT = "t",
        MARKER_IMPORT_STD = 'I',
        MARKER_IMPORT_LOCAL = 'i';
    MARKER_SOURCE_MAP = 'S';
    function decompileStaticFile(aBundle, aString, aPath)
    {
        var stream = new MarkedStream(aString);
        if (stream.magicNumber() !== STATIC_MAGIC_NUMBER)
            throw new Error("Could not read static file: " + aPath);
        if (stream.version() !== "1.0")
            throw new Error("Could not read static file: " + aPath);
        var marker,
            bundleURL = aBundle.bundleURL(),
            file = NULL;
        while (marker = stream.getMarker())
        {
            var text = stream.getString();
            if (marker === MARKER_PATH)
            {
                var fileURL = new CFURL(text, bundleURL),
                    parent = StaticResource.resourceAtURL(new CFURL(".", fileURL), YES);
                file = new StaticResource(fileURL, parent, NO, YES);
            }
            else if (marker === MARKER_URI)
            {
                var URL = new CFURL(text, bundleURL),
                    mappedURLString = stream.getString();
                if (mappedURLString.indexOf("mhtml:") === 0)
                {
                    mappedURLString = "mhtml:" + new CFURL(mappedURLString.substr("mhtml:".length), bundleURL);
                    if (CFBundleSupportedSpriteType === CFBundleMHTMLUncachedSpriteType)
                    {
                        var exclamationIndex = mappedURLString.indexOf("!"),
                            firstPart = mappedURLString.substring(0, exclamationIndex),
                            lastPart = mappedURLString.substring(exclamationIndex);
                        mappedURLString = firstPart + "?" + CFCacheBuster + lastPart;
                    }
                }
                CFURL.setMappedURLForURL(URL, new CFURL(mappedURLString));
                var parent = StaticResource.resourceAtURL(new CFURL(".", URL), YES);
                new StaticResource(URL, parent, NO, YES);
            }
            else if (marker === MARKER_TEXT)
            {
                file.write(text);
                if (text.match(/^@STATIC;/))
                    file.decompile();
            }
        }
    }
    CFBundle.prototype.addEventListener =     function(anEventName, anEventListener)
    {
        this._eventDispatcher.addEventListener(anEventName, anEventListener);
    };
    CFBundle.prototype.addEventListener.displayName = "CFBundle . prototype . addEventListener";
    CFBundle.prototype.removeEventListener =     function(anEventName, anEventListener)
    {
        this._eventDispatcher.removeEventListener(anEventName, anEventListener);
    };
    CFBundle.prototype.removeEventListener.displayName = "CFBundle . prototype . removeEventListener";
    CFBundle.prototype.onerror =     function(anEvent)
    {
        throw anEvent.error;
    };
    CFBundle.prototype.onerror.displayName = "CFBundle . prototype . onerror";
    CFBundle.prototype.bundlePath =     function()
    {
        return this.bundleURL().path();
    };
    CFBundle.prototype.path =     function()
    {
        CPLog.warn("CFBundle.prototype.path is deprecated, use CFBundle.prototype.bundlePath instead.");
        return this.bundlePath.apply(this, arguments);
    };
    CFBundle.prototype.pathForResource =     function(aResource, aType, aSubDirectory, localizationName)
    {
        return this.resourceURL(aResource, aType, aSubDirectory, localizationName).absoluteString();
    };
    CFBundleCopyLocalizedString =     function(bundle, key, value, tableName)
    {
        return CFCopyLocalizedStringWithDefaultValue(key, tableName, bundle, value, "");
    };
    CFBundleCopyBundleLocalizations =     function(aBundle)
    {
        return [this._loadedLanguage];
    };
    CFCopyLocalizedString =     function(key, comment)
    {
        return CFCopyLocalizedStringFromTable(key, "Localizable", comment);
    };
    CFCopyLocalizedStringFromTable =     function(key, tableName, comment)
    {
        return CFCopyLocalizedStringFromTableInBundle(key, tableName, CFBundleGetMainBundle(), comment);
    };
    CFCopyLocalizedStringFromTableInBundle =     function(key, tableName, bundle, comment)
    {
        return CFCopyLocalizedStringWithDefaultValue(key, tableName, bundle, null, comment);
    };
    CFCopyLocalizedStringWithDefaultValue =     function(key, tableName, bundle, value, comment)
    {
        var string;
        if (!tableName)
            tableName = "Localizable";
        tableName += ".strings";
        var localizableString = bundle._localizableStrings[tableName];
        string = localizableString ? localizableString[key + comment] : null;
        return string || (value || key);
    };
    CFBundleGetMainBundle =     function()
    {
        return CFBundle.mainBundle();
    };
    var rootResources = {};
    var currentCompilerFlags = {};
    var currentGccCompilerFlags = "";
    function StaticResource(aURL, aParent, isDirectory, isResolved, aFilenameTranslateDictionary)
    {
        this._parent = aParent;
        this._eventDispatcher = new EventDispatcher(this);
        var name = aURL.absoluteURL().lastPathComponent() || aURL.schemeAndAuthority();
        this._name = name;
        this._URL = aURL;
        this._isResolved = !!isResolved;
        this._filenameTranslateDictionary = aFilenameTranslateDictionary;
        if (isDirectory)
            this._URL = this._URL.asDirectoryPathURL();
        if (!aParent)
            rootResources[name] = this;
        this._isDirectory = !!isDirectory;
        this._isNotFound = NO;
        if (aParent)
            aParent._children[name] = this;
        if (isDirectory)
            this._children = {};
        else
            this._contents = "";
    }
    StaticResource.rootResources =     function()
    {
        return rootResources;
    };
    StaticResource.resetRootResources =     function()
    {
        rootResources = {};
        FunctionCache = {};
    };
    StaticResource.prototype.filenameTranslateDictionary =     function()
    {
        return this._filenameTranslateDictionary || {};
    };
    exports.StaticResource = StaticResource;
    function resolveStaticResource(aResource)
    {
        aResource._isResolved = YES;
        aResource._eventDispatcher.dispatchEvent({type: "resolve", staticResource: aResource});
    }
    StaticResource.prototype.resolve =     function(dontCompile, compileIncludeFileArray)
    {
        if (this.isDirectory())
        {
            var bundle = new CFBundle(this.URL());
            bundle.onerror =             function()
            {
            };
            bundle.load(NO);
        }
        else
        {
            var self = this;
            function onsuccess(anEvent)
            {
                var fileContents = anEvent.request.responseText(),
                    aURL = self.URL(),
                    extension = aURL.pathExtension().toLowerCase();
                self._contents = fileContents;
                if (fileContents.match(/^@STATIC;/))
                {
                    self.decompile();
                    resolveStaticResource(self);
                }
                else if (!dontCompile && (extension === "j" || !extension) && !fileContents.match(/^{/))
                {
                    var compilerOptions = Object.assign({}, currentCompilerFlags || {}),
                        acornOptions = compilerOptions.acornOptions;
                    if (acornOptions)
                        compilerOptions.acornOptions = Object.assign({}, acornOptions);
                    if (!compilerOptions.includeFiles)
                        compilerOptions.includeFiles = compileIncludeFileArray;
                    self.cachedIncludeFileSearchResultsContent = {};
                    self.cachedIncludeFileSearchResultsURL = {};
                    compile(self, fileContents, aURL, compilerOptions, aFilenameTranslateDictionary,                     function(aResource)
                    {
                        resolveStaticResource(aResource);
                    });
                }
                else
                {
                    resolveStaticResource(self);
                }
            }
            function onfailure()
            {
                self._isNotFound = YES;
                resolveStaticResource(self);
            }
            var url = this.URL(),
                aFilenameTranslateDictionary = this.filenameTranslateDictionary();
            if (aFilenameTranslateDictionary)
            {
                var urlString = url.toString(),
                    lastPathComponent = url.lastPathComponent(),
                    basePath = urlString.substring(0, urlString.length - lastPathComponent.length),
                    translatedName = aFilenameTranslateDictionary[lastPathComponent];
                if (translatedName && urlString.slice(-translatedName.length) !== translatedName)
                    url = new CFURL(basePath + translatedName);
            }
            new FileRequest(url, onsuccess, onfailure);
        }
    };
    var compile =     function(self, fileContents, aURL, compilerOptions, aFilenameTranslateDictionary, success)
    {
        var acornOptions = compilerOptions.acornOptions || (compilerOptions.acornOptions = {});
        acornOptions.preprocessGetIncludeFile =         function(filePath, isQuoted)
        {
            var referenceURL = new CFURL(".", aURL),
                includeURL = new CFURL(filePath);
            var cacheUID = (isQuoted && referenceURL || "") + includeURL,
                cachedResult = self.cachedIncludeFileSearchResultsContent[cacheUID];
            if (!cachedResult)
            {
                var isAbsoluteURL = includeURL instanceof CFURL && includeURL.scheme(),
                    compileWhenCompleted = NO;
                function completed(aStaticResource)
                {
                    var includeString = aStaticResource && aStaticResource.contents(),
                        lastCharacter = includeString && includeString.charCodeAt(includeString.length - 1);
                    if (includeString == null)
                        throw new Error("Can't load file " + includeURL);
                    if (lastCharacter !== 10 && lastCharacter !== 13 && lastCharacter !== 8232 && lastCharacter !== 8233)
                    {
                        includeString += '\n';
                    }
                    self.cachedIncludeFileSearchResultsContent[cacheUID] = includeString;
                    self.cachedIncludeFileSearchResultsURL[cacheUID] = aStaticResource.URL();
                    if (compileWhenCompleted)
                        compile(self, fileContents, aURL, compilerOptions, aFilenameTranslateDictionary, success);
                }
                if (isQuoted || isAbsoluteURL)
                {
                    var translateDictionary;
                    if (!isAbsoluteURL)
                    {
                        includeURL = new CFURL(includeURL, new CFURL(aFilenameTranslateDictionary && aFilenameTranslateDictionary[aURL.lastPathComponent()] || ".", referenceURL));
                    }
                    StaticResource.resolveResourceAtURL(includeURL, NO, completed, null, true);
                }
                else
                    StaticResource.resolveResourceAtURLSearchingIncludeURLs(includeURL, completed);
                cachedResult = self.cachedIncludeFileSearchResultsContent[cacheUID];
            }
            if (cachedResult)
            {
                return {include: cachedResult, sourceFile: self.cachedIncludeFileSearchResultsURL[cacheUID].absoluteString()};
            }
            else
            {
                compileWhenCompleted = YES;
                return null;
            }
        };
        var includeFiles = compilerOptions && compilerOptions.includeFiles,
            allPreIncludesResolved = true;
        acornOptions.preIncludeFiles = [];
        if (includeFiles)
            for (var i = 0, size = includeFiles.length; i < size; i++)
            {
                var includeFileUrl = makeAbsoluteURL(includeFiles[i]);
                try {
                    var aResource = StaticResource.resourceAtURL(makeAbsoluteURL(includeFileUrl));
                }
                catch(e) {
                    StaticResource.resolveResourcesAtURLs(includeFiles.map(                    function(u)
                    {
                        return makeAbsoluteURL(u);
                    }),                     function()
                    {
                        compile(self, fileContents, aURL, compilerOptions, aFilenameTranslateDictionary, success);
                    });
                    return;
                }
                if (aResource)
                {
                    if (aResource.isNotFound())
                    {
                        throw new Error("--include file not found " + includeUrl);
                    }
                    var includeString = aResource.contents();
                    var lastCharacter = includeString.charCodeAt(includeString.length - 1);
                    if (lastCharacter !== 10 && lastCharacter !== 13 && lastCharacter !== 8232 && lastCharacter !== 8233)
                        includeString += '\n';
                    acornOptions.preIncludeFiles.push({include: includeString, sourceFile: includeFileUrl.toString()});
                }
            }
        var compiler = (exports.ObjJCompiler || ObjJCompiler).compileFileDependencies(fileContents, aURL, compilerOptions);
        var warningsAndErrors = compiler.warningsAndErrors;
        if (warningsAndErrors && warningsAndErrors.length === 1 && warningsAndErrors[0].message.indexOf("file not found") > -1)
            return;
        if (Executable.printWarningsAndErrors(compiler, exports.messageOutputFormatInXML))
        {
            throw "Compilation error";
        }
        var fileDependencies = compiler.dependencies.map(        function(aFileDep)
        {
            return new FileDependency(new CFURL(aFileDep.url), aFileDep.isLocal);
        });
        self._fileDependencies = fileDependencies;
        self._compiler = compiler;
        success(self);
    };
    StaticResource.prototype.decompile =     function()
    {
        var content = this.contents(),
            aURL = this.URL(),
            stream = new MarkedStream(content);
        var marker = NULL,
            code = "",
            dependencies = [],
            sourceMap;
        while (marker = stream.getMarker())
        {
            var text = stream.getString();
            if (marker === MARKER_TEXT)
                code += text;
            else if (marker === MARKER_IMPORT_STD)
                dependencies.push(new FileDependency(new CFURL(text), NO));
            else if (marker === MARKER_IMPORT_LOCAL)
                dependencies.push(new FileDependency(new CFURL(text), YES));
            else if (marker === MARKER_SOURCE_MAP)
                sourceMap = text;
        }
        this._fileDependencies = dependencies;
        this._function = StaticResource._lookupCachedFunction(aURL);
        this._sourceMap = sourceMap;
        this._contents = code;
    };
    StaticResource.setCurrentGccCompilerFlags =     function(compilerFlags)
    {
        if (currentGccCompilerFlags === compilerFlags)
            return;
        currentGccCompilerFlags = compilerFlags;
        var objjcFlags = (exports.ObjJCompiler || ObjJCompiler).parseGccCompilerFlags(compilerFlags);
        StaticResource.setCurrentCompilerFlags(objjcFlags);
    };
    StaticResource.currentGccCompilerFlags =     function(compilerFlags)
    {
        return currentGccCompilerFlags;
    };
    StaticResource.setCurrentCompilerFlags =     function(compilerFlags)
    {
        currentCompilerFlags = compilerFlags;
        if (currentCompilerFlags.transformNamedFunctionDeclarationToAssignment == null)
            currentCompilerFlags.transformNamedFunctionDeclarationToAssignment = true;
        if (currentCompilerFlags.sourceMap == null)
            currentCompilerFlags.sourceMap = false;
        if (currentCompilerFlags.inlineMsgSendFunctions == null)
            currentCompilerFlags.inlineMsgSendFunctions = false;
        var acornOptions = currentCompilerFlags.acornOptions || (currentCompilerFlags.acornOptions = {});
        if (acornOptions.ecmaVersion == null)
            acornOptions.ecmaVersion = 2022;
    };
    StaticResource.currentCompilerFlags =     function(compilerFlags)
    {
        return currentCompilerFlags;
    };
    var FunctionCache = {};
    StaticResource._cacheFunction =     function(aURL, fn)
    {
        aURL = typeof aURL === "string" ? aURL : aURL.absoluteString();
        FunctionCache[aURL] = fn;
    };
    StaticResource._lookupCachedFunction =     function(aURL)
    {
        aURL = typeof aURL === "string" ? aURL : aURL.absoluteString();
        return FunctionCache[aURL];
    };
    StaticResource.prototype.name =     function()
    {
        return this._name;
    };
    StaticResource.prototype.URL =     function()
    {
        return this._URL;
    };
    StaticResource.prototype.contents =     function()
    {
        return this._contents;
    };
    StaticResource.prototype.children =     function()
    {
        return this._children;
    };
    StaticResource.prototype.parent =     function()
    {
        return this._parent;
    };
    StaticResource.prototype.isResolved =     function()
    {
        return this._isResolved;
    };
    StaticResource.prototype.write =     function(aString)
    {
        this._contents += aString;
    };
    function rootResourceForAbsoluteURL(anAbsoluteURL)
    {
        var schemeAndAuthority = anAbsoluteURL.schemeAndAuthority(),
            resource = rootResources[schemeAndAuthority];
        if (!resource)
            resource = new StaticResource(new CFURL(schemeAndAuthority), NULL, YES, YES);
        return resource;
    }
    StaticResource.resourceAtURL =     function(aURL, resolveAsDirectoriesIfNecessary)
    {
        aURL = makeAbsoluteURL(aURL).absoluteURL();
        var resource = rootResourceForAbsoluteURL(aURL),
            components = aURL.pathComponents(),
            index = 0,
            count = components.length;
        for (; index < count; ++index)
        {
            var name = components[index];
            if (hasOwnProperty.call(resource._children, name))
                resource = resource._children[name];
            else if (resolveAsDirectoriesIfNecessary)
            {
                if (name !== "/")
                    name = "./" + name;
                resource = new StaticResource(new CFURL(name, resource.URL()), resource, YES, YES);
            }
            else
                throw new Error("Static Resource at " + aURL + " is not resolved (\"" + name + "\")");
        }
        return resource;
    };
    StaticResource.prototype.resourceAtURL =     function(aURL, resolveAsDirectoriesIfNecessary)
    {
        return StaticResource.resourceAtURL(new CFURL(aURL, this.URL()), resolveAsDirectoriesIfNecessary);
    };
    StaticResource.resolveResourcesAtURLs =     function(URLs, aCallback)
    {
        var count = URLs.length,
            allResources = {};
        for (var i = 0, size = count; i < size; i++)
        {
            var url = URLs[i];
            StaticResource.resolveResourceAtURL(url, NO,             function(aResource)
            {
                allResources[url] = aResource;
                if (--count === 0)
                    aCallback(allResources);
            });
        }
    };
    StaticResource.resolveResourceAtURL =     function(aURL, isDirectory, aCallback, aFilenameTranslateDictionary, dontCompile)
    {
        aURL = makeAbsoluteURL(aURL).absoluteURL();
        resolveResourceComponents(rootResourceForAbsoluteURL(aURL), isDirectory, aURL.pathComponents(), 0, aCallback, aFilenameTranslateDictionary, null, dontCompile);
    };
    StaticResource.prototype.resolveResourceAtURL =     function(aURL, isDirectory, aCallback)
    {
        StaticResource.resolveResourceAtURL(new CFURL(aURL, this.URL()).absoluteURL(), isDirectory, aCallback);
    };
    function resolveResourceComponents(aResource, isDirectory, components, index, aCallback, aFilenameTranslateDictionary, compileIncludeFileArray, dontCompile)
    {
        var count = components.length;
        for (; index < count; ++index)
        {
            var name = components[index],
                child = hasOwnProperty.call(aResource._children, name) && aResource._children[name];
            if (!child)
            {
                var translationDictionary = nil;
                if (aFilenameTranslateDictionary == null)
                {
                    var bundle = new CFBundle(aResource.URL());
                    if (bundle != null)
                    {
                        var bundleTranslationDictionary = bundle.valueForInfoDictionaryKey("CPFileTranslationDictionary");
                        if (bundleTranslationDictionary != null)
                        {
                            translationDictionary = bundleTranslationDictionary.toJSObject();
                        }
                        var bundleIncludeFileArray = bundle.valueForInfoDictionaryKey("CPCompileIncludeFileArray");
                        if (bundleIncludeFileArray != null)
                        {
                            compileIncludeFileArray = bundleIncludeFileArray.map(                            function(includeFilePath)
                            {
                                return new CFURL(includeFilePath, aResource.URL());
                            });
                        }
                    }
                }
                var u = new CFURL(name, aResource.URL());
                child = new StaticResource(u, aResource, index + 1 < count || isDirectory, NO, translationDictionary || aFilenameTranslateDictionary);
                child.resolve(dontCompile, compileIncludeFileArray);
            }
            if (!child.isResolved())
                return child.addEventListener("resolve",                 function()
                {
                    resolveResourceComponents(aResource, isDirectory, components, index, aCallback, aFilenameTranslateDictionary, compileIncludeFileArray, dontCompile);
                });
            if (child.isNotFound())
                return aCallback(null, new Error("File not found: " + components.join("/")));
            if (index + 1 < count && child.isFile())
                return aCallback(null, new Error("File is not a directory: " + components.join("/")));
            aResource = child;
        }
        aCallback(aResource);
    }
    function resolveResourceAtURLSearchingIncludeURLs(aURL, anIndex, aCallback)
    {
        var includeURLs = StaticResource.includeURLs(),
            searchURL = new CFURL(aURL, includeURLs[anIndex]).absoluteURL();
        StaticResource.resolveResourceAtURL(searchURL, NO,         function(aStaticResource)
        {
            if (!aStaticResource)
            {
                if (anIndex + 1 < includeURLs.length)
                    resolveResourceAtURLSearchingIncludeURLs(aURL, anIndex + 1, aCallback);
                else
                    aCallback(NULL);
                return;
            }
            aCallback(aStaticResource);
        });
    }
    StaticResource.resolveResourceAtURLSearchingIncludeURLs =     function(aURL, aCallback)
    {
        resolveResourceAtURLSearchingIncludeURLs(aURL, 0, aCallback);
    };
    StaticResource.prototype.addEventListener =     function(anEventName, anEventListener)
    {
        this._eventDispatcher.addEventListener(anEventName, anEventListener);
    };
    StaticResource.prototype.removeEventListener =     function(anEventName, anEventListener)
    {
        this._eventDispatcher.removeEventListener(anEventName, anEventListener);
    };
    StaticResource.prototype.isNotFound =     function()
    {
        return this._isNotFound;
    };
    StaticResource.prototype.isFile =     function()
    {
        return !this._isDirectory;
    };
    StaticResource.prototype.isDirectory =     function()
    {
        return this._isDirectory;
    };
    StaticResource.prototype.toString =     function(includeNotFounds)
    {
        if (this.isNotFound())
            return "<file not found: " + this.name() + ">";
        var string = this.name();
        if (this.isDirectory())
        {
            var children = this._children;
            for (var name in children)
                if (children.hasOwnProperty(name))
                {
                    var child = children[name];
                    if (includeNotFounds || !child.isNotFound())
                        string += "\n\t" + children[name].toString(includeNotFounds).split('\n').join("\n\t");
                }
        }
        return string;
    };
    var includeURLs = NULL;
    StaticResource.includeURLs =     function()
    {
        if (includeURLs !== NULL)
            return includeURLs;
        includeURLs = [];
        if (!global.OBJJ_INCLUDE_PATHS && !global.OBJJ_INCLUDE_URLS)
            includeURLs = ["Frameworks", "Frameworks/Debug"];
        else
            includeURLs = (global.OBJJ_INCLUDE_PATHS || []).concat(global.OBJJ_INCLUDE_URLS || []);
        var count = includeURLs.length;
        while (count--)
            includeURLs[count] = new CFURL(includeURLs[count]).asDirectoryPathURL();
        return includeURLs;
    };
    StaticResource.setCurrentCompilerFlags({});
    function FileDependency(aURL, isLocal)
    {
        this._URL = aURL;
        this._isLocal = isLocal;
    }
    exports.FileDependency = FileDependency;
    FileDependency.prototype.URL =     function()
    {
        return this._URL;
    };
    FileDependency.prototype.isLocal =     function()
    {
        return this._isLocal;
    };
    FileDependency.prototype.toMarkedString =     function()
    {
        var URLString = this.URL().absoluteString();
        return (this.isLocal() ? MARKER_IMPORT_LOCAL : MARKER_IMPORT_STD) + ";" + URLString.length + ";" + URLString;
    };
    FileDependency.prototype.toString =     function()
    {
        return (this.isLocal() ? "LOCAL: " : "STD: ") + this.URL();
    };
    var ExecutableUnloadedFileDependencies = 0,
        ExecutableLoadingFileDependencies = 1,
        ExecutableLoadedFileDependencies = 2,
        AnonymousExecutableCount = 0;
    function Executable(aCode, fileDependencies, aURL, aFunction, aCompiler, aFilenameTranslateDictionary, sourceMap)
    {
        if (arguments.length === 0)
            return this;
        this._code = aCode;
        this._function = aFunction || null;
        this._URL = makeAbsoluteURL(aURL || new CFURL("(Anonymous" + AnonymousExecutableCount++ + ")"));
        this._compiler = aCompiler || null;
        this._fileDependencies = fileDependencies;
        this._filenameTranslateDictionary = aFilenameTranslateDictionary;
        if (sourceMap)
            this._base64EncodedSourceMap = sourceMap;
        if (fileDependencies.length)
        {
            this._fileDependencyStatus = ExecutableUnloadedFileDependencies;
            this._fileDependencyCallbacks = [];
        }
        else
        {
            this._fileDependencyStatus = ExecutableLoadedFileDependencies;
        }
        if (this._function)
            return;
        if (!aCompiler)
            this.setCode(aCode);
    }
    exports.Executable = Executable;
    Executable.prototype.path =     function()
    {
        return this.URL().path();
    };
    Executable.prototype.URL =     function()
    {
        return this._URL;
    };
    Executable.prototype.URL.displayName = "Executable . prototype . URL";
    Executable.prototype.functionParameters =     function()
    {
        var functionParameters = ["global", "objj_executeFile", "objj_importFile"];
        functionParameters = functionParameters.concat("require", "exports", "module", "system", "print", "window");
        return functionParameters;
    };
    Executable.prototype.functionParameters.displayName = "Executable . prototype . functionParameters";
    Executable.prototype.functionArguments =     function()
    {
        var functionArguments = [global, this.fileExecuter(), this.fileImporter()];
        functionArguments = functionArguments.concat(Executable.commonJSArguments());
        return functionArguments;
    };
    Executable.prototype.functionArguments.displayName = "Executable . prototype . functionArguments";
    Executable.setCommonJSParameters =     function()
    {
        this._commonJSParameters = Array.prototype.slice.call(arguments);
    };
    Executable.commonJSParameters =     function()
    {
        return this._commonJSParameters || [];
    };
    Executable.setCommonJSArguments =     function()
    {
        this._commonJSArguments = Array.prototype.slice.call(arguments);
    };
    Executable.commonJSArguments =     function()
    {
        return this._commonJSArguments || [];
    };
    Executable.setFilenameTranslateDictionary =     function(dict)
    {
        this._filenameTranslateDictionary = dict;
    };
    Executable.filenameTranslateDictionary =     function()
    {
        return this._filenameTranslateDictionary || {};
    };
    Executable.prototype.toMarkedString =     function()
    {
        var markedString = "@STATIC;1.0;",
            dependencies = this.fileDependencies(),
            index = 0,
            count = dependencies.length;
        for (; index < count; ++index)
            markedString += dependencies[index].toMarkedString();
        var sourceMap = this._base64EncodedSourceMap;
        if (sourceMap)
        {
            markedString += MARKER_SOURCE_MAP + ";" + sourceMap.length + ";" + sourceMap;
        }
        var code = this.code();
        return markedString + MARKER_TEXT + ";" + code.length + ";" + code;
    };
    Executable.prototype.execute =     function()
    {
        if (this._compiler)
        {
            var fileDependencies = this.fileDependencies(),
                index = 0,
                count = fileDependencies.length;
            this._compiler.pushImport(this.URL().lastPathComponent());
            for (; index < count; ++index)
            {
                var fileDependency = fileDependencies[index],
                    isQuoted = fileDependency.isLocal(),
                    URL = fileDependency.URL();
                this.fileExecuter()(URL, isQuoted);
            }
            this._compiler.popImport();
            this.setCode(this._compiler.compilePass2(), this._compiler.map());
            if (Executable.printWarningsAndErrors(this._compiler, exports.messageOutputFormatInXML))
                throw "Compilation error";
            this._compiler = null;
        }
        var oldContextBundle = CONTEXT_BUNDLE;
        CONTEXT_BUNDLE = CFBundle.bundleContainingURL(this.URL());
        var result = this._function.apply(global, this.functionArguments());
        CONTEXT_BUNDLE = oldContextBundle;
        return result;
    };
    Executable.prototype.execute.displayName = "Executable . prototype . execute";
    Executable.prototype.code =     function()
    {
        return this._code;
    };
    Executable.prototype.code.displayName = "Executable . prototype . code";
    Executable.prototype.setCode =     function(code, sourceMap)
    {
        this._code = code;
        if (code == null)
            return;
        var parameters = this.functionParameters().join(",");
        var sourceMapBase64;
        if (typeof system !== "undefined" && system.engine === "rhino")
        {
            code = "function(" + parameters + "){" + code + "/**/\n}";
            this._function = Packages.org.mozilla.javascript.Context.getCurrentContext().compileFunction(window, code, this.URL().absoluteString(), 0, NULL);
        }
        else
        {
            sourceMapBase64 = this._base64EncodedSourceMap;
            var absoluteString = this.URL().absoluteString();
            var filepath = absoluteString.startsWith("file:") ? absoluteString.slice(5) : absoluteString;
            code += "/**/\n//# sourceURL=" + encodeURI(filepath) + "s";
            if (sourceMap)
            {
                if (typeof btoa === 'function')
                    sourceMapBase64 = btoa(UTF16ToUTF8(sourceMap));
                else if (typeof Buffer === 'function')
                    sourceMapBase64 = new Buffer(sourceMap).toString("base64");
            }
            if (sourceMapBase64)
            {
                code = code.substring((exports.ObjJCompiler || ObjJCompiler).numberOfLinesAtTopOfFunction());
                this._base64EncodedSourceMap = sourceMapBase64;
                code += "\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," + sourceMapBase64;
            }
            this._function = new Function(parameters, "const __filename='" + filepath + "';" + code);
            this._function.displayName = this.URL().lastPathComponent();
        }
    };
    Executable.prototype.setCode.displayName = "Executable . prototype . setCode";
    Executable.prototype.fileDependencies =     function()
    {
        return this._fileDependencies;
    };
    Executable.prototype.fileDependencies.displayName = "Executable . prototype . fileDependencies";
    Executable.prototype.setFileDependencies =     function(newValue)
    {
        this._fileDependencies = newValue;
    };
    Executable.prototype.setFileDependencies.displayName = "Executable . prototype . setFileDependencies";
    Executable.prototype.hasLoadedFileDependencies =     function()
    {
        return this._fileDependencyStatus === ExecutableLoadedFileDependencies;
    };
    Executable.prototype.hasLoadedFileDependencies.displayName = "Executable . prototype . hasLoadedFileDependencies";
    var fileDependencyLoadCount = 0,
        fileDependencyExecutables = [],
        fileDependencyMarkers = {};
    Executable.prototype.loadFileDependencies =     function(aCallback)
    {
        var status = this._fileDependencyStatus;
        if (aCallback)
        {
            if (status === ExecutableLoadedFileDependencies)
                return aCallback();
            this._fileDependencyCallbacks.push(aCallback);
        }
        if (status === ExecutableUnloadedFileDependencies)
        {
            if (fileDependencyLoadCount)
            {
                throw "Can't load: " + this.URL().absoluteURL();
            }
            loadFileDependenciesForExecutable(this);
        }
    };
    Executable.prototype.loadFileDependencies.displayName = "Executable . prototype . loadFileDependencies";
    Executable.prototype.hasExecutableUnloadedFileDependencies =     function()
    {
        return this._fileDependencyStatus === ExecutableUnloadedFileDependencies;
    };
    Executable.prototype.hasExecutableUnloadedFileDependencies.displayName = "Executable . prototype . hasExecutableUnloadedFileDependencies";
    function loadFileDependenciesForExecutable(anExecutable)
    {
        fileDependencyExecutables.push(anExecutable);
        anExecutable._fileDependencyStatus = ExecutableLoadingFileDependencies;
        var fileDependencies = anExecutable.fileDependencies(),
            index = 0,
            count = fileDependencies.length,
            referenceURL = anExecutable.referenceURL(),
            referenceURLString = referenceURL.absoluteString(),
            fileExecutableSearcher = anExecutable.fileExecutableSearcher();
        fileDependencyLoadCount += count;
        for (; index < count; ++index)
        {
            var fileDependency = fileDependencies[index],
                isQuoted = fileDependency.isLocal(),
                URL = fileDependency.URL(),
                marker = (isQuoted && referenceURLString + " " || "") + URL;
            if (fileDependencyMarkers[marker])
            {
                if (--fileDependencyLoadCount === 0)
                    fileExecutableDependencyLoadFinished();
                continue;
            }
            fileDependencyMarkers[marker] = YES;
            fileExecutableSearcher(URL, isQuoted, fileExecutableSearchFinished);
        }
    }
    function fileExecutableSearchFinished(aFileExecutable)
    {
        --fileDependencyLoadCount;
        if (aFileExecutable._fileDependencyStatus === ExecutableUnloadedFileDependencies)
            loadFileDependenciesForExecutable(aFileExecutable);
        else if (fileDependencyLoadCount === 0)
            fileExecutableDependencyLoadFinished();
    }
    function fileExecutableDependencyLoadFinished()
    {
        var executables = fileDependencyExecutables,
            index = 0,
            count = executables.length;
        fileDependencyExecutables = [];
        for (; index < count; ++index)
            executables[index]._fileDependencyStatus = ExecutableLoadedFileDependencies;
        for (index = 0; index < count; ++index)
        {
            var executable = executables[index],
                callbacks = executable._fileDependencyCallbacks,
                callbackIndex = 0,
                callbackCount = callbacks.length;
            for (; callbackIndex < callbackCount; ++callbackIndex)
                callbacks[callbackIndex]();
            executable._fileDependencyCallbacks = [];
        }
    }
    Executable.prototype.referenceURL =     function()
    {
        if (this._referenceURL === undefined)
            this._referenceURL = new CFURL(".", this.URL());
        return this._referenceURL;
    };
    Executable.prototype.referenceURL.displayName = "Executable . prototype . referenceURL";
    Executable.prototype.fileImporter =     function()
    {
        return Executable.fileImporterForURL(this.referenceURL());
    };
    Executable.prototype.fileImporter.displayName = "Executable . prototype . fileImporter";
    Executable.prototype.fileExecuter =     function()
    {
        return Executable.fileExecuterForURL(this.referenceURL());
    };
    Executable.prototype.fileExecuter.displayName = "Executable . prototype . fileExecuter";
    Executable.prototype.fileExecutableSearcher =     function()
    {
        return Executable.fileExecutableSearcherForURL(this.referenceURL());
    };
    Executable.prototype.fileExecutableSearcher.displayName = "Executable . prototype . fileExecutableSearcher";
    var cachedFileExecuters = {};
    Executable.fileExecuterForURL =     function(aURL)
    {
        var referenceURL = makeAbsoluteURL(aURL),
            referenceURLString = referenceURL.absoluteString(),
            cachedFileExecuter = cachedFileExecuters[referenceURLString];
        if (!cachedFileExecuter)
        {
            cachedFileExecuter =             function(aURL, isQuoted, shouldForce)
            {
                Executable.fileExecutableSearcherForURL(referenceURL)(aURL, isQuoted,                 function(aFileExecutable)
                {
                    if (!aFileExecutable.hasLoadedFileDependencies())
                        throw "No executable loaded for file at URL " + aURL;
                    aFileExecutable.execute(shouldForce);
                });
            };
            cachedFileExecuters[referenceURLString] = cachedFileExecuter;
        }
        return cachedFileExecuter;
    };
    Executable.fileExecuterForURL.displayName = "Executable . fileExecuterForURL";
    var cachedFileImporters = {};
    Executable.fileImporterForURL =     function(aURL)
    {
        var referenceURL = makeAbsoluteURL(aURL),
            referenceURLString = referenceURL.absoluteString(),
            cachedFileImporter = cachedFileImporters[referenceURLString];
        if (!cachedFileImporter)
        {
            cachedFileImporter =             function(aURL, isQuoted, aCallback)
            {
                enableCFURLCaching();
                Executable.fileExecutableSearcherForURL(referenceURL)(aURL, isQuoted,                 function(aFileExecutable)
                {
                    aFileExecutable.loadFileDependencies(                    function()
                    {
                        var result = aFileExecutable.execute();
                        disableCFURLCaching();
                        if (aCallback)
                            aCallback(result);
                    });
                });
            };
            cachedFileImporters[referenceURLString] = cachedFileImporter;
        }
        return cachedFileImporter;
    };
    Executable.fileImporterForURL.displayName = "Executable . fileImporterForURL";
    var cachedFileExecutableSearchers = {},
        cachedFileExecutableSearchResults = {};
    Executable.resetCachedFileExecutableSearchers =     function()
    {
        cachedFileExecutableSearchers = {};
        cachedFileExecutableSearchResults = {};
        cachedFileImporters = {};
        cachedFileExecuters = {};
        fileDependencyMarkers = {};
    };
    Executable.fileExecutableSearcherForURL =     function(referenceURL)
    {
        var referenceURLString = referenceURL.absoluteString(),
            cachedFileExecutableSearcher = cachedFileExecutableSearchers[referenceURLString];
        if (!cachedFileExecutableSearcher)
        {
            var aFilenameTranslateDictionary = Executable.filenameTranslateDictionary ? Executable.filenameTranslateDictionary() : null;
            cachedFileExecutableSearcher =             function(aURL, isQuoted, success)
            {
                var cacheUID = (isQuoted && referenceURL || "") + aURL,
                    cachedResult = cachedFileExecutableSearchResults[cacheUID];
                if (cachedResult)
                    return completed(cachedResult);
                var isAbsoluteURL = aURL instanceof CFURL && aURL.scheme();
                if (isQuoted || isAbsoluteURL)
                {
                    if (!isAbsoluteURL)
                        aURL = new CFURL(aURL, referenceURL);
                    StaticResource.resolveResourceAtURL(aURL, NO, completed, aFilenameTranslateDictionary);
                }
                else
                    StaticResource.resolveResourceAtURLSearchingIncludeURLs(aURL, completed);
                function completed(aStaticResource)
                {
                    if (!aStaticResource)
                    {
                        var compilingFileUrl = exports.ObjJCompiler || ObjJCompiler ? (exports.ObjJCompiler || ObjJCompiler).currentCompileFile : null;
                        throw new Error("Could not load file at " + aURL + (compilingFileUrl ? " when compiling " + compilingFileUrl : "") + "\nwith includeURLs: " + StaticResource.includeURLs());
                    }
                    cachedFileExecutableSearchResults[cacheUID] = aStaticResource;
                    success(new FileExecutable(aStaticResource.URL(), aFilenameTranslateDictionary));
                }
            };
            cachedFileExecutableSearchers[referenceURLString] = cachedFileExecutableSearcher;
        }
        return cachedFileExecutableSearcher;
    };
    Executable.fileExecutableSearcherForURL.displayName = "Executable . fileExecutableSearcherForURL";
    Executable.printWarningsAndErrors =     function(compiler, printXML)
    {
        var warnings = [],
            anyErrors = false;
        for (var i = 0; i < compiler.warningsAndErrors.length; i++)
        {
            var warning = compiler.warningsAndErrors[i],
                message = compiler.prettifyMessage(warning);
            anyErrors = anyErrors || warning.messageType === "ERROR";
            if (printXML)
            {
                var dict = new CFMutableDictionary();
                if (warning.messageOnLine != null)
                    dict.addValueForKey('line', warning.messageOnLine);
                if (warning.path != null)
                    dict.addValueForKey('sourcePath', new CFURL(warning.path).path());
                if (message != null)
                    dict.addValueForKey('message', message);
                warnings.push(dict);
            }
            else
            {
                print(message);
            }
        }
        if (warnings.length && printXML)
            try {
                print(CFPropertyListCreateXMLData(warnings, kCFPropertyListXMLFormat_v1_0).rawString());
            }
            catch(e) {
                print("XML encode error: " + e);
            }
        return anyErrors;
    };
    var SURROGATE_HIGH_START = 0xD800;
    var SURROGATE_HIGH_END = 0xDBFF;
    var SURROGATE_LOW_START = 0xDC00;
    var SURROGATE_LOW_END = 0xDFFF;
    var REPLACEMENT_CHAR = 0xFFFD;
    var FIRSTBYTEMARK = [0x00, 0xC0, 0xE0, 0xF0, 0xF8, 0xFC];
    function UTF16ToUTF8(source)
    {
        var target = "";
        var currentPos = 0;
        for (var i = 0; i < source.length; i++)
        {
            var c = source.charCodeAt(i);
            if (c < 0x80)
                continue;
            if (i > currentPos)
                target += source.substring(currentPos, i);
            if (c >= SURROGATE_HIGH_START && c <= SURROGATE_HIGH_END)
            {
                i++;
                if (i < source.length)
                {
                    var c2 = source.charCodeAt(i);
                    if (c2 >= SURROGATE_LOW_START && c2 <= SURROGATE_LOW_END)
                    {
                        c = (c - SURROGATE_HIGH_START << 10) + (c2 - SURROGATE_LOW_START) + 0x10000;
                    }
                    else
                    {
                        return null;
                    }
                }
                else
                {
                    return null;
                }
            }
            else if (c >= SURROGATE_LOW_START && c <= SURROGATE_LOW_END)
            {
                return null;
            }
            currentPos = i + 1;
            enc = [];
            var cc = c;
            if (cc >= 0x110000)
            {
                cc = 0x800;
                c = REPLACEMENT_CHAR;
            }
            if (cc >= 0x10000)
            {
                enc.unshift(String.fromCharCode((c | 0x80) & 0xBF));
                c >>= 6;
            }
            if (cc >= 0x800)
            {
                enc.unshift(String.fromCharCode((c | 0x80) & 0xBF));
                c >>= 6;
            }
            if (cc >= 0x80)
            {
                enc.unshift(String.fromCharCode((c | 0x80) & 0xBF));
                c >>= 6;
            }
            enc.unshift(String.fromCharCode(c | FIRSTBYTEMARK[enc.length]));
            target += enc.join("");
        }
        if (currentPos === 0)
            return source;
        if (i > currentPos)
            target += source.substring(currentPos, i);
        return target;
    }
    UTF16ToUTF8.displayName = "UTF16ToUTF8";
    var FileExecutablesForURLStrings = {};
    function FileExecutable(aURL, aFilenameTranslateDictionary, success)
    {
        aURL = makeAbsoluteURL(aURL);
        var URLString = aURL.absoluteString(),
            existingFileExecutable = FileExecutablesForURLStrings[URLString];
        if (existingFileExecutable)
            return existingFileExecutable;
        FileExecutablesForURLStrings[URLString] = this;
        var aResource = StaticResource.resourceAtURL(aURL),
            fileContents = aResource.contents(),
            executable = NULL;
        this._hasExecuted = NO;
        executable = new Executable(fileContents, aResource._fileDependencies || [], aURL, aResource._function, aResource._compiler, aResource._compiler ? aFilenameTranslateDictionary : null, aResource._sourceMap);
        Executable.apply(this, [executable.code(), executable.fileDependencies(), aURL, executable._function, executable._compiler, aFilenameTranslateDictionary]);
    }
    exports.FileExecutable = FileExecutable;
    FileExecutable.prototype = new Executable();
    FileExecutable.allFileExecutables =     function()
    {
        var URLString,
            fileExecutables = [];
        for (URLString in FileExecutablesForURLStrings)
            if (hasOwnProperty.call(FileExecutablesForURLStrings, URLString))
                fileExecutables.push(FileExecutablesForURLStrings[URLString]);
        return fileExecutables;
    };
    FileExecutable.resetFileExecutables =     function()
    {
        FileExecutablesForURLStrings = {};
    };
    FileExecutable.prototype.execute =     function(shouldForce)
    {
        if (this._hasExecuted && !shouldForce)
            return;
        this._hasExecuted = YES;
        return Executable.prototype.execute.call(this);
    };
    FileExecutable.prototype.execute.displayName = "FileExecutable . prototype . execute";
    FileExecutable.prototype.hasExecuted =     function()
    {
        return this._hasExecuted;
    };
    FileExecutable.prototype.hasExecuted.displayName = "FileExecutable . prototype . hasExecuted";
    var CLS_CLASS = 0x1,
        CLS_META = 0x2,
        CLS_INITIALIZED = 0x4,
        CLS_INITIALIZING = 0x8;
    objj_ivar =     function(aName, aType)
    {
        this.name = aName;
        this.type = aType;
    };
    objj_method =     function(aName, anImplementation, types)
    {
        var method = anImplementation ||         function(aReceiver, aSelector)
        {
            CPException.isa.objj_msgSend2(CPException, "raise:reason:", CPInternalInconsistencyException, aReceiver.isa.method_msgSend0(self, "className") + " does not have an implementation for selector '" + aSelector + "'");
        };
        method.method_name = aName;
        method.method_imp = anImplementation;
        method.method_types = types;
        return method;
    };
    objj_class =     function(displayName)
    {
        this.isa = NULL;
        this.version = 0;
        this.super_class = NULL;
        this.name = NULL;
        this.info = 0;
        this.ivar_list = [];
        this.ivar_store =         function()
        {
        };
        this.ivar_dtable = this.ivar_store.prototype;
        this.method_list = [];
        this.method_store =         function()
        {
        };
        this.method_dtable = this.method_store.prototype;
        this.protocol_list = [];
        eval("this.allocator = function " + (displayName ? displayName.replace(/^0|\W/g, "_") : "OBJJ_OBJECT") + "() { }");
        this._UID = -1;
    };
    objj_protocol =     function(aName)
    {
        this.name = aName;
        this.instance_methods = {};
        this.class_methods = {};
    };
    objj_object =     function()
    {
        this.isa = NULL;
        this._UID = -1;
    };
    objj_typeDef =     function(aName)
    {
        this.name = aName;
    };
    class_getName =     function(aClass)
    {
        if (aClass == Nil)
            return "";
        return aClass.name;
    };
    class_isMetaClass =     function(aClass)
    {
        if (!aClass)
            return NO;
        return aClass.info & CLS_META;
    };
    class_getSuperclass =     function(aClass)
    {
        if (aClass == Nil)
            return Nil;
        return aClass.super_class;
    };
    class_setSuperclass =     function(aClass, aSuperClass)
    {
        aClass.super_class = aSuperClass;
        aClass.isa.super_class = aSuperClass.isa;
    };
    class_addIvar =     function(aClass, aName, aType)
    {
        var thePrototype = aClass.allocator.prototype;
        if (typeof thePrototype[aName] != "undefined")
            return NO;
        var ivar = new objj_ivar(aName, aType);
        aClass.ivar_list.push(ivar);
        aClass.ivar_dtable[aName] = ivar;
        thePrototype[aName] = NULL;
        return YES;
    };
    class_addIvars =     function(aClass, ivars)
    {
        var index = 0,
            count = ivars.length,
            thePrototype = aClass.allocator.prototype;
        for (; index < count; ++index)
        {
            var ivar = ivars[index],
                name = ivar.name;
            if (typeof thePrototype[name] === "undefined")
            {
                aClass.ivar_list.push(ivar);
                aClass.ivar_dtable[name] = ivar;
                thePrototype[name] = NULL;
            }
        }
    };
    class_copyIvarList =     function(aClass)
    {
        return aClass.ivar_list.slice(0);
    };
    class_addMethod =     function(aClass, aName, anImplementation, types)
    {
        var method = new objj_method(aName, anImplementation, types);
        aClass.method_list.push(method);
        aClass.method_dtable[aName] = method;
        method.displayName = (aClass.info & CLS_META ? '+' : '-') + " [" + class_getName(aClass) + ' ' + method_getName(method) + ']';
        if (!(aClass.info & CLS_META) && (aClass.info & CLS_META ? aClass : aClass.isa).isa === (aClass.info & CLS_META ? aClass : aClass.isa))
            class_addMethod(aClass.info & CLS_META ? aClass : aClass.isa, aName, anImplementation, types);
        return YES;
    };
    class_addMethods =     function(aClass, methods)
    {
        var index = 0,
            count = methods.length,
            method_list = aClass.method_list,
            method_dtable = aClass.method_dtable;
        for (; index < count; ++index)
        {
            var method = methods[index];
            method_list.push(method);
            method_dtable[method.method_name] = method;
            method.displayName = (aClass.info & CLS_META ? '+' : '-') + " [" + class_getName(aClass) + ' ' + method_getName(method) + ']';
        }
        if (!(aClass.info & CLS_META) && (aClass.info & CLS_META ? aClass : aClass.isa).isa === (aClass.info & CLS_META ? aClass : aClass.isa))
            class_addMethods(aClass.info & CLS_META ? aClass : aClass.isa, methods);
    };
    class_getInstanceMethod =     function(aClass, aSelector)
    {
        if (!aClass || !aSelector)
            return NULL;
        var method = aClass.method_dtable[aSelector];
        return method ? method : NULL;
    };
    class_getInstanceVariable =     function(aClass, aName)
    {
        if (!aClass || !aName)
            return NULL;
        var variable = aClass.ivar_dtable[aName];
        return variable;
    };
    class_getClassMethod =     function(aClass, aSelector)
    {
        if (!aClass || !aSelector)
            return NULL;
        var method = (aClass.info & CLS_META ? aClass : aClass.isa).method_dtable[aSelector];
        return method ? method : NULL;
    };
    class_respondsToSelector =     function(aClass, aSelector)
    {
        return class_getClassMethod(aClass, aSelector) != NULL;
    };
    class_copyMethodList =     function(aClass)
    {
        return aClass.method_list.slice(0);
    };
    class_getVersion =     function(aClass)
    {
        return aClass.version;
    };
    class_setVersion =     function(aClass, aVersion)
    {
        aClass.version = parseInt(aVersion, 10);
    };
    class_replaceMethod =     function(aClass, aSelector, aMethodImplementation)
    {
        if (!aClass || !aSelector)
            return NULL;
        var method = aClass.method_dtable[aSelector],
            method_imp = method.method_imp,
            new_method = new objj_method(method.method_name, aMethodImplementation, method.method_types);
        new_method.displayName = method.displayName;
        aClass.method_dtable[aSelector] = new_method;
        var index = aClass.method_list.indexOf(method);
        if (index !== -1)
        {
            aClass.method_list[index] = new_method;
        }
        else
        {
            aClass.method_list.push(new_method);
        }
        return method_imp;
    };
    class_addProtocol =     function(aClass, aProtocol)
    {
        if (!aProtocol || class_conformsToProtocol(aClass, aProtocol))
        {
            return;
        }
        (aClass.protocol_list || (aClass.protocol_list = [])).push(aProtocol);
        return true;
    };
    class_conformsToProtocol =     function(aClass, aProtocol)
    {
        if (!aProtocol)
            return false;
        while (aClass)
        {
            var protocols = aClass.protocol_list,
                size = protocols ? protocols.length : 0;
            for (var i = 0; i < size; i++)
            {
                var p = protocols[i];
                if (p.name === aProtocol.name)
                {
                    return true;
                }
                if (protocol_conformsToProtocol(p, aProtocol))
                {
                    return true;
                }
            }
            aClass = class_getSuperclass(aClass);
        }
        return false;
    };
    class_copyProtocolList =     function(aClass)
    {
        var protocols = aClass.protocol_list;
        return protocols ? protocols.slice(0) : [];
    };
    protocol_conformsToProtocol =     function(p1, p2)
    {
        if (!p1 || !p2)
            return false;
        if (p1.name === p2.name)
            return true;
        var protocols = p1.protocol_list,
            size = protocols ? protocols.length : 0;
        for (var i = 0; i < size; i++)
        {
            var p = protocols[i];
            if (p.name === p2.name)
            {
                return true;
            }
            if (protocol_conformsToProtocol(p, p2))
            {
                return true;
            }
        }
        return false;
    };
    var REGISTERED_PROTOCOLS = Object.create(null);
    objj_allocateProtocol =     function(aName)
    {
        var protocol = new objj_protocol(aName);
        return protocol;
    };
    objj_registerProtocol =     function(proto)
    {
        REGISTERED_PROTOCOLS[proto.name] = proto;
    };
    protocol_getName =     function(proto)
    {
        return proto.name;
    };
    protocol_addMethodDescription =     function(proto, selector, types, isRequiredMethod, isInstanceMethod)
    {
        if (!proto || !selector)
            return;
        if (isRequiredMethod)
            (isInstanceMethod ? proto.instance_methods : proto.class_methods)[selector] = new objj_method(selector, null, types);
    };
    protocol_addMethodDescriptions =     function(proto, methods, isRequiredMethod, isInstanceMethod)
    {
        if (!isRequiredMethod)
            return;
        var index = 0,
            count = methods.length,
            method_dtable = isInstanceMethod ? proto.instance_methods : proto.class_methods;
        for (; index < count; ++index)
        {
            var method = methods[index];
            method_dtable[method.method_name] = method;
        }
    };
    protocol_copyMethodDescriptionList =     function(proto, isRequiredMethod, isInstanceMethod)
    {
        if (!isRequiredMethod)
            return [];
        var method_dtable = isInstanceMethod ? proto.instance_methods : proto.class_methods,
            methodList = [];
        for (var selector in method_dtable)
            if (method_dtable.hasOwnProperty(selector))
                methodList.push(method_dtable[selector]);
        return methodList;
    };
    protocol_addProtocol =     function(proto, addition)
    {
        if (!proto || !addition)
            return;
        (proto.protocol_list || (proto.protocol_list = [])).push(addition);
    };
    var REGISTERED_TYPEDEFS = Object.create(null);
    objj_allocateTypeDef =     function(aName)
    {
        var typeDef = new objj_typeDef(aName);
        return typeDef;
    };
    objj_registerTypeDef =     function(typeDef)
    {
        REGISTERED_TYPEDEFS[typeDef.name] = typeDef;
    };
    typeDef_getName =     function(typeDef)
    {
        return typeDef.name;
    };
    var _class_initialize =     function(aClass)
    {
        var meta = aClass.info & CLS_META ? aClass : aClass.isa;
        if (aClass.info & CLS_META)
            aClass = objj_getClass(aClass.name);
        if (aClass.super_class && !((aClass.super_class.info & CLS_META ? aClass.super_class : aClass.super_class.isa).info & CLS_INITIALIZED))
            _class_initialize(aClass.super_class);
        if (!(meta.info & CLS_INITIALIZED) && !(meta.info & CLS_INITIALIZING))
        {
            meta.info = (meta.info | CLS_INITIALIZING) & ~0;
            aClass.objj_msgSend = objj_msgSendFast;
            aClass.objj_msgSend0 = objj_msgSendFast0;
            aClass.objj_msgSend1 = objj_msgSendFast1;
            aClass.objj_msgSend2 = objj_msgSendFast2;
            aClass.objj_msgSend3 = objj_msgSendFast3;
            meta.objj_msgSend = objj_msgSendFast;
            meta.objj_msgSend0 = objj_msgSendFast0;
            meta.objj_msgSend1 = objj_msgSendFast1;
            meta.objj_msgSend2 = objj_msgSendFast2;
            meta.objj_msgSend3 = objj_msgSendFast3;
            aClass.method_msgSend = aClass.method_dtable;
            var metaMethodDTable = meta.method_msgSend = meta.method_dtable,
                initializeImp = metaMethodDTable["initialize"];
            if (initializeImp)
                initializeImp(aClass, "initialize");
            meta.info = (meta.info | CLS_INITIALIZED) & ~CLS_INITIALIZING;
        }
    };
    _objj_forward =     function(self, _cmd)
    {
        var isa = self.isa,
            meta = isa.info & CLS_META ? isa : isa.isa;
        if (!(meta.info & CLS_INITIALIZED) && !(meta.info & CLS_INITIALIZING))
        {
            _class_initialize(isa);
        }
        var implementation = isa.method_msgSend[_cmd];
        if (implementation)
        {
            return implementation.apply(isa, arguments);
        }
        implementation = isa.method_dtable[SEL_forwardingTargetForSelector_];
        if (implementation)
        {
            var target = implementation(self, SEL_forwardingTargetForSelector_, _cmd);
            if (target && target !== self)
            {
                arguments[0] = target;
                return target.isa.objj_msgSend.apply(target.isa, arguments);
            }
        }
        implementation = isa.method_dtable[SEL_methodSignatureForSelector_];
        if (implementation)
        {
            var forwardInvocationImplementation = isa.method_dtable[SEL_forwardInvocation_];
            if (forwardInvocationImplementation)
            {
                var signature = implementation(self, SEL_methodSignatureForSelector_, _cmd);
                if (signature)
                {
                    var invocationClass = objj_lookUpClass("CPInvocation");
                    if (invocationClass)
                    {
                        var invocation = invocationClass.isa.objj_msgSend1(invocationClass, SEL_invocationWithMethodSignature_, signature),
                            index = 0,
                            count = arguments.length;
                        if (invocation != null)
                        {
                            var invocationIsa = invocation.isa;
                            for (; index < count; ++index)
                                invocationIsa.objj_msgSend2(invocation, SEL_setArgument_atIndex_, arguments[index], index);
                        }
                        forwardInvocationImplementation(self, SEL_forwardInvocation_, invocation);
                        return invocation == null ? null : invocationIsa.objj_msgSend0(invocation, SEL_returnValue);
                    }
                }
            }
        }
        implementation = isa.method_dtable[SEL_doesNotRecognizeSelector_];
        if (implementation)
            return implementation(self, SEL_doesNotRecognizeSelector_, _cmd);
        throw class_getName(isa) + " does not implement doesNotRecognizeSelector: when sending " + sel_getName(_cmd) + ". Did you forget a superclass for " + class_getName(isa) + "?";
    };
    class_getMethodImplementation =     function(aClass, aSelector)
    {
        if (!((aClass.info & CLS_META ? aClass : aClass.isa).info & CLS_INITIALIZED))
            _class_initialize(aClass);
        var implementation = aClass.method_dtable[aSelector] || _objj_forward;
;
        return implementation;
    };
    var REGISTERED_CLASSES = Object.create(null);
    objj_enumerateClassesUsingBlock =     function(aBlock)
    {
        for (var key in REGISTERED_CLASSES)
        {
            aBlock(REGISTERED_CLASSES[key]);
        }
    };
    objj_allocateClassPair =     function(superclass, aName)
    {
        var classObject = new objj_class(aName),
            metaClassObject = new objj_class(aName),
            rootClassObject = classObject;
        if (superclass)
        {
            rootClassObject = superclass;
            while (rootClassObject.superclass)
                rootClassObject = rootClassObject.superclass;
            classObject.allocator.prototype = new superclass.allocator();
            classObject.ivar_dtable = classObject.ivar_store.prototype = new superclass.ivar_store();
            classObject.method_dtable = classObject.method_store.prototype = new superclass.method_store();
            metaClassObject.method_dtable = metaClassObject.method_store.prototype = new superclass.isa.method_store();
            classObject.super_class = superclass;
            metaClassObject.super_class = superclass.isa;
        }
        else
            classObject.allocator.prototype = new objj_object();
        classObject.isa = metaClassObject;
        classObject.name = aName;
        classObject.info = CLS_CLASS;
        classObject._UID = objj_generateObjectUID();
        classObject.init = true;
        metaClassObject.isa = rootClassObject.isa;
        metaClassObject.name = aName;
        metaClassObject.info = CLS_META;
        metaClassObject._UID = objj_generateObjectUID();
        metaClassObject.init = true;
        return classObject;
    };
    var CONTEXT_BUNDLE = nil;
    objj_registerClassPair =     function(aClass)
    {
        global[aClass.name] = aClass;
        REGISTERED_CLASSES[aClass.name] = aClass;
        addClassToBundle(aClass, CONTEXT_BUNDLE);
    };
    objj_resetRegisterClasses =     function()
    {
        for (var key in REGISTERED_CLASSES)
            delete global[key];
        REGISTERED_CLASSES = Object.create(null);
        REGISTERED_PROTOCOLS = Object.create(null);
        REGISTERED_TYPEDEFS = Object.create(null);
        resetBundle();
    };
    class_createInstance =     function(aClass)
    {
        if (!aClass)
            throw new Error("*** Attempting to create object with Nil class.");
        var object = new aClass.allocator();
        object.isa = aClass;
        object._UID = objj_generateObjectUID();
        return object;
    };
    var prototype_bug =     function()
    {
    };
    prototype_bug.prototype.member = false;
    with(new prototype_bug())
        member = true;
    if (new prototype_bug().member)
    {
        var fast_class_createInstance = class_createInstance;
        class_createInstance =         function(aClass)
        {
            var object = fast_class_createInstance(aClass);
            if (object)
            {
                var theClass = object.isa,
                    actualClass = theClass;
                while (theClass)
                {
                    var ivars = theClass.ivar_list,
                        count = ivars.length;
                    while (count--)
                        object[ivars[count].name] = NULL;
                    theClass = theClass.super_class;
                }
                object.isa = actualClass;
            }
            return object;
        };
    }
    object_getClassName =     function(anObject)
    {
        if (!anObject)
            return "";
        var theClass = anObject.isa;
        return theClass ? class_getName(theClass) : "";
    };
    objj_lookUpClass =     function(aName)
    {
        var theClass = REGISTERED_CLASSES[aName];
        return theClass ? theClass : Nil;
    };
    objj_getClass =     function(aName)
    {
        var theClass = REGISTERED_CLASSES[aName];
        if (!theClass)
        {
        }
        return theClass ? theClass : Nil;
    };
    objj_getClassList =     function(buffer, bufferLen)
    {
        for (var aName in REGISTERED_CLASSES)
        {
            buffer.push(REGISTERED_CLASSES[aName]);
            if (bufferLen && --bufferLen === 0)
                break;
        }
        return buffer.length;
    };
    objj_getMetaClass =     function(aName)
    {
        var theClass = objj_getClass(aName);
        return theClass.info & CLS_META ? theClass : theClass.isa;
    };
    objj_getProtocol =     function(aName)
    {
        return REGISTERED_PROTOCOLS[aName];
    };
    objj_getTypeDef =     function(aName)
    {
        return REGISTERED_TYPEDEFS[aName];
    };
    ivar_getName =     function(anIvar)
    {
        return anIvar.name;
    };
    ivar_getTypeEncoding =     function(anIvar)
    {
        return anIvar.type;
    };
    objj_msgSend =     function(aReceiver, aSelector)
    {
        if (aReceiver == nil)
            return aReceiver;
        var isa = aReceiver.isa;
        if (isa.init)
            _class_initialize(isa);
        var method = isa.method_dtable[aSelector];
        var implementation = method ? method.method_imp : _objj_forward;
        switch(arguments.length) {
            case 2:
                return implementation(aReceiver, aSelector);
            case 3:
                return implementation(aReceiver, aSelector, arguments[2]);
            case 4:
                return implementation(aReceiver, aSelector, arguments[2], arguments[3]);
            case 5:
                return implementation(aReceiver, aSelector, arguments[2], arguments[3], arguments[4]);
            case 6:
                return implementation(aReceiver, aSelector, arguments[2], arguments[3], arguments[4], arguments[5]);
            case 7:
                return implementation(aReceiver, aSelector, arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
        }
        return implementation.apply(aReceiver, arguments);
    };
    objj_msgSendSuper =     function(aSuper, aSelector)
    {
        var super_class = aSuper.super_class;
        arguments[0] = aSuper.receiver;
        if (!((super_class.info & CLS_META ? super_class : super_class.isa).info & CLS_INITIALIZED))
            _class_initialize(super_class);
        var implementation = super_class.method_dtable[aSelector] || _objj_forward;
;
        return implementation.apply(aSuper.receiver, arguments);
    };
    objj_msgSendSuper0 =     function(aSuper, aSelector)
    {
        return (aSuper.super_class.method_dtable[aSelector] || _objj_forward)(aSuper.receiver, aSelector);
    };
    objj_msgSendSuper1 =     function(aSuper, aSelector, arg0)
    {
        return (aSuper.super_class.method_dtable[aSelector] || _objj_forward)(aSuper.receiver, aSelector, arg0);
    };
    objj_msgSendSuper2 =     function(aSuper, aSelector, arg0, arg1)
    {
        return (aSuper.super_class.method_dtable[aSelector] || _objj_forward)(aSuper.receiver, aSelector, arg0, arg1);
    };
    objj_msgSendSuper3 =     function(aSuper, aSelector, arg0, arg1, arg2)
    {
        return (aSuper.super_class.method_dtable[aSelector] || _objj_forward)(aSuper.receiver, aSelector, arg0, arg1, arg2);
    };
    objj_msgSendFast =     function(aReceiver, aSelector)
    {
        return (this.method_dtable[aSelector] || _objj_forward).apply(aReceiver, arguments);
    };
    var objj_msgSendFastInitialize =     function(aReceiver, aSelector)
    {
        _class_initialize(this);
        return this.objj_msgSend.apply(this, arguments);
    };
    objj_msgSendFast0 =     function(aReceiver, aSelector)
    {
        return (this.method_dtable[aSelector] || _objj_forward)(aReceiver, aSelector);
    };
    var objj_msgSendFast0Initialize =     function(aReceiver, aSelector)
    {
        _class_initialize(this);
        return this.objj_msgSend0(aReceiver, aSelector);
    };
    objj_msgSendFast1 =     function(aReceiver, aSelector, arg0)
    {
        return (this.method_dtable[aSelector] || _objj_forward)(aReceiver, aSelector, arg0);
    };
    var objj_msgSendFast1Initialize =     function(aReceiver, aSelector, arg0)
    {
        _class_initialize(this);
        return this.objj_msgSend1(aReceiver, aSelector, arg0);
    };
    objj_msgSendFast2 =     function(aReceiver, aSelector, arg0, arg1)
    {
        return (this.method_dtable[aSelector] || _objj_forward)(aReceiver, aSelector, arg0, arg1);
    };
    var objj_msgSendFast2Initialize =     function(aReceiver, aSelector, arg0, arg1)
    {
        _class_initialize(this);
        return this.objj_msgSend2(aReceiver, aSelector, arg0, arg1);
    };
    objj_msgSendFast3 =     function(aReceiver, aSelector, arg0, arg1, arg2)
    {
        return (this.method_dtable[aSelector] || _objj_forward)(aReceiver, aSelector, arg0, arg1, arg2);
    };
    var objj_msgSendFast3Initialize =     function(aReceiver, aSelector, arg0, arg1, arg2)
    {
        _class_initialize(this);
        return this.objj_msgSend3(aReceiver, aSelector, arg0, arg1, arg2);
    };
    method_getName =     function(aMethod)
    {
        return aMethod.method_name;
    };
    method_copyReturnType =     function(aMethod)
    {
        var types = aMethod.method_types;
        if (types)
        {
            var argType = types[0];
            return argType != NULL ? argType : NULL;
        }
        else
            return NULL;
    };
    method_copyArgumentType =     function(aMethod, index)
    {
        switch(index) {
            case 0:
                return "id";
            case 1:
                return "SEL";
default:
                var types = aMethod.method_types;
                if (types)
                {
                    var argType = types[index - 1];
                    return argType != NULL ? argType : NULL;
                }
                else
                    return NULL;
        }
    };
    method_getNumberOfArguments =     function(aMethod)
    {
        var types = aMethod.method_types;
        return types ? types.length + 1 : (aMethod.method_name.match(/:/g) || []).length + 2;
    };
    method_getImplementation =     function(aMethod)
    {
        return aMethod.method_imp;
    };
    method_setImplementation =     function(aMethod, anImplementation)
    {
        var oldImplementation = aMethod.method_imp;
        aMethod.method_imp = anImplementation;
        return oldImplementation;
    };
    method_exchangeImplementations =     function(lhs, rhs)
    {
        var lhs_imp = method_getImplementation(lhs),
            rhs_imp = method_getImplementation(rhs);
        method_setImplementation(lhs, rhs_imp);
        method_setImplementation(rhs, lhs_imp);
    };
    sel_getName =     function(aSelector)
    {
        return aSelector ? aSelector : "<null selector>";
    };
    sel_getUid =     function(aName)
    {
        return aName;
    };
    sel_isEqual =     function(lhs, rhs)
    {
        return lhs === rhs;
    };
    sel_registerName =     function(aName)
    {
        return aName;
    };
    objj_class.prototype.toString = objj_object.prototype.toString =     function()
    {
        var isa = this.isa;
        if (class_getInstanceMethod(isa, SEL_description))
            return isa.objj_msgSend0(this, SEL_description);
        if (class_isMetaClass(isa))
            return this.name;
        return "[" + isa.name + " Object](-description not implemented)";
    };
    objj_class.prototype.objj_msgSend = objj_msgSendFastInitialize;
    objj_class.prototype.objj_msgSend0 = objj_msgSendFast0Initialize;
    objj_class.prototype.objj_msgSend1 = objj_msgSendFast1Initialize;
    objj_class.prototype.objj_msgSend2 = objj_msgSendFast2Initialize;
    objj_class.prototype.objj_msgSend3 = objj_msgSendFast3Initialize;
    objj_class.prototype.method_msgSend = Object.create(null);
    var SEL_description = sel_getUid("description"),
        SEL_forwardingTargetForSelector_ = sel_getUid("forwardingTargetForSelector:"),
        SEL_methodSignatureForSelector_ = sel_getUid("methodSignatureForSelector:"),
        SEL_forwardInvocation_ = sel_getUid("forwardInvocation:"),
        SEL_doesNotRecognizeSelector_ = sel_getUid("doesNotRecognizeSelector:"),
        SEL_invocationWithMethodSignature_ = sel_getUid("invocationWithMethodSignature:"),
        SEL_setTarget_ = sel_getUid("setTarget:"),
        SEL_setSelector_ = sel_getUid("setSelector:"),
        SEL_setArgument_atIndex_ = sel_getUid("setArgument:atIndex:"),
        SEL_returnValue = sel_getUid("returnValue");
    objj_eval =     function(aString)
    {
        var url = PATH.join(process.cwd(), "/");
        Executable.setCommonJSParameters("require", "exports", "module", "system", "print", "window");
        Executable.setCommonJSArguments(require, exports, module, typeof system !== "undefined" && system, print, window);
        var asyncLoaderSaved = exports.asyncLoader;
        exports.asyncLoader = NO;
        var executable = exports.preprocess(aString, url, 0);
        if (!executable.hasLoadedFileDependencies())
            executable.loadFileDependencies();
        global._objj_eval_scope = {};
        global._objj_eval_scope.objj_executeFile = Executable.fileExecuterForURL(url);
        global._objj_eval_scope.objj_importFile = Executable.fileImporterForURL(url);
        global._objj_eval_scope.require = require;
        global._objj_eval_scope.exports = exports;
        global._objj_eval_scope.module = module;
        global._objj_eval_scope.system = system;
        global._objj_eval_scope.print = print;
        global._objj_eval_scope.window = window;
        var code = "with(_objj_eval_scope){" + executable._code + "\n//*/\n}";
        var result;
        if (typeof system !== "undefined" && system.engine === "rhino")
            result = Packages.org.mozilla.javascript.Context.getCurrentContext().evaluateString(global, code, "objj_eval", 0, NULL);
        else
            result = eval(code);
        exports.asyncLoader = asyncLoaderSaved;
        return result;
    };
    exports.objj_eval = objj_eval;
    function objj_debug_object_format(aReceiver)
    {
        return aReceiver && aReceiver.isa ? exports.sprintf("<%s %#08x>", (aReceiver.info & CLS_META ? aReceiver : aReceiver.isa).name, aReceiver._UID) : String(aReceiver);
    }
    function objj_debug_message_format(aReceiver, aSelector)
    {
        return exports.sprintf("[%s %s]", objj_debug_object_format(aReceiver), aSelector);
    }
    var objj_msgSend_original = objj_msgSend,
        objj_msgSendSuper_original = objj_msgSendSuper,
        objj_msgSendFast_original = objj_msgSendFast,
        objj_msgSendFast0_original = objj_msgSendFast0,
        objj_msgSendFast1_original = objj_msgSendFast1,
        objj_msgSendFast2_original = objj_msgSendFast2,
        objj_msgSendFast3_original = objj_msgSendFast3;
    function objj_msgSend_reset_all_classes()
    {
        objj_enumerateClassesUsingBlock(        function(aClass)
        {
            if (aClass.hasOwnProperty("objj_msgSend"))
            {
                aClass.objj_msgSend = objj_msgSendFast;
                aClass.objj_msgSend0 = objj_msgSendFast0;
                aClass.objj_msgSend1 = objj_msgSendFast1;
                aClass.objj_msgSend2 = objj_msgSendFast2;
                aClass.objj_msgSend3 = objj_msgSendFast3;
            }
        });
    }
    objj_msgSend_reset =     function()
    {
        objj_msgSend = objj_msgSend_original;
        objj_msgSendSuper = objj_msgSendSuper_original;
        objj_msgSendFast = objj_msgSendFast_original;
        objj_msgSendFast0 = objj_msgSendFast0_original;
        objj_msgSendFast1 = objj_msgSendFast1_original;
        objj_msgSendFast2 = objj_msgSendFast2_original;
        objj_msgSendFast3 = objj_msgSendFast3_original;
        objj_msgSend_reset_all_classes();
    };
    objj_msgSend_decorate =     function()
    {
        var index = 0,
            count = arguments.length;
        for (; index < count; ++index)
        {
            objj_msgSend = arguments[index](objj_msgSend);
            objj_msgSendSuper = arguments[index](objj_msgSendSuper);
            objj_msgSendFast = arguments[index](objj_msgSendFast);
            objj_msgSendFast0 = arguments[index](objj_msgSendFast0);
            objj_msgSendFast1 = arguments[index](objj_msgSendFast1);
            objj_msgSendFast2 = arguments[index](objj_msgSendFast2);
            objj_msgSendFast3 = arguments[index](objj_msgSendFast3);
        }
        if (count)
            objj_msgSend_reset_all_classes();
    };
    objj_msgSend_set_decorators =     function()
    {
        objj_msgSend_reset();
        objj_msgSend_decorate.apply(NULL, arguments);
    };
    var objj_backtrace = [];
    objj_backtrace_print =     function(aStream)
    {
        var index = 0,
            count = objj_backtrace.length;
        for (; index < count; ++index)
        {
            var frame = objj_backtrace[index];
            aStream(objj_debug_message_format(frame.receiver, frame.selector));
        }
    };
    objj_backtrace_decorator =     function(msgSend)
    {
        return         function(aReceiverOrSuper, aSelector)
        {
            var aReceiver = aReceiverOrSuper && (aReceiverOrSuper.receiver || aReceiverOrSuper);
            objj_backtrace.push({receiver: aReceiver, selector: aSelector});
            try {
                return msgSend.apply(this, arguments);
            }
            catch(anException) {
                if (objj_backtrace.length)
                {
                    CPLog.warn("Exception " + anException + " in " + objj_debug_message_format(aReceiver, aSelector));
                    objj_backtrace_print(CPLog.warn);
                    objj_backtrace = [];
                }
                throw anException;
            }
            finally {
                objj_backtrace.pop();
            }
        };
    };
    objj_supress_exceptions_decorator =     function(msgSend)
    {
        return         function(aReceiverOrSuper, aSelector)
        {
            var aReceiver = aReceiverOrSuper && (aReceiverOrSuper.receiver || aReceiverOrSuper);
            try {
                return msgSend.apply(this, arguments);
            }
            catch(anException) {
                CPLog.warn("Exception " + anException + " in " + objj_debug_message_format(aReceiver, aSelector));
            }
        };
    };
    var objj_typechecks_reported = {},
        objj_typecheck_prints_backtrace = NO;
    objj_typecheck_decorator =     function(msgSend)
    {
        return         function(aReceiverOrSuper, aSelector)
        {
            var aReceiver = aReceiverOrSuper && (aReceiverOrSuper.receiver || aReceiverOrSuper);
            if (!aReceiver)
                return msgSend.apply(this, arguments);
            var types = aReceiver.isa.method_dtable[aSelector].method_types;
            for (var i = 2; i < arguments.length; i++)
            {
                try {
                    objj_debug_typecheck(types[i - 1], arguments[i]);
                }
                catch(e) {
                    var key = [(aReceiver.info & CLS_META ? aReceiver : aReceiver.isa).name, aSelector, i, e].join(";");
                    if (!objj_typechecks_reported[key])
                    {
                        objj_typechecks_reported[key] = YES;
                        CPLog.warn("Type check failed on argument " + (i - 2) + " of " + objj_debug_message_format(aReceiver, aSelector) + ": " + e);
                        if (objj_typecheck_prints_backtrace)
                            objj_backtrace_print(CPLog.warn);
                    }
                }
            }
            var result = msgSend.apply(NULL, arguments);
            try {
                objj_debug_typecheck(types[0], result);
            }
            catch(e) {
                var key = [(aReceiver.info & CLS_META ? aReceiver : aReceiver.isa).name, aSelector, "ret", e].join(";");
                if (!objj_typechecks_reported[key])
                {
                    objj_typechecks_reported[key] = YES;
                    CPLog.warn("Type check failed on return val of " + objj_debug_message_format(aReceiver, aSelector) + ": " + e);
                    if (objj_typecheck_prints_backtrace)
                        objj_backtrace_print(CPLog.warn);
                }
            }
            return result;
        };
    };
    objj_debug_typecheck =     function(expectedType, object)
    {
        var objjClass;
        if (!expectedType)
        {
            return;
        }
        else if (expectedType === "id")
        {
            if (object !== undefined)
                return;
        }
        else if (expectedType === "void")
        {
            if (object === undefined)
                return;
        }
        else if (objjClass = objj_getClass(expectedType))
        {
            if (object === nil)
            {
                return;
            }
            else if (object !== undefined && object.isa)
            {
                var theClass = object.isa;
                for (; theClass; theClass = theClass.super_class)
                    if (theClass === objjClass)
                        return;
            }
        }
        else
        {
            return;
        }
        var actualType;
        if (object === NULL)
            actualType = "null";
        else if (object === undefined)
            actualType = "void";
        else if (object.isa)
            actualType = (object.info & CLS_META ? object : object.isa).name;
        else
            actualType = typeof object;
        throw "expected=" + expectedType + ", actual=" + actualType;
    };
    var mainBundleURL = new CFURL("file:" + process.cwd()).asDirectoryPathURL();
    function makeAbsoluteURL(aURL)
    {
        if (aURL instanceof CFURL && aURL.scheme())
            return aURL;
        return new CFURL(aURL, mainBundleURL);
    }
    objj_importFile = Executable.fileImporterForURL(mainBundleURL);
    objj_executeFile = Executable.fileExecuterForURL(mainBundleURL);
    objj_import =     function()
    {
        CPLog.warn("objj_import is deprecated, use objj_importFile instead");
        objj_importFile.apply(this, arguments);
    };
    exports.objj_frameworks = [];
    exports.objj_debug_frameworks = [];
    OBJJ_INCLUDE_PATHS.unshift.apply(OBJJ_INCLUDE_PATHS, exports.objj_frameworks);
    OBJJ_INCLUDE_PATHS.unshift.apply(OBJJ_INCLUDE_PATHS, exports.objj_debug_frameworks);
    if ((typeof system !== "undefined" && system || process).env["OBJJ_INCLUDE_PATHS"])
        OBJJ_INCLUDE_PATHS.unshift.apply(OBJJ_INCLUDE_PATHS, (typeof system !== "undefined" && system || process).env["OBJJ_INCLUDE_PATHS"].split(":"));
    with(window)
    {
        exports.run =         function(args, someCompilerOptions)
        {
            if (args)
            {
                function help(status)
                {
                    console.log("usage: " + require('path').basename(process.argv[1]) + " infile [--ecma3|--ecma5] [--strict-semicolons] [--track-comments]");
                    console.log("        [--include-comments] [--include-comment-line-break]");
                    console.log("        [--formatter <path>]  [--indent-tab] [--indent-width <n>] [--indent-string <string>]");
                    console.log("        [--track-spaces] [--track-locations] [--no-objj] [--no-preprocess]");
                    console.log("        [--no-debug-symbols] [--no-type-signatures] [--generate-objj]");
                    console.log("        [--no-source-map] [-x | --xml] [-m | --multifiles] [-I<objj/include/paths>]");
                    console.log("        [-Dmacro[([p1, p2, ...])][=definition]] [--help]");
                    process.exit(status);
                }
                var options = someCompilerOptions || {},
                    acornOptions = {},
                    objjOptions = process.env.OBJJ_OPT,
                    argv = (objjOptions ? ObjectiveJ.utils.file.parse(objjOptions) : []).concat(args.slice(1)),
                    argv0 = argv.shift(),
                    multipleFiles = false;
                while (argv0 && argv0.lastIndexOf('-', 0) === 0)
                {
                    if (argv0 === "--version")
                    {
                        console.log(exports.fullVersionString());
                    }
                    else if (argv0 == "--ecma3")
                        acornOptions.ecmaVersion = 3;
                    else if (argv0 == "--ecma5")
                        acornOptions.ecmaVersion = 5;
                    else if (argv0 == "--strict-semicolons")
                        acornOptions.strictSemicolons = true;
                    else if (argv0 == "--track-comments")
                        acornOptions.trackComments = true;
                    else if (argv0 == "--include-comment-line-break")
                        acornOptions.trackCommentsIncludeLineBreak = true;
                    else if (argv0 == "--include-comments")
                        (options.includeComments = true, acornOptions.trackComments = true);
                    else if (argv0 == "--track-spaces")
                        acornOptions.trackSpaces = true;
                    else if (argv0 == "--track-locations")
                        acornOptions.locations = true;
                    else if (argv0 == "--no-objj")
                        acornOptions.objj = false;
                    else if (argv0 == "--no-preprocess")
                        acornOptions.preprocess = false;
                    else if (argv0 == "--generate-objj")
                        options.generateObjJ = true;
                    else if (argv0 == "--no-source-map")
                        options.sourceMap = false;
                    else if (argv0 == "--no-debug-symbols")
                        options.includeDebugSymbols = false;
                    else if (argv0 == "--no-type-signatures")
                        options.includeTypeSignatures = false;
                    else if (argv0 == "--indent-width")
                        options.indentationSpaces = parseInt(argv.shift());
                    else if (argv0 == "--indent-string")
                    {
                        if (options.indentationType)
                        {
                            console.log("Can't have both '--indent-string' and '--indent-tab'");
                            help(1);
                        }
                        else
                            options.indentationType = argv.shift();
                    }
                    else if (argv0 == "--indent-tab")
                    {
                        if (options.indentationType)
                        {
                            console.log("Can't have both '--indent-string' and '--indent-tab'");
                            help(1);
                        }
                        else
                        {
                            options.indentationType = "\t";
                            if (!options.indentationSpaces)
                                options.indentationSpaces = 1;
                        }
                    }
                    else if (argv0 == "--formatter")
                    {
                        var filePath = argv.shift(),
                            relative = filePath.substring(0, 1) !== '/',
                            jsonFile = JSON.parse(fs.readFileSync(relative ? path.resolve(process.cwd(), filePath) : filePath, 'utf8'));
                        options.formatDescription = jsonFile;
                    }
                    else if (argv0.slice(0, 2) == "-D")
                        (acornOptions.macros || (acornOptions.macros = [])).push(argv0.slice(2));
                    else if (argv0 === "-x" || argv0 === "--xml")
                        exports.messageOutputFormatInXML = true;
                    else if (argv0 === "-m" || argv0 === "--multifiles")
                        multipleFiles = true;
                    else if (argv0 == "--help")
                        help(0);
                    else if (argv0 == "-")
                        help(1);
                    else if (argv0.lastIndexOf('-I', 0) === 0)
                    {
                        var filePaths = argv0.length === 2 ? [argv.shift()] : argv0.substr(2).split(':');
                        OBJJ_INCLUDE_PATHS.unshift.apply(OBJJ_INCLUDE_PATHS, filePaths);
                    }
                    argv0 = argv.shift();
                }
            }
            if (argv0)
            {
                var mainFilePath = PATH.resolve(argv0);
                var callback =                 function()
                {
                    if (typeof main === "function")
                    {
                        var arguments = [argv0];
                        if (argv && argv.length > 0)
                            arguments = arguments.concat(argv);
                        main(arguments);
                    }
                    else if (multipleFiles && (argv0 = argv.shift()))
                    {
                        mainFilePath = PATH.resolve(argv0);
                        exports.make_narwhal_factory(mainFilePath, null, null, callback)(require, {}, module, typeof system !== "undefined" && system, console.log);
                    }
                    else
                    {
                        console.error("No main function is found for " + mainFilePath);
                    }
                };
                while (NODEFILE.existsSync(mainFilePath) && NODEFILE.lstatSync(mainFilePath).isSymbolicLink())
                {
                    var linkPath = NODEFILE.readlinkSync(mainFilePath);
                    if (!PATH.isAbsolute(linkPath))
                    {
                        linkPath = PATH.join(PATH.dirname(mainFilePath), linkPath);
                    }
                    mainFilePath = PATH.resolve(linkPath);
                }
                options.acornOptions = acornOptions;
                StaticResource.setCurrentCompilerFlags(options);
                exports.make_narwhal_factory(mainFilePath, null, null, callback)(require, {}, module, typeof system !== "undefined" && system, console.log);
                require("./timeout").serviceTimeouts();
            }
            else
            {
                exports.repl();
            }
        };
        exports.repl =         function()
        {
            var READLINE = require('readline-history');
            READLINE.createInterface({path: "/tmp/history", maxLength: 1234, input: process.stdin, output: process.stdout, next:             function(rli)
            {
                rli.setPrompt("objj> ");
                rli.prompt();
                rli.on('line',                 function(line)
                {
                    try {
                        var result = exports.objj_eval(line);
                        if (result !== undefined)
                            console.log(result);
                    }
                    catch(e) {
                        console.log(e);
                    }
                    require("./timeout").serviceTimeouts();
                });
            }});
        };
        exports.make_narwhal_factory =         function(path, basePath, filenameTranslateDictionary, aCallback)
        {
            return             function(require, exports, module, system, print)
            {
                Executable.setCommonJSParameters("require", "exports", "module", "system", "print", "window");
                Executable.setCommonJSArguments(require, exports, module, typeof system !== "undefined" && system, print, window);
                filenameTranslateDictionary && Executable.setFilenameTranslateDictionary(filenameTranslateDictionary);
                Executable.fileImporterForURL(basePath ? basePath : PATH.dirname(path))(path, YES, aCallback);
            };
        };
    }
    var pkg = null;
    function getPackage()
    {
        if (!pkg)
            pkg = JSON.parse(NODEFILE.readFileSync(PATH.join("..", "..", "package.json"), 'utf8'));
        return pkg;
    }
    exports.version =     function()
    {
        return getPackage()["version"];
    };
    exports.revision =     function()
    {
        return getPackage()["cappuccino-revision"];
    };
    exports.timestamp =     function()
    {
        return new Date(getPackage()["cappuccino-timestamp"]);
    };
    exports.fullVersionString =     function()
    {
        var rev = exports.revision();
        return sprintf("objective-j %s (%04d-%02d-%02d %s)", exports.version(), exports.timestamp().getUTCFullYear(), exports.timestamp().getUTCMonth() + 1, exports.timestamp().getUTCDate(), rev ? rev.slice(0, 6) : null);
    };
    global.ObjectiveJ = {};
    for (var key in exports)
        if (Object.prototype.hasOwnProperty.call(exports, key))
            global.ObjectiveJ[key] = exports[key];
    if (require.main == module.id)
        exports.run(typeof system !== "undefined" && system.args || process.argv);
});
