//app.js
App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        this.globalData.extConfig = wx.getExtConfigSync()
        this.globalData.appid = this.globalData.extConfig.appid
        this.globalData.domain = this.globalData.extConfig.domain
    },
    globalData: {
        userInfo: null,
        extConfig: null,
        appid: null,
        domain: null
    }
})