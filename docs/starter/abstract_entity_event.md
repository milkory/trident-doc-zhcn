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