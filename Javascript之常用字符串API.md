#### Javascript之常用字符串API

1.**charAt()**: 返回在指定位置的字符

```
var str = 'abc';
console.log(str.charAt(0));//a
```

2.**charCodeAt():**  返回在指定的位置的字符的Unicode编码

```
var str = 'abc';
console.log(str.charCodeAt(1)); //98
```

3.**concat()**: 拼接字符串

```
var a = 'abc';
var b = 'def';
var c = a.concat(b);
console.log(c); //abcdef
```

4.**match()**:  可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。

```
var str = '1 abc 2 def 3';
console.log(str.match(/\d+/g)); //123
```

5.**replace()**: 用于在字符串中用一些字符替换另一些字符,或替换一个与正则表达式匹配的字符。

```
var str = 'abc Def!';
console.log(str.replace(/abc/,'CBA')); //CBA Def
```

6.**indexOf()** :  检索字符串。indexOf方法对大小写敏感。

```
var str = "Hello World!"
console.log(str.indexOf("Hello"))//0
console.log(str.indexOf("world"))//-1
console.log(str.indexOf("World"))//6
主要是看第一个字母出现的位置
```

7.**search()**:  用于检索字符串指定中指定的子字符串，或检索与正则表达式相匹配的子字符串。要执行忽略大小写的检索，请追加标志**i**。如果没有找到任何匹配的子字符串，则返回-1.

```
var str = 'abc DEF';
console.log(str.search(/DEF/))//4
```

8.**slice()**: 提取字符串的片段，并在新的字符串中返回被提取的部分。有两个参数，其中**start**要抽取的片段的起始下标。如果是负数，则该参数规定的是从字符串的尾部开始算起的位置。也就是是，-1指字符串的最后一个字符，-2指的是倒数第二个字符，以此类推。**end**紧接着要抽取的片段的结尾的下标。若未指定此参数，则要提取的子字符串包括start到原字符串结尾的字符串。如果参数是负数，那么规定的是从字符串的尾部开始算起的位置。

```
var str = "abc def ghk"
console.log(str.slice(6))//f ghk
```

9.**spilt()**:  把字符串分割为字符串数组

```
var str = 'abc def ghi'
console.log(str.spilt(''))//['a','b','c','d','e','f','g','h','i']
console.log(str.spilt(' '))//['abc','def','ghi']
console.log(str.spilt(' ',3))//['abc','def','ghi']
```

10.**toLowerCase()**:  把字符串转换为小写

```
var str = 'ABC Def'
console.log(str.toLowerCase())//abc def
```

11.**toUpperCase()**:  把字符串转换为大写

```
var str = 'ABC def'
console.log(str.toUpperCase())//ABC DEF
```
