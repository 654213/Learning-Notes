import Cookies from "js-cookie";
// cookie保存的天数
import config from "@/config";
import {forEach, hasOneOf, objEqual} from "@/libs/tools";
import {Spin} from "iview";
import dayjs from 'dayjs'


const {title, cookieExpires, TOKEN_KEY, tagNaveListCacheKey} = config;

/**
 * 获取链接中的请求参数
 * @param name 参数名称
 * @returns {null}
 */
export const getRequstParame = name => {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let value = window.location.search.substr(1).match(reg);
  if (value != null) return decodeURI(value[2]);
  return null;
};

/**
 * 设置Token凭证信息
 * @param token 凭证
 * @param token_key 存储关键字
 */
export const setToken = (token, token_key) => {
  const tokenKey = token_key ? token_key : TOKEN_KEY;
  Cookies.set(tokenKey, token, {
    expires: cookieExpires || 1
  });
};

/**
 * 移除Token凭证信息
 * @param token_key 存储关键字
 */
export const removeToken = token_key => {
  const tokenKey = token_key ? token_key : TOKEN_KEY;
  Cookies.remove(tokenKey);
};

/**
 * 获取Token凭证信息
 * @param token_key 存储关键字
 * @returns {boolean|*}
 */
export const getToken = token_key => {
  const tokenKey = token_key ? token_key : TOKEN_KEY;
  const token = Cookies.get(tokenKey);
  if (token) return token;
  else return false;
};

export const hasChild = item => {
  return item.children && item.children.length !== 0;
};

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    return !!hasOneOf(item.meta.access, access);
  } else return true;
};

/**
 * 通过登录用户菜单和路由列表得到展示菜单列表
 * @param list 登录用户菜单
 * @param access 路由列表
 * @returns {Array}
 */
export const getLoginMenuByRouter = (list, access) => {
  let res = [];
  if (list) {
    forEach(list, menu => {
      let item = findRouterByCode(menu.code, access)[0];
      // console.log(item);
      if (
        item &&
        item.meta &&
        (!item.meta.hideInMenu || item.meta.hideInMenu === false)
      ) {
        let obj = {
          icon: (item.meta && item.meta.icon) || null,
          name: item.name,
          meta: item.meta
        };
        if (hasChild(item) || (item.meta && item.meta.showAlways)) {
          obj.children = getLoginMenuByRouter(menu.children, access);
        }
        if (item.meta && item.meta.href) obj.href = item.meta.href;
        res.push(obj);
      }
    });
  }
  return res;
};

/**
 * 根据路由权限码获取对应路由信息
 * @param routerCode 路由权限码
 * @param routers 路由数组
 */
export const findRouter = (routerCode, routers) => {
  let i = -1;
  let len = routers.length;
  let resultRoute = null;
  while (++i < len) {
    let item = routers[i];
    if (item.meta && item.meta.code === routerCode) {
      resultRoute = item;
    } else {
      if (item.children && item.children.length) {
        let res = findRouter(routerCode, item.children);
        if (item.meta && item.meta.code) return res;
      }
    }
  }
  return resultRoute;
};

/**
 * 根据权限码获取对应路由
 * @param routerCode 权限码
 * @param routers 所有路由信息
 * @returns {*} 权限码对应路由数组
 */
export const findRouterByCode = (routerCode, routers) => {
  let codeRouters = filterCodeMenus(routers);
  return codeRouters.filter(item => item.meta.code === routerCode);
};

/**
 * 过滤获取有权限码的路由
 * @param data 路由数组
 * @returns {*} 有权限码的路由数组
 */
export const filterCodeMenus = data => {
  return data.reduce((iter, val) => {
    if (val.meta && val.meta.code) iter.push(val);
    // if (val.meta) iter.push(val);
    return val.children ? [...iter, ...filterCodeMenus(val.children)] : iter;
  }, []);
};

/**
 *
 * @param route routeMetched 当前路由metched
 * @param homeRoute
 * @returns {*[]|{icon: *}[]}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  let homeItem = {
    ...homeRoute,
    // icon: homeRoute.meta.icon
  };
  let routeMetched = route.matched;
  if (routeMetched.some(item => item.name === homeRoute.name))
    return [homeItem];
  let res = routeMetched
    .filter(item => {
      return item.meta === undefined || !item.meta.hideInBread;
    })
    .map(item => {
      let meta = {
        ...item.meta
      };
      if (meta.title && typeof meta.title === "function") {
        meta.__titleIsFunction__ = true;
        meta.title = meta.title(route);
      }
      let obj = {
        icon: (item.meta && item.meta.icon) || "",
        name: item.name,
        meta: meta
      };
      return obj;
    });
  res = res.filter(item => {
    return !item.meta.hideInMenu;
  });
  return [
    {
      ...homeItem,
      to: homeRoute.path
    },
    ...res
  ];
};

/**
 * @description 循环路由
 */
