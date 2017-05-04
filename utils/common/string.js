"use strict";

var class2type = {},
    toString = class2type.toString,
    isArray = Array.isArray || function (object) {
            return object instanceof Array
        }

// Populate the class2type map
"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function (name, i) {
    class2type["[object " + name + "]"] = name.toLowerCase()
})

function getType(obj) {
    return obj == null ? String(obj) :
    class2type[toString.call(obj)] || "object"
}

function isFunction(value) {
    return getType(value) == "function"
}
function isWindow(obj) {
    return obj != null && obj == obj.window
}
function isObject(obj) {
    return getType(obj) == "object"
}
function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
}

function serialize(params, obj, traditional, scope) {
    var type, array = isArray(obj), hash = isPlainObject(obj)
    for (var key in obj) {
        let value = obj[key]
        type = getType(value)
        if (scope) key = traditional ? scope :
        scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
        // handle data in serializeArray() format
        if (!scope && array) params.add(value.name, value.value)
        // recurse into nested objects
        else if (type == "array" || (!traditional && type == "object"))
            serialize(params, value, traditional, key)
        else params.add(key, value)
    }
}

function param(obj, traditional) {
    var params = []
    params.add = function (key, value) {
        if (isFunction(value)) value = value()
        if (value == null) value = ""
        this.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
    }
    serialize(params, obj, traditional)
    return params.join('&').replace(/%20/g, '+')
}


function getArray(data) {
    let arr = []
    for (let key in data) {
        let v = data[key]
        if (v) {
            arr.push(key + '=' + v)
        }
    }
    return arr;
}

module.exports = {
    formSerialize: function (data) {
        return param(data)
    },
    cookieSerialize: function (data) {
        return getArray(data).join(';')
    },
    cookieUnserialize: function (data) {
        if (!data) {
            return {}
        } else {
            let arr = data.split(';'),
                cookieData = {}
            for (let i = 0; i < arr.length; i++) {
                let tmp = arr[i].split('=')
                if (tmp.length === 2) {
                    cookieData[tmp[0]] = tmp[1]
                }
            }
            return cookieData
        }
    }
}