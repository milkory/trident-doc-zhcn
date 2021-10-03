# 直译命令

每当 Minecraft 更新新版本，Trident 语言总要跟着更新来对其进行适配，但有时这些适配需要花些时间，这使得创作者可能无法第一时间使用 Trident 体验到 Minecraft 的新命令语法。于是我们加入了**直译命令（Verbatim Command）**，它在编译时不会被编译器加工，并将直接输出到结果中。直译命令的定义非常简单，只需要使命令由斜杠（`/`）开头即可。示例：

```tdn
/futurecommand @a minecraft:future_block
```

您也可以在直译命令中使用[插值块]：

```tdn
var raw_command = "futurecommand @a"
/${raw_command + " minecraft:future_block"}
```

## `raw` 子命令

您可能还想要直接输出 `execute` 的子命令，同时不干预其他的子命令。这时您可以使用 `execute` 的 `raw` 子命令，然后接一个字符串来表示您想要直接输出的子命令。示例：

```tdn
raw "if block ~ ~-1 ~ minecraft:future_block" tp @s ~ 127 ~
```

您也可以使用插值块或字符串列表来代替子命令字符串。

[~](/~link)