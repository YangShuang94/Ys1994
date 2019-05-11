// pages/mine/orderdetails/orderdetails.js
const app = getApp()
const ut = require('../../../utils/util.js')

var info = {}

Page({  

  /**
   * 页面的初始数据
   */
  data: {
    goods:{},           //商品数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    info = wx.getStorageSync("goodInfo");
    wx.removeStorageSync("goodInfo")
    this.setData({
      goods: info
    })

    console.log(info)
  },


  /**
   * 订单支付 -- 购物车
   */
  f_pay: function () {
    let that = this
    var address = {
      name: that.data.goods.address.Name,
      tel: that.data.goods.address.Tel,
      address: that.data.goods.address.City + that.data.goods.address.Address,
    }

    let data = {}
    data.storeid = wx.getStorageSync("merchantStoreId")
    data.address = JSON.stringify(address)
    data.itemids = JSON.stringify(this.data.goods.arrayid)
    // console.log(data)
    // console.log(this.data.choiceAddressinfo)

    wx.request({
      url: app.globalData.baseUrl + 'order_create&version=10',
      method: 'POST',
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync('token').Token
      },
      success: res => {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.Code == 0) {
            let orderId = res.data.data.Id
            that.orderPay(orderId)
            // app.seShow('支付成功')
          } else {
            app.erShow(res.data.Message)
          }
        } else {
          app.erShow('下单失败') 
        }
      }
    })

  },

  /**
   * 支付
   */
  orderPay: function (obj) {
    var that = this
    var data = {
      orderid: obj
    }
    app.Post(ut.api.order_pay, data).then((res) => {
      console.log(res)
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
      wx.showToast({
        title: error,
        icon: 'none',
        duration: 1000,
        mask: true
      })
    })
    // wx.request({
    //   url: app.globalData.baseUrl + 'order_pay&version=10',
    //   method: 'POST',
    //   data: {
    //     orderid: id
    //   },
    //   header: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'token': wx.getStorageSync('token').Token
    //   },
    //   success: res => {
    //     if (res.statusCode == 200) {
    //       console.log(res.data)
    //       // console.log(res.data.note)
    //       if (res.data.Code == 0) {
    //         wx.requestPayment(
    //           {
    //             'timeStamp': res.data.data.TimeStamp,
    //             'nonceStr': res.data.data.NonceStr,
    //             'package': res.data.data.Package,
    //             'signType': res.data.data.SignType,
    //             'paySign': res.data.data.PaySign,
    //             'success': function (res) {
    //               console.log(res)
    //               that.back();
    //             },
    //             'fail': function (res) {
    //               console.log(res)
    //             },
    //             'complete': function (res) { }
    //           })
    //       } else {
    //         app.seShow(res.data.Message)
    //       }
    //     } else {

    //     }
    //   }
    // })
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
})