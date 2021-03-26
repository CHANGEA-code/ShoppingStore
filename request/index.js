// 定义同时发送异步代码的变量
let ajaxTimes=0;
export const request = (params) => {
    let header={...params.header};
    // 判断是否有请求头
    if(params.url.includes("/my/")){
        header["Authorization"] = wx.getStorageSync('token');
    }
    ajaxTimes++;
     // 定义公共url
     const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1";
     // 显示加载中 效果
     wx.showLoading({
        title: '加载中',
        mask:true
      });
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            url:baseUrl+params.url,
            header:header,
            success: (result) => {
                resolve(result.data.message); 
            }, 
            fail: (err) => {
                reject(err);
            },
            // 无论成功或失败都会调用的方法
            complete:()=>{
                ajaxTimes--;
                if(ajaxTimes===0)
                {
                    // 关闭正在加载的效果
                    wx-wx.hideLoading();
                }
                
            }
        });
    })
}