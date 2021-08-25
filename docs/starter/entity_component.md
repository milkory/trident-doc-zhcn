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