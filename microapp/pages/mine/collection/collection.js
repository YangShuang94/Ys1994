// pages/mine/collection/collection.js
const app = getApp()
const ut = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 0,
    latitude: 0,
    speed: 0,
    accuracy: 0,

    list: [], //放置返回数据的数组
    // isFromList: true,   // 用于判断数据数组是不是空数组，默认true，空的数组 
    // allpageNum: 1, //返回数据总页数
    // npage: 0,   // 设置加载的第几页，默认是第一页 
    // nLoading: false, //"上拉加载"的变量，默认false，隐藏  
    nLoadingComplete: true,  //“没有数据”的变量，默认false，隐藏
    // loadingsucctext: '到底了~',//加载完提示语
    // succnull: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    this.setData({
      list: [],  //放置返回数据的数组  
      nLoadingComplete: true //把“没有数据”设为false，隐藏  
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    // wx.showLoading({
    //   title: "",
    //   mask: true
    // })
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
        that.store_list();   //获取所有列表
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
        // wx.hideLoading()
      }

    })

  },



  /**
   * 所有列表
   * 
   */
  store_list: function () {
    var that = this;
    var log = this.data.longitude
    var lat = this.data.latitude
    var npage = that.data.npage;//把第几次加载次数作为参数  
    let data = {
      pageindex: npage,
      longitude: log,
      latitude: lat,
    }
    console.log(data)
    app.Get(ut.api.store_favorite, data).then((res) => {
      console.log(res)
      if (res.data) {
        var datas = res.data;
        if (datas.length > 0) {
          var searchList = [];
          //如果isFromList是true从data中取出数据，否则先从原来的数据继续添加  
          that.data.isFromList ? searchList = datas : searchList = that.data.list.concat(datas);
          that.setData({
            list: searchList, //获取数据数组    
          });
        } else {
          that.setData({
            loadingsucctext: '暂无店铺~',
            nLoadingComplete: false, //把“没有数据”设为true，显示  
          });
        }
      } else {
        that.setData({
          loadingsucctext: '暂无店铺~',
          nLoadingComplete: false, //把“没有数据”设为true，显示  
        });
      }

    }).catch((res) => {
      console.log(res);
      app.erShow('获取数据失败')
    })

  },


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


