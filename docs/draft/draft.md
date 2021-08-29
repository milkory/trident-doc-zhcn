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

### Tag Lists
*Identifier:* `tag_list`
*extends:* `nbt_value`

Values of type Tag List represent sequences of `nbt_values` of the same type. They can be created via a `nbt_value` literal or the nbt constructor:
```tdn
var tagList0 = nbt_value<[0.0f,180.0f,90.0f]>
var tagList1 = new nbt(["a","b","new"])

summon minecraft:skeleton ~ ~ ~ {Tags:$tagList1}
```
Tag List values can be used in interpolation blocks in commands or instructions, in places where a tag compound is typically needed. They can also be used in item or block literals to add or merge the two NBT compounds.

#### Members

##### Indexer: `tag_list[index : int] : nbt_value`
*readonly*
Returns the nbt value at the specified index.
Example:
```tdn
log info nbt_value<[0.0f,180.0f,90.0f]>[2]  #logs 90.0f
```
##### length: `int`
*readonly*
Contains the length of this `tag_list`; that is, the number of elements in this tag list.
Example:
```tdn
log info nbt_value<["a","b","new","needs_id"]>.length  #logs 4
```
##### merge: `function(other : tag_list) : tag_list`
*readonly*
Creates a new tag list that contains elements of both this tag list and the one given by the parameter. Conflicting tag lists with the same type will be merged, with elements from the parameter tag list appearing after those of this tag list. In case of conflict between tag list content types (e.g. trying to merge a float `tag_list` and a string `tag_list`), an exception will be thrown.
Example:
```tdn
var tagList0 = nbt_value<[0.0f,180.0f,90.0f]>
var tagList1 = new nbt(["a","b"])
var tagList2 = new nbt(["new","needs_id"])

log info tagList1.merge(tagList2) #logs ["a","b,"new","needs_id"]
log info tagList0.merge(tagList1)
#Error: Unable to merge tag lists: Incompatible types: TAG_String and TAG_Float
```
##### toList: `function() : list`
*readonly*
Creates a list representation of this NBT tag tree and its nested values. This will convert all number tags into integers and reals, string tags into strings, list tags into lists, compounds into dictionaries and so on.
Example:
```tdn
var tagList0 = nbt_value<[{},{},{id:"minecraft:leather_chestplate",Count:1b},{id:"minecraft:pumpkin",Count:1b}]>

log info tagList0.toList()
# logs [{}, {}, {id: "minecraft:leather_chestplate", Count: 1}, {id: "minecraft:pumpkin", Count: 1}]
# Note that what is returned is of type list and is editable, unlike tag_list
```
#### Iterator
Using a for-each loop on a tag list will yield each element in the list to the iterating variable, as an NBT tag. The entries in the iterator will be in the order they appear in the list.
Modifying the list during iteration is not allowed and will throw a concurrent modification exception.
Example:
```tdn
var list = nbt_value<[1s,2s,4s,8s]>
for(entry in list) {
    log info entry
}
# logs:
# 1s
# 2s    
# 4s
# 8s
```

### Other NBT Tag Types
*extends:* `nbt_value`

1. `tag_byte` constructor: `new tag_byte(n : int)`
2. `tag_short` constructor: `new tag_short(n : int)`
3. `tag_int` constructor: `new tag_int(n : int)`
4. `tag_float` constructor: `new tag_float(n : real)`
5. `tag_double` constructor: `new tag_double(n : real)`
6. `tag_long` constructor: `new tag_long(v)` where argument 0 is: `int`, `real` or `string`
7. `tag_string` constructor: new tag_string(str : string)
8. `tag_byte_array` constructor: `new tag_byte_array(list : list)` where list contains `int`s
9. `tag_int_array` constructor: `new tag_int_array(list : list)` where list contains `int`s
10. tag_long_array constructor: `new tag_long_array(list : list)` where list contains `int`s, `real`s or `string`s.

As a reminder of the syntax, `tag_byte_array`, `tag_int_array` and `tag_long_array` can be created through the `nbt_value` literal, just like values of type `tag_list`, except adding a prefix before all the elements. Note that for each element in the array (excluding int arrays), the proper suffix must be added, or else it will be read as an integer, an incompatible type.
Example:
```tdn
var byteArr = nbt_value<[B; 0b, 1b, 2b, 3b]>
var intArr  = nbt_value<[I; 0,  1,  2,  3 ]>
var longArr = nbt_value<[L; 0L, 1L, 2L, 3L]>
setblock ~ ~ ~ minecraft:campfire{CookingTime:$intArr}
```
#### Conversions
- `<any numeric NBT type>` to `int` (explicit): Gets the truncated integer value of this NBT value.
- `<any numeric NBT type>` to `real` (explicit): Gets the real value of this NBT value.
- `<any numeric array NBT type>` to `list` (explicit): Retrieves all the tags of this array into a list of nbt values.
### NBT Paths
*Identifier:* `nbt_path`
Values of type NBT Path represent routes through an NBT tree that point to one or many nbt value within it. They can be created via the `nbt_path` literal:
```tdn
var path = nbt_path<Items[0].tag.display.Name>

data modify block ~ ~ ~ $path set value '"New Item"'
```
NBT Path values can be used in interpolation blocks in commands, in places where a path is typically needed.

#### Constructor
4 overloads:
```tdn
new nbt_path(key : string, compoundMatch : tag_compound?) : nbt_path
```
Creates a NBT path root out of the given key, of the form `key{compoundMatch}` where the compound match is optional.
```tdn
new nbt_path(compoundMatch : tag_compound, wrapInList : boolean?) : nbt_path
```
Creates a NBT path root out of the given compound, of the form `{compoundMatch}`. If `wrapInList` is true, it'll be wrapped in a list match, making it `[{compoundMatch}]`.
```tdn
new nbt_path(index : int) : nbt_path
```
Creates a NBT path root out of the given list index, of the form `[index]`.
```tdn
new nbt_path() : nbt_path
```
Creates a NBT path root of the form `[]`
Examples:
```tdn
var path0 = new nbt_path("CustomModelData")
var path1 = new nbt_path("display",nbt<{Lore:[]}>)
var path2 = new nbt_path(nbt<{HurtTime:10s}>)
var path3 = new nbt_path(nbt<{HurtTime:10s}>, true)
var path4 = new nbt_path(2)
var path5 = new nbt_path()

# Paths 3, 4 and 5 are never used in practice, though still valid in-game

log info path0    #logs CustomModelData
log info path1    #logs display{Lore:[]}
log info path2    #logs {HurtTime:10s}
log info path3    #logs [{HurtTime:10s}]
log info path4    #logs [2]
log info path5    #logs []
```
#### Members

