# 自定义物品
Trident lets you simplify the process of creating "new" item types and modifying existing ones. A custom item starts with a definition specifying its base type (what vanilla item type it uses), its default NBT data, its name, lore, and functions it may want to run. After declaration, you can use its name in place of the `give`/`clear`/`replaceitem`/etc. commands' item type. Here's an example declaration:
```tdn
# file: mypack:items/teleport_wand.tdn
define objective tp_dist

define item teleport_wand minecraft:carrot_on_a_stick#1 {

    default name {"text":"Teleport Wand","color":"aqua","italic":false}

    default lore [
            [
                {"keybind":"key.use","color":"green"},
                " to teleport to where you're looking"
            ]
    ]

    default nbt {Enchantments:[{}]}

    function raytrace {
        scoreboard players remove @s tp_dist 1
        unless block ^ ^ ^1 minecraft:air
            tp @s ~ ~ ~
        unless score @s tp_dist matches ..0
            positioned ^ ^ ^1
            if block ~ ~ ~ minecraft:air
            function /
    }

    on used function {
        set @s->tp_dist = 64
        anchored eyes
            positioned ^ ^ ^
            anchored feet
            function ${this.raytrace}
    }
}
```
The code above is for an item that teleports the player to the block they're looking at when right-clicking with it.
Its declaration defines an item named 'teleport_wand' that is based on a carrot on a stick with `CustomModelData` 1. It defines a default name, default lore and default NBT that will be assigned when given.
As well as these default values, the teleport wand declaration also defines two functions: `raytrace` and an anonymous function.
The `on` keyword before the function tells Trident to run that function whenever a player fires an event using that item (using scoreboard objective criteria, more on that in [Custom Item Functions > Item Event Functions]()) (using `as @a[...] at @s` on the player that fired the event).

Inside the anonymous function, it calls another function called `raytrace`. Notice how that function is accessed via the this identifier, which is set to whatever custom entity type being declared. (see [Interpolation Values > Data Types > Custom Items]())

To give, clear or use this custom item later in the program, all you need is an interpolation block retrieving the custom item. Example:
```tdn
give @a $teleport_wand
clear @a $teleport_wand

# Equivalent to:
give @a minecraft:carrot_on_a_stick{
    TridentCustomItem: -2008252046,
    CustomModelData: 1,
    display: {
        Name: '{"text":"Teleport Wand","color":"aqua","italic":false}',
        Lore: ['[{"keybind":"key.use","color":"green"}," to teleport to where you\'re looking"]']
    },
    Enchantments: [{}]
}
clear @a minecraft:carrot_on_a_stick{
    TridentCustomItem: -2008252046
}
```
Trident uses a `TridentCustomItem` item tag to distinguish custom item types apart. The value of that tag is determined by hashing the string formed after combining the namespace and the item name together.

## 自定义物品声明

Just like Custom Entities, Custom Items are defined by two identifying properties: a name, and a base type. Depending on whether these properties are set, the custom entity will behave differently.

1. **Named custom items** (Has a name and a base type)
    Named custom items define a new item type that doesn't alter the behavior of other vanilla items. The declaration header looks like this:
    ```tdn
    define item <name> <base_type>
    ```
    Example:
    ```tdn
    define item wand minecraft:stick
    ```
    Note: Unlike entities, custom items' base type cannot be another named custom item.

2. **Default custom items** (Has no name but has a base type)
    Default custom entities serve as a way to add functionality to a specific vanilla item type. The declaration header looks like this:
    ```tdn
    define item default <base_type>
    ```
    Example:
    ```tdn
    define item default minecraft:egg
    ```
    Behavior defined inside this example item declaration will affect **all eggs** unless specified otherwise.

There are no item equivalents of entities' wildcard entities and entity components.

## 自定义物品结构体
- [Variable Declarations]().
- `default name <text_component>`
    (Named items only)
    Changes the item's base NBT to contain the given `display.Name`.
- `default lore [<text_component>, <text_component>, ...]`
    (Named items only)
    Changes the item's base NBT to contain the given `display.Lore`.
    Each text component must represent a different line of lore.
- `default nbt <tag_compound>`
    (Named items only)
    Changes the entity's base NBT to contain the tags in the given compound (via a merge operation).
- Inner functions (See next section)

## 自定义物品函数
Custom items support inner functions, as described in the [Object Inner Functions]() section.

### 物品事件函数
***[LL3]*** *This feature may only be used if the project's language level is 3*  

Within custom item bodies, you may specify that an inner function should run whenever a scoreboard criteria event is fired from that item. This is done via the `on` keyword, followed by the type of event it should be fired from.
Those events are: `used`, `dropped`, `picked_up`, `broken` and `crafted` (crafted is not supported for custom items, only default items support it). The actions that trigger these events may vary for each item, depending on how the corresponding scoreboard objective criterion behaves.

