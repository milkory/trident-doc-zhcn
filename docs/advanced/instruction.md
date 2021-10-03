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

## `return`
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