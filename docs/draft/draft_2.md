# Custom Classes
Trident allows you to create custom interpolation data types. These types can be instantiated using a defined constructor, which will return an object of the class, containing custom data as defined by the class. They can have custom fields, methods, accessors and even casting definitions. They can also extend one or more classes, sharing their definitions.
```
# define [<access modifier>] [<symbol modifiers>] class <identifier> [: <superclasses...>]
define class MyClass {
    # fields, methods, accessors and cast definitions go here
}
```
## Custom Class Declaration
Classes are declared using the define instruction. The declarations may have the following:
1. **Access modifier** (See [Variable Visibility]()). One of: `global`, `local`, `private`. If omitted, defaults to `local`.
    Changes where the class symbol is initially accessible from.
2. **Symbol modifiers**. Any combination of:
    1. `static`: Means the class cannot be instantiated. A static class may only have static members. This also prevents other classes from extending this one.
    2. `final`: Means the class cannot be extended.
3. **Class Identifier**: The name of the class.
4. **Superclasses**: A list of classes that this new class will inherit from.

## Incomplete Declarations
Often you may want to have multiple classes which reference each other, but because instructions need to be run one after another, you may run into an issue where one class is not defined when the other needs to reference it.
To circumvent this, Trident allows for incomplete declaration of classes. They're simply the class declaration without the body, and they must be declared in the same file as the complete definition.
Example:
```tdn
define class B

define class A {
    public static var bReference : B
    # Without the incomplete B declaration, this would throw an error
}
define class B {
    public static var aReference : A
}
```
While a class definition is incomplete, you may use it in type constraints and class inherits, but you may not instantiate it or access static members.

There are certain restrictions when using incomplete definitions. The complete declaration header must be, more or less exactly the same as the incomplete declaration header:
1. The symbol modifiers must be the exact same. For instance, if the incomplete declaration had only the `static` modifier, the complete declaration must have the `static` modifier and the `static` modifier **only**.
2. The complete declaration must extend **all** the classes marked for extending by the incomplete declaration. The complete declaration, however, may extend other classes in addition to the ones promised by the incomplete declaration.

## Fields
Classes may have fields, which are essentially variables. They may either be static fields (if the static modifier is present) or instance fields.
Static fields can be accessed without the need for an instance, and are attached to the type definition of the class.
Instance fields are variables created for each instance of the class, and all the instances may each have different values for that field.
Syntax:
```tdn
[<access modifier>] [<symbol modifiers>] var <identifier> [: <constraints>] [= <initial value>]
```
Example:
```tdn
define class A {
    public static var someStaticField : int = -5
    public var someInstanceField : int = 1
}

log info A.someStaticField      # -5
log info A.someInstanceField    # ERROR

var firstInstance : = new A()
var secondInstance : = new A()

log info firstInstance.someStaticField      # ERROR

log info firstInstance.someInstanceField    # 1

eval firstInstance.someInstanceField = 8
log info firstInstance.someInstanceField    # 8

log info secondInstance.someInstanceField   # 1
```
### Field inheritance
When a class inherits from another, the new class may not create a field with the same name as a field in the inherited class - that field must be overridden to use that name.
To override a field, you must declare it in the new class, using the override keyword before the `var` keyword.
Overriding a field from an inherited class has the following requirements:
1. The inheriting class must have access to the field in the inherited class (e.g. the original field must not be private)
2. Both the original nor the new field must **not** be static
3. Both the original nor the new field must **not** be final
4. Both fields must have the **exact same** type constraints.
When a field is overridden, it simply changes what the initial value of the field becomes. Note that the original field's expression will **not** be evaluated. e.g. if the default value of the original field calls a function, that function **will not** run when the new class is instantiated.
Example:
```tdn
define class A {
    public var someField : string? = "A"
}
define class B : A {
    public var someField : int = 5                 # ERROR
   
    public override var someField : string = "B"   # ERROR
   
    public override var someField : string? = "B"  # OK
}
```

## Methods
Classes may also have methods, which are essentially dynamic functions, but with one key difference: **They can be overloaded**.
This also means that class methods are not retainable objects. You cannot take a class's method and store it in a variable, since you must call it for it to resolve into any function.
Static methods can be called without the need for an instance, and are attached to the type definition of the class.
Instance methods are methods created for each instance of the class. The this identifier can also be used inside instance methods to access the current object.

