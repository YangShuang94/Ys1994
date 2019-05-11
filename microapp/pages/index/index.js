//index
//获取应用实例
const app = getApp()
const ut = require('../../utils/util.js')

Page({
  data: {
    bannerImages: [], //banner
    // current: 0, //轮播图当前索引
    
    longitude: 116.4965075,
    latitude: 40.006103,
    speed: 0,
    accuracy: 0,

    listdata: [], //服务数据列表
    micdata: [], //商户店铺列表
    merStoreName: '', //商户店铺名字
    merchantHidden: true, //选择商户店铺弹框显示或隐藏
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    wx.showLoading({
      title: '',
    }) //加载中

    var that = this;

    //首页服务数据列表
    this.getSeHome()

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    that.bannerList() //banner图


    wx.getSetting({
      success: (res) => {
        console.log(res);
        console.log(res.authSetting['scope.userLocation']);
        if (res.authSetting['scope.userLocation'] == true) {
          // that.getMchStores(log, lat) // 获取商户店铺列表
          that.village_LBS(that);
        }
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则将无法定位商家',
            success: function(res) {
              if (res.cancel) {
                // console.info("1授权失败返回数据");
                that.getMchStores02() // 获取商户店铺列表

              } else if (res.confirm) {
                //village_LBS(that);
                wx.openSetting({
                  success: function(data) {
                    console.log(data);
                    if (data.authSetting["scope.userLocation"] == true) {
                      //授权成功  再次授权，调用getLocationt的API
                      that.village_LBS(that);
                    } else {
                      // 授权失败
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) { //初始化进入
          that.village_LBS(that);
        }
      }
    })


  },

  onReady: function() {
    var that = this;

  },

  /**
   * 分享
   */
  onShareAppMessage: function() {
    var currentUrl = this.route
    var sharePath = currentUrl
    var isAgent = wx.getStorageSync('token').IsAgent
    var userId = wx.getStorageSync('token').UserId
    if(isAgent){
      sharePath = 'pages/share/index?id=' + userId +'&url=' + currentUrl
    }
    return {
      path: sharePath,
      success: function(res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

  village_LBS: function(that) {
    //var that = this;
    // ------------ 腾讯LBS地图  --------------------
    var merchantId = wx.getStorageSync("merchantStoreId");
    var merchantName = wx.getStorageSync("merchantStoreName");

    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        // 调用接口, 坐标转具体位置 -xxz0717
        console.log(res)
        that.setData({
          loglatinfo: res
        })
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy

        // 获取商户店铺列表
        that.getMchStores(longitude, latitude)

        if (!merchantId) {
          that.setData({
            merchantHidden: false
          })
        } else {
          that.setData({
            merStoreName: merchantName
          })
        }

      },
      //定位失败回调
      fail: function() {
        // 定位失败
        that.getMchStores02() // 获取商户店铺列表
        if (!merchantId) {
          that.setData({
            merchantHidden: false
          })
        } else {
          that.setData({
            merStoreName: merchantName
          })
        }
      },
    })
  },


  /**
   * banner图
   */
  bannerList: function () {
    var that = this
    var data = {
      displayflag: 1
    }
    app.Get(ut.api.product_mallinfo, data).then((res) => {
      console.log(res.data.Banners)
      var datas = res.data.Banners;

      for (var i = 0; i < datas.length; i++) {
        if (datas[i]["LinkType"] == 2) {
          datas[i]["url"] = '../mall/commoditydetails/commoditydetails?id=' + datas[i]["ResourceId"] + '&_title=商品';
        }
        if (datas[i]["LinkType"] == 3) {
          datas[i]["url"] = '../servicedetails/servicedetails?id=' + datas[i]["ResourceId"] + '&_title=服务';
        }
      }

      that.setData({
        bannerImages: datas
      });
    }).catch((error) => {
      // app.erShow('加载失败')
    })
  },

  /**
   * banner跳转页面
   */
  onUrlgo: function (e) {
    var ourl = e.currentTarget.dataset.urls
    wx.navigateTo({
      url: ourl
    })
  },

  //获取首页服务
  getSeHome: function() {
    app.Get(ut.api.seHome).then((res) => {
      console.log(res.data)
      wx.hideLoading() //数据加载完hide加载提示
      this.setData({
        listdata: res.data
      })
    }).catch((error) => {
      // console.log(error);
      wx.hideLoading()
      // app.seShow(error); //错误弹框提示
    });
  },

  /**
   * banner轮播当前索引
   */
  swiperchange: function (e) {
    this.setData({
      current: e.detail.current
    });
  },

  // 获取商户店铺
  getMchStores: function(log, lat) {
    var merId = wx.getStorageSync("merchantStoreId");
    var data = '&longitude=' + log + '&latitude=' + lat

    app.Get(ut.api.merchant_store + data).then((res) => {
      console.log(res);
      var datas = res.data.Data
      for (var a = 0; a < datas.length; a++) {
        if (datas[a]["Id"] == merId) {
          datas[a]["ischecked"] = true;
        }
      }
      this.setData({
        micdata: datas
      })

    }).catch((error) => {
      console.log(error);
      app.erShow(error); //错误弹框提示
    });
  },
  // 获取商户店铺
  getMchStores02: function() {
    var merId = wx.getStorageSync("merchantStoreId");
    // var data = '&longitude=' + log + '&latitude=' + lat
    console.log(this.data.loglatinfo)

    app.Get(ut.api.merchant_store).then((res) => {
      console.log(res);
      var datas = res.data.Data
      for (var a = 0; a < datas.length; a++) {
        if (datas[a]["Id"] == merId) {
          datas[a]["ischecked"] = true;
        }
      }
      this.setData({
        micdata: datas
      })

    }).catch((error) => {
      console.log(error);
      app.erShow(error); //错误弹框提示
    });
  },

  // 选择商户店铺
  choiceMerchant() {
    this.setData({
      merchantHidden: false
    })
  },
  cancelchoiceMerchant() {
    this.setData({
      merchantHidden: true
    })
  },
  radioChange(e) {
    // console.log(e.currentTarget.dataset.mername)
    // console.log(e.currentTarget.dataset.id)
    // console.log(wx.getStorageSync("merchantStoreId"));
    // wx.removeStorageSync('merchantStoreId')
    wx.setStorageSync('merchantStoreId', e.currentTarget.dataset.id);
    wx.setStorageSync('merchantStoreName', e.currentTarget.dataset.mername);
    this.setData({
      merchantHidden: true,
      merStoreName: e.currentTarget.dataset.mername
    })
  },

  /**
   * 取消选择门店
   */
  cancelChoiceStore: function() {
    var merStoreName = this.data.merStoreName
    var micFistname = this.data.micdata[0].Name
    var micFistid = this.data.micdata[0].Id
    // console.log(micFistname)
    if (merStoreName) {
      this.setData({
        merchantHidden: true
      })
    } else {
      wx.setStorageSync('merchantStoreId', micFistid);
      wx.setStorageSync('merchantStoreName', micFistname);
      this.setData({
        merchantHidden: true,
        merStoreName: micFistname
      })
    }
    
  },


})