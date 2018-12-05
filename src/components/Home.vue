<template>
  <div class="Home" ref="home">
    <div ref="capture" class="container">
      <header>
        <div v-show="statu.upload" class="upload">
          <img src="../assets/button.png" alt="">
          <input type="file" ref="m_upload" accept="image/*" @change="handleFiles">
        </div>
        <div v-if="statu.uploaded" class="uploaded clearfix">
          <div @click="modify"><img src="../assets/cxsc.png" alt=""></div><div @click="save"><img src="../assets/bctp.png" alt=""></div>
        </div>
      </header>
      <main ref="m_upload_box">
        <!-- <img src="../assets/lan.png" alt=""> -->
      </main>
      <footer>
        <img src="../assets/hong.png" alt="">
        <!-- <div>
          <div class="code">
            <div id="qrcode"></div>
            <img src="" id="imgOne" />
            <p>年度券商APP</p>
            <p>评选进行中</p>
          </div>
          <p>{{nickname}}邀请您为我们</p>
          <p>投上宝贵一票</p>
        </div> -->
      </footer>
    </div>
    <!-- 弹窗 -->
    <div class="pop-ups">
      <!-- 提示弹窗 -->
      <div v-show="prompt.statu" class="supernatant prompt">
        <div>{{prompt.msg}}</div>
      </div>
      <!-- 提示信息 -->
      <transition name="fade"><div v-if="statu.msg" class="msg">长按图片可保存!</div></transition>
      <!-- 展示生成的图片 -->
      <div v-show="statu.capture" ref="showCapture" class="showCapture"><img ref="img" src="" alt=""></div>
    </div>
  </div>
</template>

<script>
// import html2canvas from 'html2canvas'
import lrz from 'lrz'
import touch from 'touchjs'

