#### Js之Array API

1. Array.prototype.concat(): 用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。

   ```
   var alpha = ['a','b','c'];
   var numeric = [1,2,3];
   alpha.concat(numeric);
   //['a','b','c',1,2,3]
   ```

2. Array.prototype.entries(): 返回一个新的Array Iterator对象，该对象包含数组中每个索引的键值对。

   ```
   const array1 = ['a','b','c','d'];
   const iterator1 = array1.entries();
   console.log(iterator1.next().value);
   //Array [0,'a']
   console.log(iterator1.next().value);
   //Array [1,'b']
   ```

3. Array.prototype.find(): 返回数组中满足提供的测试函数的第一个元素的值。否则返回undefined.

   ```
   const array1 = [5,12,8,130,44];
   const found = array1.find(element => element > 10);
   console.log(found);
   //12
   ```

4. Array.prototype.filter(): 创建一个新数组，其包含所提供函数实现的测试的所有元素。其中，如果没有任何数组元素通过测试，则返回空数组。

   ```
   const fruits = ['apple','banana','grapes','mango','orange'];
   const filterItem = (query) => {
     return fruits.filter(el =>
       el.toLowerCase().indexOf(query.toLowerCase()) > -1
     )
   }
   console.log(filterItems('ap'));  //['apple','graps']
   console.log(dilterItems('an'));   //['banna','mango','orange']
   ```

5. Array.from(): 从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例。

   ```
   consle.log(Array.from('foo'));
   //Array ['f','o','o']
   console.log(Array.from([1,2,3],x => x + x))
   //Array [2,4,6]
   ```

6. Array.prototype.keys(): 返回一个包含数组中每个索引键的Array Iterator对象。

   ```
   const array1 = ['a','b','c'];
   const iterator = array1.keys();
   for (const key of iterator) {
     console.log(key);
   }
   //0
   //1
   //2
   var arr = ["a", , "c"];
   var sparseKeys = Object.keys(arr);
   var denseKeys = [...arr.keys()];
   console.log(sparseKeys);  //['0','2']
   console.log(denseKeys);   //[0,1,2]
   ```

7. Array.prototype.reduce(): 对数组中的每个元素执行一个由你提供的reducer函数(升序执行),将其结果汇总为单个返回。返回值是函数累计处理的结果。

   ```
   const array1 = [1,2,3,4];
   const reducer = (previousValue,currentValue) => previousValue + currentValue;
   //1+2+3+4
   console.log(array1.reduce(reducer));
   // 10
   
   //5+1+2+3+4
   console.log(array1.reduce(reducer,5));
   15
   ```

8. Array.prototype.toString(): 返回一个字符串，表示指定的数组及其元素。

   ```
   const array1 = [1,2,'q','1a'];
   console.log(array1.toString());
   //"1,2,a,1a"
   ```

   