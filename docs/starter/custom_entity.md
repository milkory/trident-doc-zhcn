# 自定义实体

Trident 允许您简化“创建”一个实体类型的过程，一个**自定义实体（Custom Entity）**的定义包括它的基本实体类型（即该实体所基于的实体）、默认 NBT 数据、乘客，以及它将要运行的函数。完成定义后，您可以在 `summon` 命令中直接使用它的名称作为实体类型，也可以用 `type=` 目标选择器参数进行选择。

以下是一个定义的示例：

```tdn
# 文件 - mypack:entities/guard.tdn
define entity guard minecraft:iron_golem {

    default name [
            "",
            {"text":"Guard","color":"red"},
            "[",
            {"text":"Lv. ","color":"gold"},
            {"text":"1","color":"yellow"},
            "]"
    ]

    default nbt {
            Silent: 1b,
            CustomNameVisible: 1b,
            DeathLootTable: "minecraft:empty"
    }

    default health 30

    function animation/hurt {
        particle damage_indicator ~ ~ ~ 0.5 0.5 0.5 0.5 8
       
        playsound minecraft:block.anvil.place master @a

        # ...
    }

    ticking function tick {
        if entity @s[nbt={HurtTime:10s}] function ${this["animation/hurt"]}
       
        # ...
    }
}
```

以上声明中定义了一个名为 `guard` 的实体，它基于原版中的铁傀儡，包含一个默认名称、默认 NBT 和默认生命值，该实体被生成时将会附带这些属性。

除了这些默认属性，`guard` 的声明还定义了两个函数：`tick` 和 `animation/hurt`。

函数定义前的 `ticking` 修饰符表示这个函数每刻都会被运行一次（使用 `as @e[...] at @s`）。

