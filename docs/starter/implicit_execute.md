# 隐式 `execute`

Trident 允许您特定情况下省略 [`execute`][] 和 [`run`] 关键字。

例如，[介绍#文件格式](/starter/#文件格式)中的命令可以被简化为如下命令：

```tdn
as @a at @s align xyz
    summon armor_stand ~ ~ ~ {
        Tags: [
            "position_history",
            "new"
        ],
        Invisible: 1b,
        Marker: 1b
    }
```

注意，只有当您需要运行命令（即使用 `run` 子命令时），`execute` 才可以被省略。也就是说，当您需要通过 `if` 或 `unless` 存储数据时，不能省略 `execute` 关键字。

示例：

```tdn
execute store result score PLAYER_COUNT global if entity @a
```

此处，不能省略 `execute` 关键字。

[~](/~clink)