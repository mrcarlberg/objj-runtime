var window = exports;

window.window           = window;

window.DOMParser        = require("@xmldom/xmldom").DOMParser;

window.XMLHttpRequest   = require("xmlhttprequest-ssl").XMLHttpRequest;

window.alert            = function() { console.log.apply(null, arguments); }
window.prompt           = function() { console.log(null, arguments); return ""; }
window.confirm          = function() { console.log(null, arguments); return true; }

window.Image            = function() { };

Object.defineProperty(window.Image.prototype, 'src', {
    set: function() {
        this.onerror && this.onerror() 
    }
});