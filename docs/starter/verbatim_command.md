# Verbatim Commands

The implementation of the Trident language requires it to receive an update every time a new command feature is added to Minecraft. This is why Trident features verbatim commands, which are a way to export a command as-is, without any processing from Trident. These are commands prefixed by a forward slash (`/`). Anything after the slash and before the end of the line will be included in the output function as-is. Example:
```tdn
/futurecommand @a minecraft:future_block
```
You may also use interpolation blocks in verbatim commands (see Interpolation Blocks):
```tdn
var raw_command = "futurecommand @a"
/${raw_command + " minecraft:future_block"}
```

## `raw` 修饰符

You may also want to output an execute modifier as-is, while using Trident syntax for the chained command. This is why you can use the `raw` execute modifier for that, which takes a string literal or an interpolation block. Example:
```tdn
raw "if block ~ ~-1 ~ minecraft:future_block" tp @s ~ 127 ~
```
This also works with interpolation blocks and lists of strings.