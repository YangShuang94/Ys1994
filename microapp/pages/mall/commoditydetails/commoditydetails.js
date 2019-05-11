const app = getApp()
const ut = require('../../../utils/util.js')
const WxParse = require('../../../wxParse/wxParse.js')

// pages/mall/commoditydetails/commoditydetails.js
//加入购物车数据
var info = {
    count: 1,
    color:0, 
    version:0,
    productId:0,
    versionname:"",
    colorname:"",
}
Page({
    data: {
        //商品信息，假装请求到的信息
        orinGoodMsg: {
            "good": {
                // "good_sell": "100",
                // "good_display_img": "https://a3.vimage1.com/upload/merchandise/pdcvis/2017/08/21/142/fb2960bf8e074d029c24315279289c19-5_218x274_70.jpg",
                // "good_unit": "套",
                // "good_name": "绚彩活性棉提花四件套",
                // "good_mark": "人性化家居生活必备，家庭日常收纳用品，简洁大方，实用美观，用料诚意，坚固可靠"
            },
            "goodflowers": [
            //   {
            //     "flower_name": "朝花夕拾",
            //     "flower_id": "11d75c6a560a4345b232706f7642de22",
            //     "flower_image": "https://a3.vimage1.com/upload/merchandise/pdcvis/2017/08/21/142/fb2960bf8e074d029c24315279289c19-5_218x274_70.jpg",
            //     "good_id": "17",
            //     "flower_identity": ""
            // },
            // {
            //     "flower_name": "美丽相约",
            //     "flower_id": "3994afdb0427425d93bbba6e881601c3",
            //     "flower_image": "https://a3.vimage1.com/upload/merchandise/pdcvis/2017/08/21/142/fb2960bf8e074d029c24315279289c19-5_218x274_70.jpg",
            //     "good_id": "17",
            //     "flower_identity": ""
            // },
            // {
            //     "flower_name": "清水佳人",
            //     "flower_id": "3ebc1032eb5d477b9e2bf508918f3d2b",
            //     "flower_image": "https://a3.vimage1.com/upload/merchandise/pdcvis/2017/08/21/142/fb2960bf8e074d029c24315279289c19-5_218x274_70.jpg",
            //     "good_id": "17",
            //     "flower_identity": ""
            // },
            // {
            //     "flower_name": "意境幽蓝",
            //     "flower_id": "425cc030c0574344a62be9674c854ee6",
            //     "flower_image": "https://a3.vimage1.com/upload/merchandise/pdcvis/2017/08/21/142/fb2960bf8e074d029c24315279289c19-5_218x274_70.jpg",
            //     "good_id": "17",
            //     "flower_identity": ""
            // },
            // {
            //     "flower_name": "出水芙蓉",
            //     "flower_id": "4ea02d08e2464ba681e4861451a7a2f7",
            //     "flower_image": "https://a3.vimage1.com/upload/merchandise/pdcvis/2017/08/21/142/fb2960bf8e074d029c24315279289c19-5_218x274_70.jpg",
            //     "good_id": "17",
            //     "flower_identity": ""
            // }
            ],
        },

        good: {}, //商品
        mainImg: '', //主图
        goodPrice: 59.9, //商品价格
        goodOrinPrice: 59,
        goodflowers: [],
        imgUrls: [], //轮播图
        chooseFlowers: [], //选中的花色
        // ====== 轮播设置
        // indicatorDots: true,
        // autoplay: true,
        // interval: 5000,
        // duration: 200,
        // 轮播设置 ======
        // flowerImgSelect: '', //选中的花色图片
        flowerNameSelect: "", //
        colorNameSelect:"",
        flowerSelect: 0, //判断是否选中
        colorSelect: 0, //判断是否选中
        isHidden: 0,
        animationData: {}, //选择动画
        showModalStatus: false, //显示遮罩
        goodNum: 1, //商品数量
        select: 0, //商品详情、参数切换

        current: 0, //轮播图当前索引

        shareHidden: true, //分享弹框
        shareproHidden: true, //分享二维码
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) { 
        var that = this;
        if (wx.showLoading) {
            wx.showLoading({
                title: '加载中',
            })
        }

        console.log(options._title)
        // title
        wx.setNavigationBarTitle({
          title: options._title
        })

        info.productId = options.id;
        console.log(info)

        if (wx.getStorageSync('token').Token) {
          this.carItemCount() //购物车总数
        }

        //获取商品详情
        this.getInfo(that, info.productId)

        var data = that.data.orinGoodMsg; //写死的商品信息
        var goodBaseMsg = data.good; //商品基本信息
        var goodflowersMsg = data.goodflowers; //商品花色信息
        var swiperAy = []; //轮播图

        for (var i = 0; i < goodflowersMsg.length; i++) {
            var jo = {
                flower_image: goodflowersMsg[i].flower_image,
                flower_id: goodflowersMsg[i].flower_id,
            }
            swiperAy.push(jo);
        };
        that.setData({ //商品
            // mainImg: goodBaseMsg.good_display_img,
            // flowerImgSelect: goodBaseMsg.good_display_img,
            good: goodBaseMsg,
            goodflowers: goodflowersMsg,
            imgUrls: swiperAy,
        });
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

    /**
     * 去购物车
     */
    goShopCart: function() {
      wx.reLaunch({
        url: "/pages/shopcart/shopcart"
      })
    },

    /**
     * 获取商品详情
     */
    getInfo: function (that, goodsId) {
        let data = {
            productid: goodsId
        }
        app.Get(ut.api.goodsInfo, data).then((res) => {
          console.log(res.data)
          that.setData({
            orinGoodMsg: res.data,
          })

          info.versionname = res.data.Version[0] //默认选择的花色
          info.colorname = res.data.Color[0] //默认选择的颜色
          this.setData({
            flowerNameSelect:info.versionname,
            colorNameSelect:info.colorname,
          })
          console.log(res.data.Version[0],res.data.Color[0]);
          
          var article = res.data.Notice //质保多久
          WxParse.wxParse('article', 'html', article, that, 0);

          var lcarticle = res.data.ExpressDescription //服务流程
          WxParse.wxParse('lcarticle', 'html', lcarticle, that, 0);
        }).catch((er) => {
            console.log(er);
        });
    },

    // banner轮播当前索引
    swiperchange: function (e) {
        this.setData({
            current: e.detail.current
        });
    },

    /**选择花色 */
    chooseFlower: function (data) {
      var that = this
      // info[data.currentTarget.id] = data.currentTarget.dataset.select
      info.version = data.currentTarget.dataset.select
      info.versionname = data.currentTarget.dataset.name
      that.setData({ //把选中值，放入判断值中
        flowerNameSelect: data.currentTarget.dataset.name,
        flowerSelect: data.currentTarget.dataset.select
      })
      console.log(info);
    },
    /**选择颜色 */
    chooseColor: function (data) {
      var that = this
      // info[data.currentTarget.id] = data.currentTarget.dataset.select
      info.color = data.currentTarget.dataset.select
      info.colorname = data.currentTarget.dataset.name
      that.setData({ //把选中值，放入判断值中
        colorNameSelect: data.currentTarget.dataset.name,
        colorSelect: data.currentTarget.dataset.select
      })

      console.log(info);
    },
    /**
     * 点击选择花色按钮、显示页面
     */
    viewFlowerArea: function (data) {
        var that = this;
        var type = data.currentTarget.dataset.value

        var animation = wx.createAnimation({ //动画
            duration: 500, //动画持续时间
            timingFunction: 'linear', //动画的效果 动画从头到尾的速度是相同的
        })
        animation.translateY(0).step() //在Y轴偏移tx，单位px

        this.animation = animation
        that.setData({
          clicktype: type, //点击的是那个选择按钮 选择  加入购物车 or 立即购买
          showModalStatus: true, //显示遮罩       
          animationData: animation.export()
        })
        that.setData({ //把选中值，放入判断值中
            isHidden: 1,
        })
    },
    viewFlowerArea02: function (data) {
      var that = this;
      
      that.setData({
        showModalbuyStatus: true, //显示遮罩     
      })
      that.setData({ //把选中值，放入判断值中
        isHiddenbuy: 1,
      })
    },
    /**隐藏选择花色区块 */
    hideModal: function (data) {

        var that = this;
        that.setData({ //把选中值，放入判断值中
            showModalStatus: false, //显示遮罩       
            isHidden: 0,
        })

    },
    hideModalbuy: function (data) {

      var that = this;
      that.setData({ //把选中值，放入判断值中
        showModalbuyStatus: false, //显示遮罩       
        isHiddenbuy: 0,
      })

    },
    goodAdd: function (data) {
        var that = this;
        var goodCount = that.data.goodNum + 1;
        info.count = goodCount
        //增加商品数量
        //this.aCount(that,1)
        that.setData({ //商品数量+1
            goodNum: goodCount
        })

    },
    goodReduce: function (data) {
        if (info.count == 1) {
            app.erShow('数量不能小于1')
            return false
        }
        var that = this;
        var goodCount = that.data.goodNum - 1;
        info.count = goodCount
        //减少商品数量
        //this.reCount(that,3)

        that.setData({ //商品数量+1
            goodNum: goodCount
        })

    },
    /**
     * 加入购物车
     */
    addCart: function (data) {
        var that = this;
        var thatData = that.data;
        var ja = thatData.chooseFlowers; //选中的花色id
        var good_id = thatData.good.good_id; //good_id
        var good_name = thatData.good.good_name; //good_name
        var gn = thatData.goodNum; //数量
        var good_price = thatData.goodPrice; //价格
        
        // var cityCode = thatData.

        this.aCart(that);
        // this.carItemCount();
    },

    /**
     * 生成订单
     */
    // saveOrder: function (data) {
    //     var that = this;
    //     var thatData = that.data;
    //     var ja = thatData.chooseFlowers; //选中的花色
    //     var good_id = thatData.good.good_id; //good_id
    //     var good_name = thatData.good.good_name; //good_name
    //     var gn = thatData.goodNum; //数量
    //     var good_price = thatData.goodPrice; //价格v
    //     var goodDisplayImg = thatData.mainImg; //主图

    //     if (ja.length > 0) {
    //         wx.showToast({
    //             title: '成功！',
    //             duration: 2000,
    //         })
    //     } else {
    //         wx.showToast({
    //             title: '您还没有选择哦~',
    //             duration: 2000,

    //         })

    //     }
    // },
    /**
     * 查看轮播图片
     */
    seeSwiperAll: function (e) {
        this.seePreviewImg(0, e.currentTarget.dataset.img)
    },
    /**
     * 查看类型图片 
     * */
    seeFlowersAll: function (e) {
        this.seePreviewImg(1, e.currentTarget.dataset.img)
    },
    /**
     * 预览图片
     * 
     * 
     * @pd 0表示轮播图 、 1表示类型 
     */
    seePreviewImg: function (pd, showImg) {
        var array = [];
        var that = this;
        if (pd == 0) {
            var imgArray = that.data.orinGoodMsg.BannerImage;
            for (var i = 0; i < imgArray.length; i++) {
                array.push(imgArray[i])
            }
        } else if (pd == 1) {
            var imgArray = that.data.orinGoodMsg.BannerImage;
            for (var i = 0; i < imgArray.length; i++) {
                array.push(imgArray[i])
            }
        }

        wx.previewImage({
            current: showImg, // 当前显示图片的http链接
            urls: array // 需要预览的图片http链接列表
        })
    },

    // 分享弹框显示
    shareClick: function () {
        this.setData({
            shareHidden: false
        });
    },
    // 分享弹框隐藏
    shareCancel: function () {
        this.setData({
            shareHidden: true
        });
    },


    // 生成封面图显示
    shareproClick: function () {
        this.setData({
            shareproHidden: false,
            shareHidden: true,
        });
    },
    // 生成封面图隐藏
    shareproCancel: function () {
        this.setData({
            shareproHidden: true
        });
    },

    /**
     * 立即购买
     */
    pageSkip: function (e) {
      let that = this

      // 是否登录和是否手机号注册
      if (!wx.getStorageSync('token').Token) {
        if (wx.getStorageSync('isRegister') == false) {
          wx.navigateTo({
            url: "/pages/login/loginformsg/loginformsg"
          })
        }
        return false
      }

      let pay_data = info
      pay_data.name = e.currentTarget.dataset.name
      pay_data.price = e.currentTarget.dataset.price
      pay_data.expressprice = e.currentTarget.dataset.expressprice //运费
      pay_data.imgs = e.currentTarget.dataset.imgs
      wx.setStorageSync("info", pay_data);
      that.setData({ //隐藏选择弹框
        isHidden: 0,
        showModalStatus: false
      })
      wx.navigateTo({
        url:  '/pages/mine/orderpay/orderpay',
      })
    },
    /**
     * 加入购物车-提交
     */
    aCart: function (that) {
      let data = info;
      
      app.Post(ut.api.add_cart, data).then((res) => {
        // console.log(res);
          if (res.Code == 0) {

            if (wx.getStorageSync('token').Token) {
              this.carItemCount() //购物车总数
            }
            app.seShow("加入购物车成功");
            that.setData({ //隐藏选择弹框
              isHidden: 0,
              showModalStatus: false
            })
          }
      }).catch((er) => {
          app.seShow("加入购物车失败");
      });
    },

    /**
     * 购物车商品数量加
     */
    aCount: function (that, ct_id) {
        let data = {
            cartitemid: ct_id
        }
        app.Post(ut.api.add_count, data).then((e) => {
            if (res.Code == 0) {
                app.seShow("增加成功");
            }
        }).catch((e) => {

        })
    },

    /**
     * 购物车商品数量加
     */
    reCount: function (that, ct_id) {
        let data = {
            cartitemid: ct_id
        }
        app.Post(ut.api.add_count, data).then((e) => {
            if (res.Code == 0) {
                app.seShow("减少成功");
            }
        }).catch((e) => {

        })
    },


    /**
     * 购物车总数
     */
    carItemCount: function () {
      app.Get(ut.api.cart_count).then((e) => {
        console.log(e)
        if (e.Code == 0) {
          this.setData({
            shopCartNum: e.data
          })
        }
      }).catch((e) => {
      })
    },

})