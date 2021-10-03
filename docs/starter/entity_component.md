# 实体组件

**实体组件（Entity Component）**是[自定义实体]的一个拓展，它允许通过类似标签的方式向任意实体添加功能，并具有自定义实体的全部特性。实际上，它就是一种自定义实体类型。

实体组件可以被添加到自定义实体的定义中，或是在 `summon` 命令中为一个单独的实体设置；同时，还可以使用 Trident 独有的 `component=` 实体选择器来选择符合要求的实体，这些特性都将在后文中详细叙述。

以下是一个定义实体组件的示例：

```tdn
# 文件 - mypack:components.tdn
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

这个声明定义了一个叫做 `invisible` 的实体组件，它包含一个默认 NBT，使得拥有该组件的实体会在被生成的时候获得隐身效果。

该组件还包含一个叫 `reapply` 的函数，它每 10,000 秒会运行一次，为拥有该组件的所有实体重新添加隐身效果。

就像其他的自定义实体一样，实体组件

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

[~](/~link)