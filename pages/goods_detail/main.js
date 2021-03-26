import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/good_detail/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {},
        // 定义变量表示商品是否被收藏
        isCollect:false
    },
    // 商品对象
    GoodsInfo: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function() {
         // 获取当前小程序的页面栈
        let pages = getCurrentPages();
        // console.log(pages);
        let currentPages = pages[pages.length-1];
        let options = currentPages.options;
        const {goods_id} = options;
        // console.log(goods_id);
        this.getGoodsDetail(goods_id);
    },
    // 获取商品详情数据
    async getGoodsDetail(goods_id) {
        const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
        this.GoodsInfo = goodsObj;
        // 获取商品收藏的数组
        let collect = wx.getStorageSync("collect")||[];
        let isCollect = collect.some(v=>v.goods_id === this.GoodsInfo.goods_id);
        this.setData({
            goodsObj: {
                goods_name: goodsObj.goods_name,
                goods_price: goodsObj.goods_price,
                // iphone部分手机不识别webp图片格式
                // 所以最好找到后台修改
                // 临时自己改的话:确保后台存在web/g格式,转换为jpg
                goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
                pics: goodsObj.pics
            },
            isCollect
        })
    },
    handlePreviewImage(e) {
        // console.log(e);
        // 构造要预览的图片数组
        const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
        // 接收传递过来的图片url
        const current = e.currentTarget.dataset.url;
        wx - wx.previewImage({
            urls,
            current
        });
    },
    handleCartAdd() {
        // 获取缓存中的购物车 数组
        let cart = wx.getStorageSync('cart') || [];
        // 查找购物车是否存在该商品
        let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
        // 判断
        if (index === -1) {
            // 不存在
            this.GoodsInfo.num = 1;
            this.GoodsInfo.checked = true;
            cart.push(this.GoodsInfo);
        } else {
            // 存在
            cart[index].num++;
        }
        // 把购物车数组重新添加回缓存中
        wx.setStorageSync('cart', cart);
        // 弹窗提示
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            mask: true
        })
    },
    handleCollect(){
        let isCollect = false;
        let collect = wx.getStorageSync("collect")||[];
        let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
        console.log(index);
        if(index!==-1)
        {
            // 能找到，则取消收藏
            collect.splice(index,1);
            isCollect = false;
            wx.showToast({
              title: '取消成功!',
              icon:'success'
            })
        }else{
            // 不能找到，则收藏
            collect.push(this.GoodsInfo);
            isCollect = true;
            wx.showToast({
              title: '收藏成功！',
              icon:'success'
            })
        }
        this.setData({
            isCollect
        });
        wx.setStorageSync("collect",collect);
    }
})