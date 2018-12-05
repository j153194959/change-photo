export default {
  // 判断微信环境
  isWeixin: function () {
    var ua = navigator.userAgent.toLowerCase()
    if ((ua.match(/MicroMessenger/i) + '') === 'micromessenger') {
      return true
    } else {
      return false
    }
  },
  // 判断手机是安卓还是ios
  isAndroid: function () {
    var u = navigator.userAgent
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
    // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    if (isAndroid) return true
    return false
  },
  /**
   * 获取url地址参数
   * @param  {[type]} name [地址参数名]
   * @return {[type]}      [description]
   */
  getQueryString: function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  },
  /**
   * 获取字符串长度（区分英文汉字）
   */
  strlen: function (str) {
    var len = 0
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i)
      // 单字节加1
      if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
        len++
      } else {
        len += 2
      }
    }
    return len
  },
  /**
   * 手机号码验证
   */
  pattern: function (str) {
    var pattern = /^1(3|4|5|7|8|9)\d{9}$/
    return pattern.test(str)
  },
  /**
   * 判断url中是否含有某个值
   */
  urlJudgment: function (name) {
    var href = window.location.href
    if (href.indexOf(name) > -1) return true
    return false
  },
  /**
   * 字符串过滤
   */
  strFilter: function (str) {
    const arr = str.split('.')
    return arr[0]
  },
  /**
   * 将时间戳改为时间格式
   * @param  {[number || string]} time [时间戳]
   * @param  {[string]} format [时间格式 yyyy-MM-dd hh:mm:ss]
   * @return {[string]}      [需要的时间]
   */
  changeTimeType: function (time, format) {
    var date = new Date(time) // 获取一个时间对象  注意：如果是uinx时间戳记得乘于1000。比如php函数time()获得的时间戳就要乘于1000
    // 定义一个数组接收时间格式所有数据
    var formatArr = [ // txt: 所属字段 -- index: 当前所处索引位置
      { yyyy: '', txt: 'yyyy', index: 0 }, // 年
      { MM: '', txt: 'MM', index: 1 }, // 月
      { dd: '', txt: 'dd', index: 2 }, // 日
      { hh: '', txt: 'hh', index: 3 }, // 时
      { mm: '', txt: 'mm', index: 4 }, // 分
      { ss: '', txt: 'ss', index: 5 } // 秒
    ]
    // 如果含有当前字段 做响应处理
    if (format.indexOf(formatArr[0].txt) !== -1) formatArr[0].yyyy = date.getFullYear() + ''
    if (format.indexOf(formatArr[1].txt) !== -1) formatArr[1].MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + ''
    if (format.indexOf(formatArr[2].txt) !== -1) formatArr[2].dd = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + 1) + ''
    if (format.indexOf(formatArr[3].txt) !== -1) formatArr[3].hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + 1) + ''
    if (format.indexOf(formatArr[4].txt) !== -1) formatArr[4].mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + 1) + ''
    if (format.indexOf(formatArr[5].txt) !== -1) formatArr[5].ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds() + 1) + ''
    // 获取中间格式
    var splitArr = format.split(/yyyy|MM|dd|hh|mm|ss/)
    for (let i = 0; i < formatArr.length; i++) {
      // 给索引赋值
      formatArr[i].index = format.indexOf(formatArr[i].txt)
      if (format.indexOf(formatArr[i].txt) !== -1) { // 如果不存在当前项则跳过
        continue
      } else { // 否则插入当前项
        splitArr.splice(i, 0, '')
      }
    }
    // 排序数组
    formatArr.sort((val1, val2) => {
      // 如果对比值的索引为 -1 则排到末尾
      if (val2.index === -1) return 0
      return val1.index - val2.index
    })
    // console.log(formatArr)
    // console.log(splitArr)
    // 拼接字符串得到结果
    var result = ''
    for (let i = 0; i < formatArr.length; i++) {
      result += splitArr[i] + formatArr[i][formatArr[i].txt]
    }
    return result
  }
}
