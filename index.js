// :: a -> Bool
function isObject(a){ return Object(a) === a }

// :: Object*, Object -> Object*
function extend(target, source) {
  var keys = Object.keys(source)
  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i]
    if (isObject(source[key])) {
      if (!target[key]) target[key] = source[key]
      else              extend(target[key], source[key])
    }
    else if (target[key] !== source[key])
      target[key] = source[key]
  }
  return target
}

// :: Object -> Object
var clone = Object.create

// :: Object -> Maybe Object
var protoOf = Object.getPrototypeOf

// :: type ImmutableHashT a
var ImmutableHashT = {
  // :: @ImmutableHashT => Object -> ImmutableHashT <| b
  patch: function(struct) {
    var result = new ImHash()
    result._data = extend(clone(this._data), struct)
    return result
  }

  // :: String -> a
, get: function(key) {
    return this._data[key]
  }

  // :: String -> Bool
, has: function(key) {
    return key in this._data
  }

  // :: () -> Object
, toJSON: function() {
    var result = {}
    for (var key in this._data) {
      result[key] = this._data[key]
    }
    return result
  }
}

// Object ImHash
ImHash.prototype = ImmutableHashT
function ImHash() {
  this._data = clone(null)
}

// :: Object -> ImmutableHash
function immutableHash(struct) {
  var result = new ImHash()
  if (struct)  result = result.patch(struct)
  return result
}


module.exports = extend(immutableHash, {
  ImmutableHashT: ImmutableHashT
})
