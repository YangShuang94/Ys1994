const app = getApp()
const ut = require('../../utils/util.js')

// pages/servicenav/servicenav.js
Page({ 

    /**
     * 页面的初始数据
     */
    data: {
      categoryId: 0,//地址栏传的服务列表类型id
      list: [], //放置返回数据的数组
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
      var that = this

      // title
      wx.setNavigationBarTitle({
        title: options._title
      })

      var categoryId = options.CategoryId

      this.setData({
        categoryId: categoryId, //地址栏传的服务列表类型id
        npage: 0,   //第一次加载，设置1  
        list: [],  //放置返回数据的数组  
        isFromList: true,  //第一次加载，设置true  
        nLoading: true,  //把"上拉加载"的变量设为true，显示  
        nLoadingComplete: true //把“没有数据”设为false，隐藏  
      })

      this.seList();   //获取所有订单
      
    },

    /**
     * 服务列表
     */
    seList: function () {
      var that = this;
      var npage = that.data.npage;//把第几次加载次数作为参数  
      let data = {
        pageindex: npage,
        category: that.data.categoryId
      }
      app.Get(ut.api.seList, data).then((res) => {
        console.log(res.data)
        var datas = res.data.Data;
        if (res.data.Data.length > 0) {
          var searchList = [];
          //如果isFromList是true从data中取出数据，否则先从原来的数据继续添加  
          that.data.isFromList ? searchList = datas : searchList = that.data.list.concat(datas);
          that.setData({
            allpageNum: res.data.TotalPages,
            list: searchList, //获取数据数组    
            //nLoading: true   //把"上拉加载"的变量设为false，显示  
          });
          if (that.data.npage == res.data.TotalPage) {
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
          }
          if (that.data.npage <= 0) {
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


      }).catch((res) => {
        // console.log(res);
        app.erShow('获取数据失败')
      })

    },

    //滚动到底部触发事件  
    nScrollLower: function () {
      var that = this;

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

      this.seList();   //获取所有订单

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
	

})