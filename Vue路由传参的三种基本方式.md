> Vue路由传参的三种基本方式

如下场景：点击当前页的某个按钮跳转到另一个页面去，并将某个值带过去

```
<div class="examine" @click="insurance(2)"></div>
```

**方式一**：页面刷新数据不会丢失

```
methods:{
  insurance(id) {
    //直接调用$router.push实现携带参数的跳转
    this.$router.push({
      path:`/particulars/${id}`,
    })
  }
}
```

需要配置对应路由如下:

```
{
  path:'/particulars/:id',
  name:'pariculars',
  component:particulars,
}
```

可以看出需要在path中添加/:id来对应$router.push中携带的参数。在子组件中可以使用来获取传递的参数值。

另外页面获取参数如下：

```
this.$route.params.id   //注意这里是route
```

**方式二**:页面刷新数据会丢失

通过路由属性中的name来确定匹配的路由，通过params来传递参数。

```
methods:{
  insurance(id) {
    this.$router.push({
      name:'particulars',
      params:{
        id:id
      }
    })
  }
}
```

对应路由配置：注意这里不能使用/:id来传递参数了，因为组件中，已经使用params来携带参数了。

```
{
  path:'/particulars',
  name:'particulars',
  component:particulars,
}
```

子组件中，这样来获取参数

```
this.$route.parmas.id
```

方式三：使用path来匹配路由，然后通过query来传递参数

这种情况下query传递的参数会显示在url后面?id=?

```
methods:{
  insurance(id) {
    this.$router.push({
      path:'/particulars',
      query:{
        id:id
      }
    })
  }
}
```

对应路由配置：

```
{ 
  path:'/particulars',
  name:'particulars',
  component:particulars,
}
```

对应子组件：这样来获取参数

```
this.$route.query.id
```

