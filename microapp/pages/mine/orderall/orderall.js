const app = getApp()
const ut = require('../../../utils/util.js')

// pages/mine/orderall/orderall.js
Page({ 
    /**
     * 页面的初始数据
     */
    data: {
      pendingPaymentOrders: 0, //待付款订单数

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

      if (ordertype == 1) { 
        this.order_all();   //获取所有订单
      }
      if (ordertype == 2) {
        this.order_nopay();   //获取待付款订单
      }
      if (ordertype == 3) {
        this.order_chuli();   //获取待收货订单
      }
      if (ordertype == 4) {
        this.order_end();   //获取已完成订单
      }

      this.user_usercenterinfo() //待付款数
    },

    onShow: function() {
      this.user_usercenterinfo() //待付款数
    },

    // 顶部nav点击切换
    choiceTypeOrder: function (e) {
      var corderType = e.currentTarget.dataset.type;
      console.log(corderType);
      wx.redirectTo({
        url: '/pages/mine/orderall/orderall?type=' + corderType,
      })
    },

    // 待付款订单数
    user_usercenterinfo: function () {
      app.Get(ut.api.user_usercenterinfo).then((res) => {
        console.log(res.data)
        this.setData({
          pendingPaymentOrders: res.data.PendingPaymentOrders
        })
      }).catch((error) => {
        console.log(error);
        app.erShow(error); //错误弹框提示
      });
    },

    /**
     * 所有订单
     */
    order_all: function () {
      var that = this;
      var npage = that.data.npage;//把第几次加载次数作为参数  
      let data = {
        pageindex: npage
      }
      app.Get(ut.api.order_all, data).then((res) => {
        console.log(res.data)
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
        app.erShow('获取数据失败')
      })
      
    },


    /**
     * 待付款订单
     */
    order_nopay: function () {
      var that = this;
      var npage = that.data.npage;//把第几次加载次数作为参数  
      let data = {
        pageindex: npage
      }
      app.Get(ut.api.order_nopay, data).then((res) => {
        console.log(res.data)
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
        app.erShow('获取数据失败')
      })
    },


    /**
     * 待收货订单
     */
    order_chuli: function () {
      var that = this;
      var npage = that.data.npage;//把第几次加载次数作为参数  
      let data = {
        pageindex: npage
      }
      app.Get(ut.api.order_chuli, data).then((res) => {
        console.log(res.data)
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
        app.erShow('获取数据失败')
      })
    },

    /**
     * 已完成订单
     */
    order_end: function () {
      var that = this;
      var npage = that.data.npage;//把第几次加载次数作为参数  
      let data = {
        pageindex: npage
      }
      app.Get(ut.api.order_end, data).then((res) => {
        console.log(res.data)
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
        this.order_nopay();   //获取待付款订单
      }
      if (ordertype == 3) {
        this.order_chuli();   //获取待收货订单
      }
      if (ordertype == 4) {
        this.order_end();   //获取已完成订单
      }

    },
    

  // 订单支付
  orderPay: function (e) {
    var id = e.currentTarget.dataset.id
    var that = this
    var data = {
      orderid: id
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
            that.back(); //刷新当前页
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

  // 取消订单
  orderCancel: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '信息',
      content: '确定取消订单吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseUrl + 'order_cancel&version=10',
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
                      that.back(); //刷新当前页
                    } else if (res.cancel) {
                      that.back(); //刷新当前页
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

  /**
   * 确认收货
   */
  receipt: function(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '信息',
      content: '确定立即收货吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseUrl + 'order_receipt&version=10',
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
                  content: '成功~',
                  success: function (res) {
                    if (res.confirm) {
                      that.back(); //刷新当前页
                    } else if (res.cancel) {
                      that.back(); //刷新当前页
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
      url: '/pages/mine/orderall/orderall?type=' + ordertype,
    })
  },
  /**
   * 返回上一页
   */
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



})