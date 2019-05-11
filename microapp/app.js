//app.js 
const ut = require('utils/util.js')
App({
  onLaunch: function() {
    var that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var token = wx.getStorageSync('token').Token
    if (!token) {
      // this.wx_Login()
      wx.login({
        success: res => {
          wx.request({
            url: this.globalData.baseUrl + 'auth_wxlogin&version=10',
            method: 'POST',
            data: {
              appid: this.globalData.appId,
              code: res.code
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: res => {
              // console.log(res)
              if (res.statusCode == 200) {
                console.log(res.data.data)
                var isRegister = false
                if (res.data.Code == 402) {
                  isRegister = false //是否手机号注册  未注册
                  wx.setStorageSync('isRegister', isRegister)
                } else {
                  isRegister = true //是否手机号注册  已注册
                  wx.setStorageSync('isRegister', isRegister)

                  if (res.data.data != null) {
                    wx.setStorageSync('token', res.data.data)
                    that.customerBind()
                  } else {
                    // wx.showToast({
                    //   title: res.data.Message,
                    //   icon: 'none',
                    //   duration: 1000,
                    //   mask: true
                    // })
                  }
                }
                // }
              } else {
                // wx.showToast({
                //   title: res.data.Message,
                //   icon: 'none',
                //   duration: 1000,
                //   mask: true
                // })
              }
            },
            fail: function(e) {
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
    }
  },
  globalData: {
    userInfo: null,
    appId: 'wx1ace8c1458b54cb3',

    //baseUrl: 'http://127.0.0.1:8011/api?cmdid='
    // baseUrl: 'http://dev-api.yunxishop.com/api?cmdid='
    baseUrl: 'https://microapp-api.yunxishop.com/api?cmdid='
  },
  Post: function(api, data = {}, debug = 1, head = {}) {
    var promise = new Promise((resolve, reject) => {
      //init
      var that = this;
      var postData = data;
      var token = wx.getStorageSync('token').Token || '';
      var _isRegister = wx.getStorageSync('isRegister') || ''; //是否登录

      //var re_head = head;
      postData.appid = 'wx1ace8c1458b54cb3';
      postData.pagesize = 20;


      // console.log(this.globalData.baseUrl + api + '&version=10');

      //re_head.content - type = 'application/x-www-form-urlencoded';
      /*
      //自动添加签名字段到postData，makeSign(obj)是一个自定义的生成签名字符串的函数
      postData.signature = that.makeSign(postData);
      */
      //网络请求
      wx.request({
        url: this.globalData.baseUrl + api + '&version=10',
        data: postData,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': token
        },
        success: function(res) { //服务器返回数据
          //是否打印数据
          if (debug) {
            // console.log(res.data)
          }
          if (res.data.Code == 0) {
            resolve(res.data);
          } else if (res.data.Code == 401) {
            wx.removeStorageSync('token')
            wx.reLaunch({
              url: '/pages/mine/mine'
            })
            reject("请先登录");
          } else { //返回错误提示信息
            if (!token) {
              if (_isRegister == false){
                wx.navigateTo({
                  url: "/pages/login/loginformsg/loginformsg"
                })
              } else {
                wx.showToast({
                  title: "请先登录",
                  icon: 'none',
                  duration: 1000,
                  complete: function() {
                    wx.reLaunch({
                      url: '/pages/mine/mine'
                    })
                  } //接口调用结束的回调函数
                })
              }
            } else {
              reject(res.data.Message);
            }

          }
        },
        error: function(e) {
          reject('网络出错');
        },
        fail: function(e) {
          reject('请求超时');
          // fail(res)
          // console.log(res.errMsg);
        }
      })


    });
    return promise;
  },
  Get: function(api, data = {}, debug = 1, head = {}) {
    var promise = new Promise((resolve, reject) => {
      //init
      var that = this;
      var getData = data;
      var token = wx.getStorageSync('token').Token || '';
      var _isRegister = wx.getStorageSync('isRegister') || ''; //是否登录

      getData.appid = 'wx1ace8c1458b54cb3';
      getData.pagesize = 20;


      //var re_head = head;
      // console.log(this.globalData.baseUrl + api + '&version=10');

      //re_head.content - type = 'application/x-www-form-urlencoded';
      /*
      //自动添加签名字段到postData，makeSign(obj)是一个自定义的生成签名字符串的函数
      postData.signature = that.makeSign(postData);
      */
      //网络请求
      wx.request({
        url: this.globalData.baseUrl + api + '&version=10',
        data: getData,
        method: 'GET',
        header: {
          'token': token
        },
        success: function(res) { //服务器返回数据
          //是否打印数据
          if (debug) {
            // console.log(res.data)
          }
          if (res.data.Code == 0) {
            resolve(res.data);
          } else if (res.data.Code == 401) {
            wx.removeStorageSync('token')
            wx.reLaunch({
              url: '/pages/mine/mine'
            })
            reject("请先登录");
          } else { //返回错误提示信息
            if (!token) {
              if (_isRegister == false) {
                wx.navigateTo({
                  url: "/pages/login/loginformsg/loginformsg"
                })
              } else {
                wx.showToast({
                  title: "请先登录",
                  icon: 'none',
                  duration: 1000,
                  complete: function() {
                    wx.reLaunch({
                      url: '/pages/mine/mine'
                    })
                  } //接口调用结束的回调函数
                })
              }
            } else {
              reject(res.data.Message);
            }
            // reject(res.data.Message);
          }
        },
        error: function(e) {
          console.log(e)
          reject('网络出错');
        },
        fail: function(e) {
          reject('请求超时');
          // fail(res)
          // console.log(res.errMsg);
        }
      })


    });
    return promise;
  },

  // 是否微信登录
  iswxLogin: function() {
    var otoken = wx.getStorageSync('token').Token
    if (!otoken) {
      wx.showToast({
        title: "请先登录",
        icon: 'none',
        duration: 1000,
      })
      wx.reLaunch({
        url: '/pages/mine/mine'
      })
      // wx.navigateTo({
      //     url: "pages/login/loginformsg/loginformsg"
      // })
    }
  },

  /**
   * 微信成功弹出层
   */
  seShow: function(str = "成功", mask = 1, duration = 1000) {
    if (mask == 1) {
      mask = true;
    } else {
      mask = false;
    }
    wx.showToast({
      title: str,
      icon: 'success',
      duration: duration,
      mask: mask,
    })
  },

  /**
   * 微信失败弹出层
   */
  erShow: function(str = "失败", mask = 1, duration = 1000) {
    if (mask == 1) {
      mask = true;
    } else {
      mask = false;
    }
    wx.showToast({
      title: str,
      icon: 'none',
      duration: duration,
      mask: mask,
    })
  },
  customerBind: function() {
    var that = this
    var agentUserId = wx.getStorageSync('agentuserid') || 0
    var token = wx.getStorageSync('token').Token
    var userId = wx.getStorageSync('token').UserId
    var isAgentCustomer = wx.getStorageSync('token').IsAgentCustomer
    if (token && userId != agentUserId && !isAgentCustomer && agentUserId>0) {
      that.Post(ut.api.bangding, {
        agentuserid: agentUserId
      }).then((res) => {
        console.log(res)
        if (res.Code == 0) {} else {
          that.erShow(res.Message)
        }
      }).catch((res) => {
        that.erShow(res)
      })
    }
  }

})