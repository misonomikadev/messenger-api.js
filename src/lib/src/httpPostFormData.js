"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function(defaultFuncs, api, ctx) {
  return function httpPostFormData(url, form, callback) {
    var resolveFunc = function(){};
    var rejectFunc = function(){};

    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback && (utils.getType(form) == "Function" || utils.getType(form) == "AsyncFunction")) {
      callback = form;
      form = {};
    }

    form = form || {};
    
    
    callback = callback || function(err, data) {
        if (err) return rejectFunc(err);
        resolveFunc(data);
    };

    defaultFuncs
      .postFormData(url, ctx.jar, form)
      .then(function(resData) {
        callback(null, resData.body.toString());
      })
      .catch(function(err) {
        log.error("httpPostFormData", err);
        return callback(err);
      });

    return returnPromise;
  };
};