##### resolveKey: `function(key : string, compoundMatch : tag_compound?) : nbt_path`
*readonly*
Creates a new NBT path with the given key segment (and optionally, a compound match) added to the end.
Example:
```tdn
log info nbt_path<RecordItem>.resolveKey("id") #logs RecordItem.id
log info nbt_path<RecordItem>.resolveKey("tag", nbt<{Damage:0s}>)
#logs RecordItem.tag{Damage:0s}
```
### resolveIndex: `function(index : int) : nbt_path`
*readonly*
Creates a new NBT path with the given index segment added to the end.
Example:
```tdn
log info nbt_path<Items>.resolveIndex(0) #logs Items[0]
```
##### resolveListMatch: `function(match : tag_compound) : nbt_path`
*readonly*
Creates a new NBT path with the given list match segment added to the end.
Example:
```tdn
log info nbt_path<Items>.resolveListMatch(nbt<{id:"minecraft:snowball"}>)
#logs Items[{id:"minecraft:snowball"}]
log info nbt_path<Items>.resolveListMatch()
#logs Items[]
```

### Coordinate Sets
*Identifier:* `coordinates`
Values of type Coordinate Set represent points in 3D space in a given coordinate system. They can be created via the coordinate literal:
```tdn
var origin = coordinates<0.0 0.0 0.0> # parsed as 0.0 0.0 0.0
var pos0 = coordinates<0 0 0>         # parsed as 0.5 0.0 0.5
var pos1 = coordinates<~ ~-8 ~>       # parsed as ~ ~-8 ~
var pos2 = coordinates<^ ^ ^.1>       # parsed as ^ ^ ^0.1
var pos3 = coordinates<15 3 -7>       # parsed as 15 3 -7
var pos4 = coordinates<~ 255 ~>       # parsed as ~ 255 ~

setblock $origin jukebox         # setblock 0 0 0 minecraft:jukebox
setblock $pos0   jukebox         # setblock 0 0 0 minecraft:jukebox
summon pig $origin               # summon pig 0.0 0.0 0.0
summon pig $pos0                 # summon pig 0.5 0.0 0.5
spreadplayers $pos3 1 2 true @a  # spreadplayers 15.5 -6.5 1 2 true @a
```
Coordinate values can be used in interpolation blocks in commands, in places where a coordinate set is typically needed.
**NOTE: Through the coordinate literal, the coordinates are parsed as if they were going to be used for an entity position. That means 0.5 is added to X and Z axes if they are absolute. Note that for every command that uses coordinates, the output is adjusted for each type of coordinate mode it uses.**

#### Members

##### getMagnitude: `function(axis : trident-util:native@Axis) : real`
*readonly*
Retrieves the magnitude of the coordinate set along a given axis (in entity position mode). The axis parameter should be one of the `X`, `Y` and `Z` constants of the `Axis` class.
Example:
```tdn
log info coordinates<0.0 1.0 2.0>.getMagnitude(Axis.Z) # logs 2.0
log info coordinates<0 1 2>.getMagnitude(Axis.X)       # logs 0.5
log info coordinates<~ ~1 2>.getMagnitude(Axis.Y)      # logs 1
```
### getCoordinateType: `function(axis : trident-util:native@Axis) : trident-util:native@CoordinateType`
*readonly*
Retrieves the coordinate type of the coordinate along a given axis. The axis parameter should be one of the `X`, `Y` and `Z` constants of the `Axis` class. The returned value is one of the `ABSOLUTE`, `RELATIVE` and `LOCAL` constants of the `CoordinateType` class.
Example:
```tdn
log info coordinates<~ ~ 2.0>.getCoordinateType(Axis.Z)
#logs CoordinateType.ABSOLUTE
log info coordinates<~ ~ 2.0>.getCoordinateType(Axis.Y)
#logs CoordinateType.RELATIVE
log info coordinates<^ ^ ^.1>.getCoordinateType(Axis.X)
#logs CoordinateType.LOCAL
```

##### deriveMagnitude: `function(newMagnitude : real, axis : trident-util:native@Axis?) : coordinates`
*readonly*
Creates a new coordinate set after changing one or all axes' magnitudes to the one given. The axis parameter is optional, and should be one of the `X`, `Y` and `Z` constants of the `Axis` class. If the axis is not specified, all axes' magnitudes will be changed; otherwise, only the specified axis is changed.
Example:
```tdn
log info coordinates<~ ~ 2.0>.deriveMagnitude(1, Axis.X)
#logs ~1 ~ 2.0
log info coordinates<~ ~ 2.0>.deriveMagnitude(1)
#logs ~1 ~1 1.0
```
##### deriveCoordinateType: `function(newType : trident-util:native@CoordinateType,axis : trident-util:native@Axis?) : coordinates`
*readonly*
Creates a new coordinate set after changing one or all axes' coordinate types to the one given. The axis parameter is optional, and should be one of the `X`, `Y` and `Z` constants of the `Axis` class. Only the type of the axis specified will be changed to the new type, unless at least one of the following conditions is met:
1. The axis is not specified.
2. The specified coordinate type is `CoordinateType.LOCAL`
3. The coordinate type of the original coordinate set is `CoordinateType.LOCAL`
If one of these conditions is met, all axes will be changed to the given type, regardless of the axis specified.
Example:
```tdn
log info coordinates<~ ~ 2.0>
        .deriveCoordinateType(CoordinateType.ABSOLUTE, Axis.X)
#logs 0.0 ~ 2.0
log info coordinates<1.0 2.0 3.0>
        .deriveCoordinateType(CoordinateType.RELATIVE, Axis.Y)
#logs 1.0 ~2 3.0
log info coordinates<1.0 2.0 3.0>
        .deriveCoordinateType(CoordinateType.RELATIVE)
#logs ~1 ~2 ~3
log info coordinates<1.0 2.0 3.0>
        .deriveCoordinateType(CoordinateType.LOCAL)
#logs ^1 ^2 ^3
log info coordinates<1.0 2.0 3.0>
        .deriveCoordinateType(CoordinateType.LOCAL, Axis.X)
#logs ^1 ^2 ^3
log info coordinates<^1 ^2 ^3>
        .deriveCoordinateType(CoordinateType.RELATIVE, Axis.X)
#logs ~1 ~2 ~3
```

