#### 	Ts

> TypeScript是javascript的一个超集，支持es6.
>
> TypeScript由微软开发的自由和开源的编程语言。
>
> TypeScript设计目标是开发大型应用，它可以编译成纯JavaScript，编译出来的JavaScript可以运行在任何浏览器上。

**增加的功能包括**：

1. 类型批注和编译时类型检查
2. 类型推断
3. 类型檫除
4. 接口
5. 枚举
6. Mixin
7. 泛型编程
8. 名字空间
9. 元祖
10. Await

**JavaScript与TypeScript的区别**

1.  TypeScript是JavaScript的超集，扩展了JavaScript的语法，因此现有的JavaScript代码可与TypeScript一起工作无需任何修改，TypeScript通过类型注解提供编译时的静态类型检查。
2. TypeScript可处理已有的JavaScript代码，并只对其中的TypeScript代码进行编译。

**TypeScript安装**

```
使用国内镜像： npm config set registry https://registry.npmmirror.com
安装typescript: npm install -g typescript
安装成功之后: tsc -v
tsc app.ts     (这里app.ts--->app.js)
node app.js
```

**TypeScript程序由以下几个部分组成**：

1. 模块
2. 函数
3. 变量
4. 语句和表达式
5. 注释

**TypeScript区分大小写**

**TypeScript与面向对象**

1. 面向对象主要有两个概念：对象和类。
2. 对象：是类的实例，有状态和行为。类： 是一个模板，它描述一类对象的行为和状态。方法： 是类的操作的实现步骤。

**TypeScript基础类型**

1. 任意类型：any
2. 数字类型:   number
3. 字符串类型：string
4. 布尔类型：boolean
5. 数组类型：无        let arr: number[] = [1,2];     let  arr: Array<number> = [1,2]
6. 元祖：无      let x: [string,number];  x = ['Runoob',1];  //运行正常，记得一一对应
7. 枚举：enum     enum Color {Red,Green,Blue};   le c:Color = Color.Blue;  console.log(c)  //输出2
8. void: void   用于标识方法返回值的类型，表示该方法没有返回值。
9. null:  null    表示对象值缺失
10. undefined:  undefined   用于初始化变量为一个未定义的值
11. never:  never   是其他类型(包括null和undefined)的子类型，代表从不会出现的值。

**TypeScript运算符**

1. 算术运算符
2. 逻辑运算符
3. 关系运算符
4. 按位运算符：&、|、~、^、<<、>>、>>>
5. 赋值运算符: +=、-=、=、*=、/=、%=
6. 三元/条件运算符
7. 字符串运算符: 连接运算符(+)
8. 类型运算符: typeof、instanceof

**TypeScript条件语句**

1. if  else-if
2. switch...case

**TypeScript循环**

1. for、while、do...while
2. for...in
3. for...of
4. forEach
5. every
6. some
7. break语句、continue语句：会跳过当前循环中的代码，强迫开始下一次循环

**TypeScript Number**

​      **Number对象支持以下方法**

1. toExponential():  把对象的值转换为指数计数法
2. toFixed(): 把数字转换为字符串，并对小数点指定位数。
3. toLocaleString(): 把数字转换为字符串，使用本地数字格式顺序
4. toPrecision(): 把数字格式化为指定的长度。
5. toString(): 把数字转换为字符串，使用指定的基数是2~36之间的整数。若省略该参数，则使用基数10
6. valueOf(): 返回一个Number对象的原始数字值。

**TypeScript String**

1. String对象用于处理文本(字符串)
2. String对象属性：constructor、length、prototype
3. String方法：charAt()、charCodeAt()、concat()、indexOf()、lastIndexOf()、localeCompare()、match()、replace()、search()、slice()、split()、substr()、substring()、toLocaleLowerCase()、toLocaleUpperCase()、toLowerCase()、toString()、toUpperCase()、valueOf()

**TypeScript Array**

1. Array方法：concat()、every()、filter()、forEach()、indexOf()、join()、lastIndexOf()、map()、pop()、push()、reduce()、reduceRight()、reverse()、shift()、slice()、some()、sort()、splice()、toString()、unshift()

**TypeScript Map**

1. Map对象保存键值对，并且能够记住键的原始插入顺序。
2. Map相关函数与属性：map.clear()、map.set()、map.get()、map.has()、map.delete()、map.size()、map.keys()、map.values()

**TypeScript 元祖**

