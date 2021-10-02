# 指令
Instructions in Trident typically alter the state of the program during compilation, or generate many commands or functions at once. As such, they cannot be used with execute modifiers, as they are not commands.
## `log`
The log instruction is used to display information after the project has finished compiling. In command-line based systems, this may be in the form of text in the console. In the official [Trident UI](), these logs will appear in a panel at the bottom of the program, which allow you to quickly jump to the location it was logged from.
There are different types of messages you can log: `info`, `warning` and `error`.
None of these will halt the execution of the program, but the latter (`error`) will prevent the output data pack and resource pack from generating.
Syntax:
```tdn
log <info|warning|error> <value>
```
Example:
```tdn
log info "Added  " + i + " to the list"
```

## `using`
### `using tag`
*__[LL2]__ This feature may only be used if the project's language level is at least 2*
Tags on entities are often used temporarily to target a specific entity without changing the context. This requires adding and removing the tag from the entity. Trident adds an instruction that makes this process easier. The using tag instruction runs a specific block after adding a tag to the entity given, and automatically adds the tag remove command at the end. Note that the tag is removed from all entities at the end, so don't use a tag that is used permanently somewhere else.
Syntax:
```tdn
using tag <tag_to_use> <entity_to_tag> <optional_modifiers> {
    # Commands in the middle go here:
}
```
Examples:
```tdn
using tag needs_id @e[scores={id=0},limit=1] {
    scoreboard players operation @e[tag=needs_id] id > * id
    tellraw @a ["ID assigned to ", {"selector":"@e[tag=needs_id]"}]
}
# Equivalent to:
tag @e[scores={id=0},limit=1] add needs_id
scoreboard players operation @e[tag=needs_id] id > * id
tellraw @a ["ID assigned to ", {"selector":"@e[tag=needs_id]"}]
tag @e remove needs_id
```
```tdn
using tag needs_id @e[scores={id=0},limit=1] if block ~ ~-1 ~ air {
    scoreboard players operation @e[tag=needs_id] id > * id
    tellraw @a ["ID assigned to ", {"selector":"@e[tag=needs_id]"}]
}
# Equivalent to:
as @e[scores={id=0},limit=1] if block ~ ~-1 ~ air tag @s add needs_id
scoreboard players operation @e[tag=needs_id] id > * id
tellraw @a ["ID assigned to ", {"selector":"@e[tag=needs_id]"}]
tag @e remove needs_id
```

### `using summon`
*__[LL2]__ This feature may only be used if the project's language level is at least 2*  
Another common use of temporary tags is targeting a newly summoned entity. Trident makes this much easier by adding a function block that runs `as` the summoned entity. The selector targeting the entity with the tag is optimized whenever possible so that it only targets entities close to the summoning location.
Syntax:
```tdn
using <summon_command> with <tag_to_use> <optional_modifiers> {
    # Commands in the middle go here:
}
```
Example (without modifiers):
```tdn
using summon armor_stand ~-3 0 ~4 {
        CustomName:'"guard_model"',
        CustomNameVisible:1b,
        Tags:["entity_model"]
    }
    with new {
        set @s->id = NEXT_ID->global
        scoreboard players add NEXT_ID global 1
        set @s->cooldown = 0
        set @s->jump_time = 0
    }

# Equivalent to:
summon armor_stand ~-3 0 ~4 {
    CustomName:'"guard_model"',
    CustomNameVisible:1b,
    Tags:["entity_model","new"]
}

as @e[type=armor_stand,tag=new,limit=1,y=0,distance=4.99..5.01] function {
    tag @s remove new
    set @s->id = NEXT_ID->global
    scoreboard players add NEXT_ID global 1
    set @s->cooldown = 0
    set @s->jump_time = 0
}
```

