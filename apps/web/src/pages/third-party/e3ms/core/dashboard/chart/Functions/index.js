export let JSONfn
if (!JSONfn) {
  JSONfn = {}
}
;(function () {
  JSONfn.stringify = function (obj) {
    return JSON.stringify(obj, function (key, value) {
      return typeof value === "function" ? value.toString() : value
    })
  }

  JSONfn.parse = function (str) {
    if (str === null || str === undefined || str.trim() === "") return null
    return JSON.parse(str, function (key, value) {
      if (typeof value !== "string") return value
      return value.substring(0, 8) === "function" ? eval(`(${value})`) : value
    })
  }
})()
