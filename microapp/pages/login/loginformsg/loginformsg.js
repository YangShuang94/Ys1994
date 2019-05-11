// pages/login/loginforpsd/loginforpsd.js

const app = getApp()
const ut = require('../../../utils/util.js')
var interval = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhone: "",
    userCode: "",

    time: '获取验证码', //倒计时 
    currentTime: 60, //倒计时60秒
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  

  userPhoneInput: function (e) {
    this.setData({
      userPhone: e.detail.value
    })
  },
  userCodeInput: function (e) {
    this.setData({
      userCode: e.detail.value
    })
  },

  // 获取验证码倒计时
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
  },
  getVerificationCode: function () {
    var that = this
    var userPhone = that.data.userPhone
    var telRule = /^1[3|4|5|7|8|9]\d{9}$/

    if (!telRule.test(userPhone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    that.getCode(); //验证码倒计时
    that.setData({
      disabled: true
    })

    var merchantStoreId = wx.getStorageSync('merchantStoreId')
    wx.showLoading({
      title: '',
    }) //加载中

    wx.login({
      success: res => {

        let data = {
          appid: app.globalData.appId,
          storeId: merchantStoreId,
          phone: userPhone,
          code: res.data
        }
        console.log(data);
        wx.request({
          url: app.globalData.baseUrl + 'auth_getsmscode&version=10',
          method: 'POST',
          data: data,
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          success: res => {
            wx.hideLoading() //加载完hide加载提示

            if (res.statusCode == 200) {
              console.log(res.data)
              if(res.data.Code == 0) {

                // that.getCode(); //验证码倒计时

                wx.showToast({
                  title: '发送成功，注意查收~',
                  icon: 'none',
                  duration: 1000,
                  mask: true,
                })
              } else {
                clearInterval(interval)
                that.setData({
                  disabled: false
                })
                wx.showToast({
                  title: res.data.Message,
                  icon: 'none',
                  duration: 1000,
                  mask: true
                })
              }
            } else {
              clearInterval(interval)
              that.setData({
                disabled: false
              })
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

  // 立即注册
  register: function () {
    var that = this;
    var telRule = /^1[3|4|5|7|8|9]\d{9}$/
    if (!that.data.userPhone) {
      wx.showToast({
        title: "请输入手机号",
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    if (!telRule.test(that.data.userPhone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    if (!that.data.userCode) {
      wx.showToast({
        title: "请输入验证码",
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }

    wx.showLoading({
      title: '注册中...',
    }) //加载中
    wx.login({
      success: res => {
        console.log(res)
        var merchantStoreId = wx.getStorageSync('merchantStoreId')

        let data = {
          appid: app.globalData.appId,
          storeId: merchantStoreId,
          phone: that.data.userPhone,
          smscode: that.data.userCode,
          jscode: res.code
        }

        wx.request({
          url: app.globalData.baseUrl + 'auth_register&version=10',
          method: 'POST',
          data: data,
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          success: res => {
            wx.hideLoading()
            if (res.statusCode == 200) {
              console.log(res)
              console.log(res.data.note)

              if (res.data.data != null) {
                var isRegister = true //是否手机号注册  已注册
                wx.setStorageSync('isRegister', isRegister)
                wx.setStorageSync('token', res.data.data)
                app.customerBind()
                that.back()
                // wx.reLaunch({
                //   url: "/pages/mine/mine"
                // })

              } else {
                wx.showToast({
                  title: res.data.Message,
                  icon: 'none',
                  duration: 1000,
                  mask: true
                })
                // wx.setStorageSync('token', res.data.data.Token)
                // wx.setStorageSync('user', res.data.data)
              }
            } else {
              wx.showToast({
                title: res.data.Message,
                icon: 'none',
                duration: 1000,
                mask: true
              })
            }
          },
          fail: function (e) {
            wx.hideLoading()
            wx.showToast({
              title: "请求超时",
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        }) 

      }
    })
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})