const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

//请求地址
const api = {
    product_mallinfo: 'product_mallinfo', //商品页头部banner
    goods: 'product_list',  //商品列表
    goodsInfo: 'product_detail',   //商品详情
    seHome: 'service_home',     //服务首页
    seList: 'service_list',     //服务列表
    seInfo: 'service_detail',   //服务详情
    fjshops: 'store_nearby',    //附近店铺
    shops: 'store_merchantstores',  //店铺列表
    register: 'auth_register',      //用户注册
    getsmscode: 'auth_getsmscode',  //获取验证码
    service_detail: 'service_detail', //服务详情
    sorder_create: 'sorder_create', //预约服务
    add_cart:'cart_add',            //加入购物车
    re_cart:'cart_remove',          //移除购物车
    my_cart:'cart_info',            //我的购物车
    add_count:'cart_addcount',        //增加数量
    re_count:'cart_reducecount',     //减少数量
    em_cart:'cart_empty',            //清空购物车
    qu_order:'order_quickcreate',    //直接购买

    daili:'agent_apply',		//代理申请
    zhanghu:'commission_summary',	//账户详情
    liushui:'commission_list',		//账户流水
    tixian:'commission_withdraw',	//提现申请
    bangding: 'agent_customerbinding', //分销客户绑定

    order_all:'order_all',		//商品所有订单
    order_info:'order_detail',	//订单详情
    order_nopay:'order_inpayment',	//待支付
    order_chuli:'order_processing',	//处理中
    order_end:'order_completed',	//已完成
    order_cel:'order_cancel',		//订单取消
    order_pay:'order_pay',			//订单支付
    order_one:'order_quickcreate',  //一键购买

    bank_list:'bankaccount_get',     //获取所有银行卡
    bank_bind:'bankaccount_bind',    //绑定银行卡
    bank_edit:'bankaccount_update',  //修改银行卡
    zhanghu:'commission_summary',	//账户详情
    liushi:'commission_list',		//账户流水

    address_list: 'rcvinf_getall', //地址列表
    address_add: 'rcvinf_add', //添加地址
    address_edit: 'rcvinf_edit', //地址编辑
    address_get: 'rcvinf_get', //地址详情
    address_remove: 'rcvinf_remve', //地址删除
    address_setmr: 'rcvinf_setdefault', //设置默认地址

    merchant_store: 'store_merchantstores', //首页商户店铺

    sorder_all: 'sorder_all',		//服务所有订单
    sorder_inpayment: 'sorder_inpayment', //待付定金
    sorder_unconfirm: 'sorder_unconfirm',	//待确认
    sorder_inservice: 'sorder_inservice',	//服务中
    sorder_completed: 'sorder_completed',	//已完成
    sorder_pay: 'sorder_pay',	//订单支付
    sorder_servicefeepay: 'sorder_servicefeepay',		//服务费支付
    sorder_detail: 'sorder_detail',		//服务订单详情
    sorder_cancel: 'sorder_cancel',		//取消订单

    user_usercenterinfo: 'user_usercenterinfo',		//个人中心信息 

    store_favorite: 'store_favorite',		//收藏店铺列表 
    store_nearby: 'store_nearby',		//周边店铺列表
    store_detail: 'store_detail',		//店铺列表详情
    store_addfavorite: 'store_addfavorite',		//收藏店铺
    store_removefavorite: 'store_removefavorite',		//移除收藏
    rcvinf_getdefault: 'rcvinf_getdefault',		//获取默认地址 

    cart_count: 'cart_count',		//购物车总数

    task_all: 'task_all',		//工人全部订单
    task_pending: 'task_pending',		//工人待接单
    task_inprocess: 'task_inprocess',		//工人处理中
    task_completed: 'task_completed',		//工人已完成
    task_confirm: 'task_confirm',		//工人接单
    task_confirmservice: 'task_confirmservice',		//工人服务定价
    task_info: 'task_info',		//工人订单新分配数


    
}

module.exports = {
    formatTime: formatTime,
    api: api
}