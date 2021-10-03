# 变量
You can declare variables to use in commands with the following syntax:
```tdn
[<visibility>] [<final>] var <identifier> [ : [<constraint>]] = <value>
```
Where visibility is optional, and specifies the visibility of the variable to other files (see [Variable Visibility]()). If not specified, defaults to local.
The identifier is the name of the variable it is creating.
The value is an Interpolation Value (such as integers, real numbers, strings, booleans, null, etc.) to assign to the variable (see [Interpolation Values]())
You can access variables from commands using Interpolation Blocks, which we’ll cover later (see [Interpolation Blocks]()).

If you specify `final` before the `var` keyword, the variable will only be able to change its value once. Any further attempts to change the value in this variable will fail.

## Variable Visibility
There are three main modes of variable visibility, which affect how files other than the declaring one can access the variable. They are:
1. `private`: Only the declaring file can access the symbol.
   In the context of Class members, private visibility means only the defining class can access it.
2. `local`: Only the declaring file and files which `@require` the declaring file can use it. This is the default for variables declared with `var`.
   In the context of Class members, local means only the declaring file and subclasses can access this symbol.
3. `global`: Any file can see the variable without any `@require` directives, as long as the declaring file is read before. This is the default for custom items and entities.
   This cannot be used for Class members.
4. `public`: Only usable by Class members. Public visibility means any file can access this symbol.