### Resource Locations
*Identifier:* `resource`
Values of type Resource Location represent locations in data packs or resource packs where any asset or resource may be located within a namespace. They can be created via the resource literal, or cast from a string. If a namespace is not specified, it defaults to the minecraft namespace. Can be prefixed with a # symbol to denote a tag. They also support [Relative Resource Locations]().
```tdn
# file: mypack:demo/resources

var res0 = resource<tick>               # contains: minecraft:tick
var res1 = resource<mypack:tick>        # contains: mypack:tick
var res2 = resource<#wool>              # contains: #minecraft:wool
var res3 = resource<#mypack:load>       # contains: #mypack:load
var res4 = (resource) "mypack:util/id"  # contains: mypack:util/id
var res5 = resource<mypack:tile.step>   # contains: mypack:tile.step
var res6 = resource</>                  # contains: mypack:demo/resources
var res7 = resource</a>                 # contains: mypack:demo/resources/a

playsound $res5 master @a
define function $res4 {
    # ...
}
function $res4
```
Resource Locations can be used in interpolation blocks in commands and instructions, in places where a resource location is typically needed.

#### Constructor
```tdn
new resource(whole : string) : resource
```
Assembles a resource location entirely out of the given string.
```tdn
new resource(namespace : string, parts : list, delimiter : string?) : resource
```
Assembles a resource location out of the given namespace and the specified parts, separated by a delimiter (by default, the forward slash `/`).
The parts may be strings or resource locations - in the latter case, only the body of the resource location is used in the output resource location.
Examples:
```tdn
log info new resource("#mypack:utils/random") 
# logs #mypack:utils/random

log info new resource("mypack", ["utils", "random", "get"]) 
# logs mypack:utils/random/get

var rain = new resource("minecraft", ["weather", "rain"], ".")
log info rain
# logs minecraft:weather.rain

log info new resource("minecraft", [rain, "above"], ".")
# logs minecraft:weather.rain.above
```

#### Members

##### Indexer: `resource[index : int] : string`
*readonly*
Returns the string which represents the name at the specified position of the body.
Example:
```tdn
log info resource<mypack:util/random/get>[0]   # logs util
log info resource<mypack:util/random/get>[1]   # logs random
log info resource<mypack:util/random/get>[2]   # logs get
```
##### namespace : `string`
*readonly*
Contains the namespace of this resource.
Example:
```tdn
log info resource<tick>.namespace              # logs "minecraft"
log info resource<#minecraft:tick>.namespace   # logs "minecraft"
log info resource<mypack:tick>.namespace       # logs "mypack"
```
##### body : `string`
*readonly*
Contains the body of this resource.
Example:
```tdn
log info resource<ui.toast.in>.body       # logs "ui.toast.in"
log info resource<minecraft:load>.body    # logs "load"
log info resource<mypack:tiles/step>.body # logs "tiles/step"
```
##### isTag : `boolean`
*readonly*
Contains whether this resource is tagged.
Example:
```tdn
log info resource<ui.toast.in>.isTag       # logs false
log info resource<#minecraft:load>.isTag   # logs true
```

##### nameCount : `int`
*readonly*
Retrieves the number of "names" in this resource location - that is, the number of parts separated by forward slashes in the body.
Example:
```tdn
log info resource<mypack:util/random/get>.nameCount   # logs 3
log info resource<mypack:tiles/step>.nameCount        # logs 2
log info resource<ui.toast.in>.nameCount              # logs 1
```
##### parent: `string?`
*readonly*
Retrieves the resource location that is the parent of this resource location. That is, the resource location that has the same namespace and isTag as this one, and its body is made from all the "names" from this location excluding the last one. If there is no parent to this resource location, this member is `null`.
Example:
```tdn
log info resource<mypack:util/random/get>.parent  # logs mypack:util/random
log info resource<ui.toast.in>.parent             # logs null
```
##### subLoc: `function(beginIndex : int, endIndex : int) : resource`
*readonly*
Returns a similar resource location whose body contains only a specified range of names, such that the resulting resource location's nameCount will be `endIndex - beginIndex`.
The names that will be kept will range from `beginIndex` (inclusive) to `endIndex` (exclusive)
Example:
```tdn
log info resource<mypack:util/rand/get>.subLoc(1, 3) # logs mypack:rand\get
log info resource<mypack:util/rand/get>.subLoc(0, 2) # logs mypack:util\rand
```
##### resolve: `function(other : string, delimiter : string?) : resource`
*readonly*
Returns a similar resource location, with the specified name appended to the end. The `other` parameter may be a string or a resource location - in the latter case, only the location's body will be added to the end. The `delimiter` used to append the resource location will be, by default, the forward slash `/`, unless specified by the second optional argument.
Example:
```tdn
log info resource<mypack:util>.resolve("rand")
# logs mypack:util/rand
log info resource<mypack:util>.resolve("rand", ".")
# logs mypack:util.rand

log info resource<mypack:util>.resolve(resource<rand>)
# logs mypack:util/rand
log info resource<mypack:util>.resolve(resource<rand>, ".")
# logs mypack:util.rand
```

#### Iterator
Using a for-each loop on a resource location will create string entries for names in the resource location body. The entries in the iterator will be in the order they appear in the resource location.
Example:
```tdn
for(name in resource<mypack:util/random/get>) {
    log info name
}
# logs:
# util
# random
# get
```

