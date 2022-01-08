# 原生库  
  
### ~~typeOf: `function(obj : *?) : type_definition`~~  
*Deprecated, use `type_definition.of(*?)`*  
*editable*  
Returns a string containing the type ID of the object passed into it.  
Example:  
  
```tdn
log info typeOf("foo")  
# logs "string"  
log info typeOf(nbt_value<[B; 0b, 1b, 2b, 3b]>)  
# logs "tag_byte_array"  
log info typeOf(resource<minecraft:custom>)  
# logs "resource"  
log info typeOf(null)  
# logs "null"  
```
  
### ~~isInstance: `function(obj : *?, type : string) : boolean`~~  
*editable*  
*Deprecated, use the `is` operator.*  
Checks whether the given object is of the type string passed into it.  
Example:  
  
```tdn
log info isInstance(1, "int")  
# logs false  
log info isInstance("foo","real")  
# logs false  
log info isInstance(nbt_value<[0b, 1b, 2b, 3b]>,"nbt_value")  
# logs true  
log info isInstance(null,"string")  
# logs false  
```
  
## Reflection  
`trident-util:native@Reflection`  
*public static final class*  
This class provides several methods for dealing with Trident Files.  
  
### `getMetadata(loc : resource) : dictionary`  
*public static method*  
Returns the metadata object of the file represented by the resource location. If the specified file doesn't have metadata, an empty object is returned. Note that the file to search must be a top-level file.  
Example:  
  
```tdn
# file: tdndemo:a.tdn  
@ metadata {"foo": ["bar", "baz"]}  
  
# file: tdndemo:reflection.tdn  
log info Reflection.getMetadata(resource<tdndemo:a>)  
# logs {"foo": ["bar", "baz"]}  
  
getFilesWithTag(loc : resource) : list  
public static method  
Returns a list of all top-level Trident files whose functions are tagged with the given resource location. Whether the given resource location is a tag or not does not affect the result. The resulting list contains the resource locations for all the matching top-level functions.  
Example:  
# file: tdndemo:a.tdn  
@ tag custom  
  
# file: tdndemo:b.tdn  
@ tag load  
@ tag custom  
  
# file: tdndemo:reflection.tdn  
log info Reflection.getFilesWithTag(resource<minecraft:custom>)  
# logs [tdndemo:a, tdndemo:b]  
```
  
### `getFilesWithMetaTag(loc : resource) : list`  
*public static method*  
Returns a list of all top-level Trident files with the given meta tag. The resulting list contains the resource locations for all the matching top-level functions.  
Example:  
  
```tdn
# file: tdndemo:b.tdn  
@ meta_tag custom  
  
# file: tdndemo:a.tdn  
@ tag custom  
  
# file: tdndemo:reflection.tdn  
log info Reflection.getFilesWithMetaTag(resource<minecraft:custom>)  
# logs [tdndemo:a]  
```
  
### `insertToFile(loc : resource, writer : function)`  
*public static method*  
Runs the given dynamic function within the context of the top-level file specified by the given resource location.  
Example:  
  
```tdn
# file: tdndemo:a.tdn  
say Hello  
  
# file: tdndemo:reflection.tdn  
eval Reflection.insertToFile(resource<tdndemo:a>, function() {  
    say World!  
})  
  
# output of file tdndemo:a  
say Hello  
say World!  
  
getCurrentFile() : resource  
public static method  
Returns the resource location of the function this is called from.  
Example:  
# file: tdndemo:reflection.tdn  
var testfunct = function() {  
    log info Reflection.getCurrentFile()  
}  
  
eval testfunct()  
# logs tdndemo:reflection  
  
define function inner {  
    log info Reflection.getCurrentFile()  
    # logs tdndemo:reflection/inner  
  
    eval testfunct()  
    # logs tdndemo:reflection  
}  
```
  
### `getWritingFile() : resource`  
*public static method*  
Returns the resource location of the function currently being written to.  
Example:  
  
```tdn
# file: tdndemo:reflection.tdn  
var testfunct = function() {  
    log info Reflection.getWritingFile()  
}  
  
eval testfunct()  
# logs tdndemo:reflection  
  
define function inner {  
    log info Reflection.getWritingFile()  
    # logs tdndemo:reflection/inner  
  
    eval testfunct()  
    # logs tdndemo:reflection/inner  
}  
```
  
### `getCurrentFilePath() : string`  
*public static method*  
Returns the path of the file this is called from  
Example:  
  
```tdn
# file: tdndemo:reflection.tdn  
  
log info Reflection.getCurrentFilePath()  
# logs datapack/data/tdndemo/functions/reflection.tdn  
```
  
## File  
`trident-util:native@File`  
*public static final class*  
Container class for File IO classes. The IO classes are defined all defined privately under `trident-util:native`, and the File class exposes them publicly through static final fields. Any access to each of the IO classes must be through the File class.  
  
## File.in  
`trident-util:native@in`  
*private static final class*  
This class provides methods for reading files within the project directory.  
  
### read(path : resource) : *  
*public static method*  
Returns the contents of the file at the given location, from the project directory.  
If the specified path represents a file, its text data is returned as a string. If the specified path represents a directory, its children's filenames are returned as a list of strings.  
Example:  
  
