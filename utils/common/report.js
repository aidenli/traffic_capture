/**
 * Created by lill12 on 2016-10-26.
 */
"use strict";
var mRequest = require('./request')
var util = require('../components/util')
var mLocalCache = require('./localCache')

function Statics({options = {}} = {}) {
    // 页面参数对象
    this.options = options

    let that = this,
        appInstance = getApp(),
        pageInstance = appInstance.getPage()

    // 初始化页面点击事件捕获
    pageInstance.__captureMtag__ = function (e) {
        var target = e.target,
            mtag = target.dataset.mtag

        if (mtag) {
            that.captureTap(mtag, that.options)
        }
    }

    pageInstance.setData({
        '__reportTag__': 0
    })

    var onShow = pageInstance.onShow,
        onUnload = pageInstance.onUnload;

    pageInstance.onShow = function () {
        if (pageInstance.data.__reportTag__ === 0) {
            // 上报访问url
            that.captureTap(that.options['mtag'] || '', that.options)

            pageInstance.setData({
                '__reportTag__': 1
            })
        }

        if (onShow) {
            onShow.apply(pageInstance, arguments)
        }
    }

    pageInstance.onUnload = function () {
        pageInstance.setData({
            '__reportTag__': 0
        })

        if (onUnload) {
            onUnload.apply(pageInstance, arguments)
        }
    }
}

Statics.prototype.captureTap = function (mtag, options) {
    if (!(mtag || options)) {
        return false;
    }

    var appInstance = getApp(),
        pageInstance = appInstance.getPage()

    var commonParams = {
        curl: pageInstance.__route__,
        rurl: '',
        serviceid: 10,
        command: 'wxapp',
        mtag: mtag
    }

    var extendParams = {};

    if (options) {
        extendParams = {
            skuid: options['skuid'] || '',
            distributorid: options['distributorid'] || '',
            dealid: options['dealid'] || '',
            sellerid: options['sellerid'] || '',
            supplierid: options['supplierid'] || '',
            fromuid: '',
            from: ''
        };
    }

    // 上报mtag
    let oParams = util.extend(commonParams, extendParams);

    // 保存mtag到本地缓存
    mLocalCache.saveMtag(mtag)

    mRequest.send({
        url: 'https://w.midea.com/common/log/rd',
        data: oParams,
        method: 'post',
        success: function () {
            console.log(arguments);
            return true;
        },
        fail: function () {
            console.log(arguments);
            return false;
        }
    })
}

function _saveMtag(mtag) {

}

module.exports = {
    init: function (conf = {}) {
        return new Statics(conf)
    },
    doReport: Statics.prototype.captureTap
}