Example (with modifiers):
```tdn
using summon armor_stand ~-3 0 ~4 {
        CustomName:'"guard_model"',
        CustomNameVisible:1b,
        Tags:["entity_model"]
    }
    with new
    if score ID_ENABLED global matches 1.. {
        set @s->id = NEXT_ID->global
        scoreboard players add NEXT_ID global 1
        set @s->cooldown = 0
        set @s->jump_time = 0
    }

# Equivalent to:
summon armor_stand ~-3 0 ~4 {
    CustomName:'"guard_model"',
    CustomNameVisible:1b,
    Tags:["entity_model","new"]
}

as @e[type=armor_stand,tag=new,limit=1,y=0,distance=4.99..5.01] function {
    tag @s remove new
    if score ID_ENABLED global matches 1.. function {
        set @s->id = NEXT_ID->global
        scoreboard players add NEXT_ID global 1
        set @s->cooldown = 0
        set @s->jump_time = 0
    }
}
```
Trident will create at least one extra function for the using summon block, and it will use two only if necessary (e.g. if one of the modifiers specified may cause the command not to run, like conditionals if and unless). It will only create one extra function if modifiers likely wouldn't change the execution condition (e.g. `at @s`)

## `eval`
The eval instruction is used to evaluate an interpolation value or expression that might change the state of the program.
Syntax:
```tdn
eval <value_or_expression>
```
Example:
```tdn
var count = 0
eval count += 4
eval someFunction(count)
```

## `within`
The `within` instruction makes it easy to write commands that run at every block in a volume. This is done by assigning coordinates to a variable inside a loop, similar to a foreach loop in many languages.
Syntax:
```tdn
within <identifier> <coordinates:from> <coordinates:to> {
    # Commands using the coordinates go here:
}
```
Example:
```tdn
within pos ~-1 ~ ~-1 ~1 ~ ~1 {
    positioned $pos if block ~ ~ ~ hopper summon armor_stand
}
# Equivalent to:
positioned ~-1 ~  ~-1 if block ~ ~ ~ hopper summon armor_stand
positioned ~-1 ~  ~   if block ~ ~ ~ hopper summon armor_stand
positioned ~-1 ~  ~1  if block ~ ~ ~ hopper summon armor_stand
positioned ~   ~  ~-1 if block ~ ~ ~ hopper summon armor_stand
positioned ~   ~  ~   if block ~ ~ ~ hopper summon armor_stand
positioned ~   ~  ~1  if block ~ ~ ~ hopper summon armor_stand
positioned ~1  ~  ~-1 if block ~ ~ ~ hopper summon armor_stand
positioned ~1  ~  ~   if block ~ ~ ~ hopper summon armor_stand
positioned ~1  ~  ~1  if block ~ ~ ~ hopper summon armor_stand
```
You may also specify the step by which to increase the coordinates. By default, the step is 1, but you can overwrite it by adding `step <real>` after the coordinates.
Example:
```tdn
within pos ~-16 ~ ~-16 ~15 ~ ~15 step 16 {
    positioned $pos fill ~ ~ ~ ~14 ~ ~14 white_stained_glass
}
# Equivalent to:
positioned ~-16 ~   ~-16 fill ~ ~ ~ ~14 ~ ~14 white_stained_glass
positioned ~-16 ~   ~    fill ~ ~ ~ ~14 ~ ~14 white_stained_glass
positioned ~-16 ~   ~16  fill ~ ~ ~ ~14 ~ ~14 white_stained_glass
positioned ~    ~   ~-16 fill ~ ~ ~ ~14 ~ ~14 white_stained_glass
positioned ~    ~   ~    fill ~ ~ ~ ~14 ~ ~14 white_stained_glass
positioned ~    ~   ~16  fill ~ ~ ~ ~14 ~ ~14 white_stained_glass
positioned ~16  ~   ~-16 fill ~ ~ ~ ~14 ~ ~14 white_stained_glass
positioned ~16  ~   ~    fill ~ ~ ~ ~14 ~ ~14 white_stained_glass
positioned ~16  ~   ~16  fill ~ ~ ~ ~14 ~ ~14 white_stained_glass
```
Coordinates used in the `within` instruction may have mixed coordinates, but the coordinate types of each axis must match.
```tdn
# This is allowed:
# Relative Absolute Absolute - Relative Absolute Absolute
within pos ~-1 0 10 ~1 15 12 {
    # ...
}

# This is NOT allowed:
# Relative Relative Absolute - Relative Absolute Absolute
within pos ~-1 ~ 10 ~1 15 12 {
    # ...

```

## 流程控制
### `if-else`
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

