import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    isFocus:false,
    isValue:""
  },
  TimeId:-1,
  // bindInput事件不能加sync，否则会出错
  handleSearch(e){
    // 获取数据
    const {value} = e.detail;
    // 判断输入字符是否合法
    if(!value.trim()){
      // 若为空格则返回
      this.setData({
        goods:[],
        isFocus:false
      })
      return;
    }
    this.setData({
      isFocus:true
    })
    // 此处定时器的作用是防抖，即防止输入输入框重复输入重复，发送请求。
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(()=>{
    this.qSearch(value);
    },1000);
  },
  async qSearch(query){
    const res = await request({url:"/goods/qsearch",data:{query}});
    // console.log(res);
    this.setData({
      goods:res
    })
  },
  // 点击取消按钮的事件
  handleButton(){
    this.setData({
      goods:[],
      isFocus:false,
      isValue:""
    })
  }
})