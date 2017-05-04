"use strict";

var mLocalCache = require('./localCache'),
    mString = require('./string'),
    mAuth = require('./auth')

function _checkError(obj, params) {
    let nErrCode = obj.errcode || obj.errCode
    if (nErrCode == 536860015) {
        // 未登录
        console.log('用户未登录')
        mLocalCache.delUserSession()
        if (params.custom === true) {
            obj.errType = 'unlogin'
            params.fail && params.fail(obj)
        } else {
            mAuth.doLogin({
                success: function () {
                    console.log('微信授权登录成功')
                    console.log(params)
                    // 登录成功，重试
                    if (!params.haveRetry && params.url) {
                        console.log('重试请求')
                        params.haveRetry = true
                        _send(params)
                    } else {
                        console.log('不重试，丢弃')
                    }
                },
                fail: function (obj) {
                    console.log('微信授权登录失败', obj)
                    if (obj && obj.errMsg === "getUserInfo:cancel") {
                        if(getCurrentPages().length > 1) {
                            // 用户拒绝授权，二级以上页面返回到上一页
                            wx.navigateBack()
                        }
                    } else {
                        // 登录失败
                        params.fail && params.fail(obj)
                    }
                },
                custom: params.custom
            })
        }
    } else {
        console.log('接口出现业务失败')
        obj.errType = 'business error'
        // 业务失败
        params.fail && params.fail(obj)
    }
}

function _checkLogin(params) {
    let oCookieData = mLocalCache.getRequestCookie()

    wx.checkSession({
        success: function () {
            // 微信登录态未过期，验证电商系统的登录态
            params.url = 'https://w.midea.com/mlogin/is_login'
            params.header = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': mString.cookieSerialize(oCookieData)
            }
            _send(params)
        },
        fail: function () {
            // 登录态过期
            _checkError({errcode: 539299862}, params)
        }
    })
}

function _send(params = {}) {
    let conf = {},
        appInstance = getApp()

    for (let key in params) {
        conf[key] = params[key]
    }

    let method = conf.method ? conf.method.toUpperCase() : 'GET',
        success = conf.success,
        fail = conf.fail,
        complete = conf.complete

    conf.method = method

    if (method !== 'GET' && conf.data && typeof conf.data !== 'string') {
        conf.data = mString.formSerialize(conf.data)
    }

    if (!conf.header) {
        conf.header = {}
    }

    // 设置post的contenttype
    if (method === 'POST') {
        if (!conf.header['Content-Type']) {
            conf.header['Content-Type'] = 'application/x-www-form-urlencoded'
        }
        conf.header['content-type'] = conf.header['Content-Type']
    }

    // 设置登录态等cookie
    let oCookieData = mString.cookieUnserialize(conf.header.Cookie),
        rData = mLocalCache.getRequestCookie()
    for (let key in rData) {
        oCookieData[key] = rData[key]
    }
    conf.header.Cookie = mString.cookieSerialize(oCookieData)

    if (success) {
        conf.success = function (response) {
            console.log('接口数据返回')
            var obj = response.data,
                nErrCode = obj.errcode

            // 不带errcode的接口，根据http状态为200时认为也是业务成功，兼容静态数据
            if ((nErrCode == null && (response.statusCode * 1) == 200) || nErrCode == 0) {
                success && success(obj)
            } else {
                _checkError(obj, params)
            }
        }
    }

    if (fail) {
        conf.fail = function () {
            // 上报错误
            fail && fail()
        }
    }

    // console.log(conf)
    wx.request(conf)
}

module.exports = {
    send: _send,
    checkLogin: _checkLogin,
    checkError: _checkError
}