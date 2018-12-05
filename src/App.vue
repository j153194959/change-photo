<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view :propData="propData" :cordova="cordova" class="child-view"></router-view>
    </transition>
    <div class="pop-ups">
      <!-- 更新提示 -->
      <transition name="fade">
        <div v-if="mask.update" class="supernatant update">
          <div>
            <div class="txt">参与超燃世界杯活动需升级<br>至优理宝最新版本</div>
            <nav>
              <a @click="closeMask(0)" href="javascript:void(0)">我知道了</a>
              <a @click="update" href="javascript:void(0)">立即更新</a>
            </nav>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      transitionName: 'slide-left',
      shareData: { // 分享
        title: '我为博道卓远打call加油', // 标题
        desc: '集齐66个赞，有机会赢取神秘好礼', // 描述
        outUrl: 'https://static.xyzq.cn/activity/change-photo/index.html#/', // 地址（出）
        // outUrl: 'https://www.baidu.com', // 地址（出）
        imgUrl: 'https://static.xyzq.cn/activity/change-photo/static/images/share_icon.png' // 图标地址
      },
      propData: { // 传给子组件的值
        userinfo: { // 用户信息
          phone: '', // 手机号
          account: '', // 资金账号
          xuid: '', // xuid
          Token: '', // Token
          Client: '', // Client
          // xuid: '35388', // xuid
          // Token: '4319644f52daafe9e8e691c3eae87b23', // Token
          // Client: '2880000322', // Client
          loadingCompleted: true, // 是否加载完成
          isLogin: false // 是否已登录
        }
      },
      mask: { // 弹窗控制
        update: false // 更新提示弹窗
      }
    }
  },
  watch: {
    '$route' (to, from) { // 切换路由时，前进后退使用不同动画
      const toDepth = this.getLength(to.path)
      const fromDepth = this.getLength(from.path)
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  },
  methods: {
    /**
     * 页面document初始化完成
     */
    documentInitFinish: function () {
      return new Promise(function (resolve, reject) {
        window.onload = function () {
          // alert(1)
          resolve()
        }
      })
    },
    /**
     * cordova 初始化完成
     */
    cordovaInitFinish: function () {
      return new Promise((resolve, reject) => {
        document.addEventListener('deviceready', () => {
          navigator.uniaccount && navigator.uniaccount.cordovaInitFinish()
          resolve()
        }, false)
      })
    },
    /**
     * 打开弹窗
     */
    openMask: function (index) {
      var arr = ['update']
      this.mask[arr[index]] = true
    },
    /**
     * 关闭弹窗
     */
    closeMask: function (index) {
      var arr = ['update']
      this.mask[arr[index]] = false
    },
    /**
     * 剔除空项获取路由长度
     */
    getLength: function (str) {
      var arr = str.split('/')
      for (let i = 0; i < arr.length; i++) {
        const el = arr[i]
        if (el === '') {
          arr.splice(i, 1)
          i--
        }
      }
      return arr.length
    },
    /**
     * 设置微信分享
     */
    setWeixinShare: function () {
      // alert(29)
      var that = this
      // console.log(that)
      var appid = ''
      var timestamp = ''
      var noncestr = ''
      var signature = ''

      this.$ajax({
        url: 'https://wechat.xyzq.cn/wechatbiz/accountApi?act=getJsapiInfo',
        params: {'url': window.location.href}, // 微信直接分享地址会变
        responseType: 'json'
      }).then((res) => {
        var data = res.data
        // alert(JSON.stringify(data))
        if (data.code === 0) {
          appid = 'wx513461a9e5de5010'
          timestamp = data.timestamp
          noncestr = data.noncestr
          signature = data.signature
          console.log('appid: %s', appid)
          console.log('timestamp: %s', timestamp)
          console.log('noncestr: %s', noncestr)
          console.log('signature: %s', signature)

          window.wx.config({
            debug: false,
            appId: appid,
            timestamp: timestamp,
            nonceStr: noncestr,
            signature: signature,
            jsApiList: [
              // 所有要调用的 API 都要加到这个列表中
              'onMenuShareTimeline',
              'onMenuShareAppMessage'
            ]
          })
        }
      })

      window.wx.ready(function () {
        // 发送给朋友
        window.wx.onMenuShareAppMessage({
          title: that.shareData.title, // 分享标题
          desc: that.shareData.desc, // 分享描述
          link: that.shareData.outUrl, // 分享链接
          imgUrl: that.shareData.imgUrl, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        })
        // 分享到朋友圈
        window.wx.onMenuShareTimeline({
          title: that.shareData.title,
          desc: that.shareData.desc, // 分享描述
          link: that.shareData.outUrl,
          imgUrl: that.shareData.imgUrl, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function (res) {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        })
        window.wx.error(function (res) {
          // alert('wx.error'+res.errMsg)
        })
      })
    },
    /**
     * cordova方法
     * params 登录参数
     * callback 回调函数
     */
    cordova: function (params, callback) {
      // 给定默认值
      var reloginflag = params.reloginflag || '0'
      var accounttype = params.accounttype || '2'
      // 获取登录信息
      navigator.uniaccount.ulbAccLogin((data) => {
        this.propData.userinfo.loadingCompleted = true
        var response = data
        if (typeof data === 'string') {
          response = JSON.parse(response)
        }
        // alert(JSON.stringify(response))
        // 如果登录方式为不对则返回
        // alert(response.respBody.userinfo.accountType)
        if (response.respBody.userinfo.accountType !== accounttype) {
          // that.openMask(2)
          return
        }
        var phone = response.respBody.userinfo.mobile || ''
        var account = response.respBody.userinfo.fundAccount || ''
        var xuid = response.respBody.clientservice_uni_acct_id || ''
        var client = response.respBody.userinfo.clientId || ''
        var token = response.respBody.logintoken || ''
        this.propData.userinfo.phone = phone
        this.propData.userinfo.account = account
        this.propData.userinfo.xuid = xuid
        this.propData.userinfo.client = client
        this.propData.userinfo.token = token
        this.shareData.outUrl = 'https://static.xyzq.cn/activity/world-cup/index.html?ownerPhone=' + xuid + '#/share'
        // this.shareData.outUrl = 'http://static.xyzq.cn/activity/pjm-test/world-cup/index.html?ownerPhone=' + xuid + '#/share'
        this.propData.userinfo.isLogin = true
        // alert('phone: ' + phone + '--account: ' + account + '--xuid: ' + xuid + '--client: ' + client + '--token: ' + token)
        // 如果有回调函数则执行
        if (callback) callback()
      }, (data) => {
        alert('未登录')
      }, {reloginflag: reloginflag, accounttype: accounttype})
    },
    /**
     * 获取app版本
     * 判断是否要更新
     */
    getVersion: function () {
      navigator.uniaccount.getAppInfo((data) => {
        var response = data
        if (typeof data === 'string') {
          response = JSON.parse(response)
        }
        // 得到 app内部版本号
        var version = parseInt(response.appVersionCode)
        if (this.GLOBAL.isAndroid()) { // 如果在安卓端
          if (version < 210) { // 最低版本需求210
            this.openMask(0)
          }
        } else {
          if (version < 74) { // 最低版本需求74
            this.openMask(0)
          }
        }
        // alert(JSON.stringify(response))
      })
    },
    /**
     * 点击 立即更新
     */
    update: function () {
      this.closeMask(0)
      navigator.uniaccount.jumpActivity({'linkType': '3', 'link': 'http://wap.xyzq.com.cn', 'linkParam': ''})
    }
  },
  beforeMount: function () {
    if (this.GLOBAL.getQueryString('inUlb')) { // 如果在优理宝中
      this.propData.userinfo.loadingCompleted = false
      Promise.all([
        this.documentInitFinish(),
        this.cordovaInitFinish()
      ]).then(() => {
        // cordova 加载
        this.cordova({
          reloginflag: '2',
          accounttype: '1'
        })
        this.getVersion()
      })
    } else if (this.GLOBAL.isWeixin()) { // 微信页面
      // if (!this.GLOBAL.getQueryString('openId')) {
      //   window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx513461a9e5de5010&redirect_uri=http%3a%2f%2fwechat.xyzq.cn%2fwechatbiz%2fauth&response_type=code&scope=snsapi_userinfo&state=mp-home.changephoto&connect_redirect=1#wechat_redirect'
      // }
      window.onload = this.setWeixinShare
    }
  },
  mounted: function () {
    // alert('测试03')
  }
}
</script>

<style lang="less">
html, body{
  height: 100%;
  ::-webkit-scrollbar {/*隐藏滚轮*/
    display: none;
  }
  #app {
    /* 过渡动画 */
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
      opacity: 0
    }
    .child-view {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      transition: all .5s cubic-bezier(.55,0,.1,1);
      box-sizing: border-box;
      overflow-y: scroll;
    }
    .slide-left-enter, .slide-right-leave-active {
      opacity: 0;
      -webkit-transform: translate(30px, 0);
      transform: translate(30px, 0);
    }
    .slide-left-leave-active, .slide-right-enter {
      opacity: 0;
      -webkit-transform: translate(-30px, 0);
      transform: translate(-30px, 0);
    }
    .pop-ups{
      .supernatant{
        position: fixed;
        z-index: 10;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.7);
        top: 0;
        left: 0;
        display:-webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        justify-content: center;
        align-items: center;
        > div{
          width: 6.381944rem; /* 919 */
          border-radius: .347222rem; /* 50 */
          overflow: hidden;
          position: relative;
          box-sizing: border-box;
          h3{
            height: .840278rem; /* 121 */
            line-height: .840278rem; /* 121 */
            background-image: -webkit-linear-gradient(-90deg, #4ac9ff 0%, #a5b1ec 50%, #fe98d9 100%), -webkit-linear-gradient(#ffffff, #ffffff);
            background-image: -o-linear-gradient(-90deg, #4ac9ff 0%, #a5b1ec 50%, #fe98d9 100%), -o-linear-gradient(#ffffff, #ffffff);
            background-image: -moz-linear-gradient(-90deg, #4ac9ff 0%, #a5b1ec 50%, #fe98d9 100%), -moz-linear-gradient(#ffffff, #ffffff);
            background-image: linear-gradient(-90deg, #4ac9ff 0%, #a5b1ec 50%, #fe98d9 100%), linear-gradient(#ffffff, #ffffff);
            text-align: center;
            font-family: PingFangSC-Medium;
            font-size: .333333rem; /* 48 */
            color: #fff;
          }
          .close{
            width: .5625rem; /* 81 */
            height: .5625rem; /* 81 */
            padding: .138889rem;
            position: absolute;
            top: 0;
            right: 0;
          }
        }
      }
      .update{
        > div{
          width: 5.006944rem; /* 721 */
          background-color: #fff3f3;
          box-shadow: 0px .069444rem .208333rem 0px rgba(146, 7, 0, 0.3); /* 10 30 */
          border-radius: .166667rem; /* 24 */
          padding-top: .958333rem; /* 138 */
          div{
            text-align: center;
            line-height: .416667rem; /* 60 */
            font-family: PingFangSC-Regular;
            font-size: .333333rem; /* 48 */
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #353535;
          }
          nav{
            margin-top: .722222rem; /* 138 */
            border-top: .013889rem solid #f5dcdc; /* 2 */
            a{
              float: left;
              width: 50%;
              height: .916667rem; /* 132 */
              line-height: .916667rem; /* 132 */
              font-family: PingFangSC-Medium;
              font-size: .291667rem; /* 42 */
              font-weight: normal;
              font-stretch: normal;
              letter-spacing: 0px;
              color: #999999;
              text-align: center;
              &:last-of-type{
                color: #d81c1d;
                border-left: .013889rem solid #f5dcdc; /* 2 */
                box-sizing: border-box;
              }
            }
          }
        }
      }
    }
  }
}
</style>