Syntax:
```tdn
[<access modifier>] [<symbol modifiers>] <identifier>([<formal parameters...>]) [: <return constraints>] {
    <commands and instructions...>
}
```
Example:
```tdn
define class A {
   
    public someMethod() {
        log info "Got nothing"
    }
   
    public someMethod(number : int) {
        log info "Got integer " + number
    }
   
    public someMethod(number : real) {
        log info "Got real " + number
    }
   
    public someMethod(message : string) {
        log info "Got message \"" + message + "\""
    }
}

var someA : = new A()

eval someA.someMethod()          # 'Got nothing'
eval someA.someMethod(5)         # 'Got integer 5'
eval someA.someMethod(5.0)       # 'Got real 5.0'
eval someA.someMethod("5")       # 'Got message "message"'
eval someA.someMethod("5", null) # ERROR: Overload not found for parameter types: (string, null)
```
Static methods and instance methods are completely separated, meaning you can have methods with the exact same signature and different body, one as static and another as instance.
### Picking an overload
Whenever a method is called, the best overload is picked based on the given parameter types and the type constraints. Each overload is given a rating from 0 to 4 based on the average "score" of its parameters. The parameters are rated with the following logic:
- 6 if the actual parameter matches perfectly the formal parameter (without coercion or inheritance)
- 5 if the actual parameter is an instance of the formal parameter type (without coercion)
- 3 if the actual parameter can be coerced into the formal parameter type
- 2 if the actual parameter is null and and the formal parameter constraint is nullable
- 1 if the actual parameter is omitted and and the formal parameter constraint is nullable
- 0 if the actual parameter does not match at all (and cannot be coerced) OR if the actual parameter is null and the formal parameter is not nullable
Any parameters with a rating of 0 automatically discard the overload.
Also, overloads with fewer former parameters than the actual parameters are automatically discarded.
Given the above scores, the single overload with the highest average score is chosen and called.
If there's a tie for first place, an error is thrown for an "ambiguous call"; and if there are none, an error is thrown for "overload not found for parameter types..."
Note that the calling context must have access to the chosen overload for it to be called correctly.

### Symbols in context
In expressions within a class, static fields and methods of that class can be accessed without the need to use the class name.
Inside instance methods, you can access both static and instance methods without using the class name or this, unless a field is obscured by some variable or parameter in the current context.
Example:
```tdn
define class A {
   
    private static var STATIC_FIELD : int = 2147483647
    private var instanceField : int = 255
    private var number : int = 128
  
    public someMethod() : string {
       return "Called someMethod()"
    }
  
    public someMethod(number : int) {
        log info someMethod()       # Called someMethod()
       
        log info STATIC_FIELD       # 2147483647
        log info A.STATIC_FIELD     # 2147483647
       
        log info instanceField      # 255
        log info this.instanceField # 255
       
        log info number             # 5 (from parameter)
        log info this.number        # 128 (from field)
    }
}

eval new A().someMethod(5)
```
### Method inheritance
When a class inherits from another, the new class may not create an overload for a method with the same name. That overload must be overridden.
To override a method, you must declare it in the new class, using the override keyword before the function name.
Overriding a method from an inherited class has the following requirements:
1. The inheriting class must have access to the method in the inherited class (e.g. the original method must not be private)
2. Both the original nor the new method must **not** be static
3. Both the original nor the new method must **not** be final
4. The new method must not assign weaker access privileges than the original (can turn a `private` method `public`, but not a `public` method `private`)
5. The new method's return constraints must be entirely contained in the original method's return constraints. This means the new constraints should be **just as, if not more restrictive** than the original. e.g: `string?` to `string`
Example:
```tdn
define class A {
    public someMethod() : string? {
        return null
    }
}

define class B : A {
   
    public someMethod(num : int) {}             # OK, different signature
   
    public someMethod() {}                      # ERROR
   
    public override someMethod() {}             # ERROR
   
    local override someMethod() : string? {     # ERROR
        return 0
    }
   
    public override someMethod() : string {     # OK
        return ""
    }
}
```

### Virtual Methods

In some situations you may want a method to be overridden by a subclass. However, as class inheritance is flat, and not hierarchical, you may encounter issues trying to extend a class that overrides another class's method. The solution for this is the virtual keyword.
Place the virtual modifier on the class that defines the method. This will make it so, if there is a clash between a virtual method and a non-virtual method, the non-virtual method will be chosen instead of throwing an error. Example:
```tdn
define class A {
    public foo() {}
}
define class B : A {
    public override foo() {}
}
define class C : B {}
# Uncaught Structural Error: Method 'foo()' is defined in multiple inherited classes: B, A.
# Override it in the class body, or mark one of the two methods as virtual
```
```tdn
define class A {
    public virtual foo() {} # virtual keyword added
}
define class B : A {
    public override foo() {}
}
define class C : B {}
# OK, B's foo is chosen over A's
```
### Constructors
Constructors are methods that are used to instantiate objects of a class. They are called using the keyword `new`, followed by a reference to the class as a method call.
Constructors are defined just as a normal class method, but with the `new` keyword in place of the method name. Whenever a constructor is called, a new object of the class is created, its fields are initialized to their default values, and the appropriate constructor method's body is called as the newly constructed object.
At the end of a constructor, **all final fields must be initialized**, otherwise an exception will be thrown.
Note that Trident has no mechanism of ensuring that inherited classes run their own constructors appropriately. If you intend a class to require proper initialization beyond fields upon construction, and want it to be extendable, consider creating an initialization method and having all constructors (including in inheriting classes) call it.

