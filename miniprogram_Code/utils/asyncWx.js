// promise形式
export const getSetting = () => {
        return new Promise((resolve, reject) => {
            wx.getSetting({
                success: (result) => {
                    resolve(result);
                },
                fail: (err) => {
                    reject(err);
                }
            });
        })
    }
    // promise形式
export const chooseAddress = () => {
        return new Promise((resolve, reject) => {
            wx.chooseAddress({
                success: (result) => {
                    resolve(result);
                },
                fail: (err) => {
                    reject(err);
                }
            });
        })
    }
    // promise形式
export const openSetting = () => {
    return new Promise((resolve, reject) => {
        wx.openSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    })
}
    // promise形式
export const showModal = ({content}) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title:'提示',
            content:content,
            success:(res)=>{
                resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
        })   
    })
}
// promise形式
export const showToast = ({title}) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title:title,
            icon:"none",
            success:(res)=>{
                resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
        })   
    })
}
// promise形式
export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout: 10000,
            success:(res)=>{
                resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
        })   
    })
}

// promise形式
export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            ...pay,
            success:(res)=>{
                resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
        })   
    })
}