var benchmark = require("./index")
var ImmutableHash = require("../index")
var patch = require('diffpatcher/patch')

function randomStruct(n) {
  var result = {}
  result[String.fromCharCode(n + 65)] = 1
  return result
}

function genRandom(times, source) {
  var result = source
  while (times--) result = result.patch(randomStruct(times))
  return result
}

var hash1 = ImmutableHash({ a: 1 })
var hash10 = genRandom(10, hash1)
var hash100 = genRandom(100, hash1)
var hash1000 = genRandom(1000, hash1)

benchmark("Creating a hash", function () {
  var hash = ImmutableHash({ foo: "bar", baz: "fuux" })
})

benchmark("Calling toJSON() x 1", function () {
  var res = hash1.toJSON()
})
benchmark("Calling toJSON() x 10", function () {
  var res = hash10.toJSON()
})
benchmark("Calling toJSON() x 100", function () {
  var res = hash100.toJSON()
})
benchmark("Calling toJSON() x 1000", function () {
  var res = hash1000.toJSON()
})

benchmark("Successful get() x 1", function () {
  var res = hash1.get("a")
})
benchmark("Successful get() x 10", function () {
  var res = hash10.get("a")
})
benchmark("Successful get() x 100", function () {
  var res = hash100.get("a")
})
benchmark("Successful get() x 1000", function () {
  var res = hash1000.get("a")
})

benchmark("Failed get() x 1", function () {
  var res = hash1.get(" ")
})
benchmark("Failed get() x 10", function () {
  var res = hash10.get(" ")
})
benchmark("Failed get() x 100", function () {
  var res = hash100.get(" ")
})
benchmark("Failed get() x 1000", function () {
  var res = hash1000.get(" ")
})

benchmark("Successful has() x 1", function () {
  var res = hash1.has("a")
})
benchmark("Successful has() x 10", function () {
  var res = hash10.has("a")
})
benchmark("Successful has() x 100", function () {
  var res = hash100.has("a")
})
benchmark("Successful has() x 1000", function () {
  var res = hash1000.has("a")
})


benchmark("Failed has() x 1", function () {
  var res = hash1.has(" ")
})
benchmark("Failed has() x 10", function () {
  var res = hash10.has(" ")
})
benchmark("Failed has() x 100", function () {
  var res = hash100.has(" ")
})
benchmark("Failed has() x 1000", function () {
  var res = hash1000.has(" ")
})


benchmark("Calling patch() on hash(1)", function() {
  var res = hash1.patch({ " ": 2 })
})
benchmark("Calling patch() on hash(10)", function() {
  var res = hash10.patch({ " ": 2 })
})
benchmark("Calling patch() on hash(100)", function() {
  var res = hash100.patch({ " ": 2 })
})
benchmark("Calling patch() on hash(1000)", function() {
  var res = hash1000.patch({ " ": 2 })
})
var hash1e5 = genRandom(100, hash1000)
benchmark("Calling patch() on hash(100000)", function() {
  var res = hash1e5.patch({ " ": 2 })
})


benchmark("ImmutableHash integration()", function () {
    var hash = ImmutableHash()

    var hash2 = hash.patch({ foo: "bar" })

    var hash3 = hash2.patch({ foo: "baz" })

    var hash4 = hash3.patch({ "foo":  null })

    var hash5 = hash4.patch({ bar: { baz: true } })

    var hash6 = hash5.patch({ bar: { fuux: false } })

    var hash7 = hash6.patch({ bar : { baz: "hello world" }})

    var hash8 = hash7.map("bar", function (x) {
        return String(x)
    })

    var hash9 = hash8.patch({ baz: { one: "hello", two: "world" } })

    var hash10 = hash9.map(function (x) {
        return x.patch("prop", { live: 42 })
    })
})

benchmark("diffpatcher integration()", function() {
    var hash = {}

    var hash2 = patch(hash, { foo: "bar" })

    var hash3 = patch(hash2, { "foo": "baz" })

    var hash4 = patch(hash3, { "foo": null })

    var hash5 = patch(hash4, { bar: { baz: true } })

    var hash6 = patch(hash5, { bar: { fuux: false } })

    var hash7 = patch(hash6, { bar: { baz: "hello world" } })

    var hash8 = patch(hash7, {
        bar: Object.keys(hash7.bar).reduce(function (acc, k) {
            acc[k] = String(hash7.bar[k])
            return acc
        }, {})
    })

    var hash9 = patch(hash8, { baz: { one: "hello", two: "world" } })

    var hash10 = Object.keys(hash9).reduce(function (acc, k) {
        acc[k] = patch(hash9[k], { prop: { live: 42 } })
        return acc
    }, {})
})