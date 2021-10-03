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