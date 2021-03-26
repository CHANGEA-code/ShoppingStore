import { openSetting, getSetting, chooseAddress,showModal,showToast,requestPayment } from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
// pages/cart/index.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        address: {},
        cart: [],
        totalPrice: 0,
        totalNum: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    onShow() {
        // 获取缓存中的地址信息
        const address = wx.getStorageSync("address");
        // 获取购物车信息
        let cart = wx.getStorageSync("cart") || [];
        cart=cart.filter(v=>v.checked);
        // 总价格，总数量
        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(v => {
                if (v.checked) {
                    totalPrice += v.num * v.goods_price;
                    totalNum += v.num;
                } else {
                    allChecked = false;
                }
            })
        this.setData({
            cart,
            totalPrice,
            totalNum,
            address
        });
    },
async handleAuthItem(){
    try {
          // 判断是否有token
    const token = wx.getStorageSync('token');
    if(!token){
       // 跳转到授权页面
       wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    // 存在token
    // 准备请求头参数
    // const header = {Authorization:token};
    // 准备请求体参数
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address.all;
    let goods = [];
    const cart = this.data.cart;
    cart.forEach(v=>goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price
    }));
    // 将多个数据封装在一起
    const orderParams = {order_price,consignee_addr,goods};
    // 请求并获取订单编号
    const {order_number} = await request({url:"/my/orders/create",data:orderParams,method:"POST"});
    // console.log({order_number});
    // 请求 发起预支付
    const {pay} = await request({url:"/my/orders/req_unifiedorder",data:{order_number},method:"POST"});
    // 发起微信支付,
    // 注意：由于权限问题，此处无法发起微信支付权限
    const res = await requestPayment(pay);
    // 查询后台订单状态
    const res1 = await request({url:"/my/orders/chkOrder",data:{order_number},method:"POST"});
    await showToast({title:"支付成功！"});
    // 删除已支付的商品
    let newCart = wx.getStorageSync("cart");
    newCart = newCart.filter(v=>!v.checked);
    wx.setStorageSync('cart', newCart);
    // 跳转到订单页面
    wx.navigateTo({
      url: '/pages/order/index',
    });
    } catch (error) {
        console.log(error);
        await showToast({title:"支付失败！"});
    }
}
})
