//index.js
//获取应用实例
var app = getApp(),
    mRequest = require('../../utils/common/request')

Page({
    data: {
        userInfo: {},
        captureSrc: '',
        locationSrc: '',
        address: '',
        fullinfo: ''
    },
    onLoad: function () {
        mRequest.send({
            url: 'https://www.wxappnow.com/traffic_capture/capturer/get_user_info',
            success: function () {

            }
        });
    },
    capture: function () {
        let that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = res.tempFilePaths
                that.setData({
                    captureSrc: tempFilePaths[0]
                })
                wx.getLocation({
                    type: 'gcj02', //返回可以用于wx.openLocation的经纬度
                    success: function (res) {
                        let latitude = res.latitude,
                            longitude = res.longitude,
                            potion = latitude + ',' + longitude

                        that.setData({
                            locationSrc: `http://apis.map.qq.com/ws/staticmap/v2/?center=${potion}&zoom=16&size=180*320&scale=2&maptype=roadmap&markers=color:blue|label:A|${potion}&key=FGHBZ-7HFA3-FPA3O-3WK2N-AHLM3-6RF3C`
                        })

                        mRequest.send({
                            url: 'https://www.wxappnow.com/traffic_capture/record/get_location_name',
                            data: {
                                latitude: latitude,
                                longitude: longitude
                            },
                            success: function (obj) {
                                if (obj.errcode === 0) {
                                    console.log(obj.data)
                                    that.setData({
                                        address: obj.data.address + ',' + obj.data.formatted_addresses.recommend
                                    })
                                }
                            }
                        })
                    }
                })
            }
        })
    }
})