Example:
```tdn
# file: mypack:items/demo.tdn
define item demo minecraft:snowball {
    on used function {
        say Used demo snowball
    }
    on dropped function {
        say Dropped demo snowball
    }
    on picked_up if entity @s[tag=pickup_enabled] function {
        say Picked up demo snowball
    }
}
```
The function marked with `on used` will say Used demo snowball in chat whenever a player uses (throws) a snowball internally marked with the item code associated with this custom item. It will create a scoreboard objective named `uitem.12c23c81` with criterion `minecraft.used:minecraft.snowball`. Whenever that score increases for a player, it runs the corresponding function only if they were holding the demo item a tick earlier (that check doesn't occur with **default** items).
A similar process occurs with the other two functions declared in the item body.

#### Pure Events
For default items, you may want to limit certain events to non-custom items. You can achieve this by adding the `pure` keyword after the event key. Example:
```tdn
# file: mypack:items/demo.tdn
define item demo minecraft:snowball {
    # ...
}

define item default minecraft:snowball {
    on used pure function {
        say Used pure snowball
    }
    on used function {
        say Used snowball
    }
}
```
With this second item declaration, all snowballs thrown, custom or not, will print the message "Used snowball". Every non-custom snowball thrown will print the message: "Used pure snowball". Consider the following scenarios:

Player named Foo throws a default snowball (such as from the creative inventory). Chat:
```	
[Foo] Used pure snowball
[Foo] Used snowball
```

Player named Foo throws a `$demo` snowball. Chat:
```
[Foo] Used demo snowball
[Foo] Used snowball
```

----

# 特殊命令语法
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
***[LL2]*** *This feature may only be used if the project's language level is at least 2*
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
***[LL3]*** *This feature may only be used if the project's language level is 3*
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

## `execute` 修饰器
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
***[LL2]*** *This feature may only be used if the project's language level is at least 2*
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
***[LL2]*** *This feature may only be used if the project's language level is at least 2*
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

# Variables
You can declare variables to use in commands with the following syntax:
```tdn
[<visibility>] [<final>] var <identifier> [ : [<constraint>]] = <value>
```
Where visibility is optional, and specifies the visibility of the variable to other files (see [Variable Visibility]()). If not specified, defaults to local.
The identifier is the name of the variable it is creating.
The value is an Interpolation Value (such as integers, real numbers, strings, booleans, null, etc.) to assign to the variable (see [Interpolation Values]())
You can access variables from commands using Interpolation Blocks, which we’ll cover later (see [Interpolation Blocks]()).

If you specify `final` before the `var` keyword, the variable will only be able to change its value once. Any further attempts to change the value in this variable will fail.
## Variable Visibility
There are three main modes of variable visibility, which affect how files other than the declaring one can access the variable. They are:
1. `private`: Only the declaring file can access the symbol.
   In the context of Class members, private visibility means only the defining class can access it.
2. `local`: Only the declaring file and files which `@require` the declaring file can use it. This is the default for variables declared with `var`.
   In the context of Class members, local means only the declaring file and subclasses can access this symbol.
3. `global`: Any file can see the variable without any `@require` directives, as long as the declaring file is read before. This is the default for custom items and entities.
   This cannot be used for Class members.
4. `public`: Only usable by Class members. Public visibility means any file can access this symbol.


# Type Constraints
Variables and other symbols (such as function parameters and return values) can be constrained to be a certain type.
A type constraint has two properties:
1. The Type. This is the type definition that the values MUST be an instance of. If a type constraint has no type, it will accept any type of value.
   The type may be a primitive or a user-defined class.
2. Nullability: If the type constraint is nullable, it will accept null values as well as whatever type is assigned to it. If the type constraint is not nullable, attempting to assign a null value to it will result in an exception. In a type constraint literal, this is represented as a question mark after the type. Omitting the question mark will make the type constraint not nullable.

Assigning to a type-constrained symbol will check the type of the value before assigning, and throw an exception if the value doesn't conform to the constraints.

A type constraint is declared by using a colon `:`, followed by the type to constraint to and, optionally, a question mark `?` to mark it nullable.
Example using variables:
```tdn
var someInt : int = 3                    # OK
var someString : string = "a"            # OK
var someNullableString : string? = "b"   # OK

eval someInt = 5                # OK
eval someInt = ""               # ERROR

eval someString = "c"           # OK
eval someString = null          # ERROR

eval someNullableString = "d"   # OK
eval someNullableString = null  # OK
```
Assignment will also check if the value can be implicitly converted into the target type, and automatically perform the conversion. Some primitive types have implicit conversions defined, such as int to real. Example:
```tdn
var someReal : real = 3.0  # OK
eval someReal = 5         # OK
```
If a type constraint isn't defined for a symbol, it defaults to a constraint that can accept any value of any type, null or not.
```tdn
var anything  = 3.0   # OK
eval anything = "ab"  # OK
eval anything = null  # OK
```
## Inferred Constraints
Some symbol definitions allow the constraints to be inferred by the initial value, such as variable definitions and field definitions.
This is done by using a colon `:` but omitting the type. A type constraint will be created using the type definition of the initial value assigned to it. Note that constraints cannot be inferred for null initial values.
Example:
```tdn
var symbolA : = 3       # Constrained to int
var symbolB : = 3.0     # Constrained to real
var symbolC : = "ab"    # Constrained to string
var symbolD : = null    # ERROR
```

# Type Checking and Type Conversion
You may come across a situation where you'd like to check the type of a variable before doing any operations with it. Trident has a special operator specifically for this.
## `is` operator
The `is` operator is a simple binary operator that takes a value on the left, and a type on the right (can be a primitive or a custom class). This operator will return `true` if the value given is of the specified type, either the exact type or another type that extends the one specified. Otherwise it will return `false`. Null values will always return `false`.
Note that this operator will **not** check whether the value can be coerced into the given type.
Example:
```tdn
log info 5    is int       # logs true
log info "a"  is string    # logs true
log info 5    is real      # logs false
log info 5.0  is real      # logs true
log info null is string    # logs false
```
Another way that might be useful is the [`type_definition.of()`]() function, which will return the exact type of the value given.

You might also need to convert a value into a certain type, and some types may have ways to convert a value into another of a different type. For instance, you may want to convert an integer into a string, a string into a text component, a real number into a real number range, etc.
This can be done via **casting**, and there are two ways to do it:
## Strict casting
This is done by prepending the type in parenthesis to the value you want to cast. Strict casting will attempt to convert the value into the target type, and it will throw an exception if the type does not support casting to the target type.
Example:
```tdn
log info (real) 5           # 5.0
log info (tag_byte) 1       # 1b
log info (int) 2.8          # 2
log info (nbt_path) null    # null
log info (tag_byte) "foo"   # ERROR
```
## Weak casting (`as` operator)
The `as` operator is a binary operator that does almost exactly the same as casting, except that if the value is unable to be cast to the target type, it will return null instead of throwing an error.
Example:
```tdn
log info 5     as real       # 5.0
log info 1     as tag_byte   # 1b
log info 2.8   as int        # 2
log info null  as nbt_path   # null
log info "foo" as tag_byte   # null
```

----

# Interpolation Values
## Data Types
### Integers
*Identifier:* `int`
Integer values represent any kind of 4-byte integer number with a range from $-2^{31}$ to $2^{31}-1$ , inclusive. An integer value can be created via a number literal like so:
```tdn
var someInt = 3
var anotherInt = -72
clear @s minecraft:stone $someInt
```
Integers can be used in interpolation blocks in commands or instructions, in places where an integer is typically needed (such as the give command item count, effect give duration, etc.).

Integer literals may also be specified in binary form as well as hexadecimal, with 0b and 0x prefixes respectively. Example:
```tdn
var someInt = 0b0101  # 5
var anotherInt = 0xFF # 255
```

#### Conversions
- `real` (explicit & **implicit**): A real with the same value as this integer.
- `int_range` (explicit & **implicit**): An integer range with min and max set to this integer.
- `real_range` (explicit & **implicit**): A real range with min and max set to this integer.
- `nbt_value` & `tag_int` (explicit): An int tag with the same value as this integer.
- `tag_byte` (explicit): A byte tag with the same value as this integer (adjusted into the byte range with modulo).
- `tag_short` (explicit): A short tag with the same value as this integer (adjusted into the short range with modulo).
- `tag_float` (explicit): A float tag with the same value as this integer.
- `tag_double` (explicit): A double tag with the same value as this integer.
- `tag_long` (explicit): A long tag with the same value as this integer.
- 
### Reals
*Identifier:* `real`
Real values represent any real number that can be stored in an 8-byte double-precision floating-point number. A real value can be created via a number literal with a decimal point like so:
```tdn
var pitch = 0.5
var someReal = 1000.04
playsound minecraft:ui.button.click master @a ~ ~ ~ 1 $pitch 0
```
Real numbers can be used in interpolation blocks in commands or instructions, in places where a real number is typically needed (such as the playsound volume and pitch, spreadplayers distance, etc.).

Real literals may also be specified in engineering notation
Example:
```tdn
var someReal = 1.5e+3    # 1500.0
var anotherReal = 1.5e-3 # 0.0015
```
#### Conversions
- `int` (explicit): An integer value with the result of truncating this real number.
- `real_range` (explicit & **implicit**): A real range with min and max set to this real number.
- `nbt_value` & `tag_double` (explicit): A double tag with the same value as this real number.
- `tag_float` (explicit): A float tag with the same value as this real number.
### Booleans
*Identifier:* `boolean`
Real values represent true/false values. A boolean value can be created via a boolean literal like so:
```tdn
var on = true
var off = false
```

### Strings
*Identifier:* `string`
String values represent any sequence of characters, which together form text. A string value can be created via a string literal like so:
```tdn
var str = "This is a string"
var anotherString = "A string with \"escaped\" characters"
var singleQuotedString = 'this is a string too, and the single quote (") needs no escaping'
var someObjective = "field0"
define objective $someObjective
scoreboard players add @s[name=$str] $someObjective 1
```
Strings can be used in interpolation blocks in commands or instructions, in places where a string literal is expected (name selector argument) or an identifier is expected (objective names, `tag` command tag names, etc.).

#### Members

##### Indexer: `string[index : int]`
*readonly*
Returns a single-character string containing the character at the given index.
Example:
```tdn
log info "Mojang"[3]  #logs "a"
```
##### length: `int`
*readonly*
Contains the length of this string; that is, the number of characters in this string.
Example:
```tdn
log info "Mojang".length  #logs 6
```

##### substring: `function(beginIndex : int, endIndex : int?) : string`
*readonly*
Returns a string that is a substring of this string. The substring begins at the specified beginIndex and extends to the character at index `endIndex - 1`.
Thus the length of the substring is endIndex-beginIndex.
If `endIndex` is omitted, it defaults to the length of the string.
Example:
```tdn
log info "stonecutter".substring(5, 8)  #logs "cut"
log info "replaceitem".substring(7)     #logs "item"
```

##### indexOf: `function(str : string) : int`
*readonly*
Returns the first index at which the given parameter substring occurs in this string. Returns `-1` if the string doesn't contain the given parameter.
Example:
```tdn
log info "a b c d e".indexOf("d e")  #logs 6
```

##### lastIndexOf: `function(str : string) : int`
*readonly*
Returns the last index at which the given parameter substring occurs in this string. Returns -1 if the string doesn't contain the given parameter.
Example:
```tdn
log info "this appears twice in this string".lastIndexOf("this") #logs 22
```

##### split: `function(delimiter : string, limit : int?) : list`
*readonly*
Splits this string around matches of the given substring, and returns the result as a list of strings. The limit, if greater than 0, limits the number of elements in the return list, and only splits the string `$limit` times. Additionally, if the limit is set to zero, consecutive occurrences of the delimiter will split the string once, avoiding empty strings in the result list.
If `limit` is omitted, it defaults to 0.
Example:
```tdn
log info "foo:and:boo".split(":")  #logs ["foo", "and", "boo"]
```

##### splitRegex: `function(regex : string, limit : int?) : list`
*readonly*
Splits this string around matches of the given regular expression, and returns the result as a list of strings. The limit, if greater than 0, limits the number of elements in the return list, and only splits the string `$limit` times. Additionally, if the limit is set to zero, consecutive occurrences of the delimiter will split the string once, avoiding empty strings in the result list.
If `limit` is omitted, it defaults to 0.
Example:
```tdn
log info "foo:and:boo".splitRegex(".(?=:)") #logs ["foo:", "and:", "boo"]
```

##### replace: `function(target : string, replacement : string) : string`
*readonly*
Returns this string after replacing all occurrences of the target string with the replacement string.
Example:
```tdn
log info "foo:and:boo".replace(":",", ")  #logs "foo, and, boo"
```

##### replaceRegex: `function(target : string, replacement : string) : string`
*readonly*
Returns this string after replacing all matches of the target regex within this string with the replacement string.
Example:
```tdn
log info "foo:and:boo".replaceRegex(":\w+",".")  #logs "foo.."
```

##### replaceFirst: `function(target : string, replacement : string) : string`
*readonly*
Returns this string after replacing the first match of the target regex within this string with the replacement string.
Example:
```tdn
log info "foo:and:boo".replaceFirst(":\w+","")  #logs "foo:boo"
```

##### toLowerCase: `function() : string`
*readonly*
Returns this string after replacing all characters with their lowercase counterpart in the English locale.
Example:
```tdn
log info "This is a String".toLowerCase()  #logs "this is a string"
```
##### toUpperCase: `function() : string`
*readonly*
Returns this string after replacing all characters with their uppercase counterpart in the English locale.
Example:
```tdn
log info "This is a String".toUpperCase()  #logs "THIS IS A STRING"
```

##### trim: `function() : string`
*readonly*
Returns this string after replacing all whitespace characters at the beginning and the end of this string.
Example:
```tdn
log info "   This is a String ".trim()  #logs "This is a String"
```
##### startsWith: `function(str : string) : boolean`
*readonly*
Tests if this string starts with the specified prefix.
Example:
```tdn
log info "This is a String".startsWith("This")  #logs true
```
##### endsWith: `function(str : string) : boolean`
*readonly*
Tests if this string ends with the specified suffix.
Example:
```tdn
log info "This is a String".endsWith("String")  #logs true
```
##### contains: `function(str : string) : boolean`
*readonly*
Tests if the given string exists as a substring of this string.
Example:
```tdn
log info "setblock ~ ~ ~ stonecutter".contains("stone") #logs true
```
##### matches: `function(str : string) : boolean`
*readonly*
Tests if this string completely matches the given regular expression.
Example:
```tdn
log info "minecraft:stone".matches("[a-z0-9_\\.-]+?:[a-z0-9_/\\.-]+")
#logs true
log info "mine/craft:stone".matches("[a-z0-9_\\.-]+?:[a-z0-9_/\\.-]+")
#logs false
```
##### isEmpty: `function() : boolean`
*readonly*
Returns true if this string contains no characters; that is, its length is zero.
Example:
```tdn
log info "".isEmpty()  #logs true
```
##### isWhitespace: `function() : boolean`
*readonly*
Returns true if this string's first character is a whitespace character (space, tabulation, newline). See Java's [Character.isWhitespace(char)]() method. Throws an exception if the string is empty. 
Example:
```tdn
log info " ".isWhitespace()  #logs true
```
##### isDigit: `function() : boolean`
*readonly*
Returns true if this string's first character is a digit character. See Java's [Character.isDigit(char)]() method. Throws an exception if the string is empty.
Example:
```tdn
log info "9".isDigit()  #logs true
```
##### isLetter: `function() : boolean`
*readonly*
Returns true if this string's first character is a letter character. See Java's [Character.isLetter(char)]() method. Throws an exception if the string is empty.
Example:
```tdn
log info "F".isLetter()  #logs true
```
##### isLetterOrDigit: `function() : boolean`
*readonly*
Returns true if this string's first character is a letter character or a digit character. See Java's [Character.isLetterOrDigit(char)]() method. Throws an exception if the string is empty.
Example:
```tdn
log info "F".isLetterOrDigit()  #logs true
```

#### Iterator
Using a for-each loop on a string will create single-character string entries for each character in the original string. The entries in the iterator will be in the order they appear in the string.
Example:
```tdn
for(char in "ABC") {
    log info char
}
# logs:
# A
# B
# C
```
#### Conversions
- `nbt_value` & `tag_string` (explicit): A string tag with this string as its content.
- `entity` (explicit): Turns this entity into a fake player that can be used as an entity. The string may not be empty and must not contain whitespace.
- `resource` (explicit): Parses this string into a resource location. Must be a valid resource location.
- `text_component` (explicit): Turns this string into a string text component.

### Integer Ranges
*Identifier:* `int_range`
Integer ranges consist of one or two integers, which represent all possible numbers between them. (In the case only one integer, the other defaults to positive or negative infinity). They can be created either via a integer range literal or the int_range constructor:
```tdn
var range0 = int_range<5..10>
var range1 = int_range<5..>
var range2 = int_range<..10>
var range3 = new int_range(5, 10)      # same as range0
var range4 = new int_range(5, null)    # same as range1
var range4 = new int_range(null, 10)   # same as range2
```
Integer ranges can be used in interpolation blocks in commands, in places where an integer range is typically needed (such as selector arguments).

#### Constructor
```tdn
new int_range(min : int?, max : int?) : int_range
```
Creates an integer range with the specified min and max bounds.
Example:
```tdn
var range0 = new int_range(5, 10)
var range1 = new int_range(5, null)
var range2 = new int_range(null, 10)
```

#### Members

##### min: `int?`
*readonly*
Contains the lower bound of this range. Returns null if the lower bound is not specified.
Example:
```tdn
log info int_range<5..10>.min  #logs 5
log info int_range<..10>.min   #logs null
```
##### max: `int?`
*readonly*
Contains the upper bound of this range. Returns null if the upper bound is not specified.
Example:
```tdn
log info int_range<5..10>.max  #logs 10
log info int_range<5..>.max    #logs null
```
##### range: `int`
*readonly*
Contains the difference between the upper and lower bounds, as if null values represented min and max values of the integer data type. (Note: may overflow for ranges larger than the max int)
Example:
```tdn
log info int_range<5..15>.range  #logs 10
log info int_range<5..>.range    #logs 2147483642
```

##### deriveMin: `function(newMin : int?) : int_range`
*readonly*
Returns a new range whose lower bound is the one specified.
Example:
```tdn
log info int_range<5..10>.deriveMin(2)    #logs 2..10
log info int_range<5..10>.deriveMin(null) #logs ..10
```
##### deriveMax: `function(newMax : int?) : int_range`
*readonly*
Returns a new range whose upper bound is the one specified.
Example:
```tdn
log info int_range<5..10>.deriveMax(20)    #logs 5..20
log info int_range<5..10>.deriveMax(null)  #logs 5..
```

### Real Ranges
*Identifier:* `real_range`
Real ranges consist of one or two real numbers, which represent all possible numbers between them. (In the case only one real number, the other bound is undefined). They can be created either via a real range literal or the real_range constructor:
```tdn
var range0 = real_range<5.5..10.2>
var range1 = real_range<5.5..>
var range2 = real_range<..10.2>
var range3 = new real_range(5.5, 10.2)    # same as range0
var range4 = new real_range(5.5, null)    # same as range1
var range5 = new real_range(null, 10.2)   # same as range2
```
Real ranges can be used in interpolation blocks in commands, in places where a real range is typically needed (such as the distance selector argument).

#### Constructor
```tdn
new real_range(min : real?, max : real?) : real_range
```
Creates an integer range with the specified min and max bounds.
Example:
```tdn
var range0 = new real_range(5.5, 10.2)
var range1 = new real_range(5.5, null)
var range2 = new real_range(null, 10.2)
```

#### Members

##### min: `real?`
*readonly*
Contains the lower bound of this range. Returns null if the lower bound is not specified.
Example:
```tdn
log info real_range<5.5..10.2>.min  #logs 5.5
log info real_range<..10.2>.min     #logs null
```

##### max: `real?`
*readonly*
Contains the upper bound of this range. Returns null if the upper bound is not specified.
Example:
```tdn
log info real_range<5.5..10.2>.max  #logs 10.2
log info real_range<5.5..>.max      #logs null
```
##### range: `int`
*readonly*
Contains the difference between the upper and lower bounds. This will be Infinity if either the upper or lower bounds are unspecified.
Example:
```tdn
log info real_range<5.5..15.2>.range  #logs 9.7
log info real_range<5.5..>.range      #logs Infinity
```
##### deriveMin: `function(newMin : real?) : real_range`
*readonly*
Returns a new range whose lower bound is the one specified.
Example:
```tdn
log info real_range<5.5..10.2>.deriveMin(2.5)    #logs 2.5..10.2
log info real_range<5.5..10.2>.deriveMin(null)   #logs ..10.2
```
##### deriveMax: `function(newMax : real?) : real_range`
*readonly*
Returns a new range whose upper bound is the one specified.
Example:
```tdn
log info real_range<5.5..10.2>.deriveMax(20.5)   #logs 5.5..20.5
log info real_range<5.5..10.2>.deriveMax(null)   #logs 5.5..
```

### Entities
*Identifier:* `entity`
Values of type entity represent ways to target an entity, either through a selector or a player name. They can be created via a entity literal:
```tdn
var fakePlayer = entity<#RETURN>
var selector = entity<@e[type=cow,tag=onGround]>

kill $selector
```
Entity values can be used in interpolation blocks in commands, in places where an entity is typically needed.
**NOTE: UUIDs are internally treated as player names by the following functions.**

#### Members

##### isPlayerName: `function() : boolean`
*readonly*
Returns true if this entity representation is a player name (not a selector)
Example:
```tdn
log info entity<#RETURN>.isPlayerName()  #logs true
log info entity<@a>.isPlayerName()       #logs false
```
##### isPlayer: `function() : boolean`
*readonly*
Returns whether all the entities represented by this object are guaranteed to be of type `minecraft:player`.
Example:
```tdn
log info entity<#RETURN>.isPlayer()   #logs true
log info entity<@a>.isPlayer()        #logs true
log info entity<@e>.isPlayer()        #logs false
log info entity<@s>.isPlayer()        #logs false
```
##### isUnknownType: `function() : boolean`
*readonly*
Returns whether the type of the entities represented by this object cannot be known just from this object's values.
An example of this is the @s selector, where @s could mean any entity type, even if it only returns one entity.
Returns false if it expected to return more than one entity type.
Example:
```tdn
log info entity<#RETURN>.isUnknownType()      #logs false
log info entity<@a>.isUnknownType()           #logs false
log info entity<@e>.isUnknownType()           #logs true
log info entity<@e[type=cow]>.isUnknownType() #logs false
log info entity<@s>.isUnknownType()           #logs true
```
##### getLimit: `function() : int`
*readonly*
Returns this entity's count limit; that is, how many entities, at maximum, this entity object represents. `-1` if indeterminate.

Example:
```tdn
log info entity<#RETURN>.getLimit()     #logs 1
log info entity<@a>.getLimit()           #logs -1
log info entity<@e[limit=5]>.getLimit()  #logs 5
log info entity<@s>.getLimit()           #logs 1
```

### Blocks
*Identifier:* `block`
Values of type block group together a block type, blockstate and block data, which may represent the tiles at any position in a Minecraft world. They can be created via a block literal:
```tdn
var block0 = block<minecraft:prismarine_wall>
var block1 = block<minecraft:prismarine_wall[east=true,up=false]>
var block2 = block<command_block{auto:1b,Command:"tp @a ~ ~1 ~"}>
var block3 = block<chest[facing=east]{Lock:"Key"}>
var block4 = block<#wool>

setblock ~ ~ ~ $block2
```
Block values can be used in interpolation blocks in commands, in places where a block is typically needed.

#### Constructor
```tdn
new block(type : resource?) : block
```
Creates a block value with the specified block type. May throw an exception if the type is not a valid block type.
If type is omitted, it defaults to minecraft:air.
Example:
```tdn
var wall  = new block(resource<minecraft:prismarine_wall>)
var walls = new block(resource<#minecraft:walls>)
var air   = new block()
```

#### Members

##### blockType: `resource`
*get-set*
Holds the type or ID of this block.
```tdn
Example:
log info block<stone>.blockType  #logs minecraft:stone
log info block<#wool>.blockType  #logs #minecraft:wool
```

##### blockState: `dictionary?`
*get-set*
Holds a Dictionary object containing all the key-value pairs of this block's state (may be null).
Example:
```tdn
log info block<stone>.blockState
#logs null
log info block<brick_wall[east=true,up=false]>.blockState
#logs {east: "true", up: "false"}
```
##### blockTag: `tag_compound?`
*editable*
Contains the tag compound containing this block's NBT data (may be null).
Example:
```tdn
log info block<stone>.blockTag
#logs null
log info block<command_block{auto:1b,Command:"tp @a ~ ~1 ~"}>.blockTag
#logs {auto:1b,Command:"tp @a ~ ~1 ~"}
```

### Items
*Identifier:* `item`
Values of type item group together an item type and item data, which may represent the item at any entity or container's slot in a Minecraft world. They can be created via an item literal, using explicit type and NBT, or a reference to a custom item type:
```tdn
var item0 = item<minecraft:prismarine_wall>
var item1 = item<$someCustomItem>
var item2 = item<bow{Enchantments:[{id:"flame",lvl:1s}]}>
var item3 = item<#minecraft:music_discs>

give @a $item1
clear @a $item3
```
Item values can be used in interpolation blocks in commands, in places where an item is typically needed.

#### Constructor
```tdn
new item(type : resource?) : item
```
Creates an item value with the specified item type. May throw an exception if the type is not a valid item type.
If type is omitted, it defaults to `minecraft:air`.
Example:
```tdn
var stick   = new item(resource<minecraft:stick>)
var records = new item(resource<#minecraft:music_discs>)
var air     = new item()
```

#### Members

##### itemType: `resource`
*get-set*
```tdn
Holds the type or ID of this item.
Example:
log info item<stick>.itemType  #logs minecraft:stick
log info item<#wool>.itemType  #logs #minecraft:wool
```

##### itemTag: `tag_compound?`
*editable*
Contains the tag compound containing this item's NBT data (may be null).
Example:
```tdn
log info item<stick>.itemTag
#logs null
log info item<bow{display:{Name:'"PSG-1"'}}>.itemTag
#logs {display:{Name:'"PSG-1"'}}
```

##### getSlotNBT: `function() : tag_compound`
*readonly*
Returns an NBT compound representing this item in a slot in NBT.
Example:
```tdn
log info item<bow{display:{Name:'"PSG-1"'}}>.getSlotNBT()
#logs {tag:{display:{Name:"\"PSG-1\""}},id:"minecraft:bow",Count:1b}
```

### Text Components
*Identifier:* `text_component`
Values of type text component represent JSON text with formatting, which can be shown in-game. They can be created via a text component literal or the text_component constructor:
```tdn
var text0 = text_component<"Winner">
var text1 = text_component<{"selector":"@s"}>
var text2 = text_component<["Winner: ",{"selector":"@s"}]>
var text3 = new text_component(["First Round's ", text2])

tellraw @a $text3
```
Item values can be used in interpolation blocks in commands or instructions, in places where an item is typically needed.

#### Constructor
```tdn
new text_component(object : *?, ignoreIncompatibleTypes : boolean?) : text_component
```
Creates a block text component out of the given object, recursively. If `ignoreIncompatibleTypes` is `false` (or unset), an exception will be thrown if a value that cannot be converted to a text component is found.
Valid `object` types are: `string`, `boolean`, `dictionary`, `list`, `entity`, `resource`, `coordinate`, `pointer` or `text_component`. If `null`, defaults to an empty string.
If `ignoreIncompatibleTypes` is omitted, it defaults to `false`.
Example:
```tdn
var text3 = new text_component(["First Round's ", text2, " (", pointer<@s -> score>, " points)"])

log info text3
#logs ["First Round's ",["Winner",{"selector":"@s"}]," (",{"score":{"name":"@s","objective":"score"}}," points)"]
```

### NBT Values
*Identifier:* `nbt_value`
*grouping type*

Values of type NBT Value represent data storage elements for Minecraft's entities, items and blocks. There are many subtypes of nbt values.

#### Constructor
```tdn
new nbt(object : *?, ignoreIncompatibleTypes : boolean?) : nbt_value
```
Creates an nbt value out of the given object, recursively. If `ignoreIncompatibleTypes` is `false` (or unset), an exception will be thrown if a value that cannot be converted to an NBT value is found.
Valid `object` types are: `int`, `real`, `string`, `boolean`, `resource`, `dictionary`, `list` or `nbt_value`. If `null`, defaults to an empty dictionary.
If `ignoreIncompatibleTypes` is omitted, it defaults to `false`.
Notes:
- Any nbt value passed to this constructor will be cloned.
- Any integers passed to this constructor will be turned into tag_int
- Any reals passed to this constructor will be turned into tag_double
- Any booleans passed to this constructor will be turned into tag_byte (1b->true, 0b->false)
Example:
```tdn
var nbt2 = new nbt({CustomModelData:120,Unbreakable:nbt_value<1b>})
var nbt3 = new nbt({Item:{id:resource<stone>,Count:nbt_value<3b>,tag:nbt2}})

log info nbt2    #logs {Unbreakable:1b,CustomModelData:120}
log info nbt3    #logs {Item:{id:"minecraft:stone",Count:3b,tag:{Unbreakable:1b,CustomModelData:120}}}
```

### Tag Compounds
*Identifier:* `tag_compound`
*alias:* `nbt`
*extends:* `nbt_value`

Values of type Tag Compound represent key-value pairs, where keys are strings, and values are exclusively NBT values. They can be created via a nbt literal, nbt_value literal or the nbt constructor:
```tdn
var nbt0 = nbt<{CustomModelData:120,Unbreakable:1b}>
var nbt1 = nbt_value<{CustomModelData:120,Unbreakable:1b}>
var nbt2 = new nbt({CustomModelData:120,Unbreakable:nbt_value<1b>})

give @a minecraft:carrot_on_a_stick$nbt0
```
Tag Compound values can be used in interpolation blocks in commands, in places where a tag compound is typically needed. They can also be used in item or block literals to add or merge the two NBT compounds.

#### Members

##### Indexer: `tag_compound[key : string] : nbt_value?`
*readonly*
Returns the nbt value associated with the specified key, or null if it doesn't exist.
Example:
```tdn
log info nbt<{Age:0s,PickupDelay:10s,Tags:["a"]}>["Age"]  #logs 0s
```

##### merge: `function(other : tag_compound) : tag_compound`
*readonly*
Creates a new tag compound that contains elements of both this compound and the compound given by the parameter. In case of conflict between tags, the tags from the other compound overwrite those of this compound.
Example:
```tdn
var nbt0 = nbt<{Age:0s,PickupDelay:10s,Tags:["a"]}>
var nbt1 = nbt<{PickupDelay:40s,Tags:["b"]}>

log info nbt0.merge(nbt1) #logs {Age:0s,PickupDelay:40s,Tags:["a","b"]}
```

##### remove: `function(key : string)`
*readonly*
Removes a value from the tag compound using the given key, if it exists.
Example:
```tdn
var nbt0 = nbt<{Age:0s,PickupDelay:10s,Tags:["a"]}>

log info nbt0 #logs {Age:0s,PickupDelay:10s,Tags:["a"]}
eval nbt0.remove("Age")
log info nbt0 #logs {PickupDelay:10s,Tags:["a"]}
```

### toDictionary: `function() : dictionary`
*readonly*
Creates a dictionary representation of this NBT tag tree and its nested values. This will convert all number tags into integers and reals, string tags into strings, list tags into lists, compounds into dictionaries and so on.
Example:
```tdn
var nbt0 = nbt<{Age:0s,PickupDelay:40s,Tags:["a","b"]}>

log info nbt0.toDictionary()
# logs {PickupDelay: 40, Age:0, Tags: ["a", "b"]}
# Note that what is returned is of type dictionary and is editable, unlike tag_compound
```

#### Iterator
Using a for-each loop on a tag compound will create one value for each key-value pair. The iterator's values are dictionaries with two entries each: "key", which holds the tag's name, and "value", which holds the entry's value as an NBT tag. The entries in the iterator are not guaranteed to be in any particular order.
Modifying the dictionary during iteration is not allowed and will throw a concurrent modification exception.
Example:
```tdn
var comp = nbt<{Age:0s,PickupDelay:40s,Tags:["a","b"]}>
for(entry in comp) {
    log info entry
}
# logs:
# {value: 0s, key: "Age"}
# {value: 40s, key: "PickupDelay"}
# {value: ["a","b"], key: "Tags"}
```



<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
<!-- TEMP: 末尾留几行以在协同编辑器中把文字提到中间 -->