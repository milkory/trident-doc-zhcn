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