### `while`
The `while` instruction runs an entry block repeatedly based on a compile time expression, if it evaluates to the boolean value `true`.
Syntax:
```tdn
while(<expression>) {
    <commands and instructions...>
}
```
Examples:
```tdn
var counter = 3
while(counter > 0) {
    give @s stick $counter
    eval counter--
}

# Equivalent to the following:
var counter = 3
give @s stick $counter
eval counter--             # counter is now 2
give @s stick $counter
eval counter--             # counter is now 1
give @s stick $counter
eval counter--             # counter is now 0

# Ultimately evaluates to:
give @s stick 3
give @s stick 2
give @s stick 1
```
### `for`
The `for` instruction runs an entry block repeatedly based on a compile time expression, just like `while`, except `for` supports different headers for different uses.
Syntax:
```tdn
for(<loop_header>) {
    <commands and instructions...>
}
```

#### Classic Header
The classic header `for` the for instruction has three expressions separated by semicolons: the initializer, the condition and the iterator. The **initializer** expression is evaluated once at the beginning of the loop. The **condition** expression is evaluated before every loop and it should evaluate to a boolean: true if the loop should continue, false if the loop should end. The **iterator** expression is evaluated after every loop. Syntax:
```tdn
for(<initializer>;<condition>;<iterator>) {
    <commands and instructions...>
}
```
Example:
```tdn
for(var i = 0; i < 5; i++) {
    worldborder add $i
}

# Equivalent to the following:
var i = 0
worldborder add $i
eval i++             # i is now 1
worldborder add $i
eval i++             # i is now 2
worldborder add $i
eval i++             # i is now 3
worldborder add $i
eval i++             # i is now 4
worldborder add $i
eval i++             # i is now 5

# Ultimately evaluates to:
worldborder add 0
worldborder add 1
worldborder add 2
worldborder add 3
worldborder add 4
```
#### Iterator Header
The iterator header for the `for` instruction runs the entry block for every element in an iterable value (list, dictionary). It creates a temporary variable that will contain the elements of the iterator. Syntax:
```tdn
for(<temp_var_name> in <iterable>) {
    <commands and instructions...>
}
```
Example:
```tdn
var items = [item<stick>,item<glass>,item<bow>,item<arrow>]
for(itm in items) {
    give @s $itm
}

# Ultimately evaluates to:
give @s stick
give @s glass
give @s bow
give @s arrow
```
### `switch`
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
### `break`
The `break` instruction is used in conjuction with looping instructions or switch.
In loops, `break` will forcefully exit out of the innermost loop, even if the condition still matches.
In switch, it will forcefully exit the innermost switch instruction. Any entries after the `break`, and still inside the structure it exits, will not be evaluated.
Syntax:
```tdn
break
```
Example:
```tdn
var counter = 3
while(counter > 0) {
    give @s stick $counter
    eval counter--
    break
}

# Equivalent to the following:
var counter = 3
give @s stick $counter
eval counter--             # counter is now 2

# Ultimately evaluates to:
give @s stick 3
```
### `continue`
The `continue` instruction is used in conjuction with looping instructions.
`continue` will end the current iteration and begin the next, if possible. Conditions will still determine if the next iteration runs or not. In the classic `for` header, the iteration expression will still run after a `continue`.
Any entries after the `continue`, and still inside the loop it affects, will not be evaluated.
Syntax:
```tdn
continue
```
Example:
```tdn
for(var i = 0; i < 5; i++) {
    if(i == 3) {
        continue
    }
    worldborder add $i
}

# Equivalent to the following:
var i = 0
worldborder add $i
eval i++             # i is now 1
worldborder add $i
eval i++             # i is now 2
worldborder add $i
eval i++             # i is now 3
eval i++             # i is now 4
worldborder add $i
eval i++             # i is now 5

# Ultimately evaluates to:
worldborder add 0
worldborder add 1
worldborder add 2
worldborder add 4
```
#### `return`
The `return` instruction is used in conjuction with dynamic functions, and is used to transfer the result of an operation to the environment that called it.
`return` will forcefully exit from the dynamic function that contains it.
Any entries after the `return`, and still inside the dynamic function it's in, will not be evaluated.
Syntax:
```tdn
return <optional_value>
```
If the return value is omitted, it defaults to `null`.
Example:
```tdn
var min = function(a, b) {
    if(a < b) {
        return a
    } else {
        return b
    }
    # This line never runs
}

log info min(12, 4) # Logs 4
```

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