Example:
```tdn
define class A {
   
    private final var score : int
   
    public new(score : int) {
        eval this.score = score
    }
    private new(score : string) {
       eval this.score = score.length
    }
}


var a = new A(5)   # OK
var a = new A("")  # ERROR, private access
```

If a class does not explicitly declare any constructors, it will have an implicit empty public constructor.
Static classes may not declare any constructors.
### Default Methods
All custom classes implicitly extend one base class, and it has the following methods defined, which can be overridden:
#### `public toString() : string`
Called whenever the object needs to be converted into a string (not to be confused with a cast). Called by language features such as the `log` instruction or the string concatenation operator `+`.

Example:
```tdn
define class A {
    private final var score : int
    public new(score : int) {
        eval this.score = score
    }
   
    public override toString() : string {
        return "score=" + score
    }
}

log info new A(5)  # "score=5"
```
#### `public getIterator()`
Called whenever the object needs to be iterated through via a foreach loop. Must return a natively iterable object such as a list, dictionary or string, or another iterable class.

Example:
```tdn
define class ListWrapper {
   private final var list : list = [0,1,2,3,4]
  
   public override getIterator() {
       return list
    }
}


for(element in new ListWrapper()) {
    log info element # Prints 0, 1, 2, 3, 4
}
```

## Indexer
Custom classes may define the behavior of square brace `[]` indexers, for use similar to lists and dictionaries.
Indexers are essentially two methods: One for setting, and another for getting, and they both share a parameter type, which will be the value inside the square braces.

The syntax is as follows:
```tdn
public this[<index parameter>] {
    get <return constraint> {
        # code for getting
    }
    set(<set parameter>) {
        # code for setting
    }
}
```
Where the index and set parameter may be constrained, the return constraint is optional, and the set block may be omitted.
Each `get` and `set` block may also have its own access modifier (before the `get` and `set` keywords).

Example:
```tdn
define class BitField {
    private var field : int = 0
   
    public new(default : boolean) {
        if(default) eval field = ~0
    }
   
    public override toString() : string {
        return Integer.toUnsignedString(field, 2)
    }
   
    public this[bit : int] {
        get : boolean {
            return (this.field & (1 << bit)) != 0
        }
        set(value : boolean) {
            eval this.field &= ~(1 << bit)
            if(value) eval this.field |= (1 << bit)
        }
    }
}

var bitField : = new BitField(false)

#set
eval bitField[0] = true
eval bitField[1] = true
eval bitField[3] = true
eval bitField[31] = true

log info bitField # 10000000000000000000000000001011

#get
log info bitField[1]  #true
log info bitField[2]  #false
log info bitField[5]  #false
log info bitField[31] #true
```
### Indexer inheritance
When a class inherits from another, the new class may not create an indexer in the inherited class without overriding the original indexer.
To override an indexer, you must declare it in the new class, using the override keyword before the `this` keyword.
Overriding an indexer from an inherited class has the following requirements:
1. The inheriting class must have access to both the getter and the setter (if it exists) in the inherited class (e.g. the original indexer must not be private)
2. The old indexer's index parameter constraints must be entirely contained in the new indexer's index parameter constraints. This means the new constraints should be **just as, if not less restrictive** than the original. e.g: `string` to `string?`
3. If the original indexer has a setter, the new indexer must also declare a setter.
4. The new indexer must not assign weaker access privileges than the original (can turn a private indexer public, but not a public indexer private)
5. The new indexer's getter return constraints must be entirely contained in the old indexer's getter return constraints. This means the new constraints should be **just as, if not more restrictive** than the original. e.g: `string?` to `string`
6. The old indexer's setter value constraints must be entirely contained in the new indexer's setter value constraints. This means the new constraints should be **just as, if not less restrictive** than the original. e.g: `string` to `string?`
   This does not apply if the old indexer doesn't have a setter.

## Properties
Custom classes may define properties that have their own get and set methods, similarly to indexers, but accessed via dot notation, not bracket notation. Unlike accessors, properties can be static.

