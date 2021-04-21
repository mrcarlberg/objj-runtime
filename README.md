Objective-J Runtime
=================

A Node runtime for the [Objective-J][objj] language.

[objj]: http://www.cappuccino-project.org/learn/objective-j.html

It uses an Objective-J to JavaScript [compiler][objj-transpiler] by Martin Carlberg.

[objj-transpiler]: https://github.com/mrcarlberg/ObjJAcornCompiler

## How to use

Install using npm

```
npm install objj-runtime
```

Make sure you have grunt commandline installed. If not install with

```
npm install -g grunt-cli

```

Compile and build the runtime with grunt from inside the objj-runtime directory.

```
grunt
```

Copy a built Cappuccino Foundation framework to the Framework directory. You might need to create the Framework directory inside the objj-runtime directory.

Create an Objective-J main.j file

```
@import <Foundation/Foundation.j>

@implementation MyClass : CPObject

- (CPString)myMethod {
    return [CPString stringWithFormat:@"Node version: %@", process.version];
}

@end

function main(args, namedArgs)
{
    console.log("Hello World");
    console.log([[[MyClass alloc] init] myMethod]);
}
```

Compile and run
```
bin/objj main.j
```

You can debug with the node-inspector and Chrome.

```
node --inspect-brk bin/objj main.j
```

A framework that is already built can be use if placed inside the Framework directory.

To update the Objective-J runtime you need to copy the files from the Cappuccino Objective-J directory into the Objective-J directory. (This will not work yet as there are some changes to the Objective-J runtime that is not pushed to the Cappuccino project. Should work if you merge in your changes)

Compile and build the runtime with grunt

```
grunt
```

There are many things that don't work yet. For example you can't just compile your files. You have to compile and run.

## Example

Example of very simple backend webserver in Objective-J can be downloaded [here][objj-node-webserver] as a zip file.

[objj-node-webserver]: http://mini.carlberg.org/dev/objj-node-webserver.zip

Start the backend webserver from the command prompt with
```
bin/objj main.j
```

From another command prompt json data can be stored with:
```
curl 127.0.0.1:1337/Name/42 -d '{"name": "martin"}'
```

It can be retrieved with:
```
curl 127.0.0.1:1337/Name/42
```

The url uses a pattern with entity and identifier for storage. It looks like this:
```
curl 127.0.0.1:1337/<entity>/<identifier>
```
