// pages/mine/orderdetails/orderdetails.js
const app = getApp()
const ut = require('../../../utils/util.js')

var info = {}

Page({   

  /**
   * 页面的初始数据
   */  
  data: { 
    addressHidden: true, //选择地址弹框显示或隐藏
    lookHidden: true, //订单确认成功弹框显示或隐藏
    address: [], //地址
    choiceAddressinfo: {}, //选择的地址
    goods:{},           //商品数据

    isaddress: true, //是否添加地址

    newaddressHidden: true, //新增地址显示隐藏
    paydata: {},
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部'
  },
  // 订单确认成功显示
  lookShow: function () {
    this.setData({
      lookHidden: false
    });
  },
  // 订单确认成功隐藏
  lookCancel: function () {
    this.setData({
      lookHidden: true
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getaddressList() //地址列表
    this.rcvinf_getdefault() //默认地址

    info = wx.getStorageSync("info");
    wx.removeStorageSync("info")
    this.setData({
      goods:info
    })
    console.log(info);

  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    if (wx.getStorageSync('token').Token) {
      this.getaddressList() //地址列表
      this.rcvinf_getdefault() //默认地址

    } else {
      this.isRgisterp()
    }

  },

  /**
 * 是否手机号注册
 */
  isRgisterp: function () {
    if (!wx.getStorageSync('token').Token) {
      if (wx.getStorageSync('isRegister') == false) {
        wx.navigateTo({
          url: "/pages/login/loginformsg/loginformsg"
        })
      } else {
        wx.navigateTo({
          url: "/pages/mine/mine"
        })
      }
    }
  },

  // 选择地址
  choiceAddress() {
    this.setData({
      addressHidden: false
    })
  },
  cancelchoiceAddress() {
    this.setData({
      addressHidden: true
    })
  },
  // 地址列表
  getaddressList: function () {
    var that = this
    app.Get(ut.api.address_list).then((res) => {
      console.log(res.data);
      if (res.data.length <= 0) {
        that.setData({
          isaddress: false //未添加地址
        })
      } else {
        that.setData({
          address: res.data
        })
      }
    }).catch((error) => {
      console.log(error);
    });
  },
  // 获取默认地址
  rcvinf_getdefault: function () {
    var that = this
    app.Get(ut.api.rcvinf_getdefault).then((res) => {
      console.log(res.data);
      that.setData({
        choiceAddressinfo: res.data
      })
    }).catch((error) => {
      console.log(error);
    });
  },
  // 官方api三级城市联动
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  radioChange(e) {
    console.log(e.currentTarget.dataset.info)
    this.setData({
      addressHidden: true,
      choiceAddressinfo: e.currentTarget.dataset.info
    })
  },
  // 确认订单
  sureOrder:function(){
    let that = this
    let data = info
    data.storeid = wx.getStorageSync("merchantStoreId")
    data.address = JSON.stringify(this.data.choiceAddressinfo)
    this.setData({
      lookHidden: false
    });
    wx.request({
      url: app.globalData.baseUrl + 'order_quickcreate&version=10',
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
            // let orderId = res.data.data.Id
            // that.orderPay(orderId)
            that.setData({
              paydata : res.data.data.Id
            })
            app.seShow('订单确认成功')
          } else {
            app.erShow('下单失败')
          }
        } else {
          app.erShow('下单失败')
        }
      }
    })
  },
  /**
   * 订单支付
   */
  f_pay: function () {
    let that = this
    let addresslist = that.data.address
    if (addresslist.length <= 0) {
      app.erShow('请先选择地址')
      return false
    }

    let data = info
    data.storeid = wx.getStorageSync("merchantStoreId")
    data.address = JSON.stringify(this.data.choiceAddressinfo)
    // console.log(data)
    // console.log(this.data.choiceAddressinfo)

    // wx.request({
    //   url: app.globalData.baseUrl + 'order_quickcreate&version=10',
    //   method: 'POST',
    //   data: data,
    //   header: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'token': wx.getStorageSync('token').Token
    //   },
    //   success: res => {
    //     console.log(res)
    //     if (res.statusCode == 200) {
    //       if (res.data.Code == 0) {
    //         let orderId = res.data.data.Id
    //         that.orderPay(orderId)
    //         // app.seShow('支付成功')
    //       } else {
    //         app.erShow('下单失败')
    //       }
    //     } else {
    //       app.erShow('下单失败')
    //     }
    //   }
    // })
    
    this.orderPay(this.data.paydata)
  },

  /**
   * 支付
   */
  orderPay: function (obj) {
    // var id = obj
    // var that = this
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


  name: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  linemobile: function (e) {
    this.setData({
      linemobile: e.detail.value
    })
  },
  city: function (e) {
    this.setData({
      city: e.detail.value
    })
  },
  addressde: function (e) {
    this.setData({
      addressde: e.detail.value
    })
  },

  addNewsaddress: function() {
    this.setData({
      newaddressHidden: false,
      addressHidden: true
    })
  },
  addAddressCancel: function() {
    this.setData({
      newaddressHidden: true
    })
  },

  // 添加地址
  sureadd: function () {
    var that = this
    var telRule = /^1[3|4|5|7|8|9]\d{9}$/
    var name = that.data.name
    var linemobile = that.data.linemobile
    var city = that.data.region
    var address = that.data.addressde
    if (!that.data.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    if (!that.data.linemobile) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    if (!telRule.test(linemobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    if (!that.data.region) {
      wx.showToast({
        title: '请输入城市',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    if (!that.data.address) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }


    var data = {
      name: name,
      tel: linemobile,
      city: city,
      address: address
    }
    var addressdata = {
      Name: name,
      Tel: linemobile,
      City: city,
      Address: address
    }
    wx.showLoading({
      title: '',
    }) //加载中
    
    app.Post(ut.api.address_add, data).then((res) => {
      console.log(res);
      wx.hideLoading() //数据加载完hide加载提示

      if (res.Code == 0) {
        that.setData({
          newaddressHidden: true,
          choiceAddressinfo: addressdata
        })
        console.log(addressdata)
        that.getaddressList() //地址列表
        
      } else {
        wx.showToast({
          title: res.Message,
          icon: 'none',
          duration: 1000,
          mask: true,
        })
      }
    }).catch((error) => {
      console.log(error);
      wx.hideLoading() //数据加载完hide加载提示
      wx.showToast({
        title: error,
        icon: 'none',
        duration: 1000,
        mask: true,
      })
    });

  },





})