### Pointers
*Identifier:* `pointer`
Values of type Pointer represent places where data is typically stored in-game. They have four properties:
1. Target: The block, entity or resource location that holds the information
2. Member: The place they hold the information; either a scoreboard objective (entities only) or an NBT path.
3. Scale: Used in the `set` custom command. Stores how much to scale the value when getting or setting from this pointer. May only exist for NBT path Members.
4. Numeric type: Used in the `set` custom command, when the member is an NBT path. Specifies what the data type of the NBT tag is. If unspecified, Trident will attempt to determine the data type.
They can be created using the pointer literal.
Block targets should be
The separator between the target and the member depends on the type of target and member; score members will require an arrow `->`, NBT paths require a dot `.`, and storage requires a tilde `~`.
```tdn
var ptr0 = pointer<#RETURN->global>    # player #RETURN, score global
var ptr1 = pointer<@s->id>             # sender, score id
var ptr2 = pointer<custom:storage~Tmp (double)>
# storage "custom:storage", Tmp
var ptr3 = pointer<@s.Pos[1]>          # sender, tag Pos[1], double (guess)
var ptr4 = pointer<(~ ~-1 ~).auto (byte)>
# block at ~ ~-1 ~, tag auto, byte
var ptr5 = pointer<@p.Motion[0] * 0.1 (double)>
# nearest player, tag Motion[0], scale 0.1, double

set $ptr1 = $ptr0
# scoreboard players operation @s id = #RETURN global
set $ptr2 = $ptr5
# execute store result storage custom:storage Tmp double 1 run data get entity @p Motion[0] 0.1
scoreboard players operation deref $ptr1 += deref $ptr0
# scoreboard players operation @s id += #RETURN global
```
Pointers can be used in interpolation blocks in the `set` command, as well as the scoreboard command by using the `deref` keyword in place of the player name, and an interpolation block to the pointer in place of the objective name.

**Note: The target and member properties of pointer objects can hold any data type; regardless of whether they make up a valid pointer. However, if an invalid pointer is used on any command or instruction that uses pointers, an error will be thrown.**

#### Members

##### target : `*`
*editable*
Contains the target of this pointer. Becomes an illegal pointer if it's anything other than an entity, a coordinate set or a resource location.
Example:
```tdn
log info pointer<#RETURN->global>.target # logs #RETURN (type entity)
log info pointer<@s->id>.target          # logs @s (type entity)
log info pointer<custom:storage~Pos>.target
# logs custom:storage (type resource)
log info pointer<(~ ~ ~1).auto>.target   # logs ~ ~ ~1 (type coordinates)
```
##### member : `*`
*editable*
Contains the target of this pointer. Becomes an illegal pointer if it's anything other than a string or an NBT path, if the string is an invalid objective name, or if the target is a coordinate set or resource while the member is a string.
Example:
```tdn
log info pointer<@s->global>.member       #logs "global"
log info pointer<@s.Pos[1]>.member        #logs Pos[1]
```
##### scale: `real`
*get-set*
Contains the scale of this pointer. It is `1` by default.
Example:
```tdn
log info pointer<@s->global>.scale             #logs 1
log info pointer<@s.Pos[1] * 100>.scale        #logs 100
log info pointer<@s.Pos[1] * 0.01>.scale       #logs 0.01
```
##### numericType : `string`
*get-set*
Contains the numeric type of this pointer. null by default.
Must be one of: `null`, `"byte"`, `"short"`, `"int"`, `"float"`, `"double"`, `"long"`
If attempting to set to an invalid value, no changes will be made to this field.
Example:
```tdn
log info pointer<@s.Pos[1] * 100>.numericType           #logs null
log info pointer<@s.Pos[1] * 100 (double)>.numericType  #logs double
log info pointer<@s.FallDistance (float)>.numericType   #logs float
```

### Dictionaries
*Identifier:* `dictionary`
Dictionaries are collections of named values. These contain key-value pairs where keys are strings, and values are any type of interpolation value. They can be created via a dictionary literal:
```tdn
var MapProperties = {
    name: "The Aether II Map",
    version: "1.1.2",
    final: true,
    idle: resource<aether:aemob.moa.say>,
    mainFunc: resource</main>,
    "Not an identifier": entity<@s>,
    nested: {
        level: 2
    }
}

log info MapProperties.name            # logs "The Aether II Map"
log info MapProperties.nested.level    # logs 2
```
Dictionaries are particularly useful to store large amounts of related information together.

#### Members

**Note: This data type features dynamic members (user-made member keys), as well as static members (those given by the language). User-made members with the same name as language-provided members are valid, but they will hide the language-defined member for that object.**
Example:
```tdn
var dict0 = {}
var dict1 = {map: "overwritten"}

log info dict0.map
# logs <internal function>
log info dict1.map
# logs "overwritten"
```

