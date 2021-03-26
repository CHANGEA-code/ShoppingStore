
// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品，商家投诉",
        isActive:false
      }
    ],
    chooseImgs:[],
    // 定义变量保存文本内容
    textVal:""
  },
  // 定义变量保存上传到外网的图片链接
  upLoadImg:[],
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
  // 点击“+”按钮触发事件
  handleAddImg(){
    wx.chooseImage({
      count: 9,
      sizeType:['original','compressed'],
      sourseType:['album','camera'],
      success:(result)=>{
        this.setData({
          // 图片数组进行拼接
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })
      }
    })
  },
  // 点击图标删除图片
  handleRemoveImg(e){
    const {index} = e.currentTarget.dataset;
    let {chooseImgs} = this.data;
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
  },
  // 文本域输入文本响应事件
  handleTextarea(e){
    const textVal = e.detail.value;
    this.setData({
      textVal
    })
  },
  // 提交按钮响应事件
  handleSubmit(){
    const {textVal,chooseImgs} = this.data;
    if(!textVal.trim()){
      // 不存在
      wx.showToast({
        title: '输入不合法',
        icon:'none',
        mask:true
      })
      return;
    }
    // 显示正在上传中
    wx.showLoading({
      title: '正在上传中',
      mask: true
    })
    // 判断是否需要上传图片
    if(chooseImgs.length!=0){
      // 准备上传图片到专门的图片服务器
    // 由于只能单张图片上传，故需要用到遍历
    chooseImgs.forEach((v,i)=>{
      wx.uploadFile({
        filePath: v,
        name: 'image',
        url: 'https://img.coolcr.cn/api/upload',
        success:(result)=>{
          // 解析出url
          let url = JSON.parse(result.data).data.url;
          this.upLoadImg.push(url);
          // 等所有照片都遍历完成后才触发
          if(i===chooseImgs.length-1){
            console.log("把文本的内容和外网的图片数组提交到后台");
            // 提交成功后重置页面，并返回上一个页面
            this.setData({
              textVal:"",
              chooseImgs:[]
            })
            wx.navigateBack({
              delta: 1,
            })
            wx.hideLoading();            
          }
        }
      })
    })
      }
      else{
        wx.hideLoading();
        console.log("文字内容提交到后台");
      }
    }
    
})