```tdn
# file: /structure_gen/oak_tree.json  
{  
    "trunk_block": "minecraft:oak_log",  
    "leaf_block": "minecraft:oak_leaves",  
    "trunk_length": [4, 7],  
    "leaf_shape": "bush"  
}  
# file: /structure_gen/birch_tree.json  
{  
    "trunk_block": "minecraft:birch_log",  
    "leaf_block": "minecraft:birch_leaves",  
    "trunk_length": [5, 9],  
    "leaf_shape": "bush"  
}  
# file: /datapack/data/tdndemo/functions/io.tdn  
  
log info File.in.read("structure_gen")  
# logs ["oak_tree.json", "birch_tree.json"]  
  
log info JSON.parse(File.in.read("structure_gen/birch_tree.json"))  
# logs {leaf_block: "minecraft:birch_leaves", leaf_shape: "bush", trunk_length: [5, 9], trunk_block: "minecraft:birch_log"}  
```
  
### `exists(path : string) : boolean`  
*public static method*  
Returns whether the file at the specified path within the input project directory exists.  
Example:  
  
```tdn
log info File.exists("datapack/data/test/functions")  
```
  
### `isDirectory(path : string) : boolean`  
*public static method*  
Returns whether the file at the specified path within the input project directory exists and is a directory.  
Example:  
  
```tdn
log info File.isDirectory("datapack/data/test/functions")  
```
  
### `write(path : string, content : string)`  
*public static method*  
Writes the given string to the file at the specified path within the input project directory.  
Example:  
  
```tdn
eval File.in.write(  
    "datapack/data/test/functions/function_for_next_compilation.tdn",  
    "@on compile\nlog info \"Hello from the past!\""  
)  
```
  
### `wasFileChanged(path : string) : boolean`  
*public static method*  
Returns whether the file at the specified path within the input project directory was changed since the last successful compilation.  
Example:  
  
```tdn
log info File.in.wasFileChanged(Reflection.getCurrentFilePath())  
```
  
## File.out  
`trident-util:native@out`  
*private static final class*  
This object provides methods for writing to the output data pack and resource pack files.  
  
### `writeData(path : string, content : string)`  
*public static method*  
Writes the given string to the file at the specified path within the output data pack.  
Example:  
  
```tdn
eval File.out.writeData(  
    "data/custom/tags/blocks/unbreakable.json",  
    JSON.stringify(  
        {  
            "values": [  
                "minecraft:dark_oak_planks",  
                "minecraft:chest",  
                "minecraft:iron_block"  
            ]  
        },  
        true  
    )  
)  
```
  
### `writeResource(path : string, content : string)`  
*public static method*  
Writes the given string to the file at the specified path within the output resource pack, if there is a resource pack in the project.  
Example:  
  
```tdn
eval File.out.writeResource(  
    "assets/minecraft/sounds.json",  
    JSON.stringify(  
        {  
            "block.enderchest.open": {  
                "category": "block",  
                "replace": true,  
                "sounds": [  
                    "blank"  
                ]  
            }  
        },  
        true  
    )  
)  
```
  
## JSON  
`trident-util:native@JSON`  
*public static final class*  
This class provides several methods for converting from JSON strings to complex Trident values and vice versa.  
  
### `parse(s : string) : *`  
*public static method*  
Parses the string argument and attempts to convert it into Trident values, in the following manner:  
- JSON Objects become dictionaries  
- JSON Lists become lists  
- JSON Numbers become integers (if they can be expressed as such), otherwise, real numbers  
- JSON Booleans become booleans  
- JSON Strings become strings  
Example:  
  
```tdn
log info JSON.parse('{"a": 1.8, "b": ["1", 2.0, true]}')   
# logs {a: 1.8, b: ["1", 2, true]}  
```
  
### `stringify` (multiple overloads)  
```tdn
stringify(obj : string,     prettyPrinting : boolean?) : string  
stringify(obj : boolean,    prettyPrinting : boolean?) : string  
stringify(obj : int,        prettyPrinting : boolean?) : string  
stringify(obj : real,       prettyPrinting : boolean?) : string  
stringify(obj : list,       prettyPrinting : boolean?) : string  
stringify(obj : dictionary, prettyPrinting : boolean?) : string  
```
*public static method*  
Converts the given value into a JSON string, in the following manner:  
- Dictionaries become JSON Objects  
- Lists become JSON Lists  
- Reals and Integers become JSON Numbers  
- Strings and Resource Locations become JSON Strings  
- Booleans become JSON Booleans  
Any other values will not be present in the return value.  
If prettyPrinting is true, the output will be spread over multiple lines and indented. If not specified, prettyPrinting is not enabled.  
Example:  
  
```tdn
log info JSON.stringify({a: 1.8, b: ["1", 2, true, entity<@a>], c: resource<tick>}, true)  
# logs {  
#   "a": 1.8,  
#   "b": [  
#     "1",  
#     2,  
#     true  
#   ],  
#   "c": "minecraft:tick"  
# }  
```
  
## Text  
`trident-util:native@Text`  
*public static final class*  
This class provides several methods for dealing with Text Components.  
  
### `parse(s : string) : text_component`  
*public static method*  
Parses the string argument and attempts to convert it into a Text Component. Roughly equivalent to passing the result of JSON.parse(s) to new text_component(o)  
Example:  
  
```tdn
log info Text.parse('["Hello ", {"text": "World", "color": "green"}]')  
# logs ["Hello ",{"text":"World","color":"green"}] (of type text_component)  
```
  
