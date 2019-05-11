// pages/mine/orderall/orderall.js

const app = getApp()
const ut = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    res: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    applyHidden: true,

    orderid: 0,

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
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    });


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

    this.task_info(); //新分配数

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

  sermoney: function (e) {
    this.setData({
      sermoney: e.detail.value
    })
  },
  serremark: function (e) {
    this.setData({
      serremark: e.detail.value
    })
  },


  // 顶部nav点击切换
  choiceTypeOrder: function (e) {
    var corderType = e.currentTarget.dataset.type;
    console.log(corderType);
    wx.redirectTo({
      url: '/pages/mine/serviceorder/serviceorder?type=' + corderType,
    })
  },

  // 新分配数
  task_info: function () {
    app.Get(ut.api.task_info).then((res) => {
      console.log(res.data)
      this.setData({
        newTaskCount: res.data.NewTaskCount
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
    // wx.showLoading({
    //   title: '加载中...',
    // }) //加载中

    app.Get(ut.api.task_all, data).then((res) => {
      console.log(res.data)
      // wx.hideLoading() //数据加载完hide加载提示
      var datas = res.data.Data;
      if (res.data.Data.length > 0) {
        var searchList = [];
        //如果isFromList是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromList ? searchList = datas : searchList = that.data.orderList.concat(datas);
        that.setData({
          allpageNum: res.data.TotalPages,
          orderList: searchList, //获取数据数组    
          //nLoading: true   //把"上拉加载"的变量设为false，显示  
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
        }
        if (that.data.npage <= 0) {
          that.setData({
            loadingsucctext: '暂无订单~',
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
      // wx.hideLoading() //数据加载完hide加载提示
      app.erShow('获取数据失败')
    })

  },


  /**
   * 待接单订单
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

    app.Get(ut.api.task_pending, data).then((res) => {
      console.log(res.data)
      // wx.hideLoading() //数据加载完hide加载提示
      var datas = res.data.Data;
      if (res.data.Data.length > 0) {
        var searchList = [];
        //如果isFromList是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromList ? searchList = datas : searchList = that.data.orderList.concat(datas);
        that.setData({
          allpageNum: res.data.TotalPages,
          orderList: searchList, //获取数据数组    
          //nLoading: true   //把"上拉加载"的变量设为false，显示  
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
        }
        if (that.data.npage <= 0) {
          that.setData({
            loadingsucctext: '暂无订单~',
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
      // wx.hideLoading() //数据加载完hide加载提示
      app.erShow('获取数据失败')
    })
  },


  /**
   * 处理中订单
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

    app.Get(ut.api.task_inprocess, data).then((res) => {
      console.log(res.data)
      // wx.hideLoading() //数据加载完hide加载提示
      var datas = res.data.Data;
      if (res.data.Data.length > 0) {
        var searchList = [];
        //如果isFromList是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromList ? searchList = datas : searchList = that.data.orderList.concat(datas);
        that.setData({
          allpageNum: res.data.TotalPages,
          orderList: searchList, //获取数据数组    
          //nLoading: true   //把"上拉加载"的变量设为false，显示  
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
        }
        if (that.data.npage <= 0) {
          that.setData({
            loadingsucctext: '暂无订单~',
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

    app.Get(ut.api.task_completed, data).then((res) => {
      console.log(res.data)
      // wx.hideLoading() //数据加载完hide加载提示
      var datas = res.data.Data;
      if (res.data.Data.length > 0) {
        var searchList = [];
        //如果isFromList是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromList ? searchList = datas : searchList = that.data.orderList.concat(datas);
        that.setData({
          allpageNum: res.data.TotalPages,
          orderList: searchList, //获取数据数组    
          //nLoading: true   //把"上拉加载"的变量设为false，显示  
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
        }
        if (that.data.npage <= 0) {
          that.setData({
            loadingsucctext: '暂无订单~',
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
      return false;
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


  /**
   * 接单
   */
  orderConfirm: function (e) {
    var that = this
    // var ordertype = that.data.ordertyped
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '信息',
      content: '确定接受该订单吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseUrl + 'task_confirm&version=10',
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
                  content: '接单成功~',
                  success: function (res) {
                    if (res.confirm) {
                      that.back() //刷新当前页面、
                    } else if (res.cancel) {
                      that.back() //刷新当前页面、
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
   * 服务定价
   */
  serviceConfirm: function (e) {
    var that = this
    var id = that.data.orderid
    // var id = e.currentTarget.dataset.id
    var sermoney = that.data.sermoney
    var serremark = that.data.serremark

    if (!sermoney) {
      wx.showToast({
        title: "请输入服务费",
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    
    wx.request({
      url: app.globalData.baseUrl + 'task_confirmservice&version=10',
      method: 'POST',
      data: {
        id: id,
        servicefee: sermoney, //服务费
        remark: serremark
      },
      header: { 'Content-Type': 'application/x-www-form-urlencoded', 'token': wx.getStorageSync('token').Token },
      success: res => {
        console.log(res);
        if (res.data.Code == 0) {
          console.log(res.data)
          wx.showModal({
            title: '信息',
            content: '操作成功~',
            success: function (res) {
              if (res.confirm) {
                that.back() //刷新当前页面、
              } else if (res.cancel) {
                that.back() //刷新当前页面、
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

  },


  // 刷新当前页
  back: function () {
    var ordertype = this.data.ordertyped
    wx.redirectTo({ //跳转上一页并重新加载
      url: '/pages/mine/serviceorder/serviceorder?type=' + ordertype,
    })
  },


  // 接单弹框显示
  getClick: function (e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      applyHidden: false,
      orderid: id
    });
  },
  // 接单弹框隐藏
  getCancel: function () {
    this.setData({
      applyHidden: true
    });
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