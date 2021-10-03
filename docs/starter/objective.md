# 记分板项目

Trident 允许您快速声明记分板项目，同时自动生成添加它们的命令。

您只需要使用 <code>[define] objective</code> 指令。

```tdn
define objective global
```

这会创建一个名为 `global` 的记分项，然后创建该记分项的命令会被生成在另一个初始化函数中，其拥有 `minecraft:tag` 标签，这使得该记分项会在数据包加载后被创建。

没有准则的记分项会默认为 `dummy` 准则，同时它的显示名称也默认为它的内部名称。

您可以在定义中指定记分项的准则和显示名称，没有准则的记分项会默认为 `dummy` 准则，同时它的显示名称也默认为它的内部名称。

示例：

```tdn
define objective health health {"text": "当前生命值"}
```

您也可以直接使用未经声明的记分项，编译器会自动帮您生成创建记分项命令，同时显示一个警告，要求您先声明记分项再使用。

当然，这并非唯一的方法，<code>[scoreboard] objectives add</code> 也可以声明记分项。

[~](/~clink)