# 自定义对象
Trident allows you to abstract the process of creating a custom entity or item, using its custom object features. This section will describe features common to both entity and items.

## 对象内部函数
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