## Character  
`trident-util:native@Character`  
*public static final class*  
This class provides methods for creating and getting info about characters.  
  
### `fromCodePoint(codePoint : int) : string`  
*public static method*  
Creates a single-character string with the unicode character of the given code point.  
Example:  
  
```tdn
log info Character.fromCodePoint(230)  
# logs æ  
```
  
### `toCodePoint(char : string) : int`  
*public static method*  
Retrieves the code point value of the first character of the given string. Throws an exception if the string is empty.  
Example:  
  
```tdn
log info Character.toCodePoint("æ")  
# logs 230  
```
  
### `getName(char : string) : string`  
*public static method*  
Returns the Unicode name of the first character in the given string. Throws an exception if the string is empty.  
Example:  
  
```tdn
log info Character.getName("æ")  
# logs LATIN SMALL LETTER AE  
```
  
### `isLetter(char : string) : boolean`  
*public static method*  
Returns a boolean dictating whether the first character in the given string is a letter. Throws an exception if the string is empty.  
Example:  
  
```tdn
log info Character.isLetter("æ") # logs true  
log info Character.isLetter("5") # logs false  
```
  
### `1isDigit(char : string) : boolean`  
*public static method*  
Returns a boolean dictating whether the first character in the given string is a digit. Throws an exception if the string is empty.  
Example:  
  
```tdn
log info Character.isDigit("æ") # logs false  
log info Character.isDigit("5") # logs true  
```
  
### `isWhitespace(char : string) : boolean`  
*public static method*  
Returns a boolean dictating whether the first character in the given string is whitespace. Throws an exception if the string is empty.  
Example:  
  
```tdn
log info Character.isWhitespace(" ")  # (space)     logs true  
log info Character.isWhitespace("5")  #             logs false  
log info Character.isWhitespace("\n") # (line feed) logs true  
```
  
### `isUpperCase(char : string) : boolean`  
*public static method*  
Returns a boolean dictating whether the first character in the given string is an uppercase letter. Throws an exception if the string is empty.  
Example:  
  
```tdn
log info Character.isUpperCase("5") # logs false  
log info Character.isUpperCase("a") # logs false  
log info Character.isUpperCase("A") # logs true  
```
  
### `isLowerCase(char : string) : boolean`  
*public static method*  
Returns a boolean dictating whether the first character in the given string is a lowercase letter. Throws an exception if the string is empty.  
Example:  
  
```tdn
log info Character.isLowerCase("5") # logs false  
log info Character.isLowerCase("a") # logs true  
log info Character.isLowerCase("A") # logs false  
```
  
## Tags  
`trident-util:native@Tags`  
*public static final class*  
This class provides methods for creating and getting info about type tags.  
  
### `createTag(category : string, location : resource, values : list[resource])`  
*public static method*  
Creates a tag of the given category at the given resource location, and adds the provided list of resource location values to that tag (all must be valid types of the specified category, that is, they must exist).  
Refer to the complementary documentation ([Definition Packs > Types]()) for category names and info.  
Example:  
  
```tdn
eval Tags.createTag(  
        "block",  
        resource<#custom:ignore>,  
        [  
                resource<minecraft:glass>,  
                resource<minecraft:sponge>,  
                resource<#minecraft:stained_glass>  
        ]  
)  
```
  
### `exists(category : string, location : resource) : boolean`  
*public static method*  
Checks whether the specified tag in the given category exists.  
Refer to the complementary documentation ([Definition Packs > Types]()) for category names and info.  
Returns true if a tag exists for it, false otherwise.  
Example:  
  
```tdn
log info Tags.exists("entity", resource<#minecraft:skeletons>)  
# logs true  
log info Tags.exists("block", resource<#minecraft:skeletons>)  
# logs false (unless a user-created #skeletons block tag exists in the project)  
```
  
### `tagContainsValue(category : string, tagLocation : resource, valueLocation : resource) : boolean`  
*public static method*  
Checks whether the specified tag in the given category contains the provided value.  
Refer to the complementary documentation ([Definition Packs > Types]()) for category names and info.  
Example:  
  
```tdn
eval Tags.tagContainsValue(  
        "block",  
        resource<#minecraft:flower_pots>,  
        resource<minecraft:potted_poppy>  
)  
# logs true  
eval Tags.tagContainsValue(  
        "block",  
        resource<#minecraft:slabs>,  
        resource<#minecraft:wooden_slabs>  
)  
# logs true  
eval Tags.tagContainsValue(  
        "block",  
        resource<#minecraft:slabs>,  
        resource<minecraft:oak_slab>  
)  
# logs true  
eval Tags.tagContainsValue(  
        "block",  
        resource<#minecraft:wooden_slabs>,  
        resource<minecraft:stone_slab>  
)  
# logs false  
```
  
## MinecraftTypes  
`trident-util:native@MinecraftTypes`  
*public static final class*  
This class provides methods for gathering info about all minecraft-defined types.  
  
### `getDefinitionsForCategory(category : string) : dictionary`  
*public static method*  
Retrieves an object with all the names and properties of all types of a certain type category, provided by the definition pack used in Trident. Refer to the complementary documentation ([Definition Packs > Types]()) for category names and info.  
Example:  
  
