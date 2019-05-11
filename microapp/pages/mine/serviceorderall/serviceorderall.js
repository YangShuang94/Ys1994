const app = getApp()
const ut = require('../../../utils/util.js')

var pageindex = 0;
Page({

    /** 
     * 页面的初始数据
     */
    data: { 
      pendingPaymentServiceOrders: 0, //待付款数
 
      ordertyped: 1, //订单类型
      orderList: [], //放置返回数据的数组
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
      console.log(options);
      
      wx.showLoading({
        title: '加载中...',
      }) //加载中


      var that = this
      var ordertype = options.type;
      console.log(ordertype);
      
      this.setData({
        ordertyped: ordertype,   //页面加载类型  1全部订单 2待付款 3服务中 4已完成
        npage: 0,   //第一次加载，设置1  
        orderList: [],  //放置返回数据的数组  
        isFromList: true,  //第一次加载，设置true  
        nLoading: true,  //把"上拉加载"的变量设为true，显示  
        nLoadingComplete: true //把“没有数据”设为false，隐藏  
      })

      this.user_usercenterinfo(); //待付款数

      if (ordertype == 1) {
        this.order_all();   //获取所有订单
      }
      if (ordertype == 2) {
        this.sorder_inpayment();   //获取待付款订单
      }
      if (ordertype == 3) {
        this.sorder_inservice();   //获取所服务中订单
      }
      if (ordertype == 4) {
        this.sorder_completed();   //获取已完成订单
      }
      
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      // var ordertype = this.data.ordertyped
      // if (ordertype == 1) {
      //   this.order_all();   //获取所有订单
      // }
      // if (ordertype == 2) {
      //   this.sorder_inpayment();   //获取待付款订单
      // }
      // if (ordertype == 3) {
      //   this.sorder_inservice();   //获取所服务中订单
      // }
      // if (ordertype == 4) {
      //   this.sorder_completed();   //获取已完成订单
      // }
      // this.user_usercenterinfo(); //待付款数
    },

    /**
   * 生命周期函数--监听页面初次渲染完成
   */
    onReady: function () {
      wx.hideLoading() //数据加载完hide加载提示

      var ordertype = this.data.ordertyped
      if (ordertype == 1) {
        this.order_all();   //获取所有订单
      }
      if (ordertype == 2) {
        this.sorder_inpayment();   //获取待付款订单
      }
      if (ordertype == 3) {
        this.sorder_inservice();   //获取所服务中订单
      }
      if (ordertype == 4) {
        this.sorder_completed();   //获取已完成订单
      }
      this.user_usercenterinfo(); //待付款数
    },

    // 顶部nav点击切换
    choiceTypeOrder: function(e) {
      var corderType = e.currentTarget.dataset.type;
      console.log(corderType);
      wx.redirectTo({
        url: '/pages/mine/serviceorderall/serviceorderall?type=' + corderType,
      })
    },

    // 待付款服务数
    user_usercenterinfo: function() {
      app.Get(ut.api.user_usercenterinfo).then((res) => {
        console.log(res.data)
        this.setData({
          pendingPaymentServiceOrders: res.data.PendingPaymentServiceOrders
        })
      }).catch((error) => {
        console.log(error);
        app.erShow(error); //错误弹框提示
      });
    },

    

    /**
     * 所有订单
     */
    order_all: function() {
      var that = this;
      var npage = that.data.npage;//把第几次加载次数作为参数  
      let data = {
        pageindex: npage
      }
      // wx.showLoading({
      //   title: '加载中...',
      // }) //加载中

      app.Get(ut.api.sorder_all, data).then((res)=>{
        console.log(res.data)
        // wx.hideLoading() //数据加载完hide加载提示
        var datas = res.data.Data;
        if (res.data.Data.length > 0) {
          var searchList = [];
          //如果isFromList是true从data中取出数据，否则先从原来的数据继续添加  
          that.data.isFromList ? searchList = datas : searchList = that.data.orderList.concat(datas);
          that.setData({
            allpageNum: res.data.TotalPage,
            orderList: searchList, //获取数据数组    
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
              loadingsucctext: '暂无订单~',
            });
          }
          that.setData({
            allpageNum: res.data.TotalPage,
            nLoadingComplete: false, //把“没有数据”设为true，显示  
            nLoading: true, //把"上拉加载"的变量设为false，隐藏  
            succnull: false
          });
        }
      }).catch((res)=>{
        // console.log(res);
        // wx.hideLoading() //数据加载完hide加载提示
        app.erShow('获取数据失败')
      })

    },


    /**
     * 待付款订单
     */
    sorder_inpayment: function () {
      var that = this;
      var npage = that.data.npage;//把第几次加载次数作为参数  
      let data = {
        pageindex: npage
      }
      // wx.showLoading({
      //   title: '加载中...',
      // }) //加载中

      app.Get(ut.api.sorder_inpayment, data).then((res) => {
        console.log(res.data)
        // wx.hideLoading() //数据加载完hide加载提示
        var datas = res.data.Data;
        if (res.data.Data.length > 0) {
          var searchList = [];
          //如果isFromList是true从data中取出数据，否则先从原来的数据继续添加  
          that.data.isFromList ? searchList = datas : searchList = that.data.orderList.concat(datas);
          that.setData({
            allpageNum: res.data.TotalPage,
            orderList: searchList, //获取数据数组    
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
              loadingsucctext: '暂无订单~',
            });
          }
          that.setData({
            allpageNum: res.data.TotalPage,
            nLoadingComplete: false, //把“没有数据”设为true，显示  
            nLoading: true, //把"上拉加载"的变量设为false，隐藏  
            succnull: false
          });
        }

      }).catch((res) => {
        // console.log(res);
        // wx.hideLoading() //数据加载完hide加载提示
        app.erShow('获取数据失败')
      })
    },


    /**
     * 服务中订单
     */
    sorder_inservice: function () {
      var that = this;
      var npage = that.data.npage;//把第几次加载次数作为参数  
      let data = {
        pageindex: npage
      }
      // wx.showLoading({
      //   title: '加载中...',
      // }) //加载中

      app.Get(ut.api.sorder_inservice, data).then((res) => {
        console.log(res.data)
        // wx.hideLoading() //数据加载完hide加载提示
        var datas = res.data.Data;
        if (res.data.Data.length > 0) {
          var searchList = [];
          //如果isFromList是true从data中取出数据，否则先从原来的数据继续添加  
          that.data.isFromList ? searchList = datas : searchList = that.data.orderList.concat(datas);
          that.setData({
            allpageNum: res.data.TotalPage,
            orderList: searchList, //获取数据数组    
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
              loadingsucctext: '暂无订单~',
            });
          }
          that.setData({
            allpageNum: res.data.TotalPage,
            nLoadingComplete: false, //把“没有数据”设为true，显示  
            nLoading: true, //把"上拉加载"的变量设为false，隐藏  
            succnull: false
          });
        }

      }).catch((res) => {
        // console.log(res);
        // wx.hideLoading() //数据加载完hide加载提示
        app.erShow('获取数据失败')
      })
    },

    /**
     * 已完成订单
     */
    sorder_completed: function () {
      var that = this;
      var npage = that.data.npage;//把第几次加载次数作为参数  
      let data = {
        pageindex: npage
      }
      // wx.showLoading({
      //   title: '加载中...',
      // }) //加载中

      app.Get(ut.api.sorder_completed, data).then((res) => {
        console.log(res.data)
        // wx.hideLoading() //数据加载完hide加载提示
        var datas = res.data.Data;
        if (res.data.Data.length > 0) {
          var searchList = [];
          //如果isFromList是true从data中取出数据，否则先从原来的数据继续添加  
          that.data.isFromList ? searchList = datas : searchList = that.data.orderList.concat(datas);
          that.setData({
            allpageNum: res.data.TotalPage,
            orderList: searchList, //获取数据数组    
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
              loadingsucctext: '暂无订单~',
            });
          }
          that.setData({
            allpageNum: res.data.TotalPage,
            nLoadingComplete: false, //把“没有数据”设为true，显示  
            nLoading: true, //把"上拉加载"的变量设为false，隐藏  
            succnull: false
          });
        }

      }).catch((res) => {
        // console.log(res);
        // wx.hideLoading() //数据加载完hide加载提示
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

      if (ordertype == 1) {
        this.order_all();   //获取所有订单
      }
      if (ordertype == 2) {
        this.sorder_inpayment();   //获取待付款订单
      }
      if (ordertype == 3) {
        this.sorder_inservice();   //获取所服务中订单
      }
      if (ordertype == 4) {
        this.sorder_completed();   //获取已完成订单
      }

    },


    // 订单支付
    orderPay: function (e) {
      var id = e.currentTarget.dataset.id
      var that = this
      // var ordertype = that.data.ordertyped

      var data = {
        orderid: id
      }
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
              that.back() //刷新当前页面、
              // wx.redirectTo({ //刷新当前页面、
              //   url: '/pages/mine/serviceorderall/serviceorderall?type=' + ordertype,
              // })
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

    // 服务费支付
    orderservicePay: function (e) {
      var id = e.currentTarget.dataset.id
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
    orderCancel: function (e) {
      var that = this
      // var ordertype = that.data.ordertyped
      var id = e.currentTarget.dataset.id
      wx.showModal({
        title: '信息',
        content: '确定取消订单吗？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.baseUrl + 'sorder_cancel&version=10',
              method: 'POST',
              data: {
                id: id
              },
              header: { 'Content-Type': 'application/x-www-form-urlencoded', 'token': wx.getStorageSync('token').Token },
              success: res => {
                console.log(res);
                if (res.data.Code == 0) {
                  console.log(res.data)
                  wx.showModal({
                    title: '信息',
                    content: '取消订单成功~',
                    success: function (res) {
                      if (res.confirm) {
                        that.back() //刷新当前页面、
                        // wx.redirectTo({ //刷新当前页面、
                        //   url: '/pages/mine/serviceorderall/serviceorderall?type=' + ordertype,
                        // })
                      } else if (res.cancel) {
                        that.back() //刷新当前页面、
                        // wx.redirectTo({ //刷新当前页面、
                        //   url: '/pages/mine/serviceorderall/serviceorderall?type=' + ordertype,
                        // })
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

    // 刷新当前页
    back: function () {
      var ordertype = this.data.ordertyped
      wx.redirectTo({ //跳转上一页并重新加载
        url: '/pages/mine/serviceorderall/serviceorderall?type=' + ordertype,
      })
    },


    
 


})