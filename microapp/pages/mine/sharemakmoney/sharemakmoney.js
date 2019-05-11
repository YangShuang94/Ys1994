const app = getApp()
const ut = require('../../../utils/util.js')

// pages/mine/sharemakmoney/sharemakmoney.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        applyHidden: true,
    },

    /** 
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        

    },
    // 姓名
    name: function(e) {
      this.setData({
        name: e.detail.value
      })
    },
    // 身份证
    idcard: function(e) {
      this.setData({
        idcard: e.detail.value
      })
    },
    // 银行卡姓名
    relname: function (e) {
      this.setData({
        relname: e.detail.value
      })
    },
    // 银行卡名
    bankname: function (e) {
      this.setData({
        bankname: e.detail.value
      })
    },
    // 银行卡号
    banknumber: function (e) {
      this.setData({
        banknumber: e.detail.value
      })
    },
    // 银行卡开户行
    bankopenname: function (e) {
      this.setData({
        bankopenname: e.detail.value
      })
    },

    /**
     * 申请加入
     */
    sureJoin: function(that, idcardno, realname, storeid, withdrawdetail) {
        var that = this
        var name = that.data.name
        var idcard = that.data.idcard
        var relname = that.data.relname
        var bankname = that.data.bankname
        var banknumber = that.data.banknumber
        var bankopenname = that.data.bankopenname

        var storeid = wx.getStorageSync("merchantStoreId")

        if (!name) {
          wx.showToast({
            title: "请输入姓名",
            icon: 'none',
            duration: 1000,
            mask: true
          })
          return false;
        }
        if (!idcard) {
          wx.showToast({
            title: "请输入身份证",
            icon: 'none',
            duration: 1000,
            mask: true
          })
          return false;
        }
        if (!relname) {
          wx.showToast({
            title: "请输入银行账户姓名",
            icon: 'none',
            duration: 1000,
            mask: true
          })
          return false;
        }
        if (!bankname) {
          wx.showToast({
            title: "请输入银行名",
            icon: 'none',
            duration: 1000,
            mask: true
          })
          return false;
        }
        if (!banknumber) {
          wx.showToast({
            title: "请输入银行卡号",
            icon: 'none',
            duration: 1000,
            mask: true
          })
          return false;
        }
        if (!bankopenname) {
          wx.showToast({
            title: "请输入银行卡开户行",
            icon: 'none',
            duration: 1000,
            mask: true
          })
          return false;
        }

        var withdrawdetail = {
          name: relname, //账户名
          bankName: bankname, //银行名
          cardNo: banknumber, //账号
          bankAddress: bankopenname //开户行
        }
        let data = {
          idcardno: idcard, //身份证号
          realname: name, //姓名
          storeid: storeid, //店铺id
          withdrawdetail: JSON.stringify(withdrawdetail)
        }
        console.log(data)
        app.Post(ut.api.daili, data).then((e) => {
          if (e.Code == 0) {
            app.seShow('提交成功')
            that.setData({
              applyHidden: true
            });
          }
        }).catch((e) => {
          app.seShow('提交失败')
          that.setData({
            applyHidden: true
          });
        })
    },

    // 申请加入弹框显示
    joinClick: function() {
        var that = this
        // let withdrawdetail = '{"name": "黄山","bankName": "工商银行","cardNo": "622200021254214477","bankAddress": "工商银行中国营业部"}'
        //代理申请
        // this.daili(that, '12345678999999', '黄山', '2', withdrawdetail);

        this.setData({
            applyHidden: false
        });
    },
    // 申请加入弹框隐藏
    joinCancel: function() {
        this.setData({
            applyHidden: true
        });
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