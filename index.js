// :: a -> String
var classOf = Function.call.bind({}.toString)

// :: a -> Bool
function isObject(a){ return Object(a) === a }

// :: a -> Bool
function isString(a){ return classOf(a) === '[object String]' }

// :: a -> Bool
function isFunction(a){ return typeof a == 'function' }

// :: Object*, Object -> Object*
function extend(target, source) {
  var keys = Object.keys(source)
  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i]
    if (isObject(source[key])) {
      if (!target[key]) target[key] = source[key]
      else              target[key] = extend(clone(target[key]), source[key])
    }
    else if (target[key] !== source[key])
      target[key] = source[key]
  }
  return target
}

// :: [String], a -> { String -> a }
// :: String, a -> { String -> a }
function toObject(parts, value) {
  if (isObject(parts))  return parts
  if (isString(parts))  parts = parts.split('.')
  var len = parts.length - 1, result = {}
  parts.reduce(function(result, part, i) {
    return i == len?  result[part] = value
    :                 result[part] = {}
  }, result)
  return result
}

// :: Object -> Object
var clone = Object.create

// :: Object -> Maybe Object
var protoOf = Object.getPrototypeOf

// :: type ImmutableHashT a
var ImmutableHashT = {
  // :: @ImmutableHash => Object -> ImmutableHash <| Object
  // :: @ImmutableHash => String, a -> ImmutableHash <| Object
  // :: @ImmutableHash => [String], a -> ImmutableHash <| Object
  patch: function(struct, value) {
    var result = new ImHash()
    result._data = extend(clone(this._data), toObject(struct, value))
    return result
  }

  // :: @ImmutableHash => String -> a
, get: function(key) {
    return key.split('.').reduce(function(result, key) {
      return result[key]
    }, this._data)
  }

  // :: @ImmutableHash => String -> Bool
, has: function(key) {
    var d = this._data
    return key.split('.').every(function(key) {
      var r = key in d
      d = d[key]
      return r
    })
  }

  // :: @ImmutableHash => () -> Object
, toJSON: function() {
    var result = {}
    for (var key in this._data) {
      result[key] = this._data[key]
    }
    return result
  }

  // :: @ImmutableHash => (a -> b) -> ImmutableHash
  // :: @ImmutableHash => String, (a -> b) -> ImmutableHash
  // :: @ImmutableHash => [String], (a -> b) -> ImmutableHash
, map: function(query, lambda) {
    if (isFunction(query)) lambda = query, query = ''

    var data = query? this.get(query) : this._data
    var diff = {}

    for (var key in data) {
      diff[key] = lambda(data[key], key)
    }

    return query?  this.patch(query, diff) : this.patch(diff)
  }
}

// type ImmutableHash <| ImmutableHashT
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
