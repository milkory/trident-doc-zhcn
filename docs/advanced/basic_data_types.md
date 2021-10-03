# 基本数据类型

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

