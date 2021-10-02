# 内部函数

为数据包中的每个函数单独创建一个文件通常很麻烦，而且很难去维护，这正是为什么 Trident 会允许您通过不同的方式在函数内创建**内部函数（Inner Function）**。

## 通过 `define` 指令
您可以通过 `define` 指令定义一个带有名称的内部函数，他们的名称是一个资源路径，既可以相对于父函数，也可以是一个非 `minecraft` 命名空间下的绝对路径。示例：

```tdn
# 文件 - tdndemo:inner_functions.tdn
define function inner {
      if block ~ ~ ~ minecraft:hopper summon armor_stand ~ ~ ~ {Tags:["block_marker", "new"], Invisible:1b, Marker:1b}
      scoreboard players add BLOCKS_CHECKED global 1
}
# inner 函数被定义于 tdndemo:inner_functions/inner
```

## 通过 `function` 命令
您可以通过 `function` 命令定义一个内部函数，它会在被创建后立即被调用。示例：

```tdn
# 文件 - tdndemo:inner_functions.tdn
function inner {
      if block ~ ~ ~ minecraft:hopper summon armor_stand ~ ~ ~ {Tags:["block_marker", "new"], Invisible:1b, Marker:1b}
      scoreboard players add BLOCKS_CHECKED global 1
}
# inner 函数被定义于 tdndemo:inner_functions/inner
```

在这个示例中，`inner` 被创建为 `tdndemo:inner_functions/inner`，然后这条命令最终被编译为 `function tdndemo:inner_functions/inner`。

您也可以在此省略函数名称：

```tdn
# 文件 - tdndemo:inner_functions.tdn
function {
      setblock ~ ~ ~ stone
}
```

在这个示例中，`inner` 被创建为 `tdndemo:inner_functions/_anonymous0`，末尾的 `0` 会在同一函数内每次定义这类内部函数时自动递增。
 
除此之外，还有一种方法可以定义内部函数，不过我们会在[插值][]一章中进行探讨。

## 相对资源路径

无论您在哪使用资源路径（特别是函数引用），Trident 都允许您以一个斜杠（`/`）开头以使用相对资源路径。示例：

```tdn
# 路径 - tdndemo:relative_functions
function /inner
function /
```

这个示例最终会被编译为：

```tdn
function tdndemo:relative_functions/inner
function tdndemo:relative_functions
```

该示例中的第二行只使用了一个斜杠，这表示该行命令将调用该函数自己，这对于递归函数来说特别有用。

[~](/~link)