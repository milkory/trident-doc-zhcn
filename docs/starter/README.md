# 介绍

Trident 是一门由 Energyxxer 制作的 Minecraft 函数（mcfunction）语言，它在原版函数语法的基础上添加了更多语法糖与有用的特性，无论是简单的原版模组项目还是成熟的地图都可以使用 Trident 来帮助开发。用 Trident 语言编写的代码最终都能被编译为一个数据包，供您分发您的创作。

**Trident 能做哪些原版函数不能做的事情？**  
很多 Minecraft 函数的语法是繁杂而重复的，所以有的时候仅为了制作一个基本的模块，您可能会编写很多函数，而 Trident 则可以通过添加编译时的变量、常数，甚至自定义实体和物品来解决这些问题。

## Trident 项目结构
要使用 Trident 协助开发，您需要将您的文件整理成类似于数据包与资源包的文件夹结构中。在您的项目文件夹中，通常需要有一个 `datapack` 文件夹作为数据包，一个 `resources` 文件夹作为资源包，和一个名为 `.tdnproj` 的 JSON 文件，它用于表示这个 Trident 项目，包含一些实用的设置。

所有 Trident 代码将会被置于数据包的任意命名空间中的函数文件夹下。如果您是初学者，那么一个数据包的结构如下：

```treeview
datapack/
|-- data/
|   `-- [namespace]/
|       |-- functions/
|       |-- advancements/
|       |-- tags/
|       |   |-- blocks/
|       |   |-- fluids/
|       |   |-- items/
|       |   |-- functions/
|       |   `-- entity_types/
|       |-- loot_tables/
|       `-- structures/
`-- pack.mcmeta
```

您仍然可以直接将您的 mcfunction 文件放置在 `[namespace]/functions` 文件夹中。唯一不同的是 Trident 的文件后缀名为 `.tdn` 而不是 `.mcfunction`。

## 文件格式

Trident 语言的代码文件使用 `.tdn` 作为文件后缀名。在一个 Trident 文件里，您可以像在 mcfunction 文件里一样直接添加命令。大部分 `.mcfunction` 文件中可以使用的命令在 `.tdn` 文件中也可以使用，但有几点不同的是：

1. 以 `$` 开头的虚拟玩家的名称将会代表另一种东西（在下面的章节将会讲解）。

2. [`particle`][] 命令的偏移参数（`delta`）只能使用实数，不能使用相对坐标或绝对坐标。

Trident 函数与 Minecraft 函数不同的一点是空格的使用。Trident 中的命令可以使用多余的空格，甚至可以在参数中添加空行（只要意义明确）。这意味这您可以将子命令或NBT一类的内容放在单独的行内，而放在同一行中也不会有任何的不同。例如：

```tdn
execute
    as @a
    at @s
    align xyz
    run
        summon armor_stand ~ ~ ~ {
            Tags: [
                "position_history",
                "new"
            ],
            Invisible: 1b,
            Marker: 1b
        }
```

## 重要提示

如果您把 Trident 语言理解为一门单独的语言，而不是一个函数预处理器，那么 Trident 的一些特性就更容易被理解。一个文件由一些语句组成，它们一部分是命令，一部分是[指令][]。

> 译注：此处指令的原文是 `Instructions`，指的是 Trident 中的一些不同于原版函数的特殊语法，与命令不同。

对于函数中的每一条命令，Minecraft 函数和 Trident 的语法是相同的，并且最终的命令会被直接放入当前编写的函数文件，不加以任何改变；指令很类似，但他们不是直接添加一行命令，而是更改程序的状态（例如修改变量）。

如果命令中使用了任何变量，那么这条命令将只能获取到变量当前的状态。这使得 Trident 文件中的运行顺序很重要，因此您需要使用 Trident 中控制运行顺序的特性来确保代码的运行顺序正确。

[~](/~link)
[~](/~clink)