## `while`
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
## `for`
The `for` instruction runs an entry block repeatedly based on a compile time expression, just like `while`, except `for` supports different headers for different uses.
Syntax:
```tdn
for(<loop_header>) {
    <commands and instructions...>
}
```

### Classic Header
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
### Iterator Header
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

## `break`
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
## `continue`
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