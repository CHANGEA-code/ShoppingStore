import { openSetting, getSetting, chooseAddress,showModal,showToast } from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/cart/index.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        address: {},
        cart: [],
        allChecked: false,
        totalPrice: 0,
        totalNum: 0
    },

    // 点击收货地址
    async handleChooseAddress() {
        try {
            // 获取权限状态
            const res1 = await getSetting();
            const scopeAddress = res1.authSetting["scope.address"];
            // 判断 权限状态
            if (scopeAddress === false) {
                await openSetting();
            }
            let address = await chooseAddress();
            address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
            wx.setStorageSync('address', address);
        } catch (error) {
            console.log(error);
        }
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
        const cart = wx.getStorageSync("cart") || [];
        this.setCart(cart);
        this.setData({ address });
    },
    handleChange(e) {
        // 获取被修改商品的id
        const goods_id = e.currentTarget.dataset.id;
        // 获取购物车数组
        let { cart } = this.data;
        // 找到被修改的商品对象
        let index = cart.findIndex(v => v.goods_id === goods_id);
        // 选中状态取反
        cart[index].checked = !cart[index].checked;

        this.setCart(cart);
    },
    // 设置购物车的状态同时进行其他计算
    setCart(cart) {
        let allChecked = true;
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
            // 判断allChecked数组是否为空
        allChecked = cart.length != 0 ? allChecked : false;
        this.setData({
            cart,
            allChecked,
            totalPrice,
            totalNum
        });
        // 将数据设置回data和缓存中
        wx.setStorageSync('cart', cart);
    },
    // 商品全选功能
    handleAllChecked(){
        // 获取数据
        let {cart,allChecked}=this.data;
        //反向allChecked
        allChecked = !allChecked;
        // 修改cart中的checked
        cart.forEach(v=>v.checked=allChecked);
        this.setCart(cart);
    },
    async handleEditNum(e){
        const {id,operation} = e.currentTarget.dataset;
        // 获取数据
        let {cart} = this.data;
        // 获取选中的下标
        const index = cart.findIndex(v=>v.goods_id===id);
        // 修改num值
        if(cart[index].num===1&&operation===-1){
            const res = await showModal({content: "您是否要删除?"});
            if(res.confirm){
                cart.splice(index,1);
                this.setCart(cart);
            }
        }else{
            cart[index].num += operation;
            this.setCart(cart);
        }
    },
    // 结算功能
    async handlePay(){
        const {address,totalNum} = this.data;
        // 若地址未填写
        if(!address.userName){
            await showToast({title:"地址未填写"});
            return;
        }
        // 若购物车为空
        if(totalNum===0){
            await showToast({title:"购物车为空"});
            return;
        }
        // 跳转到支付页面
        wx.navigateTo({
          url: '/pages/pays/index'
        });

    }
})
