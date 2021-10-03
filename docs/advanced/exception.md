## Exceptions
### `try-catch`
The `try-catch` instruction is used to handle exceptions thrown inside an entry block. Exceptions in the try block will halt execution of that block and will jump to the catch block.
The catch block will not run if no exception was caught in the try block.
Syntax:
```tdn
try {
    <commands and instructions...>
} catch(<identifier: exception_var_name>) {
    <commands and instructions...>
}
```
Examples:
```tdn
try {
    eval 1 / 0
    eval null.property
} catch(ex) {
    # ex contains an exception
    log info ex

    # Prints the following:
    # Arithmetic Error: / by zero
    #     at stt:documentation_test ~ <body>
}
```
The standard try-catch block stops execution after the first exception has been caught, and holds that exception in the variable specified in the catch block.

Also see: [Data Types > Exceptions]()

### `try-recovering-catch`
The `try-recovering-catch` instruction is a variation of the try-catch instruction, where the only difference is, after catching an exception in the try block, it will continue execution until it reaches the end. After that, the variable specified in the catch block will contain a list of exceptions, collected from the try block.
The catch block will not run if no exceptions were caught in the try block.
Syntax:
```tdn
try recovering {
    <commands and instructions...>
} catch(<identifier: exception_var_name>) {
    <commands and instructions...>
}
```
Examples:
```tdn
try recovering {
    eval 1 / 0
    eval null.property
} catch(gx) {
    # gx contains a list of exceptions
    log info gx

    # Prints the following:
    # [Arithmetic Error: / by zero, Type Error: Unexpected null value]
}
```
try-recovering-catch blocks behave more similarly to entries outside any exception handling block, as an error in a single command will not stop later commands from logging their errors. However, unlike entries outside of it, try-recovering blocks will 

Also see: [Data Types > Exceptions]()

### `throw`
The `throw` instruction is used to inform the calling environment that an error occurred in the execution of a piece of code, using a string to describe the error, or another exception that has been caught.
`throw` will forcefully exit from the dynamic function that contains it, unless it was called from a `try-recovering` block.
Uncaught exceptions will prevent the output data pack and resource packs from being generated.
Syntax:
```tdn
throw <string: message>
throw <exception>
```
Example:
```tdn
var sqrt = function(x) {
    if(x < 0) {
        throw "Illegal argument 'x', expected non-negative"
    } else {
        # ...
    }
}
```