export default {
  name: 'Home',
  data () {
    return {
      statu: { // 显示状态
        upload: 1, // 上传
        uploaded: 0, // 上传过
        msg: 0, // 提示信息
        pic: null,
        capture: 0 // 生成的图片
      },
      prompt: { // 提示弹窗
        statu: 0,
        msg: '生成图片中...'
      },
      linkUrl: '',
      nickname: ''
    }
  },
  methods: {
    /**
     * 上传图片框发生变化
     */
    handleFiles: function () {
      this.prompt.msg = '上传中...'
      this.prompt.statu = 1
      // 取到上传图片并转化为base64
      var box = this.$refs.m_upload_box
      var pic = this.$refs.m_upload.files[0]
      if (!pic) {
        this.prompt.statu = 0
        return
      }
      console.log(pic)
      this.pic = pic
      // console.log(pic)
      lrz(pic).then((rst) => {
        box.innerHTML = '<img src=' + rst.base64 + ' id="touch" style="position:relative;transform-origin:center" >'
        this.statu.upload = 0
        this.statu.uploaded = 1
        this.touch(document.querySelector('#touch'))
        this.prompt.statu = 0
      }).catch((err) => {
        // 处理失败会执行
        this.prompt.statu = 0
        alert(err)
      }).always(() => {
        // 不管是成功失败，都会执行
      })
    },
    /**
     * 点击修改
     */
    modify: function () {
      this.iosClick(this.$refs.m_upload)
    },
    /**
     * 点击保存
     */
    save: function () {
      this.statu.uploaded = 0
      this.prompt.msg = '生成图片中...'
      this.prompt.statu = 1
      // 获取想要转换的 DOM 节点
      var dom = this.$refs.capture
      /**
       * 根据window.devicePixelRatio获取像素比
       */
      function DPR () {
        if (window.devicePixelRatio && window.devicePixelRatio > 1) {
          return window.devicePixelRatio
        }
        return 1
      }

      /**
       *  将传入值转为整数
       */
      function parseValue (value) {
        return parseInt(value, 10)
      }
      var box = window.getComputedStyle(dom)
      // DOM 节点计算后宽高
      var width = parseValue(box.width)

      var height = parseValue(box.height)

      // 获取像素比
      var scaleBy = DPR()
      // 创建自定义 canvas 元素
      var canvas = document.createElement('canvas')
      // 获取元素相对于视窗的偏移量
      var rect = dom.getBoundingClientRect()
      // 设定 canvas 元素属性宽高为 DOM 节点宽高 * 像素比
      canvas.width = width * scaleBy
      canvas.height = height * scaleBy
      // 设定 canvas css宽高为 DOM 节点宽高
      canvas.style.width = width * scaleBy + 'px'
      canvas.style.height = width * scaleBy + 'px'
      // 获取画笔
      var context = canvas.getContext('2d')
      // 将所有绘制内容放大像素比倍
      context.scale(scaleBy, scaleBy)
      // 设置context位置, 值为相对于视窗的偏移量的负值, 实现图片复位
      context.translate(-rect.left, -rect.top)
      setTimeout(() => {
        // 将自定义 canvas 作为配置项传入，开始绘制
        window.html2canvas(dom, {
          canvas: canvas,
          onrendered: (canvas) => {
            // console.log(canvas)
            this.statu.capture = 1
            // 将canvas转化为base64
            var dataURL = canvas.toDataURL('image/png')
            var form = new FormData() // 创建一个FormData对象
            var openId = this.GLOBAL.getQueryString('openId') || 'test'
            console.log(openId)
            // alert(window.location.href)
            // alert(openId)
            // form.append('file', dataURL)
            // console.log(this.pic)
            form.append('file', this.pic)
            form.append('openid', openId)
            this.$ajax({
              method: 'post',
              url: '/upload',
              responseType: 'json',
              // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'},
              data: form
              // data: {file: dataURL, openid: openId}
              // params: {file: dataURL, openid: openId}
              // params: form
            }).then((res) => {
              console.log(res.data)
              if (res.data.resphead.respcode === '1111') alert(res.data.resphead.respdetails)
              // alert(1 + JSON.stringify(res))
            }).catch((err) => {
              console.log(err)
              // alert(2 + JSON.stringify(err))
            })
            this.$refs.img.src = dataURL
            this.prompt.statu = 0
            // 显示提示
            this.statu.msg = 1
            // 两秒后关闭提示
            setTimeout(() => {
              this.statu.msg = 0
            }, 1500)
          }
        })
      }, 100)
    },
    /**
     * 拖拽、缩放、旋转
     * dom 作用元素
     */
    touch: function (dom) {
      // console.log(dom)
      var cat = window.cat || {}
      cat.touchjs = {
        left: 0,
        top: 0,
        scaleVal: 1, // 缩放
        rotateVal: 0, // 旋转
        curStatus: 0, // 记录当前手势的状态, 0:拖动, 1:缩放, 2:旋转
        // 初始化
        init: function ($targetObj, callback) {
          touch.on($targetObj, 'touchstart', function (ev) {
            cat.touchjs.curStatus = 0
            ev.preventDefault() // 阻止默认事件
          })
          if (!window.localStorage.cat_touchjs_data) {
            // callback(0, 0, 1, 0)
            callback()
          } else {
            var jsonObj = JSON.parse(window.localStorage.cat_touchjs_data)
            cat.touchjs.left = parseFloat(jsonObj.left)
            cat.touchjs.top = parseFloat(jsonObj.top)
            cat.touchjs.scaleVal = parseFloat(jsonObj.scale)
            cat.touchjs.rotateVal = parseFloat(jsonObj.rotate)
            callback(cat.touchjs.left, cat.touchjs.top, cat.touchjs.scaleVal, cat.touchjs.rotateVal)
          }
          // touch.on('touch', 'touchstart', function (ev) {
          //   ev.startRotate()
          //   ev.originEvent.preventDefault()
          //   // ev.originEvent.stopPropagation();     //注释掉或者删掉stopPropagation方法
          // })
        },
        // 拖动
        drag: function ($targetObj, callback) {
          touch.on($targetObj, 'drag', function (ev) {
            // $targetObj.css("left", cat.touchjs.left + ev.x).css("top", cat.touchjs.top + ev.y)
            $targetObj.style.left = cat.touchjs.left + ev.x + 'px'
            $targetObj.style.top = cat.touchjs.top + ev.y + 'px'
          })
          touch.on($targetObj, 'dragend', function (ev) {
            cat.touchjs.left = cat.touchjs.left + ev.x
            cat.touchjs.top = cat.touchjs.top + ev.y
            callback(cat.touchjs.left, cat.touchjs.top)
          })
        },
        // 缩放
        scale: function ($targetObj, callback) {
          var initialScale = cat.touchjs.scaleVal || 1
          var currentScale
          touch.on($targetObj, 'pinch', function (ev) {
            if (cat.touchjs.curStatus === 2) {
              return
            }
            cat.touchjs.curStatus = 1
            currentScale = ev.scale - 1
            currentScale = initialScale + currentScale
            cat.touchjs.scaleVal = currentScale
            var transformStyle = 'scale(' + cat.touchjs.scaleVal + ') rotate(' + cat.touchjs.rotateVal + 'deg)'
            // $targetObj.css('transform', transformStyle).css('-webkit-transform', transformStyle)
            $targetObj.style.transform = transformStyle
            $targetObj.style.WebkitTransform = transformStyle
            callback(cat.touchjs.scaleVal)
          })

          touch.on($targetObj, 'pinchend', function (ev) {
            if (cat.touchjs.curStatus === 2) {
              return
            }
            initialScale = currentScale
            cat.touchjs.scaleVal = currentScale
            callback(cat.touchjs.scaleVal)
          })
        },
        // 旋转
        rotate: function ($targetObj, callback) {
          var angle = cat.touchjs.rotateVal || 0
          touch.on($targetObj, 'rotate', function (ev) {
            if (cat.touchjs.curStatus === 1) {
              return
            }
            cat.touchjs.curStatus = 2
            var totalAngle = angle + ev.rotation
            if (ev.fingerStatus === 'end') {
              angle = angle + ev.rotation
            }
            cat.touchjs.rotateVal = totalAngle
            var transformStyle = 'scale(' + cat.touchjs.scaleVal + ') rotate(' + cat.touchjs.rotateVal + 'deg)'
            // $targetObj.css('transform', transformStyle).css('-webkit-transform', transformStyle)
            $targetObj.style.transform = transformStyle
            $targetObj.style.WebkitTransform = transformStyle
            $targetObj.attr('data-rotate', cat.touchjs.rotateVal)
            callback(cat.touchjs.rotateVal)
          })
        }
      }
      var $targetObj = dom
      // 初始化设置
      cat.touchjs.init($targetObj, function (left, top, scale, rotate) {})
      // 初始化拖动手势（不需要就注释掉）
      cat.touchjs.drag($targetObj, function (left, top) { })
      // 初始化缩放手势（不需要就注释掉）
      cat.touchjs.scale($targetObj, function (scale) { })
      // 初始化旋转手势（不需要就注释掉）
      cat.touchjs.rotate($targetObj, function (rotate) { })
    },

    // 获取昵称之后成功回调函数
    getNickName: function (data) {
      this.nickname = data.respbody.myInfo.nickname
      console.log(this.nickname)
    }
  },
  mounted: function () {
    // alert('test03')
    // document.scroll = function (e) { e.preventDefault() }
    // document.ontouchmove = function (e) { e.preventDefault() }
    // 获得用户的openId
    var openId = this.GLOBAL.getQueryString('openId')
    var isWX = this.GLOBAL.isWeixin()
    // if (openId) {
    // this.linkUrl = 'http://bshare.optimix.asia/barCode?site=weixin&url=https://static.xyzq.cn/activity/vote_temp/index.html'
    // this.linkUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://static.xyzq.cn/activity/vote_temp/index.html?openId=' + openId
    // var qrcode = $('#qrcode').qrcode('https://static.xyzq.cn/activity/vote_201808/index.html?owner=' + openId).hide()
    // var canvas = qrcode.find('canvas').get(0)
    // $('#imgOne').attr('src', canvas.toDataURL('image/jpg'))
    // } else {
    // this.linkUrl = 'http://bshare.optimix.asia/barCode?site=weixin&url=https://static.xyzq.cn/activity/vote_temp/index.html'
    // this.linkUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://static.xyzq.cn/activity/vote_temp/index.html'

    // 默认使用Canvas生成，并显示到图片
    // var qrcode2 = $('#qrcode').qrcode('https://static.xyzq.cn/activity/vote_201808/index.html').hide()
    // var canvas2 = qrcode2.find('canvas').get(0)
    // $('#imgOne').attr('src', canvas2.toDataURL('image/jpg'))
    // }
    if (!openId && isWX) { // 如果没有openId且在微信端
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx513461a9e5de5010&redirect_uri=http%3a%2f%2fwechat.xyzq.cn%2fwechatbiz%2fauth&response_type=code&scope=snsapi_userinfo&state=mp-home.changephoto&connect_redirect=1#wechat_redirect'
    } else if (openId) { // 如果有openId
      var _this = this
      // 得到用户昵称
      $.ajax({
        url: 'https://estock.xyzq.com.cn/activity2/pic/readingCarnival/myRecord',
        data: {openid: openId},
        success: function (data) {
          if (data.resphead.respcode === '0000') { // 如果有用户昵称
            _this.getNickName(data)
          } else if (data.resphead.respcode === '1009') { // 如果没有获取到用户昵称
            $.ajax({
              url: 'https://estock.xyzq.com.cn/activity2/pic/readingCarnival/participate',
              data: {
                openid: openId,
                bookid: '20180409141124'
              },
              success: function (data) {
                if (data.resphead.respcode === '0000') {
                  $.ajax({
                    url: 'https://estock.xyzq.com.cn/activity2/pic/readingCarnival/myRecord',
                    data: { openid: openId },
                    success: function (data) {
                      console.log(data)
                      // alert('3---- ' + JSON.stringify(data))
                      if (data.resphead.respcode === '0000') {
                        _this.getNickName(data)
                      }
                    }
                  })
                }
              }
            })
          }
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .Home{
    overflow: hidden !important;
    > .container{
      height: 100%;
      background-image: url("../assets/lan.png");
      background-size: 100% 12.076389rem; /* 1739 */
      background-repeat: no-repeat;
      background-position-y: top;
      header{
        padding-top: 3.652778rem; /* 526 */
        .upload{
          width: 3.555556rem; /* 512 */
          height: 3.555556rem; /* 512 */
          margin: 0 auto;
          position: relative;
          z-index: 3;
          input{
            top: 0;
            left: 0;
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0;
          }
        }
        .uploaded{
          margin-top: 2.180556rem; /* 314 */
          text-align: center;
          position: relative;
          z-index: 3;
          div{
            display: inline-block;
            width: 2.520833rem; /* 363 */
            height: 1.111111rem; /* 160 */
            &:last-of-type{
              margin-left: .555556rem;
            }
          }
        }
      }
      main{
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        top: 0;
        left: 0;
        z-index: 1;
      }
      footer{
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 2;
        width: 100%;
        height:5.25694rem;
        div{
          height:5.25694rem;
          background-image: url("../assets/hong.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          .code{
            width: 1.1597rem;
            height: 1.1597rem;
            position: absolute;
            right: 0.2644rem;
            top: 3.3824rem;
            background: #ffffff;
            z-index:3;
            img{
              width: 1.0597rem;
              height: 1.0597rem;
              margin: .05rem;
            }
            p{
              top: .08rem;
              font-size: .1875rem;
              color: #FFFFFF;
              text-align: center;
              line-height: .2644rem;
              width: 1.6rem;
              right: .25rem;
            }
          }
          p{
            font-size: .3033rem;
            color: #FFFFFF;
            text-align: center;
            position: relative;
            top: 3.4694rem;
            letter-spacing: .0204rem;
          }
        }
      }
    }
    .pop-ups{
      .prompt{
        > div{
          font-size: .416667rem;
          font-family: PingFangSC Light;
          color: #fff;
          text-align: center;
        }
      }
      .msg{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        color: #fff;
        text-align: center;
        width: 60%;
        height: .833333rem; /* 120 */
        line-height: .833333rem; /* 120 */
        border-radius: .173611rem; /* 25 */
        font-size: .416667rem;
        font-family: PingFangSC Light;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 6;
      }
      .showCapture{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 5;
      }
    }
  }
</style>