##### Indexer: `dictionary[key : string] : *?`
*variable*
Returns the value associated with the specified key.
Example:
```tdn
var MapProperties = {
    idle: resource<aether:aemob.moa.say>,
    mainFunc: resource</main>,
    "Not an identifier": entity<@s>
}
log info MapProperties["idle"]              # logs aether:aemob.moa.say
log info MapProperties["Not an identifier"] # logs @s
eval MapProperties["new"] = true            # sets property "new" to true
```
##### `*` : `*?`
*variable*
Returns the value associated with the specified key. This can only access values named as identifiers; to access values with keys of any string, use the accessor instead.
New entries can be added and changed from the dictionary, using the assignment operator, as well as through the dictionary literal upon creation.
Example:
```tdn
var MapProperties = {
    name: "The Aether II Map",
    version: "1.1.2",
    final: true
}
log info MapProperties.name              # logs "The Aether II Map"
log info MapProperties.version           # logs "1.1.2"
log info MapProperties.final             # logs true
log info MapProperties.unset             # logs null
eval MapProperties.newProp = entity<@e>  # sets property "newProp" to @e
```
##### merge: `function(other : dictionary) : dictionary`
*readonly*
Creates a new dictionary that contains elements of both this dictionary and the dictionary given by the parameter. In case of conflict between keys, the values from the other dictionary overwrite those of this dictionary.
Example:
```tdn
var dict0 = {
    a: "Original A",
    b: "Original B"
}
var dict1 = {
    b: "New B",
    c: "New C"
}

log info dict0.merge(dict1)
# logs {a: "Original A", b: "New B", c: "New C"}
```
##### remove: `function(key : string)`
*readonly*
Removes the key-value pair with the given value, if it exists. If it doesn't exist, no action is taken.
Example:
```tdn
var dict0 = {
    a: "Original A",
    b: "Original B"
}

log info dict0
# logs {a: "Original A", b: "Original B"}
eval dict0.remove("b")
log info dict0
# logs {a: "Original A"}
```
##### hasOwnProperty: `function(key : string)`
*readonly*
Returns whether the dictionary has a value associated with the given key. Does not include native functions.
Example:
```tdn
var dict0 = {
    a: "A",
    b: "B"
}

log info dict0.hasOwnProperty("a") # logs true
log info dict0.hasOwnProperty("b") # logs true
log info dict0.hasOwnProperty("c") # logs false
log info dict0.hasOwnProperty("hasOwnProperty") # logs false
```
##### clear: `function()`
*readonly*
Removes all elements from this dictionary.
Example:
```tdn
var dict0 = {
    a: "Original A",
    b: "Original B"
}

log info dict0
# logs {a: "Original A", b: "Original B"}
eval dict0.clear()
log info dict0
# logs {}
```
##### map: `function(filter : function[(key : string, value : *?) : *?]) : dictionary`
*readonly*
Creates a new dictionary with the same keys as this one, but with the values given by the filter function passed to this function. For each key-value pair, the filter function should take as its first parameter, the key, and as its second parameter, the original value. Whatever is returned by the function at each key-value pair will be used as the value for that key in the new dictionary.
Example:
```tdn
var dict0 = {
    a: "Original A",
    b: "Original B",
    c: "Original C"
}

log info dict0.map(function(key, value) {
    if(key != "c") {
        return value.replace("Original", "New")
    } else {
        return value
    }

})
# logs {a: "New A", b: "New B", c: "Original C"}
```

#### Iterator
Using a for-each loop on a dictionary will create one value for each key-value pair. The iterator's values are dictionaries with two entries each: "key", which holds the entry's key, and "value", which holds the entry's value. The entries in the iterator are not guaranteed to be in any particular order.
Example:
```tdn
var dict0 = {
    a: "Original A",
    b: "Original B",
    c: "Original C"
}

for(entry in dict0) {
    log info entry
}
# logs:
# {value: "Original A", key: "a"}
# {value: "Original B", key: "b"}
# {value: "Original C", key: "c"}
```

### Lists
*Identifier:* `list`
Lists are ordered collections of interpolation values of any type. They can be created via a list literal using square braces:
```tdn
var list0 = [
    "A String",
    true,
    resource<minecraft:weather.rain>,
    entity<@s>,
    {min: 0, max: 100},
    ["another", "list"]
]
```
#### Members

##### Indexer: `list[index : int] : *?`
*variable*
Returns the value located at the specified index.
Example:
```tdn
var list0 = [
    "A String",
    true,
    resource<minecraft:weather.rain>,
    entity<@s>,
    {min: 0, max: 100},
    ["another", "list"]
]

log info list0[0] # logs "A String"
log info list0[2] # logs minecraft:weather.rain
log info list0[4] # logs {min: 0, max: 100}
log info list0[5] # logs ["another", "list"]
```
##### length : `int`
*readonly*
Contains the length of this list; that is, the number of elements in it.
Example:
```tdn
log info ["a","b","new","needs_id"].length  # logs 4
```
##### add: `function(elem : *?)`
*readonly*
Appends the given element to the end of this list.
Example:
```tdn
var list0 = [
    "A",
    "B"
]

log info list0         # logs ["A", "B"]
eval list0.add("C")
log info list0         # logs ["A", "B", "C"]
```
##### insert: `function(elem : *?, index : int)`
*readonly*
Inserts the given element at the specified index, shifting all elements previously at that index of higher, one index up.
Example:
```tdn
var list0 = [
    "A",
    "C",
    "D"
]

log info list0               # logs ["A", "C", "D"]
eval list0.insert("B", 1)
log info list0               # logs ["A", "B", "C", "D"]
```
##### remove: `function(index : int)`
*readonly*
Removes the element at the specified index.
Example:
```tdn
var list0 = [
    "A",
    "B",
    "C",
    "D"
]

log info list0          # logs ["A", "B", "C", "D"]
eval list0.remove(2)
log info list0          # logs ["A", "B", "D"]
```
##### clear: `function()`
*readonly*
Removes all elements from this list.
Example:
```tdn
var list0 = [
    "A",
    "B",
    "C"
]

log info list0        # logs ["A", "B", "C", "D"]
eval list0.clear()
log info list0        # logs []
```
##### contains: `function(value : *?)`
*readonly*
Returns `true` if the given value exists in the list, `false` otherwise.
Example:
```tdn
var list0 = [
    "Original A",
    "Original B",
    "Original C"
]

log info list0.contains("Original A")    # logs true
log info list0.contains("Original D")    # logs false
```
##### indexOf: `function(value : *?) : int`
*readonly*
Returns the index at which the specified value first occurs in the list. Returns `-1` if the list does not contain it.
Example:
```tdn
var list0 = [
    "Original A",
    "Original B",
    "Repeat",
    "Repeat"
]

log info list0.indexOf("Repeat")        # logs 2
log info list0.indexOf("Original C")    # logs -1
```
##### lastIndexOf: `function(value : *?) : int`
*readonly*
Returns the index at which the specified value last occurs in the list. Returns `-1` if the list does not contain it.
Example:
```tdn
var list0 = [
    "Original A",
    "Original B",
    "Repeat",
    "Repeat"
]

log info list0.lastIndexOf("Repeat")        # logs 3
log info list0.lastIndexOf("Original C")    # logs -1
```
##### isEmpty: `function() : boolean`
*readonly*
Returns `true` if the list contains no elements, `false` otherwise.
Example:
```tdn
var list0 = [
    "Original A",
    "Original B",
    "Repeat",
    "Repeat"
]

log info list0.isEmpty()    # logs false
log info [].isEmpty()       # logs true
```
##### map: `function(filter : function[(value : *?, index : int) : *?]) : list`
*readonly*
Creates a new list, where each element corresponds to one of the original list, after going through a filter. The filter function should take as its first parameter the original value, as second parameter, the index it resides in, and return its corresponding value in the new list.
Example:
```tdn
var list0 = [
    "Original A",
    "Original B",
    "Original C"
]

log info list0.map(function(value, index) {
    return value.replace("Original", "New at " + index + ":")
})
# logs ["New at 0: A", "New at 1: B", "New at 2: C"]
```
##### filter: `function(filter : function[(value : *?, index : int) : boolean]) : list`
*readonly*
Creates a duplicate of this list, keeping only elements that, when run through the filter function, return `true`. The filter function should take as its first parameter the original value, as second parameter, the index it resides in, and return `true` for elements that should be kept in the new list.

