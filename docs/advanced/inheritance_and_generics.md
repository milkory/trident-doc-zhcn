# 继承

Classes may inherit from from other classes, making objects of the new class behave as the inherited class. This is particularly useful for extending the functionality of one or more classes.

```tdn
define class A {
    public var aField : int = 5
}
define class B : A {
    public var bField : string = "five"
}

var bInstance : B = new B()

log info bInstance.bField  # "five"
log info bInstance.aField  # 5
```

Note that, unlike in most object-oriented programming languages, fields and methods can only have one form. This means that a field declared in both A and B with the same name will effectively destroy the field in A, and only B's implementation will be accessible, even by methods of A. To avoid unintentionally causing issues like these, the `override` keyword must be used to resolve issues like these.

Also unlike in most object oriented programming languages, inheritance with Trident classes is iterative, not recursive. Because of this, circular inheritance is possible.

```tdn
define class A
define class B : A
define class C : A

define class A : C {
}
define class B : A {
}
define class C : B {
}
```

As any conflicts between inherited members is required to be resolved by the inheriting class, classes in a cycle are effectively one large class with its members defined across three different classes.

# 泛型

Custom classes may define type parameters. Generic classes describe functionality that isn't specific to any particular data type, but needs the data type to be consistent across all the features of a single instance of that class. This can be useful for things like typed lists.

To define a generic class, the names of the type parameters need to be placed between angle brackets <>, separated by commas, after the class name. Then inside that class, the generic types can be referenced via those names.
To instantiate (or reference a type with explicit type parameters), the actual types should be placed in much the same way after the class name.
Example:

```tdn
define class Pair<K, V> {
    public var key : K
    public var value : V
   
    public new(key : K, value : V) {
        eval this.key = key
        eval this.value = value
    }
}

var stringIntPair : Pair<string, int> = new Pair<string, int>("five", 5)
var itemBoolPair : Pair = new Pair<item, boolean>(item<stick>, true)

eval stringIntPair.key = "go" # OK
eval stringIntPair.key = true # ERROR

eval itemBoolPair.value = false # OK
eval itemBoolPair.value = 5 # ERROR
```

This describes a class that represents a pair of two values, where the type of each value is not known in advance, but upon instantiation the types will be resolved. Assigning values to the key and value fields of type that doesn't match the types bound to that object at instantiation is forbidden.

An object of a generic class cannot be instantiated without actual type parameters, and the number of type parameters must match that of the generic class.
However, you can use a generic class without type parameters in places such as type constraints and the `is` operator, where the objective is to verify the type of an object, not create one.
