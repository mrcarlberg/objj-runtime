var window = exports;

window.window           = window;

window.DOMParser        = require("xmldom").DOMParser;

window.XMLHttpRequest   = require("xmlhttprequest-ts").XMLHttpRequest;

window.alert            = function() { console.log.apply(null, arguments); }
window.prompt           = function() { console.log(null, arguments); return ""; }
window.confirm          = function() { console.log(null, arguments); return true; }

window.Image            = function() {};