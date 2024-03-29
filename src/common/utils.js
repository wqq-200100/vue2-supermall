// 防抖函数,解决重复频繁调用问题
export function debounce(func,delay) {
  let timer=null

  return function (...args) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() =>{
      func.apply(this,args)
    },delay)
  }
}

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}

// 时间格式化
export function formatDate(date, fmt) {
  // 1.获取年份
  // y+ 表示1个y或者多个y
  // y* 表示0个y或者多个y
  // y? 表示0个或者一个y
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  //
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };

  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
    }
  }

  return fmt;
}