const backendMenuToRoute = menus => {
  let routers = [];
  forEach(menus, menu => {
    let route = getChildrenMenu(menu);
    if (menu.children && menu.children.length !== 0) {
      route.children = getChildrenMenu(menu.children);
    }
    routers.push(route);
  });
  return routers;
};

/**
 * @description 添加名称
 */
export const getChildrenMenu = menu => {
  if ($.isPlainObject(menu)) {
    menu["meta"] = {
      title: menu.name
    };
  } else {
    forEach(menu, (item, index) => {
      menu[index]["meta"] = {
        title: item.name
      };
    });
  }
  return menu;
};

export const getRouteTitleHandled = route => {
  let router = {
    ...route
  };
  let meta = {
    ...route.meta
  };
  let title = "";
  if (meta.title) {
    if (typeof meta.title === "function") {
      meta.__titleIsFunction__ = true;
      title = meta.title(router);
    } else title = meta.title;
  }
  meta.title = title;
  router.meta = meta;
  return router;
};

export const showTitle = (item, vm) => {
  let {title} = item.meta;
  if (!title) return;
  return (item.meta && item.meta.title) || item.name;
};

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage[tagNaveListCacheKey] = JSON.stringify(list);
};
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage[tagNaveListCacheKey];
  return list ? JSON.parse(list) : [];
};

export const removeTagNavListInLocalstorage = () => {
  localStorage.removeItem(tagNaveListCacheKey);
};

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = "home") => {
  let i = -1;
  let len = routers.length;
  let homeRoute = {};
  while (++i < len) {
    let item = routers[i];
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName);
      if (res.name) return res;
    } else {
      if (item.name === homeName) homeRoute = item;
    }
  }
  return homeRoute;
};

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const {name, path, meta} = newRoute;
  let newList = [...list];
  if (newList.findIndex(item => item.name === name) >= 0) return newList;
  else {
    newList.push({
      name,
      path,
      meta
    });
  }
  return newList;
};

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access)
    return hasOneOf(access, route.meta.access);
  else return true;
};

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = list => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children);
      } else if (item.name === name) {
        return hasAccess(access, item);
      }
    });
  };

  return routePermissionJudge(routes);
};

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split("?")[1].split("&");
  let paramObj = {};
  keyValueArr.forEach(item => {
    const keyValue = item.split("=");
    paramObj[keyValue[0]] = keyValue[1];
  });
  console.log(paramObj);
  return paramObj;
};

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {};
  if (list.length === 2) {
    res = getHomeRoute(list);
  } else {
    const index = list.findIndex(item => routeEqual(item, route));
    if (index === list.length - 1) res = list[list.length - 2];
    else res = list[index + 1];
  }
  return res;
};

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1;
  while (++i < times) {
    callback(i);
  }
};

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = file => {
  let nameSplit = file.name.split(".");
  let format = nameSplit[nameSplit.length - 1];
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsText(file); // 以文本格式读取
    let arr = [];
    reader.onload = function (evt) {
      let data = evt.target.result; // 读到的数据
      let pasteData = data.trim();
      arr = pasteData
        .split(/[\n\u0085\u2028\u2029]|\r\n?/g)
        .map(row => {
          return row.split("\t");
        })
        .map(item => {
          return item[0].split(",");
        });
      if (format === "csv") resolve(arr);
      else reject(new Error("[Format Error]:你上传的不是Csv文件"));
    };
  });
};

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = array => {
  let columns = [];
  let tableData = [];
  if (array.length > 1) {
    let titles = array.shift();
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      };
    });
    tableData = array.map(item => {
      let res = {};
      item.forEach((col, i) => {
        res[titles[i]] = col;
      });
      return res;
    });
  }
  return {
    columns,
    tableData
  };
};

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode;
    } else {
      return findNodeUpper(ele.parentNode, tag);
    }
  }
};

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode;
  if (parentNode) {
    let classList = parentNode.classList;
    if (
      classList &&
      classes.every(className => classList.contains(className))
    ) {
      return parentNode;
    } else {
      return findNodeUpperByClasses(parentNode, classes);
    }
  }
};

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase();
  if (ele.childNodes.length) {
    let i = -1;
    let len = ele.childNodes.length;
    while (++i < len) {
      let child = ele.childNodes[i];
      if (child.tagName === tagName) return child;
      else return findNodeDownward(child, tag);
    }
  }
};

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access);
};

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {};
  const params2 = route2.params || {};
  const query1 = route1.query || {};
  const query2 = route2.query || {};
  //调整为判断名称唯一
  // return (route1.name === route2.name && objEqual(params1, params2) && objEqual(query1, query2));
  return (route1.name === route2.name);
};

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let len = tagNavList.length;
  let res = false;
  doCustomTimes(len, index => {
    if (routeEqual(tagNavList[index], routeItem)) res = true;
  });
  return res;
};

