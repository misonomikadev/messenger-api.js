/* eslint-disable linebreak-style */
"use strict";

module.exports = function (defaultFuncs, api, ctx) {
    return function getAccessToken(callback) {
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
      var { getAccessToken } = require('../lib/getToken');
      getAccessToken(ctx.jar,ctx,defaultFuncs).then(data => callback(null,data));
    }
    catch (e) {
      callback(null, e);
    }
    return returnPromise;
    };
  };
//HORIZON