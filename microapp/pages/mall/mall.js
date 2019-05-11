// pages/mall/mall.js
const app = getApp()
const ut = require('../../utils/util.js')
var pageindex = 0;
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    // banner轮播
    bannerImages: [],
    current: 0, //轮播图当前索引

    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],

    olist: [], //放置返回数据的数组
    isFromList: true,   // 用于判断数据数组是不是空数组，默认true，空的数组 
    allpageNum: 1, //返回数据总页数
    npage: 0,   // 设置加载的第几页，默认是第一页 
    nLoading: false, //"上拉加载"的变量，默认false，隐藏  
    nLoadingComplete: true,  //“没有数据”的变量，默认false，隐藏
    loadingsucctext: '到底了~',//加载完提示语
    succnull: true
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    wx.showLoading({
      title: '',
    }) //加载中

    this.setData({
      npage: 0,   //第一次加载，设置0  
      olist: [],  //放置返回数据的数组  
      isFromList: true,  //第一次加载，设置true  
      nLoading: true,  //把"上拉加载"的变量设为true，显示  
      nLoadingComplete: true //把“没有数据”设为false，隐藏  
    })

    // this.bannerList() //banner图

    // 商品列表
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

            var that = this
            this.getGoods() //获取商品列表
        }
    })
  },

  onShow: function() {
    var merchantStoreName = wx.getStorageSync('merchantStoreName')
    // title
    wx.setNavigationBarTitle({
      title: merchantStoreName
    })

    this.bannerList() //banner图
    
  },

  /**
   * 分享
   */
  onShareAppMessage: function () {
    var currentUrl = this.route
    var sharePath = currentUrl
    var isAgent = wx.getStorageSync('token').IsAgent
    var userId = wx.getStorageSync('token').UserId
    if (isAgent) {
      sharePath = 'pages/share/index?id=' + userId + '&url=' + currentUrl
    }
    return {
      path: sharePath,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

  /**
   * banner图
   */
  bannerList: function() {
    var that = this
    var data = {
      displayflag: 2
    }
    app.Get(ut.api.product_mallinfo, data).then((res) => {
      console.log(res.data.Banners)
      var datas = res.data.Banners;

      for (var i = 0; i < datas.length; i++) {
        if (datas[i]["LinkType"] == 2) {
          datas[i]["url"] = '../mall/commoditydetails/commoditydetails?id=' + datas[i]["ResourceId"]+'&_title=商品';
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
  onUrlgo: function(e) {
    var ourl = e.currentTarget.dataset.urls
    wx.navigateTo({
      url: ourl
    })
  },
  
  /**
   * banner轮播当前索引
   */
  swiperchange: function (e) {
    this.setData({
      current: e.detail.current
    });
  },


  /**
   * 获取商品列表
   */
  getGoods: function () {
    let that = this;
    let npage = that.data.npage;//把第几次加载次数作为参数  
    let data = {
      pageindex: npage
    }

    app.Get(ut.api.goods, data).then((res) => {
      wx.hideLoading() //数据加载完hide加载提示
      console.log(res)
      var datas = res.data.Data;
      if (res.data.Data.length > 0) {
        var searchList = [];
        //如果isFromList是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromList ? searchList = datas : searchList = that.data.olist.concat(datas);

        let col1 = this.data.col1;
        let col2 = this.data.col2;

        //处理商品数据
        for (let i = 0; i < searchList.length; i++) {
          if (i % 2 == 0) {
            col1.push(searchList[i])
          } else {
            col2.push(searchList[i])
          }
        }
        that.setData({
          allpageNum: res.data.TotalPages,
          col1: col1,
          col2: col2,
          olist: searchList, //获取数据数组    
          // nLoading: true   //把"上拉加载"的变量设为false，显示  
        });

        if (that.data.npage == res.data.TotalPages) {
          that.setData({
            nLoadingComplete: false, //把“没有数据”设为true，显示    
            nLoading: true   //把"上拉加载"的变量设为false，隐藏  
          });
        }
      } else {
        if (that.data.npage > 0) {
          that.setData({
            loadingsucctext: '到底了~',
          });
        } else {
          that.setData({
            loadingsucctext: '暂无内容~',
          });
        }
        that.setData({
          allpageNum: res.data.TotalPages,
          nLoadingComplete: false, //把“没有数据”设为true，显示  
          nLoading: true, //把"上拉加载"的变量设为false，隐藏  
          succnull: false
        });
      }


    }).catch((error) => {
      wx.hideLoading() //数据加载完hide加载提示
      console.log(error)
      app.erShow('获取数据失败')
    })
  },


  //滚动到底部触发事件  
  nScrollLower: function () {
    var that = this;
    var ordertype = that.data.ordertyped

    console.log(that.data.npage);
    if (that.data.npage == that.data.allpageNum) {
      that.setData({
        nLoadingComplete: false,
        nLoading: true
      })
      return;
    }

    that.setData({
      npage: that.data.npage + 1,  //每次触发上拉事件，把npage+1  
      isFromList: false  //触发到上拉事件，把isFromList设为为false  
    });

    this.getGoods();   //获取数据

  }

    
	
})