export const localSave = (key, value) => {
  localStorage.setItem(key, value);
};

export const localRead = key => {
  return localStorage.getItem(key) || "";
};

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil((difference / duration) * 50);

  const scroll = (start, end, step) => {
    if (start === end) {
      endCallback && endCallback();
      return;
    }

    let d = start + step > end ? end : start + step;
    if (start > end) {
      d = start - step < end ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  };
  scroll(from, to, step);
};

/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
export const setTitle = (routeItem, vm) => {
  const handledRoute = getRouteTitleHandled(routeItem);
  const pageTitle = showTitle(handledRoute, vm);
  const resTitle = pageTitle ? `${title} - ${pageTitle}` : title;
  window.document.title = resTitle;
};

/**
 * loading加载方法
 * @param msg 提示信息
 * @param time 加载展示时间(毫秒),到点后自动隐藏
 */
export const spinLoading = (msg, time) => {
  Spin.show({
    render: h => {
      return h("div", [
        h("Icon", {
          class: "sx-spin-icon-load",
          props: {
            type: "ios-loading",
            size: 18
          }
        }),
        h("div", msg === undefined ? "加载中..." : msg + "...")
      ]);
    }
  });
  setTimeout(
    () => {
      Spin.hide();
    },
    time === undefined ? 1000 : time
  );
};

/**
 * loading加载方法,不自动隐藏
 * @param msg
 */
export const spinLoadingNoHide = msg => {
  Spin.show({
    render: h => {
      return h("div", [
        h("Icon", {
          class: "sx-spin-icon-load",
          props: {
            type: "ios-loading",
            size: 18
          }
        }),
        h("div", msg === undefined ? "加载中..." : msg + "...")
      ]);
    }
  });
};

/**
 * 设置金钱单位到元的数据,保留2位小数
 * @param number
 * @returns {*}
 */
export const returnYuan = number => {
  if (!number) {
    return "0.00";
  }
  // 现在是精确到分,所以元需要除掉100
  let value = Math.ceil(parseFloat(number)) / 100;
  let xsd = value.toString().split(".");
  if (xsd.length === 1) {
    value = value.toString() + ".00";
    return value;
  }
  if (xsd.length > 1) {
    if (xsd[1].length < 2) {
      value = value.toString() + "0";
    }
    return value;
  }
};

/**
 * 设置金钱单位到万元的数据,保留2位小数
 * @param number
 * @returns {*}
 */
export const returnWanYuan = number => {
  if (!number) {
    return 0;
  }
  // 现在是精确到分,所以万元需要除掉1000000
  let value = (Math.ceil(parseFloat(number)) / 1000000).toFixed(0);
  return Number(value);
};

/**
 * 根据数值返回保留2位小数点的百分比
 * @param number
 * @returns {string}
 */
export const returnRatio = number => {
  let value = Math.round(parseFloat(number * 100)) / 100;
  if (value > 100) {
    return "100.00%";
  }
  let xsd = value.toString().split(".");
  if (xsd.length === 1) {
    value = value.toString() + ".00";
    return value + "%";
  }
  if (xsd.length > 1) {
    if (xsd[1].length < 2) {
      value = value.toString() + "0";
    }
    return value + "%";
  }
};

/**
 * 截取指定长度的字符串
 * @param string 需要截取的字符串
 * @param num 指定长度
 * @returns {*}
 */
export const stringLengthSub = (string, num) => {
  if (!string) {
    return "";
  }
  if (!num) {
    num = 14;
  }
  if (string.length <= num) {
    return string;
  } else {
    return string.substring(0, num) + "...";
  }
};

