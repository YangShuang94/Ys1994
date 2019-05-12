// pages/serviceshopcart/serviceshopcart.js
const app = getApp()
const ut = require('../../utils/util.js')
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: "请选择日期",
    multiArray: [['今天', '明天', '3-2', '3-3', '3-4', '3-5'], [0, 1, 2, 3, 4, 5, 6], [0, 10, 20]],
    multiIndex: [0, 0, 0],

    arrayItem: 0,
		array: ['在线支付', '线下支付', '请人代付'],
		expressItem: 0,
		express: ['快递 免邮', 'EMS 25元'],
		// input默认是1
		num: 1,
		// 使用data数据对象设置样式名
		minusStatus: 'disabled',
		//底部弹窗
    showModalStatus: false,
    
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

    app.Get(ut.api.service_detail +
      '&appid=' + app.globalData.appId +
      '&id=' + options.id).then((res) => {
        // console.log(res)
      if (res.Code == 0) {
        console.log(res.data)
        var tolprice= this.data.num*res.data.Price;
        that.setData({//商品
          serviceDetails: res.data,
          thisPrice: res.data.Price,
          tolprice: tolprice
        });
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  pickerTap:function() {
    date = new Date();

    var monthDay = ['今天','明天'];
    var hours = [];
    var minute = [];
    
    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    // 月-日
    for (var i = 2; i <= 13; i++) {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + i);

      var md = (date1.getMonth() + 1) + "-" + date1.getDate();
      monthDay.push(md);
    }

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    if(data.multiIndex[0] === 0) {
      if(data.multiIndex[1] === 0) {
        this.loadData(hours, minute);
      } else {
        this.loadMinute(hours, minute);
      }
    } else {
      this.loadHoursMinute(hours, minute);
    }

    data.multiArray[0] = monthDay;
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    
    this.setData(data);
  },




  bindMultiPickerColumnChange:function(e) {
    date = new Date();

    var that = this;

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 把选择的对应值赋值给 multiIndex
    data.multiIndex[e.detail.column] = e.detail.value;

    // 然后再判断当前改变的是哪一列,如果是第1列改变
    if (e.detail.column === 0) {
      // 如果第一列滚动到第一行
      if (e.detail.value === 0) {

        that.loadData(hours, minute);
        
      } else {
        that.loadHoursMinute(hours, minute);
      }

      data.multiIndex[1] = 0;
      data.multiIndex[2] = 0;

      // 如果是第2列改变
    } else if (e.detail.column === 1) {

      // 如果第一列为今天
      if (data.multiIndex[0] === 0) {
        if (e.detail.value === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
        // 第一列不为今天
      } else {
        that.loadHoursMinute(hours, minute);
      }
      data.multiIndex[2] = 0;

      // 如果是第3列改变
    } else {
      // 如果第一列为'今天'
      if (data.multiIndex[0] === 0) {

        // 如果第一列为 '今天'并且第二列为当前时间
        if(data.multiIndex[1] === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
      } else {
        that.loadHoursMinute(hours, minute);
      }
    }
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    this.setData(data);
  },

  loadData: function (hours, minute) {

    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } 
    // else if (currentMinute == 0){
    //   minuteIndex = 00;
    // }
     else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }
    
    // var date2 = new Date(date);

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = 0; i < 60; i += 10) {
        minute.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = minuteIndex; i < 60; i += 10) {
        minute.push(i);
      }
    }
  },

  loadHoursMinute: function (hours, minute){
    // 时
    for (var i = 0; i < 24; i++) {
      hours.push(i);
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },

  loadMinute: function (hours, minute) {
    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },

  bindStartMultiPickerChange: function (e) {
    var that = this;
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];

    if (monthDay === "今天") {
      var month = date.getMonth()+1;
      var day = date.getDate();
      monthDay = month + "月" + day + "日";
    } else if (monthDay === "明天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 1);
      monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";
      var month = (date1.getMonth() + 1)
      var day = date1.getDate()
    } else {
      var month = monthDay.split("-")[0]; // 返回月
      var day = monthDay.split("-")[1]; // 返回日
      monthDay = month + "月" + day + "日";
    }
    console.log(date);
    var year = date.getFullYear()
     
    if(month < 10){
      month = "0" + month
    }
    if(day < 10){
      day = "0" + day
    }
    if(hours < 10){
      hours = "0" + hours
    }else{
      hours = hours
    }
    if(minute < 10){
      minute = "0" + minute
    }else{
      minute = minute
    }548
    var startDate = monthDay + " " + hours + ":" + minute;
    var returnDate = year + "-" + month + "-" + day + " " + hours + ":" + minute;
    that.setData({
      returnDate: returnDate,
      startDate: startDate
    })
    console.log(that.data.returnDate);
    
  },
