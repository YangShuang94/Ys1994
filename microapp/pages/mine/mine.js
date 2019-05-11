const app = getApp()
const ut = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    usercentInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (wx.getStorageSync('token').Token) {
      this.user_usercenterinfo()
      this.setData({
        token: wx.getStorageSync('token').Token,
        isWorker: wx.getStorageSync('token').IsWorker,
        isAgent: wx.getStorageSync('token').IsAgent
      })
    } else {
      // this.isRgisterp()
    }

    
  },

  /**
   * 是否手机号注册
   */
  isRgisterp: function() {
    if (!wx.getStorageSync('token').Token) {
      if (wx.getStorageSync('isRegister') == false) {
        wx.navigateTo({
          url: "/pages/login/loginformsg/loginformsg"
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var merchantStoreName = wx.getStorageSync('merchantStoreName')
    // title
    wx.setNavigationBarTitle({
      title: merchantStoreName
    })
    
    if (wx.getStorageSync('token').Token) {
      this.user_usercenterinfo()
    } else {
      this.isRgisterp()
    }
  },

  login: function () {
    // app.wx_Login()
    var that = this
    wx.showLoading({
      title: '',
    }) //加载中
    wx.login({
      success: res => {
        wx.request({
          url: app.globalData.baseUrl + 'auth_wxlogin&version=10',
          method: 'POST',
          data: {
            appid: app.globalData.appId,
            code: res.code
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            wx.hideLoading() //关闭加载
            // console.log(res)
            if (res.statusCode == 200) {
              console.log(res.data.data)
              if (res.data.Code == 402) { 
                wx.navigateTo({
                  url: "/pages/login/loginformsg/loginformsg"
                })
              } else {
                if (res.data.data != null) {
                  wx.setStorageSync('token', res.data.data)
                  wx.reLaunch({
                    url: '/pages/mine/mine',
                  })
                } else {
                  wx.showToast({
                    title: res.data.Message,
                    icon: 'none',
                    duration: 1000,
                    mask: true
                  })
                }
              }
             
            } else {
              wx.showToast({
                title: res.data.Message,
                icon: 'none',
                duration: 1000,
                mask: true
              })
            }
          }
        })
      }
    })
  },
  user_usercenterinfo: function () {
    app.Get(ut.api.user_usercenterinfo).then((res) => {
      console.log(res.data)
      this.setData({
        usercentInfo: res.data
      }) 
    }).catch((error) => {
      console.log(error);
      app.erShow(error); //错误弹框提示
    });
  },

  /**
   * 返回上一页
   */
  back: function () {
    var pages = getCurrentPages();//获取页面栈
    console.log("pages:" + pages)
    if (pages.length > 1) {
      console.log("大于1")
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //调用上一个页面的onShow方法
      prePage.onShow()
      wx.navigateBack({
        delta: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
})