```tdn
log info MinecraftTypes.getDefinitionsForCategory("effect")  
# logs {"minecraft:speed": {"id": 1,"type": "positive"},"minecraft:slowness": {"id": 2,"type": "negative"},   
```
  
### `exists` (multiple overloads)  
```tdn
exists(category : string, name : string) : boolean  
exists(category : string, location : resource) : boolean  
```
*public static method*  
Checks whether the given resource location or string represents a valid type of the given category. Refer to the complementary documentation ([Definition Packs > Types]()) for category names and info.  
Returns true if a type exists for it, false otherwise.  
Example:  
  
```tdn
log info MinecraftTypes.exists("enchantment", resource<minecraft:mending>)  
# logs true  
log info MinecraftTypes.exists("gamemode", "hardcore")  
# logs false  
```
  
## Block  
`trident-util:native@Block`  
*public static final class*  
This class provides several methods for dealing with block types.  
  
### `exists(location : resource) : boolean`  
*public static method*  
Checks whether the given resource location represents a valid block type. Returns true if a block type exists for it, false otherwise.  
Example:  
  
```tdn
log info Block.exists(resource<minecraft:fire>)    # logs true  
log info Block.exists(resource<minecraft:string>)  # logs false  
```
  
### `getAll() : list`  
*public static method*  
Creates and returns a list containing resource locations for all the block types in no particular order.  
Example:  
  
```tdn
log info Block.getAll()   # logs [minecraft:potted_acacia_sapling, minecraft:nether_brick_slab ... minecraft:pink_concrete]  
```
  
## Item  
`trident-util:native@Item`  
*public static final class*  
This class provides several methods for dealing with item types.  
  
### `exists(location : resource) : boolean`  
*public static method*  
Checks whether the given resource location represents a valid item type. Returns true if a item  type exists for it, false otherwise.  
Example:  
  
```tdn
log info Item.exists(resource<minecraft:fire>)    # logs false  
log info Item.exists(resource<minecraft:string>)  # logs true  
```
  
### `getAll() : list`  
*public static method*  
Creates and returns a list containing resource locations for all the item types in no particular order.  
Example:  
  
```tdn
log info Item.getAll()   # logs [minecraft:nether_brick_slab, minecraft:andesite_slab, minecraft:egg ... minecraft:carrot]  
```
  
## Project  
`trident-util:native@Project`  
*public static final class*  
This class provides several methods for dealing with the current Trident Project.  
  
### `getTargetVersion() : list`  
*public static method*  
Returns a list representing the target version of the running project. The first element is the Major release, the second is the Minor release, and the third number is the Patch. In practice, the Major number will always be 1 and the Patch number will always be 0.  
Example:  
  
```tdn
log info Project.getTargetVersion()    # logs [1, 16, 0] (on a project targeting 1.16)  
```
  
### `getFeatureBoolean(key : string, defaultValue : boolean?) : boolean`  
*public static method*  
Checks the feature map provided to the project via the build configuration for the given feature key, and returns a boolean based on its value. If the given key corresponds to a boolean in the feature map, that value will be returned. Otherwise, defaultValue is returned (or false if defaultValue is omitted).  
Example:  
  
```tdn
log info Project.getFeatureBoolean("command.attribute")  
# logs true (on a project targeting 1.16)  
  
log info Project.getFeatureBoolean("textcomponent.hex_color", false)  
# logs true (on a project targeting 1.16)  
```
  
### `getFeatureInt(key : string, defaultValue : int?) : int`  
*public static method*  
Checks the feature map provided to the project via the build configuration for the given feature key, and returns an integer based on its value. If the given key corresponds to an integer in the feature map, that value will be returned. Otherwise, defaultValue is returned (or 0 if defaultValue is omitted).  
Example:  
  
```tdn
log info Project.getFeatureInt("objectives.max_length")  
# logs 16  
```
  
### `getFeatureString(key : string, defaultValue : string?) : string?`  
*public static method*  
Checks the feature map provided to the project via the build configuration for the given feature key, and returns a string based on its value. If the given key corresponds to a string in the feature map, that value will be returned. Otherwise, defaultValue is returned (or null if defaultValue is omitted).  
Example:  
  
```tdn
log info Project.getFeatureString("objectives.regex")  
# logs "[A-Za-z0-9_.\-+]+"  
log info Project.getFeatureString("function.export_path")  
# logs "data/$NAMESPACE$/functions/"  
```
  
## Math  
`trident-util:native@Math`  
*public static final class*  
A port of `java.lang.Math` for Trident. The Math class contains methods for performing basic numeric operations such as the elementary exponential, logarithm, square root, and trigonometric functions.  
  
### `PI : real`  
*public static final*  
The real value that is closer than any other to $\pi$, the ratio of the circumference of a circle to its diameter.  
Example:  
  
```tdn
log info Math.PI       #logs 3.141592653589793  
```
  