// 时间

// 输入信息
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
  remarkInput:function(e){
    this.setData({
      Remark: e.detail.value
    })
  },


  bindPickerPay(e) {
		this.setData({
			arrayItem: e.detail.value
		})
	},
	
	bindPickerExpress(e) {
		this.setData({
			expressItem: e.detail.value
		})
	},

	
	/* 点击减号 */
	bindMinus: function() {
		var num = this.data.num;
		if (num > 1) {
			num--;
		}
		var minusStatus = num <= 1 ? 'disabled' : 'normal';
		this.setData({
      num: num,
      tolprice: num*this.data.thisPrice,
			minusStatus: minusStatus
		});
	},
	/* 点击加号 */
	bindPlus: function() {
		var num = this.data.num; 
		num++; 
		var minusStatus = num < 1 ? 'disabled' : 'normal';
		this.setData({
      num: num,
      tolprice: num*this.data.thisPrice,
			minusStatus: minusStatus
    });
    
	},
	/* 输入框事件 */
	bindManual: function(e) {
		var num = e.detail.value;
		this.setData({
			num: num
		});
	},
	
	
	showBuyModal() {
		// 显示遮罩层
		var animation = wx.createAnimation({
			duration: 200,
			timingFunction: "ease",
			delay: 0
		})
		this.animation = animation
		animation.translateY(300).step()
		this.setData({
			animationData: animation.export(), // export 方法每次调用后会清掉之前的动画操作。
			showModalStatus: true
		})
		setTimeout(() => {
			animation.translateY(0).step()
			this.setData({
				animationData: animation.export() // export 方法每次调用后会清掉之前的动画操作。
			})
			console.log(this)
		}, 200)
	},
  
  pay(){
    var that = this
    var serPrice = that.data.serviceDetails.Price
    console.log(that.data.serviceDetails)
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
    var address = {
      name: that.data.name,
      tel: that.data.phone,
      address: that.data.address
    }
    var data = {
      id: that.data.serviceDetails.Id,
      storeId: 2,
      count: 1,
      address: JSON.stringify(address),
      subscribeDate: that.data.returnDate,
      Remark: that.data.Remark
    }
    console.log(data);
    
    console.log(that.data.Remark);
    
    app.Post(ut.api.sorder_create, data).then((res) => {
      console.log(res)
      if (res.Code == 0) {
        // app.seShow('订单确认成功')
        console.log(res.data)
        that.setData({
          paydata : res.data
        })
        if (serPrice == 0) { //服务价格为0直接预约成功
          

        } else { //服务价格不为0要先去支付服务费
          var paydata = res.data;
          var tolprice = that.data.tolprice
          var title = that.data.serviceDetails.Title
          
          wx.navigateTo({
            url : '/pages/confirmpay/confirmpay?paydata='+paydata+'&tolprice='+tolprice+'&title='+title
          })
          // that.orderPay(res.data)
        }
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

  
	hideBuyModal() {
		// 隐藏遮罩层
		var animation = wx.createAnimation({
			duration: 200,
			timingFunction: "ease",
			delay: 0
		})
		this.animation = animation
		animation.translateY(300).step()
		this.setData({
			animationData: animation.export(),
		})
		setTimeout(function() {
			animation.translateY(0).step()
			this.setData({
				animationData: animation.export(),
				showModalStatus: false
			})
			console.log(this)
		}.bind(this), 200)
	},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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