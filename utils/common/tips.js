/**
 * Created by lill12 on 2016-10-24.
 */
"use strict";

function _getPage() {
    var appInstance = getApp()
    return appInstance.getPage()
}

function _init() {
    let pageInstance = _getPage()
    pageInstance.setData({
        showLoading: false,
        showToast: false,
        showModal: false
    })
}

function Tips() {
    _init()
    return this
}

Tips.prototype = {
    loadingTimeoutTag: null,
    showLoading: function ({text = '请稍候...', timeout = 10000, change=null} = {}) {
        let pageInstance = _getPage()

        if (change) {
            pageInstance._utilLoadingChange = function (e) {
                let ret = change(e)
                if (ret !== false) {
                    pageInstance.setData({
                        _utilShowLoading: false
                    })
                    clearTimeout(this.loadingTimeoutTag)
                }
            }
        } else {
            pageInstance._utilLoadingChange = function () {
            }
        }

        pageInstance.setData({
            _utilLoadingText: text,
            _utilShowLoading: true
        })

        this.loadingTimeoutTag = setTimeout(function () {
            pageInstance.setData({
                _utilShowLoading: false
            })
        }, timeout)
        return this
    },
    hideLoading: function () {
        let pageInstance = _getPage()
        pageInstance.setData({
            _utilShowLoading: false
        })
        clearTimeout(this.loadingTimeoutTag)
        return this
    },
    showModal: function ({title='', message='', type='confirm', confirm=null, cancel=null}) {
        let pageInstance = _getPage()
        if (confirm) {
            pageInstance._utilModalConfirm = function (e) {
                let ret = confirm(e)
                if (ret !== false) {
                    pageInstance.setData({
                        _utilShowModal: false
                    })
                }
            }
        } else {
            pageInstance._utilModalConfirm = function () {
            }
        }

        if (cancel) {
            pageInstance._utilModalCancel = function (e) {
                let ret = cancel(e)
                if (ret !== false) {
                    pageInstance.setData({
                        _utilShowModal: false
                    })
                }
            }
        } else {
            pageInstance._utilModalCancel = function () {
            }
        }

        pageInstance.setData({
            _utilModalTitle: title,
            _utilModalMsg: message,
            _utilModalType: type,
            _utilShowModal: true
        })
        return this
    },
    hideModal: function () {
        let pageInstance = _getPage()
        pageInstance.setData({
            showModal: false
        })
        return this
    },
    showToast: function ({text='', timeout=3000, change = null}) {
        let pageInstance = _getPage()

        pageInstance._utilToastChange = function (e) {
            let ret = change ? change(e) : true
            if (ret !== false) {
                pageInstance.setData({
                    _utilShowToast: false
                })
            }
        }

        pageInstance.setData({
            _utilToastMsg: text,
            _utilToastTime: timeout,
            _utilShowToast: true
        })

        return this
    },
    hideToast: function () {
        pageInstance.setData({
            _utilShowToast: false
        })

        return this
    }
}
module.exports = {
    init: function () {
        return new Tips()
    }
}