/**
 * 获取当前时间前5年后两年
 * @param num 年份数量
 * @returns {Array}
 */
/*export const getYearsSelectList = num => {
  let nowYear = parseInt(new Date().getFullYear());
  if (!num) {
    num = 3;
  }
  let selectYears = [];
  // for (let i = 0; i <= num; i++) {
  //   selectYears.push(nowYear - i);
  // }
  for (let i = 0; i <= num; i++) {
    selectYears.push(nowYear + i);
  }
  return selectYears;
};*/
/**
 * 获取当前时间前proNum年后num年
 * @param proNum
 * @param num
 * @returns {Array}
 */
export const getYearsSelectList = (proNum,num) => {
    let nowYear = parseInt(new Date().getFullYear());
    let selectYears = [];
    if(!proNum){
      proNum=2
    }
    if(!num){
      num=5
    }
    for (let i = 0; i < proNum; i++) {
      selectYears.unshift(nowYear - i-1);
    }
    for (let i = 0; i <= num; i++) {
      selectYears.push(nowYear + i);
    }
    return selectYears;
  };
/**
 * 获取计算列表行在总数据中的顺序
 * @param index 行顺序
 * @param current 当前页数
 * @param pageSize 每页数据条数
 * @returns {Array}
 */
export const getTableRowIndex = (index, current, pageSize) => {
  // debugger
  let rowIndex = index + 1;
  if (current > 1) {
    rowIndex = rowIndex + (current - 1) * pageSize;
  }
  return rowIndex;
};

/**
 * 获取供选择的自定义selectList
 * * @param list 自定义的数组
 */
export const formatSelectOption = list => {
  let definedSelectList = [];
  list.map((item, index) => {
    if (!item.type || item.type == undefined) {
      definedSelectList.push({
        type: item,
        name: item
      });
    } else {
      definedSelectList = list;
    }
  });
  return definedSelectList;
};

/**
 * 将普通的数字转换为带千位分隔符格式的数字字符串(数字的整数部分每三位一组，以“，”分节。小数部分不分节)
 * @param {*} num  数字
 */
export const numFormat = num => {
  return num.toString().replace(/\d+/, function (n) {
    // 先提取整数部分
    return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
      return $1 + ",";
    });
  });
};

/**
 *  阿拉伯数字转换中文大写字函数
 * @param n 阿拉伯数字
 * @returns {string}
 */
export const numberToChinese = n => {
  switch (n) {
    case "0":
      return "零";
    case "1":
      return "壹";
    case "2":
      return "贰";
    case "3":
      return "叁";
    case "4":
      return "肆";
    case "5":
      return "伍";
    case "6":
      return "陆";
    case "7":
      return "柒";
    case "8":
      return "捌";
    case "9":
      return "玖";
  }
};

const RMBUint = ["仟", "佰", "拾", "", "仟", "佰", "拾", "", "角", "分"];
/**
 * 阿拉伯数字人民币转换成中文字符
 * @param m 阿拉伯数字人民币 最少到分
 * @returns {string}
 */
export const numberRMBChangeToChinese = m => {
  m *= 100;
  m += "";
  let length = m.length;
  let result = "";
  for (let i = 0; i < length; i++) {
    if (i === 2) {
      result = "元" + result;
    } else if (i === 6) {
      result = "万" + result;
    }
    if (m.charAt(length - i - 1) === 0) {
      if (i !== 0 && i !== 1) {
        if (
          result.charAt(0) !== "零" &&
          result.charAt(0) !== "元" &&
          result.charAt(0) !== "万"
        ) {
          result = "零" + result;
        }
      }
      continue;
    }
    result =
      numberToChinese(m.charAt(length - i - 1)) +
      RMBUint[RMBUint.length - i - 1] +
      result;
  }
  result += result.charAt(result.length - 1) === "元" ? "整" : "";
  return result;
};

/**
 * 拷贝对象属性
 * @param newObj 新对象
 * @param obj
 */
export const copyObject = (newObj, obj) => {
  let result = {};
  for (let i in obj) {
    if (newObj.hasOwnProperty(i)) {
      result[i] = obj[i];
    }
  }
  return result;
};

/**
 * 从数组内移除对象
 * @param obj 对象值
 * @param array 目标数组
 * @returns {*}
 */
export const removeObjectFromArray = (obj, array) => {
  let index = array.indexOf(obj);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
};

