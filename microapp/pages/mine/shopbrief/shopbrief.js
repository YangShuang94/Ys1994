//index.js
//获取应用实例
const app = getApp()
const ut = require('../../../utils/util.js')
const WxParse = require('../../../wxParse/wxParse.js')

var pageindex = 0;
Page({
  data: {
    store_detail: [], //店铺详情

    longitude: 116.4965075,
    latitude: 40.006103,
    speed: 0,
    accuracy: 0,

    // 热销好货
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],

  },
  //事件处理函数
  bindViewTap: function () {

  },
  onLoad: function (options) {
    var that = this
    var storeid = options.id

    // title
    wx.setNavigationBarTitle({
      title: options._title
    })

    this.setData({
      storeid: storeid
    })
    

    wx.showLoading({
      title: "定位中",
      mask: true
    })
    wx.getLocation({
      type: 'gcj02',
      altitude: true,//高精度定位
      //定位成功，更新定位结果
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy

        that.setData({
          longitude: longitude,
          latitude: latitude,
          speed: speed,
          accuracy: accuracy
        })
        console.log(res)
        that.store_detail(storeid)
      },
      //定位失败回调
      fail: function () {
        wx.showToast({
          title: "定位失败",
          icon: "none"
        })
      },

      complete: function () {
        //隐藏定位中信息进度
        wx.hideLoading()
      }

    })


    // 热销好货
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });

        this.store_detail_list(storeid)
      }
    })


  },

  /**
   * 店铺详情
   */
  store_detail: function(obj) {
    var that = this
    var log = this.data.longitude
    var lat = this.data.latitude
    var data = {
      id: obj,
      longitude: log,
      latitude: lat,
    }
    app.Get(ut.api.store_detail, data).then((res) => {
      console.log(res.data);
      that.setData({
        store_detail: res.data,
        isFavorite: res.data.IsFavorite
      })
      var article = res.data.Description //店铺介绍
      WxParse.wxParse('article', 'html', article, that, 0);

    }).catch((error) => {
      console.log(error);
    });
  },

  //商品列表
  store_detail_list: function (obj) {
    var that = this
    var data = {
      id: obj
    }
    app.Get(ut.api.store_detail, data).then((res) => {
      console.log(res.data);
      //商品列表
      let hotProductsdata = res.data.HotProducts

      let col1 = this.data.col1;
      let col2 = this.data.col2;

      //处理商品数据
      for (let i = 0; i < hotProductsdata.length; i++) {
        if (i % 2 == 0) {
          col1.push(hotProductsdata[i])
        } else {
          col2.push(hotProductsdata[i])
        }
      }

      that.setData({
        col1: col1,
        col2: col2,
      })

    }).catch((error) => {
      console.log(error);
    });
  },

  /**
   * 收藏店铺
   */
  likeStore: function () {
    var that = this
    var storeid = this.data.storeid

    var data = {
      storeid: storeid
    }
    console.log(data)
    app.Post(ut.api.store_addfavorite, data).then((res) => {
      console.log(res.data);
      if(res.Code == 0) {
        wx.showToast({
          title: '已收藏~',
          icon: 'none',
          duration: 1000,
          mask: true,
        })

        that.setData({
          isFavorite: true
        })
      } else {
        wx.showToast({
          title: '收藏出错~',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
      }

    }).catch((error) => {
      console.log(error);
    });

  }, 

  /**
   * 移除收藏
   */
  unLikeStore: function () {
    var that = this
    var storeid = this.data.storeid

    var data = {
      storeid: storeid
    }
    app.Post(ut.api.store_removefavorite, data).then((res) => {
      console.log(res.data);
      if (res.Code == 0) {
        wx.showToast({
          title: '已取消~',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
        that.setData({
          isFavorite: false
        })
      } else {
        wx.showToast({
          title: '请求出错~',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
      }

    }).catch((error) => {
      console.log(error);
    });

  },



})
