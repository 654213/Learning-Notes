> Vue组件传参

**方式一：父传子**

父传:

**在父组件中**:通过给子组件添加自定义属性**：**来传递参数

```
//html
<son :passvalue="aMsg" />
```

子接：

**在子组件中**：通过props属性来进行接收

```
export default {
  props:['passvalue']  //passvalue是父组件传递给子组件的参数,使用这个参数
}
```

子组件接收到参数之后的用法跟data中数据的用法一样的，使用this来获取

```
let value = this.passvalue
```

**方式二：子传父**

子传：通过一个自定义事件向父组件传递参数

```
//在子组件的methods中写
methods:{
  this.$emit('passtofather',this.sonMsg)
}
```

 父接：通过实现这个自定义事件来接收参数

```
//html
<son @passtofather="myfn" />
//在父组件中接收参数时，如果代码写在html行内，需要获取传入的数据可以通过$event

//js
export default {
  methods:{
    myfn(value) {
      //value 就是子组件传入的参数
    }
  }
}
```

**方式三：兄弟组件传参**

使用步骤：

​    1.下载插件：

```
npm i eventbus
```

​    2.创建一个公用的bus,哪里用到就导入

```
//1.创建一个bus.js文件
//导入vue
import Vue from 'vue';
//导出bus
export default new Vue();


//2.使用
//在login.vue组件中使用到bus，就在vue中导入bus文件
//导入bus.js
<script>
import bus from '文件路径/bus.js'
export default {
  methods:{
    openreply:{   //方法名随意
      //通过eventbus,向(兄弟组件)中传入数据源(值)
      bus.$emit('passitem',this.commentItem)
    }
  }
}
</script>

//在home.vue组件(兄弟)接收login.vue(兄弟)传过来的值
<script>
//导入bus.js
import bus from '文件路径/bus.js'
export default {
  created(){
  //$on接收comment兄弟组件传的参数
  bus.$on('passitem',value => {
    this.commentItem = value; //value就是comment组件传过来的commentItem
  })
  }
}
</script>
```

> 例子： 父子传参

```
父
//template
<service-data :content="content1"></service-data>   ---其中一个父
<service-data :title="title"></service-data>
//script
import serviceData from '../serverApplication/components/serviceData.vue'
export default {
  components: {
    serviceData
  },
  data(){
    return {
      content1:[
        {
          name: '领域',
          unit: '个',
          num: '11'
        
        },
        {
          name: '类别',
          unit: '个',
          num: '25'
        },
        {
          name: '服务',
          unit: '个',
          num: '95'
        },
        {
          name: '事项',
          unit: '个',
          num: '195'
        }
      ],
      //其中一个父
      title:[
        {
          name: '用户数量',
          unit: '人',
          num: '--',
        },
        {
          name: '家庭数量',
          unit: '个',
          num: '13868778',
        },
        {
          name: '家庭绑定人数',
          unit: '人',
          num: '24984592',
        }
      ],
    }
  }
//子
//template
<div v-for="(item,i) in title" :key="i">
      <div class="sx-font-14 name">{{item.name}}({{item.unit}})</div>
      <div class="title-content" >{{item.num}}</div>
</div>
<div v-for="(item,i) in content" :key="i">
      <div class="sx-font-14 name">{{item.name}}({{item.unit}})</div>
      <div class="title-content" >{{item.num}}</div>
</div>
//script
export default {
  name: 'service',
  props: ['title','content']
}
```

