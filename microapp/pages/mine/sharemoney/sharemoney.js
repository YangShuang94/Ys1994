const app = getApp()
const ut = require('../../../utils/util.js')

// pages/mine/collection/collection.js
var interval = null;
var addBank = {};   //用户填写的银行卡信息

Page({
    /**
     * 页面的初始数据
     */
    data: {
      applyHidden: true, //提现绑定银行卡弹框
      getMoneyHidden: true, //提现弹框
      otherBankCardHidden: true, //其他银行卡弹框
      succHidden: true, //提现成功
      time: '获取验证码', //倒计时 
      currentTime: 60, //倒计时60秒
      zhanghu:{
        Balance:0,
        Total:0,
        Gains:0,
              Pending:0,
              WithdrawDate:'',
      },

        // 银行卡
        bankCardvalue: "",
        bankcard: [{
            value: '小明 6852*******4564 招商银行'
        },
        {
            value: '小明 6852*******4564 招商银行',
            checked: 'true'
        },
        {
            value: '小明 6852*******4564 招商银行'
        },
        {
            value: '小明 6852*******4564 招商银行'
        },
        {
            value: '小明招商银行 6852*******4564 招商银行'
        },
        ]

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        var that = this
        this.zhanghu(that)
        this.getBills(that)
    },
    
    /**
     * 获取用户填写的数据
     */
    fc:function(e) {
        addBank[e.currentTarget.id] = e.detail.value;
        console.log(addBank);
    },

    /**
     * 绑定银行卡
     */
    add_bank:function(e) {
        
		this.setData({
            addBank
        })
    },
    

    // 立即提现绑定银行卡弹框显示
    getMoneybindCard: function () {
        var that = this
        //获取银行卡
        this.getBank(that)
    },
    // 立即提现绑定银行卡弹框隐藏
    getMoneybindCardCancel: function () {

        this.setData({
            applyHidden: true
        });
    },

    // 立即提现弹框显示
    getMoney: function () {
        this.setData({
            getMoneyHidden: false
        });
    },
    // 立即提现弹框隐藏
    getMoneyCancel: function () {
        this.setData({
            getMoneyHidden: true
        });
    },

    // 使用其他银行卡弹框显示
    otherBankCard: function () {
        this.setData({
            otherBankCardHidden: false
        });
    },
    // 使用其他银行卡弹框隐藏
    otherBankCardcancel: function () {

        this.setData({
            otherBankCardHidden: true
        });
    },
    // 选择银行卡
    radioChange(e) {
        console.log('value：', e.detail.value);
        this.setData({
            bankCardvalue: e.detail.value
        })
    },

    // 提现成功弹框隐藏
    succHiddenCancel: function () {
        this.setData({
            succHidden: true
        });
    },

    // 获取验证码倒计时
    getCode: function (options) {
        var that = this;
        var currentTime = that.data.currentTime
        interval = setInterval(function () {
            currentTime--;
            that.setData({
                time: currentTime + '秒'
            })
            if (currentTime <= 0) {
                clearInterval(interval)
                that.setData({
                    time: '重新发送',
                    currentTime: 60,
                    disabled: false
                })
            }
        }, 1000)
    },
    getVerificationCode: function () {
        this.getCode();
        var that = this
        that.setData({
            disabled: true
        })
    },

    /**
     * 获取银行卡列表
     */
    getBank: function (that) {
        app.Get(ut.api.bank_list).then((e) => {
            if(e.data == null) {
                this.setData({
                    applyHidden: false
                });
            } else {
                this.setData({
                    getMoneyHidden: false
                });
            }
            
        }).catch((e) => {

        });

    },

    /**
     * 绑定银行卡
     */
    bank_bind: function (e) {

        if(addBank.accountname == null) {
            app.erShow('请填写持卡人')
            return false
        }
        if(addBank.account == null) {
            app.erShow('请填写卡号')
            return false
        }
        if(addBank.bankname == null) {
            app.erShow('请填写银行名称')
            return false
        }
        //绑定银行卡
        app.Post(ut.api.bank_bind, addBank).then((e) => {
            if(e.Code == 0) {
                app.seShow('绑定成功')
            } else {
                app.erShow('绑定失败')
            }
        }).catch((e) => {

        })

    },

    /**
     * 修改银行卡
     */
    edit_bank:function(that,id,accountname='',account='',bankname='') {
        let data = {
            id:id,
            accountname: accountname,
            account: account,
            bankname: bankname
        }
        app.Post(ut.api.bank_edit,data).then((e)=>{
            if(e.Code == 0) {
                app.seShow('修改成功')
            } else {
                app.erShow('修改失败')
            }
        }).catch((e)=>{

        })
    },

    /**
     * 获取账户详情
     */
    zhanghu:function(that) {
        app.Get(ut.api.zhanghu).then((e)=>{
            if(e.Code == 0) {
                that.setData({
                    zhanghu:{
                        Balance:e.data.Balance,
                        Gains:e.data.Gains,
                        Pending:e.data.Pending,
                        Total:e.data.Total,
                        WithdrawDate:e.data.WithdrawDate || '-',
                    }
                })
            }
        }).catch((e)=>{})
    },
    getBills:function(that){
      app.Get(ut.api.liushi).then((res)=>{
        if(res.Code == 0){
          console.log(res.data)
          console.log(res.note)
          that.setData({
            listData: res.data.Data
          })
        }
      }).catch(()=>{})
    },


  apply:function(){
    var that = this;
    app.Post(ut.api.tixian).then((res) => {
      console.log(res)
      if (res.Code == 0) {
        that.zhanghu(that)
        that.setData({
          getMoneyHidden: true //隐藏提现弹框
        });
      } else {
        app.erShow(res.Message)
      }
    }).catch((res) => {
      app.erShow(res)
      that.setData({
        getMoneyHidden: true //隐藏提现弹框
      });

    })
  }

})