/**
 * 获取当前时间 格式YYYY-MM-DD
 * @param obj
 */
export const getNowFormatDate = () => {
  let date = new Date();
  let seperator1 = "-";
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  return year + seperator1 + month + seperator1 + strDate;
};

/**
 * 获取当前时间 格式YYYY-MM-DD HH-MM--SS
 * @param obj
 */
export const getNowTimeFormatDate = () => {
  var date = new Date();
  var seperator1 = "-";

  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var hour = date.getHours();
  var minutes = date.getMinutes() ;
  var seconds = date.getSeconds();
  var strDate = date.getDate();

  if (month >= 1 && month <= 9) {
      month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
  }
  if (hour >= 1 && hour <= 9) {
      hour = "0" + hour;
  }
  if (minutes >= 1 && minutes <= 9) {
      minutes = "0" + minutes;
  }
  if (seconds >= 1 && seconds <= 9) {
     seconds = "0" + seconds;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate+" "+hour+":" +minutes+":" +seconds;

  return currentdate;
};
/**
 * 获取当前时间 格式YYYY年MM月DD日 星期几
 * @param obj
 */
export const show = () => {
  var x= new Date();
  var y=x.getFullYear();// 年
  var m=x.getMonth();//月
  var d=x.getDay();//星期
  var ds=x.getDate();//日
  var h=x.getHours();//小时
  var m1=x.getMinutes();//分
  var s=x.getSeconds();//秒
  var day;
  if (x.getDay()==0) day="星期日";
  if (x.getDay()==1) day="星期一";
  if (x.getDay()==2) day="星期二";
  if (x.getDay()==3) day="星期三";
  if (x.getDay()==4) day="星期四";
  if (x.getDay()==5) day="星期五";
  if (x.getDay()==6) day="星期六";
  var timer=""+((h>12) ? h-12 : h);
  timer +=((m1<10) ? ":0 " : ":")+m1;
  timer +=((s<10) ? ":0 " : ":" )+s;
  timer += ""+((h >=12) ? "pm" : "am");
  return `${y}年${m+1}月${ds}日 ${day}`
};

/**
 * 键盘抬起事件，只允许输入正整数
 * @param value input框输入值
 * @returns {*} 处理完输入值之后的数据
 */
export const checkPositiveInteger = value => {
  var numberReg = /^\+?[1-9][0-9]*$/;
  if (numberReg.test(value)) {
    if (parseInt(value) >= 100000000000000000) {
      value = "9999999999999999";
    }
  } else {
    value = "";
  }
  return value;
};

/**
 * 键盘抬起事件，最多只能输入两位小数
 * @param value input框输入值
 * @returns {*} 处理完输入值之后的数据
 */
export const clearNoNum = value => {
    var t = value.charAt(0);

    if (t == '-') {
       /* value = value.replace(".", "$#$")//把第一个字符'.'替换成'$#$'
            .replace(/\./g, "")//把其余的字符'.'替换为空
            .replace("$#$", ".")//把字符'$#$'替换回原来的'.'
            .replace(/[^\d.]/g, "")//只能输入数字和'.'
            .replace(/^\./g, "")//不能以'.'开头
            .replace( /([0-9]+\.[0-9]{2})[0-9]*!/,"$1")//只保留2位小数
        return '-' + value;*/
       return ""
    }
    value = value.replace(/[^\d.]/g, ""); // 清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
    // value = value.replace(/^\./g, ""); // 清除第一个.
    value = value
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
    if (value.indexOf(".") < 0 && value != "") {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于01、02的金额
        value = parseFloat(value);
    }
    var val = parseFloat(value);
    if (val >= 100000000000000000) {
        value = "99999999999999.99";
    }
    return value;
};
export function base64toFile(dataurl, filename = 'file') {
    const arr = dataurl.split(',')
    const mime = arr[ 0 ].match(/:(.*?);/)[ 1 ]
    const suffix = mime.split('/')[ 1 ]
    const bstr = atob(arr[ 1 ])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[ n ] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename || `${filename}.${suffix}`}`, {
      type: mime
    })
  }
  
  export function base64toBlob(urlData, type) {
    const arr = urlData.split(',')
    const mime = arr[ 0 ].match(/:(.*?);/)[ 1 ] || type
    // 去掉url的头，并转化为byte
    const bytes = window.atob(arr[ 1 ])
    // 处理异常,将ascii码小于0的转换为大于0
    const ab = new ArrayBuffer(bytes.length)
    // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
    const ia = new Uint8Array(ab)
    for (let i = 0; i < bytes.length; i++) {
      ia[ i ] = bytes.charCodeAt(i)
    }
    return new Blob([ab], {
      type: mime
    })
  }
  export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
export function addWatermark (that,obj){
    var cover = document.createElement('div');
    cover.className = "cover";
    cover.style.top = '100px';
    cover.style.overflow = 'hidden';
    // cover.style.width = '1000px';
    // cover.style.height = 'auto';
    cover.style.position = 'absolute';
    cover.style.zIndex = 9999999;
    const defaultSettings = {
      watermark_txt: `${obj.dept[0].departName} ${dayjs(new Date()).format("YYYY-MM-DD")}`,
      watermark_x: 20,//水印起始位置x轴坐标
      watermark_y: 20,//水印起始位置Y轴坐标
      watermark_rows: 25,//水印行数
      watermark_cols: 3,//水印列数
      watermark_x_space: 120,//水印x轴间隔
      watermark_y_space: 50,//水印y轴间隔
      watermark_color: 'gray',//水印字体颜色
      watermark_alpha: 0.2,//水印透明度
      watermark_fontsize: '15px',//水印字体大小
      watermark_font: '微软雅黑',//水印字体
      watermark_width: 120,//水印宽度
      watermark_height: 80,//水印长度
      watermark_angle: 15//水印倾斜度数
    };
    var oTemp = document.createDocumentFragment();
    //获取页面最大宽度
    var page_width = Math.max(document.body.scrollWidth, document.body.scrollWidth);
    //获取页面最大长度
    // var page_height = Math.max(document.body.scrollHeight, document.body.scrollHeight);
    var page_height = Math.max(document.body.scrollHeight, document.body.clientHeight) + 300
    // 如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
    if (defaultSettings.watermark_cols == 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) > page_width)) {
      defaultSettings.watermark_cols = parseInt((page_width - defaultSettings.watermark_x + defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space));
      defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1));
    }
    //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
    if (defaultSettings.watermark_rows == 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {
      defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
      defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1));
    }
    var x;
    var y;
    for (var i = 0; i < defaultSettings.watermark_rows; i++) {
      y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i+20;
      for (var j = 0; j < defaultSettings.watermark_cols; j++) {
        x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;
  
        var mask_div = document.createElement('div');
        mask_div.id = 'mask_div' + i + j;
        mask_div.className = 'mask_div';
        mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
        const rotateDeg = "rotate(" + defaultSettings.watermark_angle + "deg)";
        //设置水印div倾斜显示
        mask_div.style.webkitTransform = rotateDeg;
        mask_div.style.MozTransform = rotateDeg;
        mask_div.style.msTransform = rotateDeg;
        mask_div.style.OTransform = rotateDeg;
        mask_div.style.transform = rotateDeg;
        mask_div.style.visibility = "";
        mask_div.style.position = "absolute";
        
        //奇偶行错开，这样水印就不对齐，显的不呆板
        if (i % 2 != 0) {
          mask_div.style.left = x + 100 + 'px';
        } else {
          mask_div.style.left = x + 'px';
        }
        mask_div.style.top = y + 'px';
        mask_div.style.overflow = "hidden";
        mask_div.style.zIndex = 99888899999;
        mask_div.style.opacity = defaultSettings.watermark_alpha;
        mask_div.style.fontSize = defaultSettings.watermark_fontsize;
        mask_div.style.fontFamily = defaultSettings.watermark_font;
        mask_div.style.color = defaultSettings.watermark_color;
        mask_div.style.textAlign = "center";
        mask_div.style.width = '300px';
        mask_div.style.height = '50px';
        mask_div.style.display = "block";
        oTemp.appendChild(mask_div);
      }
    }
    //先清空 再添加
    that.$refs.covers.innerHTML = '';
    that.$refs.covers.appendChild(oTemp)
  
  }
  export function drawLogo(text, font = '20px normal') {
    // 创建画布
    const canvas = document.createElement('canvas')
    // 绘制文字环境
    const context = canvas.getContext('2d')
    // 设置字体
    context.font = font
    // 获取字体宽度
    let width = context.measureText(text).width
    // 如果宽度不够 240
    if (width < 240) {
      width = 240
    } else {
      width = width + 30
    }
    // 画布宽度
    canvas.width = '1200'
    // 画布高度
    canvas.height = '2000'
    // 填充白色
    context.fillStyle = '#ffffff'
    // 绘制文字之前填充白色
    context.fillRect(0, 0, 1200, 2000)
    // 设置字体
    context.font = font
    // 设置水平对齐方式
    context.textAlign = 'center'
    // 设置垂直对齐方式
    context.textBaseline = 'middle'
    // 设置字体颜色
    context.fillStyle = '#000000'
    context.rotate(30 * Math.PI / 180)
    // 绘制文字（参数：要写的字，x坐标，y坐标
    for (let indexF = 0; indexF < 10; indexF++) {
      for (let indexS = 0; indexS < 30; indexS++) {
        context.fillText(text, indexF * (width + 200) + (indexS % 2) * 200, -1001 + 200 * (indexS - 1))
      }
    }
    // 生成图片信息
    const dataUrl = canvas.toDataURL('image/png')
    return dataUrl
  }
  export function watermark(that,obj) {
    // 默认设置
    var defaultSettings = {
      watermark_txt: `${obj.dept[0].departName} ${dayjs(new Date()).format("YYYY-MM-DD")}`,
      watermark_x: 20, // 水印起始位置x轴坐标
      watermark_y: 20, // 水印起始位置Y轴坐标
      watermark_rows: 20, // 水印行数
      watermark_cols: 20, // 水印列数
      watermark_x_space: 100, // 水印x轴间隔
      watermark_y_space: 50, // 水印y轴间隔
      watermark_color: '#aaa', // 水印字体颜色
      watermark_alpha: 0.4, // 水印透明度
      watermark_fontsize: '15px', // 水印字体大小
      watermark_font: '微软雅黑', // 水印字体
      watermark_width: 210, // 水印宽度
      watermark_height: 80, // 水印长度
      watermark_angle: 15// 水印倾斜度数
    }
    // 采用配置项替换默认值，作用类似jquery.extend
    if (arguments.length === 1 && typeof arguments[ 0 ] === 'object') {
      var src = arguments[ 0 ] || {}
      for (var key in src) {
        if (src[ key ] && defaultSettings[ key ] && src[ key ] === defaultSettings[ key ]) { continue } else if (src[ key ]) { defaultSettings[ key ] = src[ key ] }
      }
    }
  
    var oTemp = document.createDocumentFragment()
  
    // 获取页面最大宽度
    var page_width = Math.max(document.body.scrollWidth, document.body.clientWidth)
    var cutWidth = page_width * 0.0150
    page_width = page_width - cutWidth
    // 获取页面最大高度
    var page_height = Math.max(document.body.scrollHeight, document.body.clientHeight) + 450
    // var page_height = document.body.scrollHeight+document.body.scrollTop;
    // 如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
    if (defaultSettings.watermark_cols === 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) > page_width)) {
      defaultSettings.watermark_cols = parseInt((page_width - defaultSettings.watermark_x + defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space))
      defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1))
    }
    // 如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
    if (defaultSettings.watermark_rows === 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {
      defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space))
      defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1))
    }
    var x
    var y
    for (var i = 0; i < defaultSettings.watermark_rows; i++) {
      y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i
      for (var j = 0; j < defaultSettings.watermark_cols; j++) {
        x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j
  
        var mask_div = document.createElement('div')
  
        mask_div.id = 'mask_div' + i + j
        mask_div.className = 'mask_div'
        mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt))
        // 设置水印div倾斜显示
        mask_div.style.webkitTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)'
        mask_div.style.MozTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)'
        mask_div.style.msTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)'
        mask_div.style.OTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)'
        mask_div.style.transform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)'
        mask_div.style.visibility = ''
        mask_div.style.position = 'absolute'
        mask_div.style.left = x + 'px'
        mask_div.style.top = y + 'px'
        mask_div.style.overflow = 'hidden'
        mask_div.style.zIndex = '9999'
        mask_div.style.pointerEvents = 'none'// pointer-events:none  让水印不遮挡页面的点击事件
        // mask_div.style.border="solid #eee 1px";
        mask_div.style.opacity = defaultSettings.watermark_alpha
        mask_div.style.fontSize = defaultSettings.watermark_fontsize
        mask_div.style.fontFamily = defaultSettings.watermark_font
        mask_div.style.color = defaultSettings.watermark_color
        mask_div.style.textAlign = 'center'
        // mask_div.style.width = defaultSettings.watermark_width + 'px'
        // mask_div.style.height = defaultSettings.watermark_height + 'px'
        mask_div.style.display = 'block'
        mask_div.style.background = 'transparent'
        oTemp.appendChild(mask_div)
      }
    }
    //先清空 再添加
    that.$refs.covers.innerHTML = '';
    that.$refs.covers.appendChild(oTemp)
  }

  //解决toFixed不四舍五入的问题
  // num 需要四舍五入的数据
  // s 四舍五入的位数
  export function myFixed (num,s) {
    var times = Math.pow(10,s)
    var des = num * times + 0.5;
    des = parseInt(des,10) / times;
    return des + '';
  }
  
  /**
 * floatObj 包含加减乘除四个方法，能确保浮点数运算不丢失精度
 *
 * 我们知道计算机编程语言里浮点数计算会存在精度丢失问题（或称舍入误差），其根本原因是二进制和实现位数限制有些数无法有限表示
 * 以下是十进制小数对应的二进制表示
 *      0.1 >> 0.0001 1001 1001 1001…（1001无限循环）
 *      0.2 >> 0.0011 0011 0011 0011…（0011无限循环）
 * 计算机里每种数据类型的存储是一个有限宽度，比如 JavaScript 使用 64 位存储数字类型，因此超出的会舍去。舍去的部分就是精度丢失的部分。
 *
 * ** method **
 *  add / subtract / multiply /divide
 *
 * ** explame **
 *  0.1 + 0.2 == 0.30000000000000004 （多了 0.00000000000004）
 *  0.2 + 0.4 == 0.6000000000000001  （多了 0.0000000000001）
 *  19.9 * 100 == 1989.9999999999998 （少了 0.0000000000002）
 *
 * floatObj.add(0.1, 0.2) >> 0.3
 * floatObj.multiply(19.9, 100) >> 1990
 *
 */
var floatObj = function() {
    
    /*
     * 判断obj是否为一个整数
     */
    function isInteger(obj) {
        return Math.floor(obj) === obj
    }
    
    /*
     * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
     * @param floatNum {number} 小数
     * @return {object}
     *   {times:100, num: 314}
     */
    function toInteger(floatNum) {
        var ret = {times: 1, num: 0}
        var isNegative = floatNum < 0
        if (isInteger(floatNum)) {
            ret.num = floatNum
            return ret
        }
        var strfi  = floatNum + ''
        var dotPos = strfi.indexOf('.')
        var len    = strfi.substr(dotPos+1).length
        var times  = Math.pow(10, len)
        var intNum = parseInt(Math.abs(floatNum) * times + 0.5, 10)
        ret.times  = times
        if (isNegative) {
            intNum = -intNum
        }
        ret.num = intNum
        return ret
    }
    
    /*
     * 核心方法，实现加减乘除运算，确保不丢失精度
     * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
     *
     * @param a {number} 运算数1
     * @param b {number} 运算数2
     * @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
     * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
     *
     */
    function operation(a, b, digits, op) {
        var o1 = toInteger(a)
        var o2 = toInteger(b)
        var n1 = o1.num
        var n2 = o2.num
        var t1 = o1.times
        var t2 = o2.times
        var max = t1 > t2 ? t1 : t2
        var result = null
        switch (op) {
            case 'add':
                if (t1 === t2) { // 两个小数位数相同
                    result = n1 + n2
                } else if (t1 > t2) { // o1 小数位 大于 o2
                    result = n1 + n2 * (t1 / t2)
                } else { // o1 小数位 小于 o2
                    result = n1 * (t2 / t1) + n2
                }
                return result / max
            case 'subtract':
                if (t1 === t2) {
                    result = n1 - n2
                } else if (t1 > t2) {
                    result = n1 - n2 * (t1 / t2)
                } else {
                    result = n1 * (t2 / t1) - n2
                }
                return result / max
            case 'multiply':
                result = (n1 * n2) / (t1 * t2)
                return result
            case 'divide':
                result = (n1 / n2) * (t2 / t1)
                return result
        }
    }
    
    // 加减乘除的四个接口
    function add(a, b, digits) {
        return operation(a, b, digits, 'add')
    }
    function subtract(a, b, digits) {
        return operation(a, b, digits, 'subtract')
    }
    function multiply(a, b, digits) {
        return operation(a, b, digits, 'multiply')
    }
    function divide(a, b, digits) {
        return operation(a, b, digits, 'divide')
    }
    
    // exports
    return {
        add: add,
        subtract: subtract,
        multiply: multiply,
        divide: divide
    }
}();

export {
    floatObj
}
  