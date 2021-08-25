# 内部函数

Creating a file for every function you want in a datapack can often be tedious, and difficult to maintain. This is why Trident implements several ways you can create functions within functions.

## 通过 `define` 指令
You can define an inner function via the define instruction, with the specified name. The name is a resource location, which can be relative to the parent function, or an absolute path in a non-minecraft namespace. Example:
```tdn
#at: tdndemo:inner_functions.tdn
define function inner {
      if block ~ ~ ~ minecraft:hopper summon armor_stand ~ ~ ~ {Tags:["block_marker", "new"], Invisible:1b, Marker:1b}
      scoreboard players add BLOCKS_CHECKED global 1
}
#inner is created at tdndemo:inner_functions/inner
```

## 通过 `function` 命令
You can define an inner function inside the function command, which will create the function and immediately call it. Example:
```tdn
# at: tdndemo:inner_functions.tdn
function inner {
      if block ~ ~ ~ minecraft:hopper summon armor_stand ~ ~ ~ {Tags:["block_marker", "new"], Invisible:1b, Marker:1b}
      scoreboard players add BLOCKS_CHECKED global 1
}
#inner is created at tdndemo:inner_functions/inner
```
In this example, inner is created at tdndemo:inner_functions/inner, and the command is resolved to `function tdndemo:inner_functions/inner` 
You may also omit the name, when creating a function via the `function` command:
```tdn
# at: tdndemo:inner_functions.tdn
function {
      setblock ~ ~ ~ stone
}
```
Here, the inner function is created at `tdndemo:inner_functions/_anonymous0`
The number at the end will increase for every anonymous inner function created in the parent file.
 
There is also another way to create inner functions, but we’ll discuss it in the [Interpolation Values]() section.

## 相对资源路径

Wherever you can use a resource location (typically function references), Trident lets you use function paths relative to the function currently being written, starting with a forward slash (`/`). Example:
```tdn
#at: tdndemo:relative_functions
function /inner
function /
```
The above example resolves into:
```tdn
function tdndemo:relative_functions/inner
function tdndemo:relative_functions
```
The second example (with a single slash) is particularly useful for recursive functions.