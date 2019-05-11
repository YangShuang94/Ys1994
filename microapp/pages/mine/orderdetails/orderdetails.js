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
      ordertyped: ordertype,   //页面加载类型  1全部订单 2待付款 3待收货 4已完成
    })
    this.getOrderDetails(id); //详情
  },

  

  // 订单详情
  getOrderDetails: function (obj) {
    var data = {
      id: obj
    }
    wx.showLoading({
      title: '',
    }) //加载中

    app.Get(ut.api.order_info, data).then((res) => {
      console.log(res.data)
      wx.hideLoading() //加载完hide加载提示
      var goodlists = res.data.Items
      var totalExpressPrice = 0
      for (var i = 0; i < goodlists.length; i++) {
        var good = goodlists[i];
        totalExpressPrice += good.ExpressPrice * 1;
      }

      this.setData({
        orderDetails: res.data,
        totalExpressPrice: totalExpressPrice
      })
    }).catch((error) => {
      console.log(error);
      wx.hideLoading() //加载完hide加载提示
      app.seShow(error); //错误弹框提示
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

    app.Post(ut.api.order_pay, data).then((res) => {
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
  orderCancel: function () {
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

          wx.request({
            url: app.globalData.baseUrl + 'order_cancel&version=10',
            method: 'POST',
            data: {
              id: id
            },
            header: { 'Content-Type': 'application/x-www-form-urlencoded', 'token': wx.getStorageSync('token').Token },
            success: res => {
              console.log(res);
              wx.hideLoading() //加载完hide加载提示
              if (res.data.Code == 0) {
                // console.log(res.data)
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
                  content: "订单取消失败",
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

  /**
   * 确认收货
   */
  surereceipt: function (e) {
    var id = this.data.id
    wx.showLoading({
      title: '',
    }) //加载中
    wx.request({
      url: app.globalData.baseUrl + 'order_receipt&version=10',
      method: 'POST',
      data: {
        id: id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync('token').Token
      },
      success: res => {
        wx.hideLoading() //加载完hide加载提示
        if (res.statusCode == 200) {
          if (res.data.Code == 0) {
            // console.log(res.data)
            wx.showModal({
              title: '信息',
              content: '收货成功~',
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
        } else {

        }
      }
    })
  },

  /**
   * 申请退货
   */
  returnApply: function (e) {
    var itemid = e.currentTarget.dataset.id

    wx.showModal({
      title: '信息',
      content: '确定申请退货吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '',
          }) //加载中

          wx.request({
            url: app.globalData.baseUrl + 'order_itemreturn&version=10',
            method: 'POST',
            data: {
              itemid: itemid,
              // remark: '货物损坏'
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'token': wx.getStorageSync('token').Token
            },
            success: res => {
              wx.hideLoading() //加载完hide加载提示
              if (res.statusCode == 200) {
                if (res.data.Code == 0) {
                  // console.log(res.data)
                  wx.showModal({
                    title: '信息',
                    content: '申请成功~',
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
              } else {

              }
            }
          })

        } else if (res.cancel) {

        }
      }
    })
    
    



  },

  // 刷新当前页
  back: function () {
    var ordertype = this.data.ordertyped
    wx.redirectTo({ //跳转上一页并重新加载
      url: '/pages/mine/orderall/orderall?type=' + ordertype,
    })
  },
  // back: function () {
  //   var pages = getCurrentPages();//获取页面栈
  //   console.log("pages:" + pages)
  //   if (pages.length > 1) {
  //     console.log("大于1")
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