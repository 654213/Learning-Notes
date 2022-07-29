#### [自适应] 	px转rem，你还在手算么?

> rem是相对单位，值基于根元素设置的font-size值(默认16px),em是相对单位，值继承父元素font-size值，px是相对单位，值根据屏幕像素点来确定。

px怎么转rem?

16px = 1rem,所以将 **转换值/16** 就可以转换，难道每次都计算转换？

**PostCss**

> 是一个用Javascript工具和插件转换css代码的工具。它是一个处理器(平台)，拥有多样化的功能插件，可根据自己的需要配置需要的功能，甚至你自己都可编写PostCss插件。

px自动转换rem需要什么插件?

`postcss-pxtorem`

或者是在vscode安装插件px2rem

*安装*

```
npm i postcss-pxtorem --save
```

*配置PostCss*

项目下新建postcss.config.js文件

```
module.exports = {
  plugins:{
    'postcss-pxtorem':{
      //根元素字体大小
      rootValue: 16,
      //匹配css中的属性，*代表启用所以属性
      propList:['*'],
      //转换成rem后保留的小数点位数
      unitPrecision: 5,
      //小于12px的样式不被替换成rem
      minPixelValue: 12,
      //忽略一些文件，不进行转换，比如我想忽略依赖的UI框架
      exclude:['node_modules']
    }
  }
}
```

添加完毕，尝试重启下项目，使文件生效。

重启后，打开Chrome控制台，可以发现所有的px都被自动转换为rem.

根据配置可知，我们是以font-size为基准实现页面尺寸布局的，但如果一直写死16，如何实现自适应布局?

新建`rem.js`

核心思想: 以设计稿定义的宽1920，根元素字体大小为基准，动态计算不同屏幕下的不同根元素的字体大小。

```
const baseSize = 16
function setRem() {
  const scale = document.documentElement.clientWidth / 192
  document.documentElement.style.fontSize = baseSize*scale + 'px'
}
setRem()
window.onresize = function() {
  setRem()
}
```

在`main.js`引入

```
import './rem.js'
```

[^总结]: 结合媒体查询 + postcss-pxtorem 相信能解决大部分自适应的问题

