<img src="http://www.cdnjson.com/images/2021/08/22/logo_transparent.png" style="float: left; width: 9em;"/>

# Trident 中文文档
作者：Energyxxer  
翻译：Milkory & APJifengc  
[[原文]](https://docs.google.com/document/d/1w_3ILt8-8s1VG-qv7cLLdIrTJTtbQvj2klh2xTnxQVw/edit#)
[[HTML版]](https://energyxxer.com/trident/docs/language)
[[完整文档]](https://docs.google.com/document/d/1HW5A6KVgC8VIcwJm6bLv31bzqVtZsnFqXRInZ_BXstM/edit?usp=sharing)
[[关于...]](about)

<br/><br/>

<!-- TEMP: 不要修改上面的内容，它们在 docsify 中是正常显示的 -->

# 目录
> [toc]

<!-- TEMP: 记得删掉这个目录 -->

# 什么是 Trident？
Trident 是一个由 Energyxxer 制作的 Minecraft 函数（mcfunction）语言，它在原版函数语法的基础上添加了更多语法糖与有用的特性，无论是简单的原版模组项目还是成熟的地图都可以使用 Trident 来帮助开发。用 Trident 语言编写的代码最终都能被编译为一个数据包，供您分发您的创作。

**Trident 能做哪些原版函数不能做的事情？**  
很多 Minecraft 函数的语法是繁杂而重复的，所以有的时候你会编写很多函数，但只是为了制作一个基本的模块，而 Trident 则可以通过添加编译时的变量、常数，甚至自定义实体和物品来解决这些问题。

# Trident 项目结构
要使用 Trident 协助开发，你需要将你的文件整理成类似于数据包与资源包的文件夹结构中。在你的项目文件夹中，通常需要有一个 `datapack` 文件夹作为数据包，一个 `resources` 文件夹作为资源包，和一个名为 `.tdnproj` 的 JSON 文件，它用于表示这个 Trident 项目，包含一些实用的设置。

所有 Trident 代码将会被置于数据包的任意命名空间中的函数文件夹下。如果你是初学者，那么一个数据包的结构如下：

```
datapack
├── data
│   └── [namespace]
│       ├── functions
│       ├── advancements
│       ├── tags
│       │   ├── blocks
│       │   ├── fluids
│       │   ├── items
│       │   ├── functions
│       │   └── entity_types
│       ├── loot_tables
│       └── structures
└── pack.mcmeta
```

你仍然可以直接将你的 mcfunction 文件放置在 `[namespace]/functions` 文件夹中。唯一不同的是 Trident 的文件后缀名为 `.tdn` 而不是 `.mcfunction`。

# 文件格式

Trident 语言的代码文件使用 `.tdn` 作为文件后缀名。在一个 Trident 文件里，你可以像在 mcfunction 文件里一样直接添加命令。大部分 `.mcfunction` 文件中可以使用的命令在 `.tdn` 文件中也可以使用，但有几点不同的是：

1. 以 `$` 开头的虚拟玩家的名称将会代表另一种东西（在下面的章节将会讲解）。

2. [`/particle`](https://minecraft.fandom.com/zh/wiki/%E5%91%BD%E4%BB%A4/particle) 命令的偏移参数（`delta`）只能使用实数，不能使用相对坐标或绝对坐标。

Trident 函数与 Minecraft 函数不同的一点是空格的使用。Trident 中的命令可以使用多余的空格，甚至可以在参数中添加空行（只要意义明确）。这意味这你可以将子命令或NBT一类的内容放在单独的行内，而放在同一行中也不会有任何的不同。例如：

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

# 重要提示

如果你把 Trident 语言理解为一门单独的语言，而不是一个函数预处理器，那么 Trident 的一些特性就更容易被理解。一个文件由一些语句组成，它们一部分是命令，一部分是[指令](TODO)。

> 译注：此处指令的原文是 `Instructions`，指的是 Trident 中的一些不同于原版函数的特殊语法，与命令不同。

对于函数中的每一条命令，Minecraft 函数和 Trident 的语法是相同的，并且最终的命令会被直接放入当前编写的函数文件，不加以任何改变；指令很类似，但他们不是直接添加一行命令，而是更改程序的状态（例如修改变量）。

如果命令中使用了任何变量，那么这条命令将只能获取到变量当前的状态。这使得 Trident 文件中的运行顺序很重要，因此你需要使用 Trident 中控制运行顺序的特性来确保代码的运行顺序正确。

# 文件编译预处理指令

你可以在一个 `.tdn` 文件的最开头设定文件的编译预处理指令，它们以 `@` 符号开头，下面列出了所有可用的指令：

1. `@ on compile` 表示该文件应该只在编译时被利用。这代表它不应该被编译器编译为一个 `.mcfunction` 文件，而是应该在其他文件被编译之前运行。这些文件通常被用于定义记分版项目，或进行其他的一些初始化操作。

2. `@ tag <tag name>` 使该函数在被编译时附带有指定的函数标签，参数 `<tag name>` 应为一个有效的资源路径；如果缺失命名空间，将被默认为 `minecraft`。这个属性不能被用于仅编译时的文件。示例：

    ```tdn
    @ tag load
    @ tag tick
    @ tag custom:tag
    ```

3. `@ meta_tag <tag name>` 用于给该文件标记上指定的元标签，参数 `<tag_name>` 应为一个有效的资源路径。和 `@ tag` 属性不同，这不会创建一个函数标签，并且可以被用在仅编译时的文件上，这在反射中很有用（见 [`Reflection.getFilesWithMetaTag`](TODO)）。示例：

    ```tdn
    @ meta_tag trident:advancement_reward
    ```

4. `@ require <file>` 表示该函数依赖指定的文件，应在指定文件之后运行，这也将导入指定文件中的所有局部变量（见 [变量可访问性](TODO)）。参数 `<file>` 应为一个有效的资源路径，就像您普通地访问被它生成的函数一样。

5. `@ priority <number>` 用于设置该文件的优先级，优先级更高的文件将在优先级更低的文件之前运行。值得注意的是，`@ on compile` 和 `@ require` 指令都能具有比 `@ priority` 更高的优先级。举例来说，一个仅编译时、优先级为 `2` 的文件，将在一个普通的、优先级为 `6` 的文件之前运行；一个优先级为 `9` 的文件将在一个依赖于此的、优先级为 `12` 的文件之前运行。

6. `@ language_level <level>` 用于指定该文件的语言等级，并覆盖项目设置（见 [语言等级](TODO)）。

7. `@ metadata <object>` 用于设置该文件的元数据为指定的对象（见 [`Reflection.getMetadata`](TODO)）。

8. `@ breaking` 被设置后，任何未被捕获到的异常就会立即终止文件的执行，这类似于 `try` 代码块的行为（见 [流程控制/`try-catch`](TODO)）。这个指令对那些主要包含仅编译时代码的文件特别有用。

9. `@ using_plugin <plugin name>` 被设置后，所有来自指定文件的自定义命令可以被直接用于这个文件而不用附带命名空间（见 [自定义命令](TODO)），类似于静态导入了其中的所有自定义命令。
 
# 语言等级

我们希望 Trident 与原版函数的差别不会太大，同时也尽量避免让用户无法理解编译器最终生成的命令。然而，有些语言特性太过于抽象，它们与 Minecraft 命令相差甚远，导致我们无法达到上面的期望。为了解决这个问题，在逻辑上分离这些特性，我们加入了语言等级。

语言等级是一个数值设定，可以在项目设置中更改，也可以在文件开头特别指定该文件的语言等级。最低的语言等级仅包含最简单、直观的特性，禁用在没有用户控制的情况下可能会生成大量命令的特性；最高的语言等级将启用该语言的全部特性，包括那些涉及到用户无法直接控制的许多命令、函数和文件的特性。

以下是当前可用的语言等级以及它们所包含的特性：

1. 基本的函数预处理功能（原版命令、[变量](TODO)、[计分板项目](TODO)、[自定义实体](TODO)、简单的[自定义物品](TODO)等）

2. 基本的 Trident 命令（[`tag update`](TODO)）和 [`using` 指令](TODO)。这些命令或指令在编译时会输出为多行命令，并且可能还会有额外的短函数生成用以实现它们。

3. [Custom item events]() and [game logger](). These will usually create several functions with many commands each, which may introduce some execution time and space overhead. However, these functions will only generate once the first usage of the feature is found, and further uses of the feature will either reference a generated function or append to one.

The language level can be specified using the `language-level` property in the project configuration file .tdnproj, or per file, using the `@ language_level` [file directive](#文件属性).


# 隐式 `execute`

Trident lets you omit `execute` and `run` keywords from your commands entirely. The previous snippet can be simplified to the following command:
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

Note that this comes with a limitation: Omitting the `execute` and `run` keywords will require you to follow up with a command; If you need to store a value obtained from the `if` or `unless`  subcommand alone, you must include `execute`. Example:
```tdn
execute store result score PLAYER_COUNT global if entity @a
```

*The `execute` keyword cannot be omitted in this case!*

# 记分板项目

Trident allows you to declare scoreboard objectives on the fly, and it takes care of the commands that add them. Define objectives using the `define objective` instruction:
```tdn
define objective global
```
This will create the objective named `global`, and the command to create it will then be added to a separate objective initialization function marked with the `minecraft:load` tag, which runs whenever the data pack is loaded. By default, the defined objective will be of type *`dummy`*, and have the same display name as its internal name.

You can also specify the criteria and display name of the objective in the definition, both sequence-optional. Example:
```tdn
define objective health health {"text": "Current Health"}
```
You may use objectives not previously defined in commands, and the compiler will silently register them, but it will give you a warning if you do so, asking you to define the objective first. Note that a `scoreboard objectives add` command will also register the objective.

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

# 内部函数

Creating a file for every function you want in a datapack can often be tedious, and difficult to maintain. This is why Trident implements several ways you can create functions within functions.

## 通过 `define` 关键字
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

# 自定义对象
Trident allows you to abstract the process of creating a custom entity or item, using its custom object features. This section will describe features common to both entity and items.

## 函数内部对象
Inside a custom entity or item body you may define functions that are logically tied to it.

### 对象的文件夹
An object's inner functions need to be created under a directory, and so both the path and name of the file that declares that object affects where those functions will be.
For objects whose name is the same as the file that created it, inner functions will be created relative to the function that created it. Example:
```tdn
# file: mypack:entities/guard.tdn
define entity guard minecraft:iron_golem {
    function idle {
        # ...
    }
}
```
The function `idle` will be created in function whose resource location is: `mypack:entities/guard/idle`.

For objects whose name is different from the file that created it, a subfolder will be created relative to the original function, whose name is that of the entity or item. Example:
```tdn
# file: mypack:entities/guards.tdn
define entity town_guard minecraft:iron_golem {
    function idle {
        # ...
    }
}
```
The function `idle` will be created in function whose resource location is: `mypack:entities/guards/town_guard/idle`.

### 函数声明
The most basic form of object inner functions is the following:
```tdn
function {
    # function file contents here...
}
```
This will declare a function relative to this object's directory. Since this function declaration doesn't have a name, an anonymous function will be created, similarly to the function command (See [Inner Function Syntax > Via function command]()).

You can specify a name for the function, with the following syntax:
```tdn
function <name> {
    # function file contents here...
}
```
This will create the function with the path specified by the name, relative to the object's folder.
Example:
```tdn
# file: mypack:items.tdn
define item key minecraft:tripwire_hook {
    function validate/block {
        # ...
    }
}
```
The function `validate/block` will be created at `mypack:items/key/validate/block`.

Object inner functions may have extra syntax options depending on the object type, which are specified in the Custom Entity Functions and Custom Item Functions sections.

----

# 自定义实体

Trident lets you simplify the process of creating "new" entity types. A custom entity starts with a definition specifying its base type (what vanilla entity type it uses), its default NBT data, its passengers, and functions it may want to run. After declaration, you can use its name in place of the `summon` command entity type, or `type`= selector argument. Here's an example declaration:
```tdn
# file: mypack:entities/guard.tdn
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
That declaration defines an entity named 'guard' that is based on an iron golem. It defines a default name, default NBT and health that will be assigned upon summoning.
As well as these default values, the guard declaration also defines two functions: `tick` and `animation/hurt`.
The `ticking` keyword before the function tells Trident to run that function on every entity of the type `guard`, every tick (using `as @e[...] at @s`).

Inside the `tick` function, it calls another function called `animation/hurt`. Notice how that function is accessed via the `this` identifier, which is set to whatever custom entity type being declared. (see [Interpolation Values > Data Types > Custom Entities]())

To spawn this custom entity later in the program, all you need is a summon command with an interpolation block retrieving the custom entity. Example:

```tdn
summon $guard ~ ~ ~

# Equivalent to:
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

Trident uses tags to distinguish custom entity types apart. They are `trident-entity`, followed by the namespace it was declared in, and the name of the custom entity, all separated by dots.

## 自定义实体声明

Custom entities are defined by two identifying properties: a name, and a base type. Depending on whether these properties are set, the custom entity will behave differently.

1.  **Named custom entities** (Has a name and a base type)
    Named custom entities define a new spawnable entity that doesn't alter the behavior of other vanilla entities. The declaration header looks like this:
    ```tdn
    define entity <name> <base_type>
    ```
    Example:
    ```tdn
    define entity guard minecraft:iron_golem
    ```
    Note: The base type can also be another named custom entity. Example:
    ```tdn
    define entity town_guard $guard
    ```

2.  **Default custom entities** (Has no name but has a base type)
    Default custom entities serve as a way to add functionality to a specific vanilla entity type. The declaration header looks like this:
    ```tdn
    define entity default <base_type>
    ```
    Example:
    ```tdn
    define entity default minecraft:iron_golem
    ```
    Behavior defined inside this example entity declaration will affect all iron golems.

3.  **Wildcard custom entities** (Has no name and no base type)
    Wildcard custom entities serve as a way to add functionality to all entities.
    The declaration header looks like this:
    ```tdn
    define entity default *
    ```

4.  **Entity Components** (Has a name but no base type)
    Entity components serve as a way to add functionality to specific entities, regardless of their entity type. More about Entity Components in another section.

## 自定义实体结构体
- Variable Declarations.
- `default name <text_component>`
    (Named entities and components only)
    Changes the entity's base NBT to contain the given `CustomName`.
- `default nbt <tag_compound>`
    (Named entities and components only)
    Changes the entity's base NBT to contain the tags in the given compound (via a merge operation).
- `default health <real>`
    (Named entities and components only)
    Changes the entity's base NBT to reflect the given max health (Changes the Health tag, as well as the `generic.maxHealth attribute`).
- `default passengers [<new_entity_literal>, <new_entity_literal>, ...]`
    (Named entities and components only)
    Adds the given entities as passengers of this entity. [See Command Syntax Additions > New-Entity literal]().
    Example:
    ```tdn
    define entity free_block minecraft:armor_stand {
        default passengers [
            shulker[invisible]{NoAI:1b},
            falling_block[everlasting]{Time:1}
        ]
        # ...
    }
    ```
- Inner functions (See next section)

## 自定义实体函数
Custom entities and entity components support inner functions, as described in the [Object Inner Functions]() section.
### 循环函数
Within custom entity bodies, you may specify that an inner function should run every tick on entities of that type. This is done via the `ticking` keyword before the `function` keyword.
Example:
```tdn
# file: mypack:entities/guard.tdn
define entity guard minecraft:iron_golem {
    ticking function tick {
        if entity @s[nbt={HurtTime:10s}] function ${this["animation/hurt"]}
       
        # ...
    }
}
```
That roughly translates to the following command in a Trident-generated function tagged with `#minecraft:tick`:
```tdn
as @e at @s if entity @s[type=$guard] function mypack:entities/guard/tick
```

You may also specify other modifiers that should be added in that command. Extra modifiers go after the `ticking` keyword and before the `function` keyword.
Example:
```tdn
# file: mypack:entities/guard.tdn
define entity guard minecraft:iron_golem {
    ticking if entity @s[nbt={HurtTime:10s}] function animation/hurt {
        particle damage_indicator ~ ~ ~ 0.5 0.5 0.5 0.5 8
        playsound minecraft:block.anvil.place master @a
       
        # ...
    }
}
```
That roughly translates to the following command:
```tdn
as @e at @s if entity @s[type=$guard] if entity @s[nbt={HurtTime:10s}] function mypack:entities/guard/animation/hurt
```
This is done for the sake of optimization with several custom entity types, so that all entities are only iterated through once per tick. The result is optimized more if there is only one ticking entity function.

**NOTE: Since this uses the `@e` selector to iterate through entities, this will not run for dead players.**  
You may also specify an interval between executions. Write a time literal right after the 'ticking' keyword.
Example:
```tdn
# file: mypack:entities/guard.tdn
define entity guard minecraft:iron_golem {
    ticking 5s function {
        playsound minecraft:block.anvil.use master @a ~ ~ ~ 1.0 2.0 0.0
    }
}
```
This will create a self-scheduling function tagged with `#minecraft:tick`, one for each unique time interval used in the project.

# 实体组件
Entity components are an extension of the custom entity system, which allows adding functionality to arbitrary entities via tags. Entity components have all the features and functionality of a named entity.
Entity components can be added to an entity's definition or after the `summon` command entity type, as well as a Trident-exclusive `component=` selector argument. Here's an example declaration:
```tdn
# file: mypack:components.tdn
define entity component invisible {

    default nbt {
        ActiveEffects: [
            {Id:14b,Duration:200000,Amplifier:0b,ShowParticles:0b}
        ]
    }

    function reapply {
        @tag load
        effect give @e[component=invisible] invisibility 10000 0 true
        schedule function / 10000s
    }
}
```
That declaration defines an entity component named 'invisible'. It defines a default NBT containing the invisibility effect that will be applied upon summoning.
The `invisible` declaration also defines a `reapply` function that runs every 10,000 seconds that reapplies the effect to all entities with the component.

Just like named custom entities, entity components are represented by a tag on the entity. For entity components, they are `trident-component`, followed by the namespace it was declared in, and the name of the component, all separated by dots.

## 用途
### 实体生成
There are many ways to use an entity component. The most simple way is through the `summon` command. To give a summoned entity components, you may put the names of the components, separated by commas, between square braces after the entity name. Example:
```tdn
summon pig[invisible]

# Equivalent to:
summon minecraft:pig ~ ~ ~ {
    Tags: ["trident-component.mypack.invisible"],
    ActiveEffects: [
        {Id:14b,Duration:200000,Amplifier:0b,ShowParticles:0b}
    ]
}
```
### `component (add|remove)` 命令
Another way to use entity components is by adding/removing them, just like tags. To do so, use the Trident-exclusive `component` command:
```tdn
component @e[type=pig] remove invisible
component @e[type=cow] add invisible

# Equivalent to:
tag @e[type=pig] remove trident-component.mypack.invisible
tag @e[type=cow] add trident-component.mypack.invisible
```
### `component` 选择器参数
You can filter entities based on which components they have, using the Trident-exclusive `component` selector argument:
```tdn
as @e[component=invisible] say I'm invisible
as @e[component=!invisible] say I'm not invisible

# Equivalent to:
as @e[tag=trident-component.mypack.invisible] say I'm invisible
as @e[tag=!trident-component.mypack.invisible] say I'm not invisible
```
### 实体继承

You may also use components in the declaration of a named custom entity, or even another entity component. Do this by using the implements keyword at the end of the entity/component declaration header with the names of the components, separated by commas:
```tdn
# file: mypack:entities/rclick_agent.tdn
define entity rclick_agent minecraft:villager implements invisible {
    default nbt {Silent:1b, Offers: {Recipes: [] }}
}

define entity component outline implements invisible {
    default nbt {Glowing:1b}
}

summon $rclick_agent
summon minecraft:iron_golem[outline]

# Equivalent to:
summon minecraft:villager ~ ~ ~ {
    Tags: [
        "trident-entity.mypack.rclick_agent",
        "trident-component.mypack.invisible"
    ],
    ActiveEffects: [
        {Id:14b,Duration:200000,Amplifier:0b,ShowParticles:0b}
    ],
    Silent: 1b,
    Offers: {Recipes:[]}
}
summon minecraft:iron_golem  ~ ~ ~ {
    Tags: [
        "trident-component.mypack.outline",
        "trident-component.mypack.invisible"
    ],
    ActiveEffects: [
        {Id:14b,Duration:200000,Amplifier:0b,ShowParticles:0b}
    ],
    Glowing: 1b
}
```

# 抽象生物事件
Trident offers a form of polymorphism for entity functions, in the form of Abstract Entity Events.
Abstract entity events are special functions whose behavior is incomplete by default. The function's behavior is entirely dependent on the type of entity that executes the function. The event can then be called through a custom `event` command, which simply tells the entities to run their own implementation of the event.

Each entity that decides to implement the event can do so through `on <event> <optional modifiers> function {...}`

Here's an example:
```tdn
define event identify

define entity boar minecraft:pig {
    default nbt {Glowing:1b}

    on identify function identify_impl {
        say I'm a boar
    }
}

define entity default minecraft:pig {
    on identify if entity @s[type=!$boar] function identify_impl {
        say I'm a pig
    }
}

define entity default minecraft:sheep {
    on identify function identify_impl {
        say I'm a sheep
    }
}

event @e[distance=..10] identify



# Equivalent to:

define function trident_dispatch_event_identify {
    if entity @s[type=$boar] function /boar/identify_impl
    if entity @s[type=minecraft:pig] if entity @s[type=!$boar] function /default_pig/identify_impl
    if entity @s[type=minecraft:sheep] function /default_sheep/identify_impl
}

function /trident_dispatch_event_identify
```

The event command has the following syntax:
```tdn
event <entity> <event>
```
which simply gets transformed into a function command as the provided entity
```tdn
as <entity> function <event_dispatch_function>
```

----

# 自定义物品
Trident lets you simplify the process of creating "new" item types and modifying existing ones. A custom item starts with a definition specifying its base type (what vanilla item type it uses), its default NBT data, its name, lore, and functions it may want to run. After declaration, you can use its name in place of the `give`/`clear`/`replaceitem`/etc. commands' item type. Here's an example declaration:
```tdn
# file: mypack:items/teleport_wand.tdn
define objective tp_dist

define item teleport_wand minecraft:carrot_on_a_stick#1 {

    default name {"text":"Teleport Wand","color":"aqua","italic":false}

    default lore [
            [
                {"keybind":"key.use","color":"green"},
                " to teleport to where you're looking"
            ]
    ]

    default nbt {Enchantments:[{}]}

    function raytrace {
        scoreboard players remove @s tp_dist 1
        unless block ^ ^ ^1 minecraft:air
            tp @s ~ ~ ~
        unless score @s tp_dist matches ..0
            positioned ^ ^ ^1
            if block ~ ~ ~ minecraft:air
            function /
    }

    on used function {
        set @s->tp_dist = 64
        anchored eyes
            positioned ^ ^ ^
            anchored feet
            function ${this.raytrace}
    }
}
```
The code above is for an item that teleports the player to the block they're looking at when right-clicking with it.
Its declaration defines an item named 'teleport_wand' that is based on a carrot on a stick with `CustomModelData` 1. It defines a default name, default lore and default NBT that will be assigned when given.
As well as these default values, the teleport wand declaration also defines two functions: `raytrace` and an anonymous function.
The `on` keyword before the function tells Trident to run that function whenever a player fires an event using that item (using scoreboard objective criteria, more on that in [Custom Item Functions > Item Event Functions]()) (using `as @a[...] at @s` on the player that fired the event).

Inside the anonymous function, it calls another function called `raytrace`. Notice how that function is accessed via the this identifier, which is set to whatever custom entity type being declared. (see [Interpolation Values > Data Types > Custom Items]())

To give, clear or use this custom item later in the program, all you need is an interpolation block retrieving the custom item. Example:
```tdn
give @a $teleport_wand
clear @a $teleport_wand

# Equivalent to:
give @a minecraft:carrot_on_a_stick{
    TridentCustomItem: -2008252046,
    CustomModelData: 1,
    display: {
        Name: '{"text":"Teleport Wand","color":"aqua","italic":false}',
        Lore: ['[{"keybind":"key.use","color":"green"}," to teleport to where you\'re looking"]']
    },
    Enchantments: [{}]
}
clear @a minecraft:carrot_on_a_stick{
    TridentCustomItem: -2008252046
}
```
Trident uses a `TridentCustomItem` item tag to distinguish custom item types apart. The value of that tag is determined by hashing the string formed after combining the namespace and the item name together.

## 自定义物品声明

Just like Custom Entities, Custom Items are defined by two identifying properties: a name, and a base type. Depending on whether these properties are set, the custom entity will behave differently.

1. **Named custom items** (Has a name and a base type)
    Named custom items define a new item type that doesn't alter the behavior of other vanilla items. The declaration header looks like this:
    ```tdn
    define item <name> <base_type>
    ```
    Example:
    ```tdn
    define item wand minecraft:stick
    ```
    Note: Unlike entities, custom items' base type cannot be another named custom item.

2. **Default custom items** (Has no name but has a base type)
    Default custom entities serve as a way to add functionality to a specific vanilla item type. The declaration header looks like this:
    ```tdn
    define item default <base_type>
    ```
    Example:
    ```tdn
    define item default minecraft:egg
    ```
    Behavior defined inside this example item declaration will affect **all eggs** unless specified otherwise.

There are no item equivalents of entities' wildcard entities and entity components.

## 自定义物品结构体
- [Variable Declarations]().
- `default name <text_component>`
    (Named items only)
    Changes the item's base NBT to contain the given `display.Name`.
- `default lore [<text_component>, <text_component>, ...]`
    (Named items only)
    Changes the item's base NBT to contain the given `display.Lore`.
    Each text component must represent a different line of lore.
- `default nbt <tag_compound>`
    (Named items only)
    Changes the entity's base NBT to contain the tags in the given compound (via a merge operation).
- Inner functions (See next section)

## 自定义物品函数
Custom items support inner functions, as described in the [Object Inner Functions]() section.

### 物品事件函数
***[LL3]*** *This feature may only be used if the project's language level is 3*  

Within custom item bodies, you may specify that an inner function should run whenever a scoreboard criteria event is fired from that item. This is done via the `on` keyword, followed by the type of event it should be fired from.
Those events are: `used`, `dropped`, `picked_up`, `broken` and `crafted` (crafted is not supported for custom items, only default items support it). The actions that trigger these events may vary for each item, depending on how the corresponding scoreboard objective criterion behaves.

Example:
```tdn
# file: mypack:items/demo.tdn
define item demo minecraft:snowball {
    on used function {
        say Used demo snowball
    }
    on dropped function {
        say Dropped demo snowball
    }
    on picked_up if entity @s[tag=pickup_enabled] function {
        say Picked up demo snowball
    }
}
```
The function marked with `on used` will say Used demo snowball in chat whenever a player uses (throws) a snowball internally marked with the item code associated with this custom item. It will create a scoreboard objective named `uitem.12c23c81` with criterion `minecraft.used:minecraft.snowball`. Whenever that score increases for a player, it runs the corresponding function only if they were holding the demo item a tick earlier (that check doesn't occur with **default** items).
A similar process occurs with the other two functions declared in the item body.

#### Pure Events
For default items, you may want to limit certain events to non-custom items. You can achieve this by adding the `pure` keyword after the event key. Example:
```tdn
# file: mypack:items/demo.tdn
define item demo minecraft:snowball {
    # ...
}

define item default minecraft:snowball {
    on used pure function {
        say Used pure snowball
    }
    on used function {
        say Used snowball
    }
}
```
With this second item declaration, all snowballs thrown, custom or not, will print the message "Used snowball". Every non-custom snowball thrown will print the message: "Used pure snowball". Consider the following scenarios:

Player named Foo throws a default snowball (such as from the creative inventory). Chat:
```	
[Foo] Used pure snowball
[Foo] Used snowball
```

Player named Foo throws a `$demo` snowball. Chat:
```
[Foo] Used demo snowball
[Foo] Used snowball
```

----

# 特殊命令语法
## 方块
You can use interpolation blocks wherever a block is required. However, you may also want to  overwrite some of the values of the block in that variable. You can do so, simply by appending a blockstate and/or a tag compound after the first interpolation block. Example:
```tdn
var blockVar = block<chest[facing=east]{Lock:"Key"}>

setblock ~ ~ ~ $blockVar{CustomName:'"Treasure Chest"'}
setblock ~ ~ ~ $blockVar[waterlogged=true]{CustomName:'"Treasure Chest"'}
setblock ~ ~ ~ $blockVar[facing=north,waterlogged=true]
setblock ~ ~ ~ $blockVar{Lock:"Different Key"}

# Equivalent to:
setblock ~ ~ ~ chest[facing=east]{
        Lock:"Key",
        CustomName:'"Treasure Chest"'
}
setblock ~ ~ ~ chest[waterlogged=true,facing=east]{
        Lock:"Key",
        CustomName:'"Treasure Chest"'
}
setblock ~ ~ ~ chest[waterlogged=true,facing=north]{
        Lock:"Key"
}
setblock ~ ~ ~ chest[facing=north]{Lock:"Different Key"}
```
Just like in the vanilla syntax, blockstates or NBT segments in a block literal should be attached directly to the name, without whitespace in between.


## 物品
Trident adds a shorthand for CustomModelData for items. Simply append a hash sign (#), followed by the custom model data number, to the end of the item name, and before the NBT (if any). Example:
```tdn
give @a stick#5

# Equivalent to:
give @a stick{CustomModelData:5}
```
You can use interpolation blocks wherever an item is required. Just like blocks, you may also want to overwrite some values in the NBT of the item in that variable. You can do so, simply by appending a tag compound after the first interpolation block. Example:
```tdn
var itemVar = item<stick#5>

give @a $itemVar{HideFlags:63}
give @a $itemVar#8{HideFlags:63}

# Equivalent to:
give @a stick{CustomModelData:5,HideFlags:63}
give @a stick{HideFlags:63,CustomModelData:8}
```
Just like in the vanilla syntax, NBT segments in an item literal should be attached directly to the name, without whitespace in between.


## 实体定义
Trident uses a common format to refer to an entity type to create. It contains information about the entity type to spawn, its entity components and its NBT data, where the latter two are optional. The entity type can also be a custom entity.
This format is used in the `summon` command, `using summon` and `default passengers` in a custom entity.
Examples:
```tdn
summon armor_stand
summon armor_stand[componentA, componentB] ~ ~ ~
summon armor_stand{Glowing:1b} ~ ~ ~
summon $guard[componentA, componentB]{Glowing:1b} ~ ~ ~

define entity block_hitbox minecraft:armor_stand {
    default passengers [
        shulker[invisible]{NoAI:1b}
    ]
    # ...
}
```

New-entity-literals can also be NBT Compounds inside Interpolation Blocks, so long as there is an "id" tag inside, containing the entity type to spawn. Example:
```tdn
summon ${nbt<{id:"minecraft:skeleton",Glowing:1b}>}
# Turns into:
summon minecraft:skeleton ~ ~ ~ {Glowing:1b}
```

## 选择器
You can use interpolation blocks wherever an entity is required. However, you may want to add more selector arguments to the selector. You can do so, simply by appending selector arguments after the first interpolation block. 
**Note**: This will **add** the given selector arguments, and it will not override old ones if that selector type is repeatable. It will also try to merge `scores` and `advancements` arguments. Example:
```tdn
var entityVar = entity<@e[type=pig,tag=selected,scores={scoreA=5}]>

tp $entityVar[tag=new] @s
tp $entityVar[tag=new,scores={scoreB=3}] @s

# Equivalent to:
tp @e[type=pig,tag=selected,scores={scoreA=5},tag=new] @s
tp @e[type=pig,tag=selected,tag=new,scores={scoreA=5,scoreB=3}] @s
```
Just like in the vanilla syntax, a selector argument block in a selector should be attached directly to the selector header, without whitespace in between.

### `score: isset`
Trident adds a shorthand to the score execute argument that evaluates to true if a score is set, by matching it against the entire integer range. Example:
```tdn
if entity @s[scores={id=isset}] say ID is set

# Equivalent to:
if entity @s[scores={id=..2147483647}] say ID is set
```

## 命令
### `set`
Trident adds a shorthand command that unifies operations to and from scores and NBT.
The syntax is `set <pointer: target> <operator> <pointer: source>`.
Alternatively, the source pointer can be replaced with an NBT value.
Refer to [Interpolation Values > Pointers]() to learn about pointers and their syntax.

This is a table showing what each combination of pointer/value type translates into:

| Target Type | Operator | Source Type | Transformed into                                                                                                                           |
|:-----------:|:--------:|:-----------:|:------------------------------------------------------------------------------------------------------------------------------------------ |
|    SCORE    |    =     |    SCORE    | `scoreboard players operation A = B`                                                                                                       |
|    SCORE    |    =     |    VALUE    | `scoreboard players set A B`                                                                                                               |
|    SCORE    |    =     |     NBT     | `store result score A data get B`                                                                                                          |
|     NBT     |    =     |    SCORE    | `store result A scoreboard players get B`                                                                                                  |
|     NBT     |    =     |    VALUE    | `data modify A set value B`                                                                                                                |
|     NBT     |    =     |     NBT     | `# When: scale A * scale B == 1:`<br/>`data modify A set from B`<br/>`# When: scale A * scale B != 1:`<br/>`store result A * data get B *` |
|    SCORE    |    +=    |    SCORE    | `scoreboard players operation A += B`                                                                                                      |
|    SCORE    |    +=    |    VALUE    | `scoreboard players add A B`                                                                                                               |
|    SCORE    |    -=    |    SCORE    | `scoreboard players operation A -= B`                                                                                                      |
|    SCORE    |    -=    |    VALUE    | `scoreboard players remove A B`                                                                                                            |
|    SCORE    |    *=    |    SCORE    | `scoreboard players operation A *= B`                                                                                                      |
|    SCORE    |    *=    |    VALUE    | `#[LL2]`<br/>`scoreboard players operation A *= #B trident_const`                                                                          |
|     NBT     |    *=    |    VALUE    | `store result A data get A *B`                                                                                                             |
|    SCORE    |    /=    |    SCORE    | `scoreboard players operation A /= B`                                                                                                      |
|    SCORE    |    /=    |    VALUE    | `#[LL2]`<br/>`scoreboard players operation A /= #B trident_const`                                                                          |
|    SCORE    |    %=    |    SCORE    | `scoreboard players operation A %= B`                                                                                                      |
|    SCORE    |    %=    |    VALUE    | `#[LL2]`<br/>`scoreboard players operation A %= #B trident_const`                                                                          |
|    SCORE    |    <     |    SCORE    | `scoreboard players operation A < B`                                                                                                       |
|    SCORE    |    <     |    VALUE    | `#[LL2]`<br/>`scoreboard players operation A < #B trident_const`                                                                           |
|    SCORE    |    >     |    SCORE    | `scoreboard players operation A > B`                                                                                                       |
|    SCORE    |    >     |    VALUE    | `#[LL2]`<br/>`scoreboard players operation A > #B trident_const`                                                                           |
|    SCORE    |    <>    |    SCORE    | `scoreboard players operation A <> B`                                                                                                      |
|    SCORE    |    =     |    null     | `scoreboard players reset A`                                                                                                               |
|     NBT     |    =     |    null     | `data remove A`                                                                                                                            |

For arithmetic operations between a score and a value, an objective `trident_const` is created and initialized with all the constants used in the project. That way, scoreboard operations can simply use the fake players to get a score with a constant. This requires a language level of at least 2.

Example:
```tdn
set @s->altitude = @s->prev_altitude
set @s->altitude = @s.Pos[1] * 100
set #OPERATION->global -= 64
set #OPERATION->global *= 8

set (-30000 0 0).RecordItem.tag.nextVariant (int) = #RANDOM->global
set @s.Variant = (-30000 0 0).RecordItem.tag.nextVariant
set @s.HandItems[0] = {id:"minecraft:bow",Count:1b}

# Equivalent to:
scoreboard players operation @s altitude = @s prev_altitude

store result score @s altitude
    data get entity @s Pos[1] 100

scoreboard players remove #OPERATION global 64
scoreboard players operation #OPERATION global *= #8 trident_const

store result block -30000 0 0 RecordItem.tag.nextVariant int 1
    scoreboard players get #RANDOM global

data modify entity @s Variant set from block -30000 0 0 RecordItem.tag.nextVariant

data modify entity @s HandItems[0] set value {id:"minecraft:bow",Count:1b}
```

### `tag update`
***[LL2]*** *This feature may only be used if the project's language level is at least 2*
Trident adds a shorthand for removing a tag from all entities and reapplying it only to specific entities. Example:
```tdn
tag @e[nbt={OnGround:1b}] update onGround

# Equivalent to:
tag @e remove onGround
tag @e[nbt={OnGround:1b}] add onGround
```
### `component`
This component command is similar in use to the tag command, but its purpose is to add and remove custom entity components. See [Entity Components > Component add/remove command]().

### `event`
This event command is used to invoke an event on certain entities. See [Abstract Entity Events]().

### `summon`
The summon command syntax has been modified so that it uses New-Entity literals. As a result, you can append a list of entity components to add to the summoned entity, as well as specify the NBT of the spawned entity while omitting the coordinates. See [Command Syntax Additions > New-Entity literal](). The default syntax for the summon command is still valid, however.

### `expand`
The `expand` command applies the same set of modifiers to multiple commands in a block.
Syntax:
```tdn
expand {
    # Commands go here:
}
```
Example:
```tdn
if entity @e[tag=!assigned] expand {
    function try_assign_0
    function try_assign_1
    function try_assign_2
    function try_assign_3
}
# Equivalent to:
if entity @e[tag=!assigned] function try_assign_0
if entity @e[tag=!assigned] function try_assign_1
if entity @e[tag=!assigned] function try_assign_2
if entity @e[tag=!assigned] function try_assign_3
```
It's advised you only use this when you expect the condition to be invalidated somewhere in the block to stop the other commands from running. If you want all the commands in the block to run if the condition is met, consider using functions instead.

### `gamelog`
***[LL3]*** *This feature may only be used if the project's language level is 3*
Trident adds a runtime equivalent of the [log instruction](). This lets you send debug messages to select people, containing information about the execution context of the command. The syntax is `gamelog <info|debug|warning|error|fatal> <value>`.
The different severities correspond to an integer, and a message of a certain severity will only be shown to players whose `tdn_logger` score is at least the severity number.
This is a table showing which type of log each player sees, depending on the `tdn_logger` score:
```
tdn_logger 0  : none
tdn_logger 1  : fatal
tdn_logger 2  : fatal, errors
tdn_logger 3  : fatal, errors, warnings
tdn_logger 4  : fatal, errors, warnings, info
tdn_logger 5  : fatal, errors, warnings, info, debug
tdn_logger 6  : debug
```

Example:
```tdn
gamelog debug "Picked up item"
gamelog info "Module loaded"
gamelog warning "Jukebox at origin not found, replacing..."
gamelog error "Command limit reached"
gamelog fatal "Did /kill @e"
```
Result:
![some picture here]()
You may customize the style of these messages via the project configuration file (.tdnproj), within the game-logger object.
- `compact: true` will reduce the information shown (by default false):
  ![another pic here]()
- `timestamp-enabled: true` will show the game time (by default true). For non-compact messages, it will be in the format: `dd/hh:mm:ss.t` where dd is days, hh is hours, mm is minutes, ss is seconds and t is ticks. For compact messages, the format is `hh:mm:ss.t`.
- `pos-enabled: true` will show the block at which the command was executed (by default true).
- `line-number-enabled: true` will show the line number where the gamelog command is located. **Note that this line number is for the Trident file the command is located in, not the function it's in.** By default false.

The gamelog messages show a variety of information in addition to the description, such as the execution time, message severity, function file, command sender, execution position and project name. Note that some of these may or may not be present depending on the project configuration.

## `execute` 修饰器
### `(if|unless) score: isset`
Trident adds a shorthand to the score condition modifier that evaluates to true if a score is set, by matching it against the entire integer range. Example:
```tdn
if score @s id isset say ID is set

# Equivalent to:
if score @s id matches ..2147483647 say ID is set
```
### `(if|unless) selector`
Trident adds a shorthand to the entity condition modifier. You can omit the entity keyword if you use a selector. Example:
```tdn
if @s[tag=valid] say Valid

# Equivalent to:
if entity @s[tag=valid] say Valid
```
### `raw`
The execute modifier version of verbatim commands. Takes a string literal or an interpolation block (containing either a string or a list of strings) as a parameter. See [Raw Modifiers](). Example:
```tdn
raw "if block ~ ~-1 ~ minecraft:future_block" tp @s ~ 127 ~
```

# 指令
Instructions in Trident typically alter the state of the program during compilation, or generate many commands or functions at once. As such, they cannot be used with execute modifiers, as they are not commands.
## `log`
The log instruction is used to display information after the project has finished compiling. In command-line based systems, this may be in the form of text in the console. In the official [Trident UI](), these logs will appear in a panel at the bottom of the program, which allow you to quickly jump to the location it was logged from.
There are different types of messages you can log: `info`, `warning` and `error`.
None of these will halt the execution of the program, but the latter (`error`) will prevent the output data pack and resource pack from generating.
Syntax:
```tdn
log <info|warning|error> <value>
```
Example:
```tdn
log info "Added  " + i + " to the list"
```

## `using`
### `using tag`
***[LL2]*** *This feature may only be used if the project's language level is at least 2*
Tags on entities are often used temporarily to target a specific entity without changing the context. This requires adding and removing the tag from the entity. Trident adds an instruction that makes this process easier. The using tag instruction runs a specific block after adding a tag to the entity given, and automatically adds the tag remove command at the end. Note that the tag is removed from all entities at the end, so don't use a tag that is used permanently somewhere else.
Syntax:
```tdn
using tag <tag_to_use> <entity_to_tag> <optional_modifiers> {
    # Commands in the middle go here:
}
```
Examples:
```tdn
using tag needs_id @e[scores={id=0},limit=1] {
    scoreboard players operation @e[tag=needs_id] id > * id
    tellraw @a ["ID assigned to ", {"selector":"@e[tag=needs_id]"}]
}
# Equivalent to:
tag @e[scores={id=0},limit=1] add needs_id
scoreboard players operation @e[tag=needs_id] id > * id
tellraw @a ["ID assigned to ", {"selector":"@e[tag=needs_id]"}]
tag @e remove needs_id
```
```tdn
using tag needs_id @e[scores={id=0},limit=1] if block ~ ~-1 ~ air {
    scoreboard players operation @e[tag=needs_id] id > * id
    tellraw @a ["ID assigned to ", {"selector":"@e[tag=needs_id]"}]
}
# Equivalent to:
as @e[scores={id=0},limit=1] if block ~ ~-1 ~ air tag @s add needs_id
scoreboard players operation @e[tag=needs_id] id > * id
tellraw @a ["ID assigned to ", {"selector":"@e[tag=needs_id]"}]
tag @e remove needs_id
```

### `using summon`
***[LL2]*** *This feature may only be used if the project's language level is at least 2*
Another common use of temporary tags is targeting a newly summoned entity. Trident makes this much easier by adding a function block that runs `as` the summoned entity. The selector targeting the entity with the tag is optimized whenever possible so that it only targets entities close to the summoning location.
Syntax:
```tdn
using <summon_command> with <tag_to_use> <optional_modifiers> {
    # Commands in the middle go here:
}
```
Example (without modifiers):
```tdn
using summon armor_stand ~-3 0 ~4 {
        CustomName:'"guard_model"',
        CustomNameVisible:1b,
        Tags:["entity_model"]
    }
    with new {
        set @s->id = NEXT_ID->global
        scoreboard players add NEXT_ID global 1
        set @s->cooldown = 0
        set @s->jump_time = 0
    }

# Equivalent to:
summon armor_stand ~-3 0 ~4 {
    CustomName:'"guard_model"',
    CustomNameVisible:1b,
    Tags:["entity_model","new"]
}

as @e[type=armor_stand,tag=new,limit=1,y=0,distance=4.99..5.01] function {
    tag @s remove new
    set @s->id = NEXT_ID->global
    scoreboard players add NEXT_ID global 1
    set @s->cooldown = 0
    set @s->jump_time = 0
}
```

Example (with modifiers):
```tdn
using summon armor_stand ~-3 0 ~4 {
        CustomName:'"guard_model"',
        CustomNameVisible:1b,
        Tags:["entity_model"]
    }
    with new
    if score ID_ENABLED global matches 1.. {
        set @s->id = NEXT_ID->global
        scoreboard players add NEXT_ID global 1
        set @s->cooldown = 0
        set @s->jump_time = 0
    }

# Equivalent to:
summon armor_stand ~-3 0 ~4 {
    CustomName:'"guard_model"',
    CustomNameVisible:1b,
    Tags:["entity_model","new"]
}

as @e[type=armor_stand,tag=new,limit=1,y=0,distance=4.99..5.01] function {
    tag @s remove new
    if score ID_ENABLED global matches 1.. function {
        set @s->id = NEXT_ID->global
        scoreboard players add NEXT_ID global 1
        set @s->cooldown = 0
        set @s->jump_time = 0
    }
}
```
Trident will create at least one extra function for the using summon block, and it will use two only if necessary (e.g. if one of the modifiers specified may cause the command not to run, like conditionals if and unless). It will only create one extra function if modifiers likely wouldn't change the execution condition (e.g. `at @s`)













<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
<!-- TEMP: 末尾留几行以在协同编辑器中把文字提到中间 -->