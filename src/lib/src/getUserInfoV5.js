"use strict";

var utils = require("../utils");
var log = require("npmlog");


module.exports = function(defaultFuncs, api, ctx) {

  return function getUserInfoV5GraphQL(id, callback) {
    var resolveFunc = function(){};
    var rejectFunc = function(){};
    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (utils.getType(callback) != "Function" && utils.getType(callback) != "AsyncFunction") {
      callback = function (err, data) {
        if (err) {
          return rejectFunc(err);
        }
        resolveFunc(data);
      };
    }

    // `queries` has to be a string. I couldn't tell from the dev console. This
    // took me a really long time to figure out. I deserve a cookie for this.
    var form = {
      queries: JSON.stringify({
        o0: {
          // This doc_id is valid as of July 20th, 2020
          doc_id: "5009315269112105",
          query_params: {
            ids: [id]
          }
        }
      }),
      batch_name: "MessengerParticipantsFetcher"
    };
      defaultFuncs
      .post("https://www.facebook.com/api/graphqlbatch/", ctx.jar, form)
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function(resData) {
      if (resData.error) {
        throw resData;
      }
      // This returns us an array of things. The last one is the success /
      // failure one.
      // @TODO What do we do in this case?
      if (resData[resData.length - 1].error_results !== 0) {
        console.error("GetThreadInfo", "Bạn Đang Bị Ăn Get Vì Sử Dụng Quá Nhiều !");
      }
        callback(null, resData);
    })
    .catch(function(err) {
      log.error("getThreadInfoGraphQL", "Lỗi: getThreadInfoGraphQL Có Thể Do Bạn Spam Quá Nhiều, Hãy Thử Lại !");
    return callback(err);
  });
    return returnPromise;
    }
};
//HORIZON