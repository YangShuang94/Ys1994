// pages/confirmpay/confirmpay.js
const app = getApp()
const ut = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      tolprice: options.tolprice,
      paydata:options.paydata,
      title: options.title
    })
    this.getOrderDetails(this.data.paydata)
    

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
  serpay:function(){
    console.log(this.data.paydata);
    
    this.orderPay(this.data.paydata)
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



  /**
   * 支付
   */
  orderPay: function (obj) {
    var that = this
    var data = {
      orderid: obj
    }
    console.log(data)
    app.Post(ut.api.sorder_pay, data).then((res) => {
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
            wx.navigateTo({
              url:'/pages/mine/serviceorderall/serviceorderall?type=1'
            })
          },
          'fail': function (res) {
            console.log(res)
            wx.navigateTo({
              url:'/pages/mine/serviceorderall/serviceorderall?type=2'
            })
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