在 `tick` 函数中，它又调用了另一个函数 `animation/hurt`。请注意，这个函数是通过 `this` 标识符调用的，它会被设置为正在被声明的这个实体。（见 [插值#自定义实体](/TODO)）

要在之后的程序中生成这个自定义实体，您只需要使用 `summon` 命令和一个指向该实体的插值块。

示例：

```tdn
summon $guard ~ ~ ~

# 等同于以下代码
summon minecraft:iron_golem ~ ~ ~ {
    Tags: ["trident-entity.mypack.guard"],
    CustomName: '["",{"text":"Guard","color":"red"},"[",{"text":"Lv. ","color":"gold"},{"text":"1","color":"yellow"},"]"]',
    Silent: 1b,
    CustomNameVisible: 1b,
    DeathLootTable: "minecraft:empty",
    Health: 30.0f,
    Attributes:[
        {Name:"generic.maxHealth",Base:30.0d}
    ]
}
```

Trident 使用记分板标签来分辨不同的自定义实体，这些标签的格式是 `trident-entity.(namespace).(name)`，如本例中定义的守卫者实体都会在生成时具有 `trident-entity.mypack.guard` 标签。

## 类型

自定义实体声明包含**名称**和**基本实体类型**两个基本属性。然而，这些属性都是可选的，不同的声明会对它们的行为造成不同的影响。

### 完全自定义实体

**完全自定义实体（Named Custom Entity）**拥有名称和基本实体类型，是一个全新的可生成实体，且不会改变任何原版实体的行为。

声明头如下所示：

```tdn
define entity <name> <base_type>
```

示例：

```tdn
define entity guard minecraft:iron_golem
```

基本实体类型也可以是另一个完全自定义实体。

示例：

```tdn
define entity town_guard $guard
```

### 通用自定义实体
**通用自定义实体（Default Custom Entity）**只拥有基本实体类型，用以向指定原版实体添加功能。

声明头如下所示：

```tdn
define entity default <base_type>
```

示例：

```tdn
define entity default minecraft:iron_golem
```

定义在该自定义实体声明下的行为将会影响所有的铁傀儡。

### 全局自定义实体
**全局自定义实体（Wildcard Custom Entity）**不具备任何一项基本属性，用以向所有原版实体添加功能，也可被视为一种更通用的[通用自定义实体](#通用自定义实体)变种。

声明头如下所示：

```tdn
define entity default *
```

### 实体组件
: 主条目：[实体组件]

实体组件只拥有名称，用以向指定实体添加功能，且通常可以在任何实体类型上使用。

## 结构体
### 属性声明

- `default name <text_component>`（仅完全自定义实体和实体组件）  
    指定该实体的名称；即将指定的 `CustomName` 标签添加到其默认 NBT 中。

- `default nbt <tag_compound>`（仅完全自定义实体和实体组件）
    指定该实体的默认 NBT 标签。

- `default health <real>`（仅完全自定义实体和实体组件）
    指定该实体的默认生命值，同时也会修改其最大生命值；即将指定的 `Health` 标签和 `generic.maxHealth` 属性添加到其默认 NBT 中。

- `default passengers [<new_entity_literal>, <new_entity_literal>, ...]`（仅完全自定义实体和实体组件）
    添加指定的实体为该实体的乘客。（见 [命令语法增强#实体生成字面量](/TODO)）

    示例:
    ```tdn
    define entity free_block minecraft:armor_stand {
        default passengers [
            shulker[invisible]{NoAI:1b},
            falling_block[everlasting]{Time:1}
        ]
        # ...
    }
    ```

### 函数声明
: 主条目：[#内部函数](#内部函数)

## 内部函数
: 主条目：[自定义对象#对象内部函数](/starter/custom_object#对象内部函数)

自定义实体和实体组件支持使用[内部函数]。

### 循环函数

在这自定义实体结构体中，您可以通过 `ticking` 修饰符以让内部函数每刻通过该实体的实例运行一次。

示例：

```tdn
# 文件 - mypack:entities/guard.tdn
define entity guard minecraft:iron_golem {
    ticking function tick {
        if entity @s[nbt={HurtTime:10s}] function ${this["animation/hurt"]}
       
        # ...
    }
}
```

它大致会生成如下命令，同时带有 `#minecraft:tick` 标签：

```tdn
as @e at @s if entity @s[type=$guard] function mypack:entities/guard/tick
```

您也可以在此使用 `execute` 的子命令，这些子命令应该在 `ticking` 和 `function` 两个关键字之间。

示例：

```tdn
# 文件 - mypack:entities/guard.tdn
define entity guard minecraft:iron_golem {
    ticking if entity @s[nbt={HurtTime:10s}] function animation/hurt {
        particle damage_indicator ~ ~ ~ 0.5 0.5 0.5 0.5 8
        playsound minecraft:block.anvil.place master @a
       
        # ...
    }
}
```

它大致会生成如下命令：

```tdn
as @e at @s if entity @s[type=$guard] if entity @s[nbt={HurtTime:10s}] function mypack:entities/guard/animation/hurt
```

使用 `ticking` 修饰符的主要是为了优化命令执行性能，我们使得所有实体每刻都只会被迭代一次，然后通过 `if entity @s` 检测并执行不同的函数。我们建议您每个自定义实体都只使用一个循环函数，这样优化效果会更好。

!> Trident 会使用 `@e` 选择器来迭代实体，所以死亡的玩家不会被检测到。

您还可以指定循环间隔，只需要在 `ticking` 之后添加一个时间量。

示例：

```tdn
# 文件 - mypack:entities/guard.tdn
define entity guard minecraft:iron_golem {
    ticking 5s function {
        playsound minecraft:block.anvil.use master @a ~ ~ ~ 1.0 2.0 0.0
    }
}
```

这会在指定时间的全局计划函数中添加该函数的引用，它们会通过 [`schedule`] 命令实现循环；而没有设定时间的循环函数则会使用 `#minecraft:tick` 标签实现循环。

[~](/~link)
[~](/~clink)