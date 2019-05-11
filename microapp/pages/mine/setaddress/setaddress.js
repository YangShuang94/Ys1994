// pages/mine/setaddress/setaddress.js
const app = getApp()
const ut = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: 0,
    addressget: [],
    index: 0,
    // list: ['无脊柱动物', '脊柱动物'],
    // list1: ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'],
    // multiArray: [],
    // multiIndex: [0, 0, 0]
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部'
  },
  // bindMultiPickerChange: function(e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     multiIndex: e.detail.value
  //   })
  // },

  // bindMultiPickerColumnChange: function(e) {
  //   console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  //   // 知道修改的列以后，就可以通过修改multiIndex中对应元素的值，然后再修改multiArray
  // },  

/**
 * 生命周期函数--监听页面加载
 */
onLoad: function(options) {
  // this.setData({
  //   multiArray:[this.data.list,this.data.list1]
  // })
  var id = options.id;
  console.log(id)
  this.setData({
    addressid: id
  })
  if (id != "null") {
    this.setData({
      flag: 1
    })

    this.addressDetails(id);
  }
  if (id == "null") {
    this.setData({
      flag: 0
    })
  }

},
// 官方api三级城市联动
bindRegionChange: function (e) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  this.setData({
    region: e.detail.value
  })
},

name: function(e) {
  this.setData({
    name: e.detail.value
  })
},
linemobile: function(e) {
  this.setData({
    linemobile: e.detail.value
  })
},
city: function(e) {
  this.setData({
    city: e.detail.value
  })
},
address: function(e) {
  this.setData({
    address: e.detail.value
  })
},

// 详情
addressDetails: function(obj) {
  var addressid = this.data.addressid;
  app.Get(ut.api.address_get + "&id=" + obj).then((res) => {
    console.log(res);
    if (res.Code == 0) {
      this.setData({
        name: res.data.Name,
        linemobile: res.data.Tel,
        region: res.data.region,
        address: res.data.Address,
        isdefault: res.data.IsDefault,
        "region[0]": res.data.Province,
        "region[1]": res.data.City,
        "region[2]": res.data.County
      })
    }
  }).catch((error) => {
    console.log(error);
  });
},

// 添加
sureadd: function() {
  var that = this
  var telRule = /^1[3|4|5|7|8|9]\d{9}$/
  var name = that.data.name
  var linemobile = that.data.linemobile
  var city = that.data.region
  var address = that.data.address
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
  app.Post(ut.api.address_add, data).then((res) => {
    console.log(res);
    if (res.Code == 0) {
      wx.showToast({
        title: res.Message,
        icon: 'none',
        duration: 1000,
        mask: true,
        complete: function() {
          that.back()
          // wx.redirectTo({
          //   url: '/pages/mine/address/address',
          // })
        }
      })
    }
  }).catch((error) => {
    console.log(error);
  });

},

// 编辑
sureedit: function() {
  var that = this

  var addressid = that.data.addressid
  var name = that.data.name
  var linemobile = that.data.linemobile
  var city = that.data.region
  var address = that.data.address
  var telRule = /^1[3|4|5|7|8|9]\d{9}$/;

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
    id: addressid,
    name: name,
    tel: linemobile,
    city: city,
    address: address
  }
  console.log(data);
  app.Post(ut.api.address_edit, data).then((res) => {
    console.log(res);
    if (res.Code == 0) {
      wx.showToast({
        title: res.Message,
        icon: 'none',
        duration: 1000,
        mask: true,
        complete: function() {
          that.back()
          // wx.redirectTo({
          //   url: '/pages/mine/address/address',
          // })
        }
      })

    }
  }).catch((error) => {
    // console.log(error);
    wx.showToast({
      title: res.Message,
      icon: 'none',
      duration: 1000,
      mask: true
    })
  });

},

// 设置默认地址
setAsDefault: function() {
  var that = this
  var addressid = that.data.addressid

  var data = {
    id: addressid
  }
  app.Post(ut.api.address_setmr, data).then((res) => {
    console.log(res);
    if (res.Code == 0) {
      // wx.showToast({
      //   // title: res.Message,
      //   icon: 'none',
      //   duration: 1000,
      //   mask: true
      // })
    }
  }).catch((error) => {
    // console.log(error);
    wx.showToast({
      title: res.Message,
      icon: 'none',
      duration: 1000,
      mask: true
    })
  });

},

// 删除地址
addressDel: function() {
  var that = this
  var addressid = that.data.addressid

  var data = {
    id: addressid
  }
  app.Post(ut.api.address_remove, data).then((res) => {
    console.log(res);
    if (res.Code == 0) {
      wx.showModal({
        title: '信息',
        content: '删除成功',
        success: function(res) {
          if (res.confirm) {
            that.back()
            // wx.redirectTo({
            //   url: '/pages/mine/address/address',
            // })
          } else if (res.cancel) {
            that.back()
            // wx.redirectTo({
            //   url: '/pages/mine/address/address',
            // })
          }
        }
      })
      // wx.showToast({
      //   title: res.Message,
      //   icon: 'none',
      //   duration: 1000,
      //   mask: true,
      //   complete: function () {
      //     wx.navigateBack({
      //       url: '/pages/mine/address/address',
      //     })
      //   }
      // })
    }
  }).catch((error) => {
    // console.log(error);
    wx.showToast({
      title: res.Message,
      icon: 'none',
      duration: 1000,
      mask: true
    })
  });

},

showMessage: function(text) {
  var that = this
  that.setData({
    showMessage: true,
    messageContent: text
  })
  setTimeout(function() {
    that.setData({
      showMessage: false,
      messageContent: ''
    })
  }, 3000)
},

back: function() {
  var pages = getCurrentPages(); //获取页面栈
  console.log("pages:" + pages)
  if (pages.length > 1) {
    console.log("大于1")
    //上一个页面实例对象
    var prePage = pages[pages.length - 2];
    //调用上一个页面的onShow方法
    prePage.onShow()
    wx.navigateBack({
      delta: 1
    })
  }
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

}
})