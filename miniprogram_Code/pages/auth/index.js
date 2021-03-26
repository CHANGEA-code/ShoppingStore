import { openSetting, getSetting, chooseAddress,showModal,showToast,login } from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
// pages/auth/index.js
Page({
  async handleGetUserInfo(e){
    try{
        // 获取数据
        const {encryptedData,iv,signature,rawData} = e.detail;
        const {code} = await login();
        // 封装数据
        const loginParams={encryptedData,rawData,iv,signature,code};
        console.log(loginParams);
        // 发送请求
        // 这里由于接口问题，直接使用token赋值
        // const res = await request({url:"/users/wxlogin",data:loginParams,method:"post"});
        const token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
        // 把token存下来，同时跳转到上一个页面
        wx.setStorageSync('token',token);
        wx.navigateBack({
          delta: 1,
        });
    }catch(error){
      console.log(error);
    }
  }
})