// pages/mine/orderdetails/orderdetails.js

const app = getApp()
const ut = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var ordertype = options.type
    this.setData({
      id: id,
      ordertyped: ordertype,   //页面加载类型  1全部订单 2待付款 3服务中 4已完成
    })
    // this.getOrderDetails(id); //订单详情
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var id = this.data.id
    this.getOrderDetails(id); //订单详情
  },

  // 订单详情
  getOrderDetails: function(obj) {
    var data = {
      id: obj
    }
    wx.showLoading({
      title: '',
    }) //加载中
    app.Get(ut.api.sorder_detail, data).then((res) => {
      console.log(res.data)
      wx.hideLoading() //加载完hide加载提示
      this.setData({
        orderDetails: res.data
      })
    }).catch((error) => {
      // console.log(error);
      wx.hideLoading() //加载完hide加载提示
      app.erShow(error); //错误弹框提示
    });
  },

  // 订单支付
  orderPay: function () {
    var id = this.data.id
    var that = this
    var data = {
      orderid: id
    }
    wx.showLoading({
      title: '支付中...',
    }) //加载中
    app.Post(ut.api.sorder_pay, data).then((res) => {
      console.log(res)
      wx.hideLoading() //加载完hide加载提示
      wx.requestPayment(
        {
          'timeStamp': res.data.TimeStamp,
          'nonceStr': res.data.NonceStr,
          'package': res.data.Package,
          'signType': res.data.SignType,
          'paySign': res.data.PaySign,
          'success': function (res) {
            console.log(res)
            that.back();
          },
          'fail': function (res) {
            console.log(res)
          },
          'complete': function (res) { }
        })
    }).catch((error) => {
      console.log(error);
      wx.hideLoading() //加载完hide加载提示
      wx.showToast({
        title: error,
        icon: 'none',
        duration: 1000,
        mask: true
      })
    })
  },

  // 服务费支付
  orderservicePay: function () {
    var id = this.data.id
    var that = this
    var data = {
      orderid: id
    }
    wx.showLoading({
      title: '支付中...',
    }) //加载中
    app.Post(ut.api.sorder_servicefeepay, data).then((res) => {
      console.log(res)
      wx.hideLoading() //加载完hide加载提示
      wx.requestPayment(
        {
          'timeStamp': res.data.TimeStamp,
          'nonceStr': res.data.NonceStr,
          'package': res.data.Package,
          'signType': res.data.SignType,
          'paySign': res.data.PaySign,
          'success': function (res) {
            console.log(res)
            that.back();
          },
          'fail': function (res) {
            console.log(res)
          },
          'complete': function (res) { }
        })
    }).catch((error) => {
      console.log(error);
      wx.hideLoading() //加载完hide加载提示
      wx.showToast({
        title: error,
        icon: 'none',
        duration: 1000,
        mask: true
      })
    })
  },

  // 取消订单
  orderCancel: function() {
    var that = this
    var id = this.data.id
    wx.showModal({
      title: '信息',
      content: '确定取消订单吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '取消中...',
          }) //加载中

          // var data = {
          //   id: id
          // }
          // app.Post(ut.api.sorder_cancel, data).then((res) => {
          //   console.log(res.data)
          //   wx.hideLoading() //加载完hide加载提示
          //   if (res.data.Code == 0) {
          //     console.log(res.data)
          //     wx.showModal({
          //       title: '信息',
          //       content: '订单取消成功~',
          //       success: function (res) {
          //         if (res.confirm) {
          //           that.back();
          //         } else if (res.cancel) {
          //           that.back();
          //         }
          //       }
          //     })
          //   } else {
          //     var msg = res.data.Message
          //     wx.showModal({
          //       title: '信息',
          //       content: msg,
          //       success: function (res) {
          //         if (res.confirm) {
          //         } else if (res.cancel) {
          //         }
          //       }
          //     })
          //   }
          // }).catch((error) => {
          //   // console.log(error);
          //   wx.hideLoading() //加载完hide加载提示
          //   app.erShow(error); //错误弹框提示
          // });

          wx.request({
            url: app.globalData.baseUrl + 'sorder_cancel&version=10',
            method: 'POST',
            data: {
              id: id
            },
            header: { 'Content-Type': 'application/x-www-form-urlencoded', 'token': wx.getStorageSync('token').Token },
            success: res => {
              console.log(res);
              wx.hideLoading() //加载完hide加载提示
              if (res.data.Code == 0) {
                console.log(res.data)
                wx.showModal({
                  title: '信息',
                  content: '取消订单成功~',
                  success: function (res) {
                    if (res.confirm) {
                      that.back();
                    } else if (res.cancel) {
                      that.back();
                    }
                  }
                })
              } else {
                var msg = res.data.Message
                wx.showModal({
                  title: '信息',
                  content: msg,
                  success: function (res) {
                    if (res.confirm) {
                    } else if (res.cancel) {
                    }
                  }
                })
              }
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
    
  },

  back: function() {
    var ordertype = this.data.ordertyped
    wx.redirectTo({ //跳转上一页并重新加载
      url: '/pages/mine/serviceorderall/serviceorderall?type=' + ordertype,
    })
  },
  // back: function() {
  //   var pages = getCurrentPages();//获取页面栈
  //   // console.log("pages:" + pages)
  //   if (pages.length > 1) {
  //     // console.log("大于1")
  //     //上一个页面实例对象
  //     var prePage = pages[pages.length - 2];
  //     //调用上一个页面的onShow方法
  //     prePage.onShow()
  //     wx.navigateBack({
  //       delta: 1
  //     })
  //   } 
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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