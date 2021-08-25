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