### `E : real`  
*public static final*  
The double value that is closer than any other to $e$ (Euler's Number), the base of the natural logarithms.  
Example:  
  
```tdn
log info Math.E        #logs 2.718281828459045  
```
  
### `pow(a : real, b : real) : real`  
*public static method*  
Returns the real value of the first argument raised to the power of the second argument.  
Example:  
  
```tdn
log info Math.pow(2, 8)   # logs 256.0  
log info Math.pow(2, -8)  # logs 0.00390625  
```
  
### `min` (multiple overloads)  
```tdn
min(a : int, b : int) : int  
min(a : real, b : real) : real  
```
*public static method*  
Returns the smallest (closest to negative infinity) of two values. If both parameters are integers, the returned value will also be an integer. Otherwise a real number is returned.  
Example:  
  
```tdn
log info Math.min(2, -8)   # logs -8  
```
  
### `max` (multiple overloads)  
```tdn
max(a : int, b : int) : int  
max(a : real, b : real) : real  
```
*public static method*  
Returns the largest (closest to positive infinity) of two values. If both parameters are integers, the returned value will also be an integer. Otherwise a real number is returned.  
Example:  
  
```tdn
log info Math.max(2, -8)   # logs 2  
```
  
### `abs` (multiple overloads)  
```tdn
abs(x : int) : int  
abs(x : real) : real  
```
*public static method*  
Returns the absolute value of a value. If the argument is not negative, the argument is returned. If the argument is negative, the negation of the argument is returned.  
The return value will match the type of the parameter (int stays int, real stays real).  
Example:  
  
```tdn
log info Math.abs(-8)   # logs 8  
log info Math.abs(8)    # logs 8  
```
  
### `floor(x : real) : real`  
*public static method*  
Returns the largest (closest to positive infinity) real value that is less than or equal to the argument and is equal to a mathematical integer.  
Example:  
  
```tdn
log info Math.floor(-0.1)   # logs -1  
log info Math.floor(0.1)    # logs 0  
```
  
### `ceil(x : real) : real`  
*public static method*  
Returns the smallest (closest to negative infinity) real value that is greater than or equal to the argument and is equal to a mathematical integer.  
Example:  
  
```tdn
log info Math.ceil(-0.1)   # logs 0  
log info Math.ceil(0.1)    # logs 1  
```
  
### `round(x : real) : real`  
*public static method*  
Returns the closest real value that is equal to a mathematical integer, with ties rounding to positive infinity.  
Example:  
  
```tdn
log info Math.round(-0.9)   # logs -1  
log info Math.round(-0.1)   # logs 0  
log info Math.round(0.5)    # logs 1  
```
  
### `floorMod(x : int, y : int) : int`  
*public static method*  
Returns the floor modulus of the int arguments.  
The floor modulus is `x - (floorDiv(x, y) * y)`, has the same sign as the divisor `y`, and is in the range of `-abs(y) < r < +abs(y)`  
The difference in values between floorMod and the % operator is due to the difference between floorDiv that returns the integer less than or equal to the quotient and the / operator that returns the integer closest to zero.  
Example:  
  
```tdn
log info Math.floorMod(4, 3)   # logs 1  
log info 4 % 3                 # logs 1  
  
log info Math.floorMod(4, -3)  # logs -2  
log info 4 % -3                # logs 1  
  
log info Math.floorMod(-4, 3)  # logs 2  
log info -4 % 3                # logs -1  
  
log info Math.floorMod(-4, -3) # logs -1  
log info -4 % -3               # logs -1  
```
  
### `floorDiv(x : int, y : int) : int`  
*public static method*  
Returns the largest (closest to positive infinity) int value that is less than or equal to the algebraic quotient.  
Normal integer division operates under the round to zero rounding mode (truncation). This operation instead acts under the round toward negative infinity (floor) rounding mode. The floor rounding mode gives different results than truncation when the exact result is negative.  
Example:  
  
```tdn
log info Math.floorDiv(4, 3)   # logs 1  
log info 4 / 3                 # logs 1  
  
log info Math.floorDiv(-4, 3)  # logs -2  
log info -4 / 3                # logs -1  
```
  
### `sin(rad : real) : real`  
*public static method*  
Returns the trigonometric sine of an angle in radians.  
Example:  
  
```tdn
log info Math.sin(0)             # logs 0.0  
log info Math.sin(Math.PI / 2)   # logs 1.0  
log info Math.sin(Math.PI)       # logs 1.2246467991473532E-16  
```
  
### `cos(rad : real) : real`  
*public static method*  
Returns the trigonometric cosine of an angle in radians.  
Example:  
  
```tdn
log info Math.cos(0)             # logs 1.0  
log info Math.cos(Math.PI / 2)   # logs 6.123233995736766E-17  
log info Math.cos(Math.PI)       # logs -1.0  
```
  
### `tan(rad : real) : real`  
*public static method*  
Returns the trigonometric tangent of an angle in radians.  
Example:  
  
```tdn
log info Math.tan(0)             # logs 0.0  
log info Math.tan(Math.PI / 2)   # logs 1.633123935319537E16  
log info Math.tan(Math.PI)       # logs -1.2246467991473532E-16  
```
  
### `sinh(x : real) : real`  
*public static method*  
Returns the hyperbolic sine of a real value.  
The hyperbolic sine of x is defined to be $\frac{e^x - e^{-x}}{2}$ where $e$ is Euler's number.  
Example:  
  
```tdn
log info Math.sinh(0)             # logs 0.0  
log info Math.sinh(1)             # logs 1.1752011936438014  
```
  
### `cosh(x : real) : real`  
*public static method*  
Returns the hyperbolic cosine of a real value.  
The hyperbolic cosine of x is defined to be $\large\frac{e^x + e^{-x}}{2}$ where $e$ is Euler's number.  
Example:  
  
```tdn
log info Math.cosh(0)             # logs 1.0  
log info Math.cosh(1)             # logs 1.543080634815244  
```
  
### `tanh(x : real) : real`  
*public static method*  
Returns the hyperbolic tangent of a real value.  
The hyperbolic tangent of x is defined to be $\large\frac{e^x - e^{-x}}{e^x + e^{-x}}$ where $e$ is Euler's number.  
Example:  
  
```tdn
log info Math.tanh(0)             # logs 0.0  
log info Math.tanh(1)             # logs 0.7615941559557649  
```
  
### `asin(a : real) : real`  
*public static method*  
Returns the arc sine of a value; the returned angle is in the range $-\frac{\pi}{2}$ through $\frac{\pi}{2}$ (in radians).  
Example:  
  
```tdn
log info Math.asin(0)              # logs 0.0  
log info Math.asin(1)              # logs 1.5707963267948966 (pi/2)  
log info Math.asin(Math.sqrt(2)/2) # logs 0.7853981633974484 (pi/4)  
```
  
### `acos(a : real) : real`  
*public static method*  
Returns the arc cosine of a value; the returned angle is in the range $-\frac{\pi}{2}$ through $\frac{\pi}{2}$ (in radians).  
Example:  
  
```tdn
log info Math.acos(0)              # logs 1.5707963267948966 (pi/2)  
log info Math.acos(1)              # logs 0.0  
log info Math.acos(Math.sqrt(2)/2) # logs 0.7853981633974484 (pi/4)  
```
  
### `atan(a : real) : real`  
*public static method*  
Returns the arc tangent of a value; the returned angle is in the range $-\frac{\pi}{2}$ through $\frac{\pi}{2}$ (in radians).  
Example:  
  
```tdn
log info Math.atan(0)              # logs 0.0  
log info Math.atan(1)              # logs 0.7853981633974484 (pi/4)  
log info Math.atan(Math.sqrt(2)/2) # logs 0.6154797086703874  
```
  
### `atan2(y : real, x : real) : real`  
*public static method*  
Returns the angle theta from the conversion of rectangular coordinates $(x, y)$ to polar coordinates $(r, theta)$. This method computes the phase theta by computing an arc tangent of $\frac{y}{x}$ in the range of $-\pi$ to $\pi$.  
Example:  
  
```tdn
log info Math.atan2(1,Math.sqrt(3))    # logs 0.5235987755982989  (pi/6)  
log info Math.atan2(-1,Math.sqrt(3))   # logs -0.5235987755982989 (-pi/6)  
log info Math.atan2(1,-Math.sqrt(3))   # logs 2.6179938779914944  (5*pi/6)  
log info Math.atan2(-1,-Math.sqrt(3))  # logs -2.6179938779914944 (-5*pi/6)  
```
  
### `toRadians(angdeg : real) : real`  
*public static method*  
Converts an angle measured in degrees to an approximately equivalent angle measured in radians. The conversion from degrees to radians is generally inexact; users should not expect `Math.cos(Math.toRadians(90.0))` to exactly equal 0.0.  
Example:  
  
```tdn
log info Math.toRadians(0)         # logs 0.0  
log info Math.toRadians(30)        # logs 0.5235987755982988  
log info Math.toRadians(45)        # logs 0.7853981633974483  
log info Math.toRadians(60)        # logs 1.0471975511965976  
log info Math.toRadians(90)        # logs 1.5707963267948966  
```
  
### `toDegrees(angrad : real) : real`  
*public static method*  
Converts an angle measured in radians to an approximately equivalent angle measured in degrees. The conversion from radians to degrees is generally inexact.  
Example:  
  
```tdn
log info Math.toDegrees(0)         # logs 0.0  
log info Math.toDegrees(Math.PI/6) # logs 29.999999999999996  
log info Math.toDegrees(Math.PI/4) # logs 45.0  
log info Math.toDegrees(Math.PI/2) # logs 90.0  
log info Math.toDegrees(Math.PI)   # logs 180.0  
```
  
### `log(a : real) : real`  
*public static method*  
Returns the natural logarithm (base $e$) of a real value.  
Example:  
  
```tdn
log info Math.log(0)        # logs -Infinity  
log info Math.log(1)        # logs 0.0  
log info Math.log(Math.E)   # logs 1.0  
```
  
### `log10(a : real) : real`  
*public static method*  
Returns the base 10 logarithm of a real value.  
Example:  
  
```tdn
log info Math.log10(0)        # logs -Infinity  
log info Math.log10(1)        # logs 0.0  
log info Math.log10(10)       # logs 1.0  
log info Math.log10(100)      # logs 2.0  
```
  
### `log2(a : real) : real`  
*public static method*  
Returns the base 2 logarithm of a real value.  
Example:  
  
```tdn
log info Math.log2(0)        # logs -Infinity  
log info Math.log2(1)        # logs 0.0  
log info Math.log2(2)        # logs 1.0  
log info Math.log2(4)        # logs 2.0  
log info Math.log2(8)        # logs 3.0  
```
  
### `sqrt(a : real) : real`  
*public static method*  
Returns the correctly rounded positive square root of a real value.  
Example:  
  
```tdn
log info Math.sqrt(2)        # logs 1.4142135623730951  
log info Math.sqrt(4)        # logs 2.0  
log info Math.sqrt(16)       # logs 4.0  
log info Math.sqrt(256)      # logs 16.0  
```
  
### `cbrt(a : real) : real`  
*public static method*  
Returns the correctly rounded positive cube root of a real value.  
Example:  
  
```tdn
log info Math.cbrt(3)        # logs 1.4422495703074083  
log info Math.cbrt(8)        # logs 2.0  
log info Math.cbrt(27)       # logs 3.0  
log info Math.cbrt(81)       # logs 5.0  
```
  
### `exp(a : real) : real`  
*public static method*  
Returns Euler's number e raised to the power of a real value.  
Example:  
  
```tdn
log info Math.exp(0)        # logs 1.0  
log info Math.exp(1)        # logs 2.718281828459045  
log info Math.exp(2)        # logs 7.38905609893065  
```
  
### `signum(x : real) : real`  
*public static method*  
Returns the signum function of the argument; zero if the argument is zero, 1.0 if the argument is greater than zero, -1.0 if the argument is less than zero.  
Example:  
  
```tdn
log info Math.signum(-8)     # logs -1.0  
log info Math.signum(0)      # logs 0.0  
log info Math.signum(12)     # logs 1.0  
```
  
### `random` (multiple overloads)  
```tdn
random() : real  
random(min : real, max : real) : real  
```
*public static method*  
Returns a real value, in a range between the given min (inclusive) and max (exclusive), or 0.0 and 1.0 if the bounds are not specified. Returned values are chosen pseudorandomly with (approximately) uniform distribution from that range.  
Example:  
  
```tdn
log info Math.random()        # logs 0.40657443943172444  
log info Math.random()        # logs 0.08285686880762  
log info Math.random()        # logs 0.7925125273103358  
# Don't expect to get the same numbers as this example  
```
  
## Integer  
`trident-util:native@Integer`  
*public static final class*  
This class provides several methods for converting an int to a String and a String to an int, as well as other constants and methods useful when dealing with an int.  
  
### `MIN_VALUE : int`  
*public static final*  
A constant holding the minimum value an int can have, $-2^{31}$.  
Example:  
log info Integer.MIN_VALUE       #logs -2147483648  
  
### `MAX_VALUE : int`  
*public static final*  
A constant holding the maximum value an int can have, $2^{31} - 1$.  
Example:  
  
```tdn
log info Integer.MAX_VALUE       #logs 2147483647  
```
  
### `parseInt` (multiple overloads)  
```tdn
parseInt(s : string) : int  
parseInt(s : string, radix : int) : int  
```
*public static method*  
Parses the string argument as a signed integer in the radix specified by the second argument. The resulting integer value is returned. If the radix is left unspecified, it defaults to 10. Throws an exception if the resulting integer is outside of the valid signed integer range.  
Example:  
  
```tdn
log info Integer.parseInt("48")      # logs 48  
log info Integer.parseInt("42", 8)   # logs 34  
log info Integer.parseInt("A0", 16)  # logs 160  
```
  
### `parseUnsignedInt` (multiple overloads)  
```tdn
parseUnsignedInt(s : string) : int  
parseUnsignedInt(s : string, radix : int) : int  
```
*public static method*  
Parses the string argument as an unsigned integer in the radix specified by the second argument. The resulting integer value is returned. If the radix is left unspecified, it defaults to 10. Throws an exception if the resulting integer is outside of the valid unsigned integer range.  
Example:  
  
```tdn
log info Integer.parseInt("80000000", 16)         # ERROR  
log info Integer.parseUnsignedInt("80000000", 16) # -2147483648  
  
log info Integer.parseInt("FFFFFFFF", 16)         # ERROR  
log info Integer.parseUnsignedInt("FFFFFFFF", 16) # -1  
```
  
### `toString` (multiple overloads)  
```tdn
toString(i : int) : string  
toString(i : int, radix : int) : string  
```
*public static method*  
Returns a string representation of the first argument in the radix specified by the second argument. If the radix is left unspecified, it defaults to 10. Calling this method with radix 10 is equivalent to casting the parameter to a string.  
Example:  
  
```tdn
log info Integer.toString(48)        # logs 48  
log info Integer.toString(34, 8)     # logs 42  
log info Integer.toString(160, 16)   # logs a0  
```
  
### `toUnsignedString` (multiple overloads)  
```tdn
toUnsignedString(i : int) : string  
toUnsignedString(i : int, radix : int) : string  
```
*public static method*  
Returns a string representation of the first argument as an unsigned integer value in the radix specified by the second argument. If the radix is left unspecified, it defaults to 10.  
Example:  
  
```tdn
log info Integer.toUnsignedString(-1)     # 4294967295  
log info Integer.toUnsignedString(-1, 16) # ffffffff  
```
  
## Real  
`trident-util:native@Real`  
*public static final class*  
This class provides several methods for converting a real to a String and a String to a real, as well as other constants and methods useful when dealing with real numbers.  
  
### `Infinity : real`  
*public static final*  
A constant holding a positive infinity value.  
Example:  
  
```tdn
log info Real.Infinity            #logs Infinity  
```
  
### `NaN : real`  
*public static final*  
A constant holding a Not-a-Number (NaN) value.  
Example:  
  
```tdn
log info Real.NaN                 #logs NaN  
```
  
### `MIN_VALUE : real`  
*public static final*  
A constant holding the minimum finite value a real number can have, $-(2-2^{-52})\times 2^{1023}$.  
Example:  
  
```tdn
log info Real.MIN_VALUE           #logs -1.7976931348623157E308  
```
  
### `MAX_VALUE : real`  
*public static final*  
A constant holding the maximum finite value a real number can have, $(2-2^{-52})\times 2^{1023}$.  
Example:  
  
```tdn
log info Real.MAX_VALUE           #logs 1.7976931348623157E308  
```
  
### `MIN_POSITIVE_VALUE : real`  
*public static final*  
A constant holding the minimum positive value a real number can have, $2^{-1074}$.  
Example:  
  
```tdn
log info Real.MIN_POSITIVE_VALUE  #logs 4.9E-324  
```
  
### `parseReal(s : string) : real`  
*public static method*  
Returns a new real number initialized to the value represented by the specified String.  
Example:  
  
```tdn
log info Real.parseReal("-0.3")            # logs -0.3  
log info Real.parseReal("1")               # logs 1.0  
log info Real.parseReal("15.0000001")      # logs 15.0000001  
```
  
### `isFinite(r : real) : boolean`  
*public static method*  
Returns true if the argument is a finite floating-point value; returns false otherwise (for NaN and infinity arguments).  
Example:  
  
```tdn
log info Real.isFinite(48)             # logs true  
log info Real.isFinite(Real.Infinity)  # logs false  
log info Real.isFinite(Real.NaN)       # logs false  
```
  
### `isInfinite(r : real) : boolean`  
*public static method*  
Returns true if the specified number is infinitely large in magnitude, false otherwise.  
Example:  
  
```tdn
log info Real.isInfinite(48)             # logs false  
log info Real.isInfinite(Real.Infinity)  # logs true  
log info Real.isInfinite(Real.NaN)       # logs false  
```
  
### `isNaN(r : real) : boolean`  
*public static method*  
Returns true if the specified number is a Not-a-Number (NaN) value, false otherwise.  
Example:  
  
```tdn
log info Real.isNaN(48)                # logs false  
log info Real.isNaN(Real.Infinity)     # logs false  
log info Real.isNaN(Real.NaN)          # logs true  
```
  
### `toString(r : real) : string`  
*public static method*  
Returns a string representation of the real argument. Calling this method is equivalent to casting the parameter to a string.  
Example:  
  
```tdn
log info Real.toString(-0.3)            # logs -0.3  
log info Real.toString(1)               # logs 1.0  
log info Real.toString(15.0000001)      # logs 15.0000001  
```
  
## Random  
`trident-util:native@Random`  
*public class*  
A port of java.util.Random for Trident. This class provides several methods for generating random numbers.  
  
### `PROJECT_RANDOM : trident-util:native@Random`  
*public static final*  
A random number generator that is always consistent between compilations. It's seeded using the hash of the project's name or, alternatively, the random-seed key in the project properties file.  
  
### `new() : trident-util:native@Random`  
*public constructor*  
Creates a new random number generator, seeded with a value dependent on the current time.  
  
### `new(seed : int) : trident-util:native@Random`  
*public constructor*  
Creates a new random number generator with the given seed.  
  
### `nextInt` (multiple overloads)  
`nextInt() : int`  
*public method*  
Returns the next pseudorandom, uniformly distributed int value from this random number generator's sequence. All 232 possible  
int values are produced with (approximately) equal probability.  
  
`nextInt(bound : int) : int`  
*public method*  
Returns the next pseudorandom, uniformly distributed int value between 0 (inclusive) and bound (exclusive), drawn from this random number generator's sequence. All bound possible int values are produced with (approximately) equal probability.  
  
### `nextReal() : real`  
*public method*  
Returns the next pseudorandom, uniformly distributed real value between 0.0 and 1.0 from this random number generator's sequence.  
  
### `nextGaussian() : real`  
*public method*  
Returns the next pseudorandom, Gaussian ("normally") distributed real value with mean 0.0 and standard deviation 1.0 from this random number generator's sequence.  
  
### `nextBoolean() : boolean`  
*public method*  
Returns the next pseudorandom, uniformly distributed boolean value from this random number generator's sequence. The values true and false are produced with (approximately) equal probability.  
  
## CoordinateType  
`trident-util:native@CoordinateType`  
*public final class*  
This class provides several constants used in the Coordinate Set methods.  
  
### `ABSOLUTE : trident-util:native@CoordinateType`  
*public static final*  
Represents the Absolute coordinate type.  
### `RELATIVE: trident-util:native@CoordinateType`  
*public static final*  
Represents the Relative coordinate type.  
### `LOCAL: trident-util:native@CoordinateType`  
*public static final*  
Represents the Local coordinate type.  
## RotationType  
`trident-util:native@RotationType`  
*public final class*  
This class provides several constants used in the Rotation methods.  
  
### `ABSOLUTE : trident-util:native@RotationType`  
*public static final*  
Represents the Absolute rotation type.  
### `RELATIVE: trident-util:native@RotationType`  
*public static final*  
Represents the Relative rotationtype.  
## Axis  
`trident-util:native@Axis`  
*public final class*  
This class provides several constants used in the Coordinate Set and Rotation methods.  
  
### `X : trident-util:native@Axis`  
*public static final*  
Represents the west-east axis.  
### `Y : trident-util:native@Axis`  
*public static final*  
Represents the down-up axis.  
### `Z : trident-util:native@Axis`  
*public static final*  
Represents the north-south axis.  