Example:
```tdn
var list0 = [
    "Original A",
    "Original B",
    "New C",
    "New D"
]

log info list0.filter(function(value, index) {
    return value.startsWith("Original")
})
# logs ["Original A", "Original B"]
```

##### reduce: `function(function : function[(total : *?, currentValue : *?, index : int) : *?], initialValue : *?) : *?`
*readonly*
Reduces all of the values of the list into a single value, using the given function and starting with the given initial value.

Example:
```tdn
var list0 = [1, 2, 3, 4, 5]

log info list0.reduce(function(total, currentValue, index) {
    return total + currentValue
})
# logs 15
```

#### Iterator
Using a for-each loop on a list will yield each element in the list to the iterating variable. The entries in the iterator will be in the order they appear in the list.
Example:
```tdn
var list0 = [
    "A",
    "B",
    "C",
    "D",
    "E"
]

for(entry in list0) {
    log info entry
}
# logs:
# "A"
# "B"
# "C"
# "D"
# "E"
```

### Custom Entities
*Identifier:* `custom_entity`
Values of type `custom_entity` represent blueprints for an user-defined non-default entity or entity component. These typically contain the values defined in their body. They can only be created via the define entity instruction. More it the Custom Entities section.
```tdn
define entity bear minecraft:polar_bear {
    var idleSound = resource<minecraft:entity.polar_bear.ambient>

    ticking function tick {
        # ...
    }
}

summon $bear
```
#### Members
**Note: This data type features dynamic members (user-made member keys), as well as static members (those given by the language). User-made members with the same name as language-provided members are valid, but they will hide the language-defined member for that object.**

##### Indexer: `custom_entity[key : string] : *?`
*variable*
Returns the value associated with the specified key.
Note: New properties can't be added through the accessor; only properties that have been declared inside the entity body can be edited.
Example:
```tdn
# file: mypack:entities/bear.tdn

define entity bear minecraft:polar_bear {
    var idleSound = resource<minecraft:entity.polar_bear.ambient>

    ticking function tick {
        # ...
    }

    function animation/hurt {
        # ...
    }
}

log info bear["idleSound"]       # logs minecraft:entity.polar_bear.ambient
log info bear["tick"]            # logs mypack:entities/bear/tick
log info bear["animation/hurt"]  # logs mypack:entities/bear/animation/hurt
```
##### `*` : `*?`
*variable*
Returns the value associated with the specified key. This can only access values named as identifiers; to access values with keys of any string, use the accessor instead.
Note: New properties can't be added through dot notation; only properties that have been declared inside the entity body can be edited.
Example:
```tdn
# file: mypack:entities/bear.tdn

define entity bear minecraft:polar_bear {
    var idleSound = resource<minecraft:entity.polar_bear.ambient>

    ticking function tick {
        # ...
    }

    function animation/hurt {
        # ...
    }
}

log info bear.idleSound         # logs minecraft:entity.polar_bear.ambient
log info bear.tick              # logs mypack:entities/bear/tick
```
##### idTag : `string`
*readonly*
Contains the tag that identifies entities of this type or component. This is added to the Tags `tag_list` of the entity when created, or added through the custom component command.
Example:
```tdn
# file: mypack:entities.tdn

define entity bear minecraft:polar_bear {}
define entity component animatable {}

log info bear.idTag         # logs trident-entity.mypack.bear
log info animatable.idTag   # logs trident-component.mypack.animatable
```
##### baseType : `resource?`
*readonly*
Contains the resource location representing the base entity type of this entity. This is always null for entity components.
Example:
```tdn
# file: mypack:entities.tdn

define entity bear minecraft:polar_bear {}
define entity component animatable {}

log info bear.baseType         # logs minecraft:polar_bear
log info animatable.baseType   # logs null
```
##### getSettingNBT: `function() : tag_compound`
*readonly*
Returns a `tag_compound` that can be used to create an entity of this type, or an entity with this component.
Example:
```tdn
# file: mypack:entities.tdn

define entity bear minecraft:polar_bear {
    default nbt {Glowing:1b}
}
define entity component invisible {
    default nbt {ActiveEffects:[{Id:14b,Amplifier:0b,Duration:100000}]}
}

log info bear.getSettingNBT()
# logs {Tags:["trident-entity.mypack.bear"],Glowing:1b,id:"minecraft:polar_bear"}
log info invisible.getSettingNBT()
# logs {Tags:["trident-component.mypack.invisible"],ActiveEffects:[{Id:14b,Amplifier:0b,Duration:100000}]}
```
##### getMatchingNBT: `function() : tag_compound`
*readonly*
Returns a `tag_compound` that can be used to match an entity of this type, or an entity with this component, using its idTag.
Example:
```tdn
# file: mypack:entities.tdn

define entity bear minecraft:polar_bear {
    default nbt {Glowing:1b}
}
define entity component invisible {
    default nbt {ActiveEffects:[{Id:14b,Amplifier:0b,Duration:100000}]}
}

log info bear.getMatchingNBT()
# logs {Tags:["trident-entity.mypack.bear"]}
log info invisible.getMatchingNBT()
# logs {Tags:["trident-component.mypack.invisible"]}
```