> 数组中元素的数据类型都一般是相同的(any[] 类型的数组可以不同)，如果存储的元素数据类型不同，则需要使用元祖。
>
> 元祖中允许存储不同类型的元素，元祖可以作为参数传递给函数。

1. 元祖运算：push() ：向元祖添加元素，添加在最后面。 pop()：从元祖中移除元素(最后一个)，并且返回移除的元素。

**TypeScipt联合类型**

> 联合类型可以通过管道(|)将变量设置多种类型，赋值时可以根据设置的类型来赋值。
>
> 注意：只能赋值指定的类型，如果赋值其他类型就会报错。

```
ts
var val:string|number
val = 12
console.log("数字为"+ val)
val = "Rinoob"
console.log("字符串"+ val)
```

**TypeScript 接口**

> 接口是一系列抽象方法的声明，是一些方法特征的集合，这些方法都应该是抽象的，需要由具体的类去实现，然后第三方就可以通过这组抽象方法调用，让具体的类执行具体的方法。

```
ts
interface IPerson {
  firstName: string,
  lastName: string,
  sayHi: () => string
}
var customer:IPerson = {
  firstName: "Tom",
  lastName: "Hanks",
  sayHi: ():string => {return "Hi there"}
}
console.log("Customer对象")
console.log(customer.firstName)
console.log(customer.sayHi())
注意：接口不能转换为javascript,它只是TypeScript的一部分。
```

> 接口继承就是说接口可以通过其他接口来扩展自己。TypeScript允许接口继承多个接口
>
> 接口关键字：extends

**TypeScript类**

> 类描述了所创建的对象共同的属性和方法。
>
> TypeScript支持面向对象的所有特性，比如类、接口等。定义类的关键字是class

1. 类的继承：注意的是子类只能继承一个父类，TypeScript不支持继承多个类，但支持多重继承。
2. 继承类的方法重写：类继承后，子类可以对父类的方法重新定义。其中，super关键字是对父类的直接引用，该关键字可以引用父类的属性与方法。
3. static关键字：用于定义类的数据成员(属性和方法)为静态的，静态成员可以直接通过类名调用。
4. instanceof运算符：用于判断对象是否是指定的类型，如果是返回是true,否则返回false.
5. 访问控制修饰符：TypeScript中，可以使用访问控制符来保护对类、变量、方法和构造方法的访问。TypeScript支持3种不同的访问权限。public(默认)、protected、private.
6. 类和接口：类可以实现接口，使用关键字implements。

**TypeScript对象**

1. 对象是包含一组键值对的实例。值可以是标量、函数、数组、对象等。
2. 鸭子模型(Duck Typing): 是动态类型的一种风格，是多态的一种形式。一个对象有效的语义，不是由继承自特定的类或实现特定的接口，而是由“当前方法和属性的集合”决定。关注点在于对象的行为，能作什么，而不是关注对象所属的类型。

**TypeScript命名空间**

> 命名空间是为了解决重名问题。
>
> 命名空间定义了标识符的可见范围，一个标识符可在多个命名空间中定义，它在不同名字空间的含义是毫不相干的。这样，在一个新的名字空间中可定义任何标识符，它们不会与任何已有的标识符发生冲突，因为已有的定义都出现在其他的命名空间中。

1. 嵌套命名空间：命名空间支持嵌套，即你可以将命名空间定义在另外一个命名空间里头。

**TypeScript模块**

> TypeScript模块的设计理念是可以更换的组织代码。模块是在其自身的作用域里执行，并不是在全局作用域，这意味着定义在模块里的变量、函数、类等在模块外都是不可见，除非明确的使用export导出它们。类似的，还可以直接通过import导入其他模块导出的变量、函数、类等。
>
> 两个模块之间的关系是通过在文件级别上使用import和export建立的。
>
> 模块使用模块加载器去导入其他的模块。在运行时，模块加载器的作用是在执行此模块代码前去查找并执行这个模块的所有依赖。

**TypeScript声明文件**

> TypeScript作为javascript的超集，在开发过程中不可避免要引用其他第三方的javascipt的库，虽然通过直接引用可以调用库的类和方法，但是却无法使用TypeScript 诸如类型检查等特性功能。为了解决这个问题，需要将这些库里的函数和方法体去掉后只保留导出类型声明，而产生了一个描述 JavaScript 库和模块信息的声明文件。通过引用这个声明文件，就可以借用 TypeScript 的各种特性来使用库文件了。