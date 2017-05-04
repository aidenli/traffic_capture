"use strict";

function _saveUserSession(uid, skey) {
    wx.setStorageSync('uid', uid);
    wx.setStorageSync('skey', skey);
}

function _delUserSession() {
    wx.removeStorageSync('uid')
    wx.removeStorageSync('skey')
}

function _getUserSession() {
    return {
        uid: wx.getStorageSync('uid'),
        skey: wx.getStorageSync('skey')
    }
}

function _getMachineKey() {
    return wx.getStorageSync('midea_mk')
}

function _getMtag() {
    var mtagData = wx.getStorageSync('mtag'),
        now = (new Date()).getTime()
    if (mtagData) {
        mtagData = JSON.parse(mtagData)
        if (now <= mtagData.expire) {
            return mtagData.content || ''
        } else {
            wx.removeStorageSync('mtag')
        }
    }

    return ''
}

function _saveMtag(mtag) {
    // mtag统计
    var allTags = _getMtag(),
        regMtag = /^[1-4]\d{4}\.\d+\.\d+$/,
        arrTag = allTags.split(';'),
        tmpTag,
        newMtags = [],
        isReplace = false,
        mtagChannel;
    if (mtag && (regMtag.test(mtag))) {
        mtagChannel = mtag.split('.')[0].split('')[0];
        for (var i = 0; i < arrTag.length; i++) {
            tmpTag = arrTag[i];
            if (regMtag.test(tmpTag)) {
                if (tmpTag.split('.')[0].split('')[0] == mtagChannel) {
                    newMtags.push(mtag);
                    isReplace = true;
                } else {
                    newMtags.push(tmpTag);
                }
            }
        }

        if (newMtags.length === 0 || isReplace === false) {
            newMtags.push(mtag);
        }

        wx.setStorageSync('mtag', JSON.stringify({
            expire: (new Date()).getTime() + 604800000,
            content: newMtags.join(';')
        }));
    }
}

module.exports = {
    saveUserSession: function (uid, skey) {
        console.log('记录用户登录态')
        _delUserSession()
        _saveUserSession(uid, skey)
    },
    delUserSession: function () {
        _delUserSession()
    },
    getUserSession: function () {
        return _getUserSession()
    },
    getRequestCookie: function () {
        var data = _getUserSession(),
            appInstance = getApp()

        data['midea_mk'] = _getMachineKey()
        // 标记来源为微信小程序
        data['plt'] = 'wxsapp'
        // 标记小程序名称
        data['appid'] = appInstance ? appInstance.globalData.appid : ''
        data['mtag'] = _getMtag()
        return data
    },
    saveMachineKey: function (mk) {
        wx.setStorageSync('midea_mk', mk);
    },
    getMtag: function () {
        return _getMtag()
    },
    saveMtag: function (mtag) {
        _saveMtag(mtag)
    }
}