function _getCurrentLocation(events = {}) {
    wx.getLocation({
        success: events.success,
        fail: events.fail,
        complete: events.complete
    })
}

module.exports = {
    getCurrentLocation: _getCurrentLocation
}