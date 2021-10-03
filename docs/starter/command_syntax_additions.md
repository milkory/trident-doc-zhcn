# 命令语法增强

## 方块

You can use interpolation blocks wherever a block is required. However, you may also want to  overwrite some of the values of the block in that variable. You can do so, simply by appending a blockstate and/or a tag compound after the first interpolation block. Example:
```tdn
var blockVar = block<chest[facing=east]{Lock:"Key"}>

setblock ~ ~ ~ $blockVar{CustomName:'"Treasure Chest"'}
setblock ~ ~ ~ $blockVar[waterlogged=true]{CustomName:'"Treasure Chest"'}
setblock ~ ~ ~ $blockVar[facing=north,waterlogged=true]
setblock ~ ~ ~ $blockVar{Lock:"Different Key"}

# Equivalent to:
setblock ~ ~ ~ chest[facing=east]{
        Lock:"Key",
        CustomName:'"Treasure Chest"'
}
setblock ~ ~ ~ chest[waterlogged=true,facing=east]{
        Lock:"Key",
        CustomName:'"Treasure Chest"'
}
setblock ~ ~ ~ chest[waterlogged=true,facing=north]{
        Lock:"Key"
}
setblock ~ ~ ~ chest[facing=north]{Lock:"Different Key"}
```
Just like in the vanilla syntax, blockstates or NBT segments in a block literal should be attached directly to the name, without whitespace in between.