### Custom Items
*Identifier:* `custom_entity`
Values of type `custom_item` represent blueprints for an user-defined non-default item. These typically contain the values defined in their body. They can only be created via the define item instruction. More at the Custom Items section.
```tdn
define item staff minecraft:snowball#3 {
    default nbt {Enchantments:[{}]}

    var useSound = resource<minecraft:item.totem.use>

    on used function use {
        playsound ${this.useSound} master @a
    }
}

give @a $staff
```
#### Members
**Note: This data type features dynamic members (user-made member keys), as well as static members (those given by the language). User-made members with the same name as language-provided members are valid, but they will hide the language-defined member for that object.**

##### Indexer: `custom_item[key : string] : *?`
*variable*
Returns the value associated with the specified key.
**Note: New properties can't be added through the accessor; only properties that have been declared inside the item body can be edited.**
Example:
```tdn
# file: mypack:items/staff.tdn

define item staff minecraft:snowball#3 {
    default nbt {Enchantments:[{}]}

    var useSound = resource<minecraft:item.totem.use>

    on used function use {
        playsound ${this.useSound} master @a
    }

    on dropped function other/dropped {
        # ...
    }
}

log info staff["useSound"]       # logs minecraft:item.totem.use
log info staff["use"]            # logs mypack:items/staff/use
log info staff["other/dropped"]  # logs mypack:items/staff/other/dropped
```
##### `*` : `*?`
*variable*
Returns the value associated with the specified key. This can only access values named as identifiers; to access values with keys of any string, use the accessor instead.
**Note: New properties can't be added through dot notation; only properties that have been declared inside the item body can be edited.**
Example:
```tdn
# file: mypack:items/staff.tdn

define item staff minecraft:snowball#3 {
    default nbt {Enchantments:[{}]}

    var useSound = resource<minecraft:item.totem.use>

    on used function use {
        playsound ${this.useSound} master @a
    }

    on dropped function other/dropped {
        # ...
    }
}

log info staff.useSound       # logs minecraft:item.totem.use
log info staff.use            # logs mypack:items/staff/use
```
##### itemCode : `int`
*readonly*
Contains the int used to identify this custom Trident item from those of a different type. This is added to a custom TridentCustomItem `tag_int` to the item tag upon creation or for testing.
Example:
```tdn
# file: mypack:items/staff.tdn

define item staff minecraft:snowball#3 {}

log info staff.itemCode       # logs 1721657579
```
##### baseType : `resource`
*readonly*
Contains the resource location representing the base item type of this item.
Example:
```tdn
# file: mypack:items/staff.tdn

define item staff minecraft:snowball#3 {}

log info staff.baseType       # logs minecraft:snowball
```
##### getSlotNBT: `function() : tag_compound`
*readonly*
Returns a `tag_compound` that can be used to create an item of this type. This includes the id, Count and tag tags of a typical item compound.
Example:
```tdn
# file: mypack:items/staff.tdn

define item staff minecraft:snowball#3 {
    default nbt {Enchantments:[{}]}}
}

log info staff.getSlotNBT()
# logs {tag:{TridentCustomItem:1721657579,CustomModelData:3,Enchantments:[{}]},id:"minecraft:snowball",Count:1b}
```
##### getItemTag: `function() : tag_compound`
*readonly*
Returns the item tag of this item, containing all its initial data. This does not include the base ID of the item.
Example:
```tdn
# file: mypack:items/staff.tdn

define item staff minecraft:snowball#3 {
    default nbt {Enchantments:[{}]}}
}

log info staff.getItemTag()
# logs {TridentCustomItem:1721657579,CustomModelData:3,Enchantments:[{}]}
```
##### getMatchingNBT: `function() : tag_compound`
*readonly*
Returns a `tag_compound` that can be used to match an item of this type using its itemCode.
Example:
```tdn
# file: mypack:items/staff.tdn

define item staff minecraft:snowball#3 {
    default nbt {Enchantments:[{}]}}
}

log info staff.getMatchingNBT()
# logs {TridentCustomItem:1721657579}
```

### UUIDs
*Identifier:* `uuid`
Values of type UUID represent an immutable universally unique identifier. A UUID represents a 128-bit value, and is commonly used in Minecraft for identifying entities and attribute modifiers. They can be created via the uuid literal or constructor:
```tdn
var id0 = uuid<0-0-0-0-0>
var id1 = uuid<1-2-3-4-5>

attribute @s generic.armor modifier add $id0 myAttribute0 5 add
attribute @s generic.armor modifier add $id1 myAttribute1 2 multiply
```

#### Constructors
```tdn
new uuid() : uuid
```
Generates a random UUID using the `trident-util:native@Random.PROJECT_RANDOM` object, meaning it will be consistent between compilations yet unique for your project. UUIDs generated this way will be version 4 UUIDs that conform to [RFC 4122]().
```tdn
new uuid(raw : string) : uuid
```
Parses the given string and creates a UUID out of it.
```tdn
new uuid(random : trident-util:native@Random) : uuid
```
Creates a random UUID using the next 4 ints returned by the nextInt method of the given Random object. UUIDs generated this way will be version 4 UUIDs that conform to [RFC 4122]().
Examples:
```tdn
log info new uuid("0-0-0-0-0")  # Fixed
log info new uuid("1-2-3-4-5")  # Fixed
log info new uuid()             # Random, consistent across compilations
log info new uuid(new Random()) # Random, different every compilation
```
#### Conversions
- `nbt_value` & `tag_int_array` (explicit): Creates an array with 4 ints corresponding to this UUID. Example:
  ```tdn
  log info (tag_int_array) new uuid("1-2-3-4-5")
  # logs [I;1,131075,262144,5]
  ```

