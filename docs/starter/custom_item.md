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
*__[LL2]__ This feature may only be used if the project's language level is 3*  

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