
const app = getApp()
const ut = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据 
   */ 
  data: {  
      addAddressHidden: true, //收货地址弹框
      otherAddressHidden: true, //其他地址弹框
      iscart: false, //控制购物车有没有数据
      goodList: [],
      checkAll: true,
      totalCount: 0, 
      totalPrice: 0,
      yhPrice:0,
      //默认地址
      de_add: {
          name: "",
          tel: "",
          add: ""
      },
      // 地址
      addressvalue: "",
      addressList: [],

      addressHidden: true, //选择地址弹框显示或隐藏
      address: [], //地址
      choiceAddressinfo: {}, //选择的地址

      newaddressHidden: true, //新增地址显示隐藏
      region: ['广东省', '广州市', '海珠区'],
      customItem: '全部',
        // city: ['广东省', '广州市', '海珠区']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var that = this;

    if (wx.getStorageSync('token').Token) {
      //获取购物车商品
      this.myCart(that);
      this.getaddressList() //地址列表
      this.rcvinf_getdefault() //默认地址

    } else {
      // this.isRgisterp()
    }
    
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    var merchantStoreName = wx.getStorageSync('merchantStoreName')
    var objlist = wx.getStorageSync('yxcityList')

    // var yxCityCodeList = []
    // for(var i=0;i<objlist.length;i++){
    //   yxCityCodeList.push(objlist[i].cityCode)
    // }
    // this.setData({
    //   yxCityCodeList:yxCityCodeList
    // })
    // console.log(this.data.yxCityCodeList);
    
    
    // title
    wx.setNavigationBarTitle({
      title: merchantStoreName
    })
    
    if (wx.getStorageSync('token').Token) {
      //获取购物车商品
      this.myCart();
      this.getaddressList() //地址列表
      this.rcvinf_getdefault() //默认地址
      this.setData({
        checkAll: false,
        totalCount: 0,
        totalPrice: 0
      })

    } else {
      this.isRgisterp()
    }

  },
  // 官方api三级城市联动
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    
    this.setData({
      region: e.detail.value,      
    })
  },

  /**
 * 是否手机号注册
 */
  isRgisterp: function () {
    if (!wx.getStorageSync('token').Token) {
      if (wx.getStorageSync('isRegister') == false) {
        wx.navigateTo({
          url: "/pages/login/loginformsg/loginformsg"
        })
      } else {
        wx.reLaunch({
          url: "/pages/mine/mine"
        })
      }
    }
  },

  // // 选择其他收货地址显示
  otherAddress: function () {
    this.setData({
      otherAddressHidden: false
    });
  },
  // 选择其他地址隐藏
  otherAddresscancel: function () {
    this.setData({
      otherAddressHidden: true
    });
  },
  // 地址列表
  getaddressList: function () {
    var that = this
    app.Get(ut.api.address_list).then((res) => {
      // console.log(res.data);
      that.setData({
        address: res.data
      })
      
    }).catch((error) => {
      // console.log(error);
      app.erShow(error);
    });
  }, 
  // 获取默认地址
  rcvinf_getdefault: function () {
    var that = this
    app.Get(ut.api.rcvinf_getdefault).then((res) => {
      console.log(res.data);
      that.setData({
        choiceAddressinfo: res.data
      })
    }).catch((error) => {
      // console.log(error);
      app.erShow(error);
    });
  },

  //点击其他地址 
  radioChange(e) {
    this.setData({
      otherAddressHidden: true,
      choiceAddressinfo: e.currentTarget.dataset.info
    })

    if(this.data.yxCityCodeList.indexOf(this.data.choiceAddressinfo.CityCode) == -1){
      this.setData({
        flag : false
      })
    }else{
      this.setData({
        flag : true
      })
    }
    
  },

  /**
   * 删除购物车当前商品`
   */
  deleteList(e) {
    // const index = e.currentTarget.dataset.index;
    let that = this
    let id = e.currentTarget.dataset.id;
    let data = {
      cartitemid: id
    }
    app.Post(ut.api.re_cart, data).then((res) => {
      // console.log(res);
      that.myCart(); //重新加载购物车
    }).catch((error) => {
      // console.log(error);
      app.erShow(error);
    });
  },

  /**
   * 计算商品总数
   */
  calculateTotal: function () {
      var goodList = this.data.goodList;
      var totalCount = 0;
      var totalPrice = 0;
      for (var i = 0; i < goodList.length; i++) {
        var good = goodList[i];
        if (good.checked == true) {
          totalCount += good.Count;
          totalPrice += good.Count * good.Price;
          }
      }
      totalPrice = totalPrice.toFixed(2);
      this.setData({
          totalCount: totalCount,
          totalPrice: totalPrice
      })
  },

  /**
   * 用户点击商品减1
   */
  subtracttap: function (e) {
      var goodList = this.data.goodList;
      var that = this
      let id = e.currentTarget.dataset.id;
      let index = e.currentTarget.dataset.index;

      console.log(e);
      
      let data = {
        cartitemid: id
      }
      // console.log(id);
      var good = goodList[index]
      if(good.Count<=1){
        app.Post(ut.api.re_cart, data).then((res) => {
          
          that.myCart(); //重新加载购物车
        }).catch((error) => {
          // console.log(error);
          app.erShow(error);
        });
      }else{
        //购物车商品减
        this.reCount(that, id);
      }
  },

  /**
   * 用户点击商品加1
   */
  addtap: function (e) {
      
      var that = this
      let id = e.currentTarget.dataset.id;
      //购物车商品减
      this.aCount(that, id);
  },
  /**
   * 用户选择购物车商品
   */
  checkboxChange: function (e) {
      // console.log('checkbox发生change事件，携带value值为：', e.detail.value);
      var checkboxItems = this.data.goodList;
      var values = e.detail.value;
      for (var i = 0; i < checkboxItems.length; ++i) {
          checkboxItems[i].checked = false;
          for (var j = 0; j < values.length; ++j) {
              if (checkboxItems[i].Id == values[j]) {
                  checkboxItems[i].checked = true;
                  break;
              }
          }
      }

      var checkAll = false;
      if (checkboxItems.length == values.length) {
        checkAll = true;
      }
      
      this.setData({
        goodList: checkboxItems,
        checkAll: checkAll
      });
      this.calculateTotal(); //计算价格
  },

  /**
   * 用户点击全选
   */
  selectalltap: function (e) {
      // console.log('用户点击全选，携带value值为：', e.detail.value);
      var value = e.detail.value;
      var checkAll = false;
      if (value && value[0]) {
          checkAll = true;
      }

      var goodList = this.data.goodList;
      for (var i = 0; i < goodList.length; i++) {
          var good = goodList[i];
          good['checked'] = checkAll;
      }

      this.setData({
          checkAll: checkAll,
          goodList: goodList
      });
      this.calculateTotal(); //总价计算
  },

  

  /**
   * 我的购物车
   */
  myCart: function () {
    var that = this
    var iscart = true

    wx.showLoading({
      title: '',
    }) //加载中

    app.Get(ut.api.my_cart).then((e) => {
      wx.hideLoading() //数据加载完hide加载提示
      console.log(e);

        let sum = 0;
        let totalnum = 0;
        let youhui = 0;
        if(e.data.Items != null && e.data.Items.length > 0) {
            let cart = e.data.Items;
            let len = cart.length;
            for(let i=0; i<len; i++) {
                sum = sum * 1 + cart[i].Price * cart[i].Count;
                totalnum = totalnum + cart[i].Count
                let yh = cart[i].DiscountAmount || 0
                youhui = youhui * 1 + yh * 1;
            }
        }

        sum = sum.toFixed(2)
        
        if (e.data.Items.length > 0) {
          iscart = false
        }
        if (e.data.Items.length <= 0) {
          iscart = true
        }

        var goodslist = e.data.Items
        var yslist = []
        var yclist = []
        for (var i = 0; i < goodslist.length; i++) {
          var good = goodslist[i];
          good['checked'] = true; //全选

          for(var j=0;j<good.ExpressDetail.length;j++){
            var yxProvince = good.ExpressDetail[j]
            for(var y=0;y<yxProvince.Cities.length;y++){
              yslist.push(yxProvince.Cities[y].City)
            }
          }
        }
        console.log(yslist);
        
        if(yslist.indexOf(this.data.choiceAddressinfo.CityCode) == -1){
          this.setData({
            flag : false
          })
        }else{
          this.setData({
            flag : true
          })
        }

        that.setData({
          iscart: iscart,
          goodList: goodslist,
          checkAll: true, //全选
          totalPrice: sum,
          totalCount: totalnum,
          // yhPrice:youhui
          yxCityCodeList: yslist

        })
      // console.log(e.data.Items);
    }).catch((e) => {
      wx.hideLoading() //数据加载完hide加载提示
      app.erShow(e);
    })
  },


  /**
   * 购物车商品数量加
   */
  aCount: function (that, ct_id) {
      let data = {
          cartitemid: ct_id
      }
      app.Post(ut.api.add_count, data).then((e) => {
          if (e.Code == 0) {
              // app.seShow("增加成功");
              // console.log("+1")
              that.myCart();
          }
      }).catch((e) => {
        app.erShow(e);
      })
  },

  /**
   * 购物车商品数量减
   */
  reCount: function (that, ct_id) {
    let data = {
      cartitemid: ct_id
    }
    // console.log(data);
    app.Post(ut.api.re_count, data).then((e) => {
      // console.log(e);
        if (e.Code == 0) {
            // app.seShow("减少成功");
            // console.log("-1")
            that.myCart();
        }
    }).catch((e) => {
      app.erShow(e);
    })
    // var goodList = this.data.goodList;
    // console.log(goodList[ct_id])
  },

  /**
     * 去支付确认页
     */
  pageSkip: function (e) {
    // let address = JSON.stringify(this.data.choiceAddressinfo)
    let address = this.data.address

    if (address.length <= 0) {
      app.erShow("请先选择地址")
      return false
    }

    var goodList = this.data.goodList;
    var goodArrayPayInfo = {};
    var goodArrayId = [];
    var goodArrayInfo = [];
    var totalgCount = 0;
    var totalgPrice = 0;
    var totalExpressPrice = 0;
    for (var i = 0; i < goodList.length; i++) {
      var good = goodList[i];
      if (good.checked == true) {
        goodArrayId.push(good.Id)
        goodArrayInfo.push(good)
        totalgCount += good.Count;
        totalgPrice += good.Count * good.Price;
        totalExpressPrice += good.ExpressPrice * 1;
      }
    }
    totalgPrice = totalgPrice.toFixed(2)
    totalExpressPrice = totalExpressPrice.toFixed(2)
    var totalePricedb = parseFloat(totalgPrice * 1 + totalExpressPrice * 1).toFixed(2)

    goodArrayPayInfo.address = this.data.choiceAddressinfo //地址
    goodArrayPayInfo.arrayid = goodArrayId //选择的商品id集合
    goodArrayPayInfo.arrayinfo = goodArrayInfo //选择的商品信息集合
    goodArrayPayInfo.totalgCount = totalgCount //商品总数
    goodArrayPayInfo.totalgPrice = totalgPrice //商品总价
    goodArrayPayInfo.totalExpressPrice = totalExpressPrice //商品总运费
    goodArrayPayInfo.totalePricedb = totalePricedb //商品总运费+商品金额
    // console.log(goodArrayPayInfo)
    wx.setStorageSync("goodInfo", goodArrayPayInfo);
    wx.navigateTo({
      url: '/pages/mine/ordercartpay/ordercartpay',
    })
  },
  
  
  name: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  linemobile: function (e) {
    this.setData({
      linemobile: e.detail.value
    })
  },
  city: function (e) {
    this.setData({
      city: e.detail.value
    })
  },
  addressde: function (e) {
    this.setData({
      addressde: e.detail.value
    })
  },

  addNewsaddress: function () {
    this.setData({
      newaddressHidden: false,
      otherAddressHidden: true
    })
  },
  addAddressCancel: function () {
    this.setData({
      newaddressHidden: true
    })
  },

  // 添加地址
  sureadd: function () {
    var that = this
    var telRule = /^1[3|4|5|7|8|9]\d{9}$/
    var name = that.data.name
    var linemobile = that.data.linemobile
    var city = that.data.region
    var address = that.data.addressde
    if (!that.data.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    if (!that.data.linemobile) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    if (!telRule.test(linemobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    if (!that.data.region) {
      wx.showToast({
        title: '请输入城市',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    if (!that.data.address) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }


    var data = {
      name: name,
      tel: linemobile,
      city: city,
      address: address
    }
    var addressdata = {
      Name: name,
      Tel: linemobile,
      City: city,
      Address: address
    }
    wx.showLoading({
      title: '',
    }) //加载中

    app.Post(ut.api.address_add, data).then((res) => {
      console.log(res);
      wx.hideLoading() //数据加载完hide加载提示

      if (res.Code == 0) {
        that.setData({
          newaddressHidden: true,
          choiceAddressinfo: addressdata
        })
        console.log(addressdata)
        that.getaddressList() //地址列表
      } else {
        wx.showToast({
          title: res.Message,
          icon: 'none',
          duration: 1000,
          mask: true,
        })
      }
    }).catch((error) => {
      console.log(error);
      wx.hideLoading() //数据加载完hide加载提示
      wx.showToast({
        title: error,
        icon: 'none',
        duration: 1000,
        mask: true,
      })
    });

  },

  


})