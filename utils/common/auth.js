/**
 * Created by lill12 on 2016-10-17.
 */
"use strict";
let mString = require('./string'),
    mLocalCache = require('./localCache'),
    appInstance = getApp(),
    domain = appInstance.globalData.domain

function _doLogin(params) {
    let success = params.success,
        fail = params.fail

    wx.login({
        success: function (res) {
            console.log(res)
            if (res.code) {
                wx.request({
                    url: domain + '/wxapp/user/do_auth',
                    data: mString.formSerialize({
                        code: res.code
                    }),
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'content-type': 'application/x-www-form-urlencoded',
                        Cookie:  mString.cookieSerialize(mLocalCache.getRequestCookie())
                    },
                    method: 'POST',
                    success: function (response) {
                        var obj = response.data
                        console.log(obj)
                        if (obj.errcode === 0) {
                            wx.getUserInfo({
                                success: function (res) {
                                    console.log(res)
                                    wx.request({
                                        url: domain + '/wxapp/user/login_uid',
                                        data: mString.formSerialize({
                                            openid: obj.data.strOpenId,
                                            encryptdata: res.encryptData,
                                            encrypteddata: res.encryptedData,
                                            iv: res.iv,
                                            rawdata: res.rawData,
                                            signature: res.signature
                                        }),
                                        header: {
                                            'Content-Type': 'application/x-www-form-urlencoded',
                                            'content-type': 'application/x-www-form-urlencoded',
                                            Cookie:  mString.cookieSerialize(mLocalCache.getRequestCookie())
                                        },
                                        method: 'POST',
                                        success: function (response) {
                                            var obj = response.data
                                            console.log(obj)
                                            if (obj.errcode === 0) {
                                                mLocalCache.saveUserSession(obj.data.oLoginInfo.uid, obj.data.oLoginInfo.skey)
                                                success && success(obj)
                                            } else {
                                                console.log('业务失败')
                                                fail && fail(obj)
                                            }
                                        },
                                        fail: function (obj) {
                                            console.log('调用wx.getUserInfo失败', arguments)
                                            fail && fail(obj)
                                        }
                                    })
                                },
                                fail: function () {
                                    console.log('调用wx.getUserInfo失败', arguments)
                                    fail && fail()
                                }
                            })
                        } else {
                            console.log('业务失败')
                            fail && fail(obj)
                        }
                    },
                    fail: function () {
                        console.log('请求失败')
                        fail && fail()
                    }
                })
            } else {
                console.log('获取用户登录态失败', arguments)
                fail && fail()
            }
        },
        fail: function () {
            console.log('调用wx.login失败')
            fail && fail()
        }
    })
}


module.exports = {
    doLogin: _doLogin
}