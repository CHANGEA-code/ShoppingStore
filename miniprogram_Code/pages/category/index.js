import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/category/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 左侧菜单数据
        leftMenuList: [],
        // 右侧商品数据
        rightContent: [],
        // 选中的左侧菜单下标
        menuIndex: 0,
        // 右侧菜单滚动条距顶部的距离
        scrollTop: 0
    },
    // 接口的返回数据
    Cates: [],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 获取本地存储的数据
        const Cates = wx.getStorageSync("cates");
        // 判断是否存在本地数据
        if (!Cates) {
            // 若不存在，则发送请求数据
            this.getCates();
        } else {
            // 定义过期时间，超过10s重新请求
            if (Date.now() - Cates.time > 1000 * 10) {
                // 重新发送请求
                this.getCates();
            } else {
                console.log("可以使用旧数据");
            }
        }
    },
    // 获取分类数据
    async getCates() {
        // request({
        //         url: "/categories"
        //     })
        //     .then(res => {
        //         this.Cates = res.data.message;
        //         // 将请求后的数据存储到本地中
        //         wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });

        //         let leftMenuList = this.Cates.map(v => v.cat_name);
        //         let rightContent = this.Cates[0].children;
        //         this.setData({
        //             leftMenuList,
        //             rightContent
        //         })
        //     })

        // 使用es7的async await来发送请求
        const res = await request({ url: "/categories" });
        this.Cates = res;
        // 将请求后的数据存储到本地中
        wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });

        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
            leftMenuList,
            rightContent
        })
    },
    // 左侧菜单的点击事件
    handleItemTap(e) {
        // 获取下标
        const { index } = e.currentTarget.dataset;
        // 根据不同的商品渲染右侧内容
        let rightContent = this.Cates[index].children;
        this.setData({
            menuIndex: index,
            rightContent,
            // 重新设置右侧scroll-view中scroll-top的值
            scrollTop: 0
        })
    }
})