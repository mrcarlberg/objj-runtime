Objective-J Runtime
=================

A Node runtime for the [Objective-J][objj] language.

[objj]: http://www.cappuccino-project.org/learn/objective-j.html

It uses an Objective-J to JavaScript [compiler][objj-transpiler] by Martin Carlberg.

[objj-transpiler]: https://github.com/mrcarlberg/ObjJAcornCompiler

## How to use

Compile and build the runtime with grunt

```
grunt
```

Copy the Cappuccino Foundation framework to the Framework directory

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
node --debug-brk bin/objj main.j
```

A framework that is already built can be use if placed inside the Framework directory.

To update the Objective-J runtime you need to copy the files from the Cappuccino Objective-J directory into the Objective-J directory. (This will not work yet as there are some changes to the Objective-J runtime that is not pushed to the Cappuccino project. Should work if you merge in your changes)

Compile and build the runtime with grunt

```
grunt
```

There are many things that don't work yet. For example you can't just compile your files. You have to compile and run.