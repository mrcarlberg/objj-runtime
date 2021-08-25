var window = exports.window = require("./window");

for (var property in window) {
    if (global[property] === undefined)
        global[property] = window[property];
    else {
        console.log('\x1b[33m%s\x1b[0m', "Warning: There has been a clash in global variables! " + property);  //yellow

        //system.log.warn("global clash");
    }
}
