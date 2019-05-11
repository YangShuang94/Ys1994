// pages/mall/commoditydetails/commoditydetails.js 
const app = getApp()
const ut = require('../../utils/util.js')
 
const WxParse = require('../../wxParse/wxParse.js')
 
Page({  
  data: {
    yyHidden: true, //立即预约弹框
    lookHidden: true,// 订单确认成功
    succHidden: true, //预约成功
    //商品信息
    orinGoodMsg: { 
      "good": {
        // "good_sell": "100", 
        // "good_display_img": "https://a3.vimage1.com/upload/merchandise/pdcvis/2017/08/21/142/fb2960bf8e074d029c24315279289c19-5_218x274_70.jpg", 
        // "good_unit": "套", 
        // "good_name": "精细日常保洁", 
        // "good_mark": "人性化家居生活必备，家庭日常收纳用品，简洁大方，实用美观，用料诚意，坚固可靠" 
      }, 
      "goodflowers": [
          // { "flower_name": "朝花夕拾", "flower_id": "11d75c6a560a4345b232706f7642de22", "flower_image": "https://a3.vimage1.com/upload/merchandise/pdcvis/2017/08/21/142/fb2960bf8e074d029c24315279289c19-5_218x274_70.jpg", "good_id": "17", "flower_identity": "" }, 
          // { "flower_name": "美丽相约", "flower_id": "3994afdb0427425d93bbba6e881601c3", "flower_image": "https://a3.vimage1.com/upload/merchandise/pdcvis/2017/08/21/142/fb2960bf8e074d029c24315279289c19-5_218x274_70.jpg", "good_id": "17", "flower_identity": "" }, 
          // { "flower_name": "清水佳人", "flower_id": "3ebc1032eb5d477b9e2bf508918f3d2b", "flower_image": "https://a3.vimage1.com/upload/merchandise/pdcvis/2017/08/21/142/fb2960bf8e074d029c24315279289c19-5_218x274_70.jpg", "good_id": "17", "flower_identity": "" }, 
          // { "flower_name": "意境幽蓝", "flower_id": "425cc030c0574344a62be9674c854ee6", "flower_image": "https://a3.vimage1.com/upload/merchandise/pdcvis/2017/08/21/142/fb2960bf8e074d029c24315279289c19-5_218x274_70.jpg", "good_id": "17", "flower_identity": "" }, 
          // { "flower_name": "出水芙蓉", "flower_id": "4ea02d08e2464ba681e4861451a7a2f7", "flower_image": "https://a3.vimage1.com/upload/merchandise/pdcvis/2017/08/21/142/fb2960bf8e074d029c24315279289c19-5_218x274_70.jpg", "good_id": "17", "flower_identity": "" }
      ], 
    },

    good: {}, //商品
    // mainImg: '', //主图
    goodPrice: 59.9, //商品价格
    goodOrinPrice: 59,
    goodflowers: [],
    imgUrls: [], //轮播图
    chooseFlowers: [], //选中的 
    // ====== 轮播设置
    // indicatorDots: true,
    // autoplay: true,
    // interval: 5000,
    // duration: 200,
    // 轮播设置 ======
    // flowerImgSelect: '', //选中的图片
    flowerNameSelect: "",//
    flowerSelect: 0, //判断是否选中
    isHidden: 0,
    animationData: {}, //选择动画
    showModalStatus: false,//显示遮罩
    goodNum: 1,//商品数量
    select: 0,//商品详情、参数切换

    current: 0, //轮播图当前索引


    timeList: [
      { "time_name": "7:00", "time_id": "1" }, 
      { "time_name": "8:00", "time_id": "2" }, 
      { "time_name": "9:00", "time_id": "3" }, 
      { "time_name": "10:00", "time_id": "4" }, 
      { "time_name": "11:00", "time_id": "5" }, 
      { "time_name": "12:00", "time_id": "6" }, 
      { "time_name": "13:00", "time_id": "7" }, 
      { "time_name": "14:00", "time_id": "8" }, 
      { "time_name": "15:00", "time_id": "9" }, 
    ], //时间列表
    timeIsHidden: 0, //隐藏显示选择时间
    showTimeModalStatus: false, //显示选择时间遮罩
    timeNameSelect: "",

    serviceDetails: [], //服务详情数据
    name: "",
    phone: "",
    address: "",

    paydata:{},


  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    console.log(options.id);
    this.setData({
      id:options.id
    })
    
    var that = this;
    if (wx.showLoading) {
      wx.showLoading({
        title: '加载中',
      })
    }

    // title
    wx.setNavigationBarTitle({
      title: options._title
    })

    var data = that.data.orinGoodMsg;//写死的商品信息
    var goodBaseMsg = data.good;//商品基本信息
    var goodflowersMsg = data.goodflowers;//商品花色信息
    var swiperAy = [];//轮播图

    for (var i = 0; i < goodflowersMsg.length; i++) {
      var jo = {
        flower_image: goodflowersMsg[i].flower_image,
        flower_id: goodflowersMsg[i].flower_id,
      }

      swiperAy.push(jo);
    };
    that.setData({//商品
      // mainImg: goodBaseMsg.good_display_img,
      // flowerImgSelect: goodBaseMsg.good_display_img,
      good: goodBaseMsg,
      goodflowers: goodflowersMsg,
      imgUrls: swiperAy,

    });


    app.Get(ut.api.service_detail +
      '&appid=' + app.globalData.appId +
      '&id=' + options.id).then((res) => {
        // console.log(res)
      if (res.Code == 0) {
        console.log(res.data)
        
        that.setData({//商品
          serviceDetails: res.data
        });
        var article = res.data.Notice //服务说明
        WxParse.wxParse('article', 'html', article, that, 0);

        var lcarticle = res.data.ServiceFlow //服务流程
        WxParse.wxParse('lcarticle', 'html', lcarticle, that, 0);

        var orarticle = res.data.OrderNotice //下单须知
        WxParse.wxParse('orarticle', 'html', orarticle, that, 5);
        
      } else {
        wx.showToast({
          title: res.Message,
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }
    }).catch((error) => {
      console.log(error);
      wx.showToast({
        title: error,
        icon: 'none',
        duration: 1000,
        mask: true
      })
    })

    if (wx.hideLoading()) {
      wx.hideLoading()
    }
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




  // banner轮播当前索引
  swiperchange: function (e) {
    this.setData({
      current: e.detail.current
    });
  },

  /**选择花色 */
  chooseFlower: function (data) {
    var that = this;
    var flower_id = data.currentTarget.dataset.select;
    var flower_name = data.currentTarget.dataset.flowerName;

    that.setData({//把选中值，放入判断值中
      flowerNameSelect: flower_name,
      flowerSelect: flower_id
    })
    var str = flower_id + ',' + flower_name;
    var chooseFlowers = that.data.chooseFlowers;
    chooseFlowers = [];
    chooseFlowers.push(str);
    that.setData({
      chooseFlowers: chooseFlowers,
      // flowerImgSelect: data.currentTarget.dataset.img
    })
  },
  /**点击选择按钮、显示页面 */
  viewChoose: function (data) {
    var that = this;
    var animation = wx.createAnimation({//动画
      duration: 500,//动画持续时间
      timingFunction: 'linear',//动画的效果 动画从头到尾的速度是相同的
    })
    animation.translateY(0).step()//在Y轴偏移tx，单位px

    this.animation = animation
    that.setData({
      showModalStatus: true,//显示遮罩       
      animationData: animation.export()
    })
    that.setData({//把选中值，放入判断值中
      isHidden: 1,
    })
  },
  /**隐藏选择区块 */
  hideModal: function (data) {
    var that = this;
    that.setData({//把选中值，放入判断值中
      showModalStatus: false,//显示遮罩       
      isHidden: 0,
    })
  },
  goodAdd: function (data) {
    var that = this;
    var goodCount = that.data.goodNum + 1;
    that.setData({//商品数量+1
      goodNum: goodCount
    })
  },
  goodReduce: function (data) {
    var that = this;
    var goodCount = that.data.goodNum - 1;
    that.setData({//商品数量+1
      goodNum: goodCount
    })
  },



  /**点击选择时间按钮、显示页面 */
  viewTimeChoose: function (data) {
    var that = this;
    that.setData({
      showTimeModalStatus: true,//显示遮罩       
    })
    that.setData({//把选中值，放入判断值中
      timeIsHidden: 1,
    })
  },
  /**隐藏选择时间区块 */
  timehideModal: function (data) {
    var that = this;
    that.setData({//把选中值，放入判断值中
      showTimeModalStatus: false,//显示遮罩       
      timeIsHidden: 0,
    })
  },
  /**选择时间 */
  chooseTime: function (data) {
    var that = this;
    var time_id = data.currentTarget.dataset.select;
    var time_name = data.currentTarget.dataset.flowerName;

    that.setData({//把选中值，放入判断值中
      timeNameSelect: time_name,
      timeSelect: time_id
    })
  },
  
  
  
  /**
   * 查看轮播图片
   */
  seeSwiperAll: function (e) {
    this.seePreviewImg(0, e.currentTarget.dataset.img)
  },
  /**
* 查看花色图片 
* */
  // seeFlowersAll: function (e) {
  //   this.seePreviewImg(1, e.currentTarget.dataset.img)
  // },
  /**
   * 预览图片
   * 
   * 
   * @pd 0表示轮播图 、 1表示花色
   */
  seePreviewImg: function (pd, showImg) {
    var array = [];
    var that = this;
    if (pd == 0) {
      var imgArray = that.data.serviceDetails.Pics;
      for (var i = 0; i < imgArray.length; i++) {
        array.push(imgArray[i])
      }
    } else if (pd == 1) {
      var imgArray = that.data.imgArray;
      for (var i = 0; i < imgArray.length; i++) {
        array.push(imgArray[i].url)
      }
    }

    wx.previewImage({
      current: showImg, // 当前显示图片的http链接
      urls: array // 需要预览的图片http链接列表
    })
  },



  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  addressInput: function (e) {
    this.setData({
      address: e.detail.value
    })
  },


  // 立即预约弹框显示
  yyShow: function () {

    this.setData({
      yyHidden: false
    });
  },
  // 立即预约弹框隐藏
  yyCancel: function () {
    this.setData({
      yyHidden: true
    });
  },
  // 订单确认成功弹框显示
  lookShow: function () {
    this.setData({
      yyHidden: true,
      lookHidden: false
    });
  },
  // 订单确认成功弹框隐藏
  lookCancel: function () {
    this.setData({
      lookHidden: true
    });
  },

  // 确定订单
  sureOrder:function(){
    var that = this
    // var serPrice = that.data.serviceDetails.Price
    // console.log(that.data.serviceDetails)
    // var telRule = /^1[3|4|5|7|8|9]\d{9}$/
    // if (!that.data.name) {
    //   wx.showToast({
    //     title: "请输入联系人姓名",
    //     icon: 'none',
    //     duration: 1000,
    //     mask: true
    //   })
    //   return false;
    // }
    // if (!that.data.phone) { 
    //   wx.showToast({
    //     title: "请输入联系电话",
    //     icon: 'none',
    //     duration: 1000,
    //     mask: true
    //   })
    //   return false;
    // }
    // if (!telRule.test(that.data.phone)) {
    //   wx.showToast({
    //     title: "请输入正确的手机号",
    //     icon: 'none',
    //     duration: 1000,
    //     mask: true
    //   })
    //   return false;
    // }
    // if (!that.data.address) {
    //   wx.showToast({
    //     title: "请输入楼栋地址",
    //     icon: 'none',
    //     duration: 1000,
    //     mask: true
    //   })
    //   return false;
    // }
    that.setData({
      yyHidden: true,
      lookHidden: false
    });
    var address = {
      name: that.data.name,
      tel: that.data.phone,
      address: that.data.address
    }
    var data = {
      id: that.data.serviceDetails.Id,
      storeId: 2,
      count: 1,
      address: JSON.stringify(address)
    }
    app.Post(ut.api.sorder_create, data).then((res) => {
      console.log(res)
      if (res.Code == 0) {
        app.seShow('订单确认成功')
        console.log(res.data)
        that.setData({
          paydata : res.data
        })
        // console.log(res.data)
        // if (serPrice == 0) { //服务价格为0直接预约成功
        //   that.setData({
        //     // yyHidden: true,
        //     succHidden: false,
        //   });
        // } else { //服务价格不为0要先去支付服务费
        //   that.setData({
        //     lookHidden:true
        //   })
        //   that.orderPay(res.data)
        // }
        // that.setData({
        //   yyHidden: true,
        //   // succHidden: false
        // });
      } else {
        wx.showToast({
          title: res.Message,
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }
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
  // 立即预约
  yysucc: function () {
    // var that = this
    // var serPrice = that.data.serviceDetails.Price
    // var telRule = /^1[3|4|5|7|8|9]\d{9}$/
    // if (!that.data.name) {
    //   wx.showToast({
    //     title: "请输入联系人姓名",
    //     icon: 'none',
    //     duration: 1000,
    //     mask: true
    //   })
    //   return false;
    // }
    // if (!that.data.phone) { 
    //   wx.showToast({
    //     title: "请输入联系电话",
    //     icon: 'none',
    //     duration: 1000,
    //     mask: true
    //   })
    //   return false;
    // }
    // if (!telRule.test(that.data.phone)) {
    //   wx.showToast({
    //     title: "请输入正确的手机号",
    //     icon: 'none',
    //     duration: 1000,
    //     mask: true
    //   })
    //   return false;
    // }
    // if (!that.data.address) {
    //   wx.showToast({
    //     title: "请输入楼栋地址",
    //     icon: 'none',
    //     duration: 1000,
    //     mask: true
    //   })
    //   return false;
    // }
    
    // var address = {
    //   name: that.data.name,
    //   tel: that.data.phone,
    //   address: that.data.address
    // }
    // var data = {
    //   id: that.data.serviceDetails.Id,
    //   storeId: 2,
    //   count: 1,
    //   address: JSON.stringify(address)
    // }
    // app.Post(ut.api.sorder_create, data).then((res) => {
    //     console.log(res)
    //     if (res.Code == 0) {
    //       console.log(res.data)
    //       if (serPrice == 0) { //服务价格为0直接预约成功
    //         that.setData({
    //           // yyHidden: true,
    //           succHidden: false,
    //         });
    //       } else { //服务价格不为0要先去支付服务费
    //         that.setData({
    //           lookHidden:true
    //         })
    //         that.orderPay(res.data)
    //       }
    //       that.setData({
    //         yyHidden: true,
    //         // succHidden: false
    //       });
    //     } else {
    //       wx.showToast({
    //         title: res.Message,
    //         icon: 'none',
    //         duration: 1000,
    //         mask: true
    //       })
    //     }
    //   }).catch((error) => {
    //     console.log(error);
    //     wx.showToast({
    //       title: error,
    //       icon: 'none',
    //       duration: 1000,
    //       mask: true
    //     })
    //   })
    console.log(this.data.paydata)
    this.orderPay(this.data.paydata)
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
            that.setData({
              // yyHidden: true,
              succHidden: false
            });
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

  // 预约成功弹框隐藏
  succHiddenCancel: function () {
    this.setData({
      succHidden: true,
      lookHidden:true
    });
  },

  onShow: function() {
   
  },



})