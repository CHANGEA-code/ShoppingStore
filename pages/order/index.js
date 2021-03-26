import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/order/index.js
Page({

  // 小程序的页面栈数组长度最多为10，即长度最多是10个页面
  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"待发货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      }
    ],
    orders:[]
  },
  onShow(){
    // 先判断是否有登录
    const token = wx.getStorageSync('token');
    if(!token){
      wx.navigateTo({
        url:'/pages/auth/index'
      });
      return;
    }
    // 获取当前小程序的页面栈
    let pages = getCurrentPages();
    // console.log(pages);
    let currentPages = pages[pages.length-1];
    // 获取参数type
    const {type} = currentPages.options;
    // console.log(type);
    this.getOrders(type);
    // 根据点击的标签改变主题
    this.changeTitleByTag(type-1);
  },
  // 获取历史订单
  async getOrders(type){
    // 请求数据
    const res = await request({url:"/my/orders/all",data:type});
    console.log(res);
    const {orders} = res;
    this.setData({
      orders:orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    });
  },
  // 定义根据标题改变选中标签
  changeTitleByTag(index){
    // 修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 赋值到data中
    this.setData({
      tabs
    })
  },
  // 定义点击事件 ，是从子组件传递过来的自定义方法
  handleTabsItemChange(e) {
    // 获取被点击的标题下标
    const {index} = e.detail;
    this.changeTitleByTag(index);
    this.getOrders();
  }
  
})