## 物品
Trident adds a shorthand for CustomModelData for items. Simply append a hash sign (#), followed by the custom model data number, to the end of the item name, and before the NBT (if any). Example:
```tdn
give @a stick#5

# Equivalent to:
give @a stick{CustomModelData:5}
```
You can use interpolation blocks wherever an item is required. Just like blocks, you may also want to overwrite some values in the NBT of the item in that variable. You can do so, simply by appending a tag compound after the first interpolation block. Example:
```tdn
var itemVar = item<stick#5>

give @a $itemVar{HideFlags:63}
give @a $itemVar#8{HideFlags:63}

# Equivalent to:
give @a stick{CustomModelData:5,HideFlags:63}
give @a stick{HideFlags:63,CustomModelData:8}
```
Just like in the vanilla syntax, NBT segments in an item literal should be attached directly to the name, without whitespace in between.


## 实体定义
Trident uses a common format to refer to an entity type to create. It contains information about the entity type to spawn, its entity components and its NBT data, where the latter two are optional. The entity type can also be a custom entity.
This format is used in the `summon` command, `using summon` and `default passengers` in a custom entity.
Examples:
```tdn
summon armor_stand
summon armor_stand[componentA, componentB] ~ ~ ~
summon armor_stand{Glowing:1b} ~ ~ ~
summon $guard[componentA, componentB]{Glowing:1b} ~ ~ ~

define entity block_hitbox minecraft:armor_stand {
    default passengers [
        shulker[invisible]{NoAI:1b}
    ]
    # ...
}
```

New-entity-literals can also be NBT Compounds inside Interpolation Blocks, so long as there is an "id" tag inside, containing the entity type to spawn. Example:
```tdn
summon ${nbt<{id:"minecraft:skeleton",Glowing:1b}>}
# Turns into:
summon minecraft:skeleton ~ ~ ~ {Glowing:1b}
```

## 选择器
You can use interpolation blocks wherever an entity is required. However, you may want to add more selector arguments to the selector. You can do so, simply by appending selector arguments after the first interpolation block. 
**Note**: This will **add** the given selector arguments, and it will not override old ones if that selector type is repeatable. It will also try to merge `scores` and `advancements` arguments. Example:
```tdn
var entityVar = entity<@e[type=pig,tag=selected,scores={scoreA=5}]>

tp $entityVar[tag=new] @s
tp $entityVar[tag=new,scores={scoreB=3}] @s

# Equivalent to:
tp @e[type=pig,tag=selected,scores={scoreA=5},tag=new] @s
tp @e[type=pig,tag=selected,tag=new,scores={scoreA=5,scoreB=3}] @s
```
Just like in the vanilla syntax, a selector argument block in a selector should be attached directly to the selector header, without whitespace in between.

### `score: isset`
Trident adds a shorthand to the score execute argument that evaluates to true if a score is set, by matching it against the entire integer range. Example:
```tdn
if entity @s[scores={id=isset}] say ID is set

# Equivalent to:
if entity @s[scores={id=..2147483647}] say ID is set
```

## 命令
### `set`
Trident adds a shorthand command that unifies operations to and from scores and NBT.
The syntax is `set <pointer: target> <operator> <pointer: source>`.
Alternatively, the source pointer can be replaced with an NBT value.
Refer to [Interpolation Values > Pointers]() to learn about pointers and their syntax.

This is a table showing what each combination of pointer/value type translates into:

| Target Type | Operator | Source Type | Transformed into                                                                                                                           |
|:-----------:|:--------:|:-----------:|:------------------------------------------------------------------------------------------------------------------------------------------ |
|    SCORE    |    =     |    SCORE    | `scoreboard players operation A = B`                                                                                                       |
|    SCORE    |    =     |    VALUE    | `scoreboard players set A B`                                                                                                               |
|    SCORE    |    =     |     NBT     | `store result score A data get B`                                                                                                          |
|     NBT     |    =     |    SCORE    | `store result A scoreboard players get B`                                                                                                  |
|     NBT     |    =     |    VALUE    | `data modify A set value B`                                                                                                                |
|     NBT     |    =     |     NBT     | `# When: scale A * scale B == 1:`<br/>`data modify A set from B`<br/>`# When: scale A * scale B != 1:`<br/>`store result A * data get B *` |
|    SCORE    |    +=    |    SCORE    | `scoreboard players operation A += B`                                                                                                      |
|    SCORE    |    +=    |    VALUE    | `scoreboard players add A B`                                                                                                               |
|    SCORE    |    -=    |    SCORE    | `scoreboard players operation A -= B`                                                                                                      |
|    SCORE    |    -=    |    VALUE    | `scoreboard players remove A B`                                                                                                            |
|    SCORE    |    *=    |    SCORE    | `scoreboard players operation A *= B`                                                                                                      |
|    SCORE    |    *=    |    VALUE    | `#[LL2]`<br/>`scoreboard players operation A *= #B trident_const`                                                                          |
|     NBT     |    *=    |    VALUE    | `store result A data get A *B`                                                                                                             |
|    SCORE    |    /=    |    SCORE    | `scoreboard players operation A /= B`                                                                                                      |
|    SCORE    |    /=    |    VALUE    | `#[LL2]`<br/>`scoreboard players operation A /= #B trident_const`                                                                          |
|    SCORE    |    %=    |    SCORE    | `scoreboard players operation A %= B`                                                                                                      |
|    SCORE    |    %=    |    VALUE    | `#[LL2]`<br/>`scoreboard players operation A %= #B trident_const`                                                                          |
|    SCORE    |    <     |    SCORE    | `scoreboard players operation A < B`                                                                                                       |
|    SCORE    |    <     |    VALUE    | `#[LL2]`<br/>`scoreboard players operation A < #B trident_const`                                                                           |
|    SCORE    |    >     |    SCORE    | `scoreboard players operation A > B`                                                                                                       |
|    SCORE    |    >     |    VALUE    | `#[LL2]`<br/>`scoreboard players operation A > #B trident_const`                                                                           |
|    SCORE    |    <>    |    SCORE    | `scoreboard players operation A <> B`                                                                                                      |
|    SCORE    |    =     |    null     | `scoreboard players reset A`                                                                                                               |
|     NBT     |    =     |    null     | `data remove A`                                                                                                                            |

For arithmetic operations between a score and a value, an objective `trident_const` is created and initialized with all the constants used in the project. That way, scoreboard operations can simply use the fake players to get a score with a constant. This requires a language level of at least 2.

Example:
```tdn
set @s->altitude = @s->prev_altitude
set @s->altitude = @s.Pos[1] * 100
set #OPERATION->global -= 64
set #OPERATION->global *= 8

set (-30000 0 0).RecordItem.tag.nextVariant (int) = #RANDOM->global
set @s.Variant = (-30000 0 0).RecordItem.tag.nextVariant
set @s.HandItems[0] = {id:"minecraft:bow",Count:1b}

# Equivalent to:
scoreboard players operation @s altitude = @s prev_altitude

store result score @s altitude
    data get entity @s Pos[1] 100

scoreboard players remove #OPERATION global 64
scoreboard players operation #OPERATION global *= #8 trident_const

store result block -30000 0 0 RecordItem.tag.nextVariant int 1
    scoreboard players get #RANDOM global

data modify entity @s Variant set from block -30000 0 0 RecordItem.tag.nextVariant

data modify entity @s HandItems[0] set value {id:"minecraft:bow",Count:1b}
```

### `tag update`
*__[LL2]__ This feature may only be used if the project's language level is at least 2*
Trident adds a shorthand for removing a tag from all entities and reapplying it only to specific entities. Example:
```tdn
tag @e[nbt={OnGround:1b}] update onGround

# Equivalent to:
tag @e remove onGround
tag @e[nbt={OnGround:1b}] add onGround
```
### `component`
This component command is similar in use to the tag command, but its purpose is to add and remove custom entity components. See [Entity Components > Component add/remove command]().

### `event`
This event command is used to invoke an event on certain entities. See [Abstract Entity Events]().

### `summon`
The summon command syntax has been modified so that it uses New-Entity literals. As a result, you can append a list of entity components to add to the summoned entity, as well as specify the NBT of the spawned entity while omitting the coordinates. See [Command Syntax Additions > New-Entity literal](). The default syntax for the summon command is still valid, however.

### `expand`
The `expand` command applies the same set of modifiers to multiple commands in a block.
Syntax:
```tdn
expand {
    # Commands go here:
}
```
Example:
```tdn
if entity @e[tag=!assigned] expand {
    function try_assign_0
    function try_assign_1
    function try_assign_2
    function try_assign_3
}
# Equivalent to:
if entity @e[tag=!assigned] function try_assign_0
if entity @e[tag=!assigned] function try_assign_1
if entity @e[tag=!assigned] function try_assign_2
if entity @e[tag=!assigned] function try_assign_3
```
It's advised you only use this when you expect the condition to be invalidated somewhere in the block to stop the other commands from running. If you want all the commands in the block to run if the condition is met, consider using functions instead.

### `gamelog`
*__[LL2]__ This feature may only be used if the project's language level is 3*
Trident adds a runtime equivalent of the [log instruction](). This lets you send debug messages to select people, containing information about the execution context of the command. The syntax is `gamelog <info|debug|warning|error|fatal> <value>`.
The different severities correspond to an integer, and a message of a certain severity will only be shown to players whose `tdn_logger` score is at least the severity number.
This is a table showing which type of log each player sees, depending on the `tdn_logger` score:
```
tdn_logger 0  : none
tdn_logger 1  : fatal
tdn_logger 2  : fatal, errors
tdn_logger 3  : fatal, errors, warnings
tdn_logger 4  : fatal, errors, warnings, info
tdn_logger 5  : fatal, errors, warnings, info, debug
tdn_logger 6  : debug
```

Example:
```tdn
gamelog debug "Picked up item"
gamelog info "Module loaded"
gamelog warning "Jukebox at origin not found, replacing..."
gamelog error "Command limit reached"
gamelog fatal "Did /kill @e"
```
Result:
![some picture here]()
You may customize the style of these messages via the project configuration file (.tdnproj), within the game-logger object.
- `compact: true` will reduce the information shown (by default false):
  ![another pic here]()
- `timestamp-enabled: true` will show the game time (by default true). For non-compact messages, it will be in the format: `dd/hh:mm:ss.t` where dd is days, hh is hours, mm is minutes, ss is seconds and t is ticks. For compact messages, the format is `hh:mm:ss.t`.
- `pos-enabled: true` will show the block at which the command was executed (by default true).
- `line-number-enabled: true` will show the line number where the gamelog command is located. **Note that this line number is for the Trident file the command is located in, not the function it's in.** By default false.

The gamelog messages show a variety of information in addition to the description, such as the execution time, message severity, function file, command sender, execution position and project name. Note that some of these may or may not be present depending on the project configuration.

## `execute` 子命令
### `(if|unless) score: isset`
Trident adds a shorthand to the score condition modifier that evaluates to true if a score is set, by matching it against the entire integer range. Example:
```tdn
if score @s id isset say ID is set

# Equivalent to:
if score @s id matches ..2147483647 say ID is set
```
### `(if|unless) selector`
Trident adds a shorthand to the entity condition modifier. You can omit the entity keyword if you use a selector. Example:
```tdn
if @s[tag=valid] say Valid

# Equivalent to:
if entity @s[tag=valid] say Valid
```
### `raw`
The execute modifier version of verbatim commands. Takes a string literal or an interpolation block (containing either a string or a list of strings) as a parameter. See [Raw Modifiers](). Example:
```tdn
raw "if block ~ ~-1 ~ minecraft:future_block" tp @s ~ 127 ~
```