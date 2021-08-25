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