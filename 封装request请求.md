#### 封装request请求

```
//request.js

import axios from 'axios'
import qs from 'qs';
import store from '@/store'
import iView from 'iview'
import config from '@/config'
import {spinLoading, removeToken ,getToken ,guid} from '@/libs/utils'
import { Loading } from 'element-ui'
import CryptoJS from 'crypto-js'; // npm i crypto-js

const { singleSignOn } = config;

// 表示跨域请求时需要使用凭证携带cookie
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 创建axios实例
const service = axios.create({
  baseURL: config.baseUrl, // api 的 base_url
  // baseURL: '/api-zportal', // api 的 base_url
  timeout: 30000, // request timeout
  withCredentials: true, // 表示跨域请求时是否需要使用凭证
});

// const tokenLogOut = () => {
//   iView.Modal.warning({
//     title: '提示',
//     content: '您的账号已过期或已在其他地方登录！',
//     onOk: function () {
//       store.dispatch('fedLogOut').then(() => {
//         spinLoading("正在跳转至登录页面");
//         removeToken();
//         window.location.href = singleSignOn;
//       })
//     }
//   });
// };

const addErrorLog = errorInfo => {
  // const { statusText, status, request: { responseURL } } = errorInfo
  // let info = {
  //  type: 'ajax',
  //  code: status,
  //  mes: statusText,
  //  url: responseURL
  // }
  // if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
};

//showFullScreenLoading() 与 tryHideFullScreenLoading() 目的是合并同一页面多个请求触发loading

let needLoadingRequestCount = 0 //声明一个变量
let loading = null //定义loading变量
//开始 加载loading
let startLoading=()=>{
    loading = Loading.service({
      lock: true,
    })
}

let showFullScreenLoading=()=> {
    if (needLoadingRequestCount === 0) { //当等于0时证明第一次请求 这时开启loading
        startLoading()
    }
    needLoadingRequestCount++ //全局变量值++
}

let tryHideFullScreenLoading=()=> {
    if (needLoadingRequestCount <= 0) return //小于等于0 证明没有开启loading 此时return
    needLoadingRequestCount-- //正常响应后 全局变量 --
    if (needLoadingRequestCount === 0) {  //等于0 时证明全部加载完毕 此时结束loading 加载
        loading.close()
    }
}

/**
 * request interceptor
 */
service.interceptors.request.use(
  config => {
    //   console.log(store.state.action.year);
    //解决重放攻击
    let date = new Date().getTime()
    if(JSON.stringify(store.getters.loginUser)!=='{}'){
        let nonce = guid()
        let uuid = `${date}${store.getters.loginUser.userAccount}${nonce}`
        //时间戳
        config.headers['timestamp'] = date
        //数字签名
        let change = CryptoJS.MD5(uuid).toString()
        config.headers['digitalSignature'] = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(change))
        //随机数
        config.headers['nonce'] = nonce
    }
    // Do something before request is sent
    config.headers['TENANT-ID'] = localStorage.getItem('tenantId');
    config.headers['authorization'] = "token "+`${localStorage.getItem('token')}`;
    // config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    //开启loading加载
    // showFullScreenLoading()
    return config
  },
  error => {
    // Do something with request error
    // console.log(error); // for debug
    Promise.reject(error)
  }
);


/**
 * response interceptor
 */
service.interceptors.response.use(
  response => {
    //关闭loading加载
    // tryHideFullScreenLoading()
    const res = response.data;
    // if (res.code !== 2000) {
    //   // 登录令牌失效
    //   if (res.code === 1) {
    //     tokenLogOut();
    //   }
    // }
    return res;
  },
  error => {
    console.log(error.response,"error");
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          console.log('错误请求');
          break;
        case 401:
          //状态码为401时未登录或登录失效，跳转到登录页面
          console.log('未授权，请重新登录');
          // window.parent.postMessage({  code: 401, message: '用户登录已超时'}, "*");
          break;
        case 403:
          console.log('拒绝访问');
          break;
        case 404:
          console.log('请求错误,未找到该资源');
          break;
        case 405:
          console.log('请求方法未允许');
          break;
        case 408:
          console.log('请求超时');
          break;
        case 500:
          console.log('服务器端出错');
          break;
        case 501:
          console.log('网络未实现');
          break;
        case 502:
          console.log('网络错误');
          break;
        case 503:
          console.log('服务不可用');
          break;
        case 504:
          console.log('网络超时');
          break;
        case 505:
          console.log('http版本不支持该请求');
          break;
        default:
          console.log(`连接错误${error.response.status}`)
      }
    } else {
      console.log('连接到服务器失败');
    }
    // error.response.data.message = error.response.data.msg;
    return error.response.data;
    // addErrorLog(error.response);
    // return Promise.reject(error);
  }
);

/**
 * 封装get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function axiosGet(url, params = {}) {
  return new Promise((resolve, reject) => {
    service.get(url, {
      params: params,
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    });
  })
}
/**
 * 封装get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function axiosPictrue(url, params = {}) {
  return new Promise((resolve, reject) => {
    service.get(url, {
      params: params,
      responseType: 'blob'
      // responseType: 'arraybuffer'
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    });
  })
}

/**
 * 导出
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function axiosExcelExport(url, params = {}) {
  // params = qs.stringify(params, { allowDots: true });//
  return new Promise((resolve, reject) => {
    service.get(url+"?"+qs.stringify(params, { allowDots: true }), {
      // params: qs.stringify(params, { allowDots: true }),//qs.stringify(params, {allowDots: true}),
      responseType: 'blob'
      // responseType: 'arraybuffer'
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    });
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} data [请求时携带的参数]
 * @param {Boolean} notUseForm [请求时是否通过Form表单提交]
 */
function axiosPost(url, data) {
  return new Promise((resolve, reject) => {
    service.post(url, data).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    })
  })
}

/**
 * 文件上传方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function axiosUpload(url, params) {
  return new Promise((resolve, reject) => {
    let headers = {
      "Content-Type": "multipart/form-data",
      'Authorization' : `Bearer ${localStorage.getItem('token')}`,
      'TENANT-ID' : `${localStorage.getItem('tenantId')}`
    };
    console.log(service.post)
    service.post(url, params, headers).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    })
  })
}

export {
  axiosGet,
  axiosPost,
  axiosUpload,
  axiosPictrue,
  axiosExcelExport
}

```

