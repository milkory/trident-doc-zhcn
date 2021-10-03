## `if-else`
(Not to be confused with the `if`/`unless` execute modifiers)
The `if` **instruction** runs an entry block (a list of commands and/or instructions), if and only if a given compile time expression evaluates to the boolean value `true`. You may also specify that, in case the expression above evaluates to false, another entry block should be run instead. 
Syntax:
```tdn
if(<expression>) {
    <commands and instructions...>
} else {
    <commands and instructions...>
}
```
...where the else keyword and the following block are optional.
Examples:
```tdn
var someVar = 5
if(someVar == 5) {
    summon cow
    log info "First block run"
} else {
    summon sheep
    log info "Second block run"
}
log info "Out of if/else blocks"

# Evaluates the following lines:
summon cow
log info "First block run"
log info "Out of if/else blocks"
```

You may omit the curly braces if there is only one entry in the block. Example:
```tdn
if(expr == 5) summon cow
else summon sheep
```
You may see older Trident code using `do if` instead of `if`. It was previously required for compile-time `if`s to have a do keyword before them, to distinguish them from the execute modifier `if`. This restriction has been lifted so if there's an open parenthesis right after the `if`, it is interpreted as a compile-time `if`. For backwards compatibility, `do if` is still allowed, although discouraged.

## `switch`
The `switch` instruction takes a single value, and associates case values to the entry block that should run if the original expression matches that value. Note that once a case has been matched, all the entry blocks after it will run, unless the `break` instruction is used. The optional default case will match any expression value and run the associated block.
Syntax:
```tdn
switch(<expression>) {
    case <match_0>: {
        <commands and instructions...>
    }
    case <match_1>: {
        <commands and instructions...>
    }
    case <match_n>: {
        <commands and instructions...>
    }
    default: {
        <commands and instructions...>
    }
}
```
Example:
```tdn
var someVar = 0
switch(someVar) {
    case 0:
    case 1: {
        log info "someVar is 0 or 1"
        break
    }
    case 2: {
        log info "someVar is 2"
        break
    }
    case 3: {
        log info "someVar is 3"
        break
    }
    default: {
        log info "someVar is not between 0 and 3"
    }
}
# Evaluates the following lines:
log info "someVar is 0 or 1"
```