import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/good_list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[]
  },  
  // 接口需要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  // 总页数
  totalPages:1,
  onLoad: function(options) {
    // console.log(options.cid);  
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query = options.query||"";
    this.getGoodsList();
  },
  // 定义点击事件 ，是从子组件传递过来的自定义方法
  handleTabsItemChange(e) {
    // 获取被点击的标题下标
    const {index} = e.detail;
    // 修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 赋值到data中
    this.setData({
      tabs
    })
  },
  // 获取商品列表数据 
  async getGoodsList(){
    const  res = await request({url:"/goods/search",data:this.QueryParams});
    // 获取总条数
    const total = res.total;
    // console.log(total);
    // console.log(this.QueryParams.pagesize);
    // 计算总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    console.log(this.totalPages);
    this.setData({ 
      // 对数组进行拼接
      goodsList:[...this.data.goodsList,...res.goods]
    })
  },
  // 用户上滑页面，加载下一页
  // 获取页面总页数=总条数/页容量，再向上取整
  // 即总页数=Math.ceil(总条数/页容量)
  onReachBottom(){
    if(this.QueryParams.pagenum>=this.totalPages){
      wx-wx.showToast({title: '没有下一页数据!'});
    }else{  
      this.QueryParams.pagenum++; 
      this.getGoodsList();
    }
  },
  onPullDownRefresh(){
    // 重置数组
    this.setData({
      goodsList:[]
    })
    // 重置页码
    this.QueryParams.pagenum=1;
    // 发送请求
    this.getGoodsList();
    // 关闭下拉刷新窗口,如果没有触发下拉刷新,直接关闭也不会报错
    wx.stopPullDownRefresh();
  }
})