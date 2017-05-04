

function each(collection, callback) {
    if (Array.isArray(collection)) {
        collection.forEach(callback)
    } else {
        for (let key in collection) {
            if (callback.call(collection[key], collection[key], key) === false) {
                break
            }
        }
    }
}

module.exports  = {
    forEach: each,
    each
}