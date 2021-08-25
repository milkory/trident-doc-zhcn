# 语言等级

我们希望 Trident 与原版函数的差别不会太大，同时也尽量避免让用户无法理解编译器最终生成的命令。然而，有些语言特性太过于抽象，它们与 Minecraft 命令相差甚远，导致我们无法达到上面的期望。为了解决这个问题，在逻辑上分离这些特性，我们加入了语言等级。

语言等级是一个数值设定，可以在项目设置中更改，也可以在文件开头特别指定该文件的语言等级。最低的语言等级仅包含最简单、直观的特性，禁用在没有用户控制的情况下可能会生成大量命令的特性；最高的语言等级将启用该语言的全部特性，包括那些涉及到用户无法直接控制的许多命令、函数和文件的特性。

以下是当前可用的语言等级以及它们所包含的特性：

1. 基本的函数预处理功能（原版命令、[变量](TODO)、[计分板项目](TODO)、[自定义实体](TODO)、简单的[自定义物品](TODO)等）

2. 基本的 Trident 命令（[`tag update`](TODO)）和 [`using` 指令](TODO)。这些命令或指令在编译时会输出为多行命令，并且可能还会有额外的短函数生成用以实现它们。

3. [Custom item events]() and [game logger](). These will usually create several functions with many commands each, which may introduce some execution time and space overhead. However, these functions will only generate once the first usage of the feature is found, and further uses of the feature will either reference a generated function or append to one.

The language level can be specified using the `language-level` property in the project configuration file .tdnproj, or per file, using the `@ language_level` [file directive](TODO).