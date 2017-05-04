/**
 * Created by lill12 on 2016-10-18.
 */
"use strict"
var mRequest = require('../../util/common/request'),
    mLocalCache = require('./localCache')

function _checkMachineKey() {
    mRequest.send({
        url: 'https://w.midea.com/common/log/mk',
        success: function (obj) {
            mLocalCache.saveMachineKey(obj.midea_mk)
        },
        fail: function (obj) {
            console.log(arguments)
            console.log(obj ? obj.errmsg : '设置machinekey失败')
        }
    })
}

module.exports = {
    checkMachineKey: _checkMachineKey
}