### Functions
*Identifier:* `function`
These values represent dynamic functions that can take parameters, return a value, and insert commands into the file currently being written. They can be called using the function name followed by parentheses.
Each parameter may or may not be constrained to a type, and the return value may also be constrained by placing the constraint after the parameter list and before the opening brace.
Example:
```tdn
var rand = function(min : int, max : int) : pointer {
    function $generate_random
    set RANDOM_TEMP->global = ${max - min}
    scoreboard players operation RANDOM global %= RANDOM_TEMP global
    scoreboard players add RANDOM global $min
    return pointer<RANDOM->global>
}

scoreboard players operation @s offset += deref ${rand(-16, 17)}

# Result:
#  rand() call begin
function stt:utils/generate_random
scoreboard players set RANDOM_TEMP global 33
scoreboard players operation RANDOM global %= RANDOM_TEMP global
scoreboard players add RANDOM global 16
#  rand() call end
scoreboard players operation @s offset += RANDOM global
```
Parameters can be passed to a function by name, which allows them to be passed out of order. Here's an example:
```tdn
var testFunction = function(a : int, b : int) {
    log info "a: " + a
    log info "b: " + b
}

eval testFunction(b: 1, a: 2)
# Logs:
#    a: 2
#    b: 1
```

#### Members

##### formalParameters : `list`
*get*
Retrieves a list of the parameter names defined for this function. Will be an empty list if the function does not define any parameters OR if the function is language-provided.
Example:
```tdn
log info function(min, max : int) {}.formalParameters
# logs [{nullable: true, name: "min", type: null}, {nullable: false, name: "max", type: type_definition<int>}]
```
##### declaringFile : `resource?`
*get*
Retrieves a resource location specifying the static function it was declared from. Will always be null for language-provided functions.
Example:
```tdn
# file: mypack:function_tests
log info function(min, max) {}.declaringFile  # logs mypack:function_tests
```

### Exceptions
*Identifier:* `exception`
These values represent exceptions or errors thrown by the program logic. Values of type exception are only created when an exception is thrown.
Example:
```tdn
# file: mypack:exceptions
try {
    throw "An error occurred"
} catch(ex) {
    log info ex
}
```
#### Members

##### message : `string`
*readonly*
Contains a brief description of the exception.
Example:
```tdn
# file: mypack:exceptions
try {
    throw "An error occurred"
} catch(ex) {
    log info ex.message # logs "An error occurred"
}
```
##### extendedMessage : `string`
*readonly*
Contains a long description of the exception, detailing the error type, message and stack trace.
Example:
```tdn
file: mypack:exceptions
try {
    throw "An error occurred"
} catch(ex) {
    log info ex.extendedMessage
      # logs An error occurred
      #   at mypack:exceptions ~ <body>
      #   at mypack:exceptions ~ <body> (exceptions.tdn:2)
}
```
##### line : `int`
*readonly*
Contains the line from the file at which the exception was thrown (starting from 1).
Example (with line numbers):
```tdn
# file: mypack:exceptions
try {
    throw "An error occurred"
} catch(ex) {
    log info ex.line # logs 2
}
```

##### column : `int`
*readonly*
Contains the column from the file at which the exception was thrown (starting from 1).
Example (with line numbers):
```tdn
# file: mypack:exceptions
try {
    throw "An error occurred"
} catch(ex) {
    log info ex.line # logs 5
}
```
##### index : `int`
*readonly*
Contains the index from the file at which the exception was thrown (starting from 0).
Example (with line numbers):
```tdn
# file: mypack:exceptions
1 try {
2     throw "An error occurred"
3 } catch(ex) {
4     log info ex.line # logs 10
5 }
```

##### type : `string`
*readonly*
Contains a key of the exception type, that describes what could have caused it. Will always return one of the following:
- `USER_EXCEPTION`
- `TYPE_ERROR`
- `ARITHMETIC_ERROR`
- `COMMAND_ERROR`
- `INTERNAL_EXCEPTION`
- `STRUCTURAL_ERROR`
- `LANGUAGE_LEVEL_ERROR`
- `DUPLICATION_ERROR`
- `IMPOSSIBLE`
Example:
```tdn
# file: mypack:exceptions
try recovering {
    throw "An error occurred"
    eval 1 / 0
    summon ${1}
    summon player
} catch(exceptions) {
    for(ex in exceptions) {
        log info ex.type
        # logs:
        #     "USER_EXCEPTION"
        #     "ARITHMETIC_ERROR"
        #     "TYPE_ERROR"
        #     "COMMAND_ERROR"
    }
}
```
All exceptions thrown by the throw instruction will be of type `USER_EXCEPTION`. The type `IMPOSSIBLE` is reserved for language bugs, and typically signifies that something has gone wrong with the compiler and that the user should report it.

### Type Definitions
*Identifier:* `type_definition`
Type Definitions are objects that represent each Interpolation Value type. They can be created via the `type_definition` literal, as well as the `type_definition.of()` function:
```tdn
var int_def = type_definition<int>
var real_def = type_definition<real>
var string_def = type_definition<string>
var dict_def = type_definition.of({"a":"b"})
var type_def_def = type_definition<type_definition>
# This last one is the same as the type_definition global constant
```
The static value of Custom Classes are also type definitions and can be used as such.

#### Members

##### is: `function(value : *?) : boolean`
*readonly*
Checks whether the given value is instance of the given type. Null values always return `false`.
Example:
```tdn
log info type_definition<int>.is(5)       # logs true
log info type_definition<string>.is("a")  # logs true
log info type_definition<real>.is(5)      # logs false
log info type_definition<real>.is(5.0)    # logs true
log info type_definition<string>.is(null) # logs false
```
This acts identically to the `is` operator.
```tdn
log info 5    is int       # logs true
log info "a"  is string    # logs true
log info 5    is real      # logs false
log info 5.0  is real      # logs true
log info null is string    # logs false
```
##### of: `function(value : *?) : type_definition`
*readonly*
Returns the type definition of a given value.
The type definition object you call this on has no effect on the return value; this is only found in all type definition instances so it can be used via the global `type_definition` constant (which is the same as `type_definition<type_definition>`).
Example:
```tdn
log info type_definition.of(5)      # logs type_definition<int>
log info type_definition.of(5.0)    # logs type_definition<real>
log info type_definition.of("a")    # logs type_definition<string>
log info type_definition.of(null)   # logs type_definition<null>
```