The syntax is as follows:
```tdn
public <property identifier> {
    get <return constraint> {
        # code for getting
    }
    set(<set parameter>) {
        # code for setting
    }
}
```
where `<set parameter>` may be constrained, `<return constraint>` is optional, and the `set` block may be omitted.
Each `get` and `set` block may also have its own access modifier (before the` `get and `set` keywords).

Example:
```tdn
define class PropertyTest {
    private var _count : int = 0
  
    public count {
        get : int {
            return this._count
        }
        set(value : int) {
            if(value < 0) throw "Count cannot be negative"
           eval this._count = value
        }
    }
}

eval new PropertyTest().count = -1 # ERROR: Count cannot be negative
eval new PropertyTest().count = 5 # OK
```
### Property inheritance
To override a property, you must declare it in the new class, using the override keyword before the identifier.
Overriding an indexer from an inherited class has the following requirements:
1. The inheriting class must have access to both the getter and the setter (if it exists) in the inherited class (e.g. the original property must not be private)
2. If the original property has a setter, the new property must also declare a setter.
3. The new property must not assign weaker access privileges than the original (can turn a private property public, but not a public property private)
4. The new property's getter return constraints must be entirely contained in the old property's getter return constraints. This means the new constraints should be **just as, if not more restrictive** than the original. e.g: `string?` to `string`
5. The old property's setter value constraints must be entirely contained in the new property's setter value constraints. This means the new constraints should be **just as, if not less restrictive** than the original. e.g: `string` to `string?`
   This does not apply if the old property doesn't have a setter.
## Conversion Definitions
Custom classes may define their behavior when objects of that class need to be cast or coerced into a type.
We call coercion "implicit conversion" and casting "explicit conversion". Coercion is what occurs when a value is passed through a type constraint that doesn't exactly match the value, but the value has an implicit conversion into that type.
Casting is what occurs when a value is explicitly cast to another type, whether through parenthesis casting or the `as` operator.

The syntax for conversion definitions is as follows:
```tdn
override explicit <<target_type>> {
    # code for casting
}

override implicit <<target_type>> {
    # code for coercing
}
```
Note the lack of access modifiers, as the visibility of conversion functions cannot be limited.

Example:
```tdn
define class A {
    private final var score : int
    public new(score : int) {
        eval this.score = score
    }

    override implicit <real> {
        # Need to explicitly cast to real,
        # as the return values of implicit
        # conversion functions are not coerced
        return (real)score
    }
    override explicit <real> {
        return 10 * score
    }
}

log info Math.pow(new A(5),2)  # Coercion, 25.0
log info new A(5) as real      # Casting,  50.0
```
Important note: the implicit conversion function is not allowed to coerce its return value into the target value; it must return the **exact** type.
### Conversion inheritance
When a class inherits from another, the new class may freely change the conversion definitions, as the return constraints are already very strict and well defined.

## Operator Overloading
Custom classes may define custom operator behavior for any combination of types and operators. They are not limited to the containing class, so a class may define operators for entirely different classes, or even primitives.
The operator definition to use is chosen the same way as overloaded methods.

The syntax for operator overloading is as follows:
```tdn
operator <operator symbol>(<param 0>, <param 1>, ..., <param n>) {
    # code for operator
}
```
where:
`<operator symbol>` is the symbol of the operator to overload (e.g. `*`, `+`, `!`). For operators with more than 2 operands, only the first symbol needs to be used (For instance, the conditional ternary operator `?:`, which is grade 3, only needs the first symbol, `?`)
`<param 0>`, `<param 1>`, ..., `<param n>` are the operands. This number will depend on how many operands the operator you're overloading accepts. For example, if you're overloading the binary `+` operator, you'll need 2 operands. If you're overloading the unary (left) `+` operator, you'll need 1 operand.

If the operator you're overloading is unary, it will choose the left hand variant of the operator, if it exists. Otherwise it'll overload the right. At the moment though, there exists no right-hand unary operator in the language that doesn't also have a left-hand variant (`++` and `--` operators exist for both sides), so overloading a right unary operator is, in practice, impossible.

Compound assignment operators (such as `+=`, `*=`), as well as `??` cannot be overloaded. In the case of compound assignment operators, the corresponding simple operator will be used (so `a += b` behaves the same as `a = a + b`)

Short-circuiting operators such as `?:`, `||` and && will use their default behavior if the first operand is a boolean. Otherwise, custom operator code will be used if all the arguments match the custom operator signature.

Note the lack of access modifiers, as the visibility of operators cannot be limited.

Example:
```tdn
define static class CustomOperators {
    operator *(part : string, times : int) {
        var repeated = ""
        for(var i = 0; i < times; i++) {
            eval repeated += part
        }
        return repeated
    }
}

log info "ba" * 5 # Logs bababababa
```