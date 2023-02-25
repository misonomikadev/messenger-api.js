"use strict";

var utils = require("../utils");
var log = require("npmlog");


module.exports = function (defaultFuncs, api, ctx) {
  return function getUserInfoV2(id, callback) {
    var resolveFunc = function () { };
    var rejectFunc = function () { };
    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });
    
    if (!callback) {
      callback = function (err, userInfo) {
        if (err) return rejectFunc(err);
        resolveFunc(userInfo);
      };
    }
    try {
      var { getInfo } = require('./../lib/getInfoNew');
      getInfo(id, ctx.jar, ctx, defaultFuncs)
        .then(data => {
          return callback(null, data);
        });
    }
    catch (e) {
      return callback(null, e);
    }
    return returnPromise;
  };
};
//HORIZON