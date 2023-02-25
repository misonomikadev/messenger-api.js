/* eslint-disable linebreak-style */
"use strict";

var utils = require("../utils");
var log = require("npmlog");


module.exports = function (defaultFuncs, api, ctx) {
    return function getUserInfoV4(id, callback) {
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

        if (utils.getType(id) !== "Array") id = [id];

    var form = {
        av: ctx.userID,
        fb_api_caller_class: "RelayModern",
        fb_api_req_friendly_name: "PresenceStatusProviderSubscription_ContactProfilesQuery",
        variables: JSON.stringify({
            ids: id
        }),
        doc_id: 7188178894556645
    };
    console.log(form)
try {
        defaultFuncs
            .post("https://www.facebook.com/api/graphql/", ctx.jar, form)
            .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
            .then(function (resData) {
            if (resData.error) throw resData;
                callback(null,resData.data.viewer.chat_sidebar_contact_nodes[0])
            })
            .catch(function (err) {
                console.log(err)
                log.error("getUserInfo", "Lỗi: getUserInfo Có Thể Do Bạn Spam Quá Nhiều !,Hãy Thử Lại !");
                return callback(err);
            });
    }
    catch (e) {
        return callback(null, e);
    }
    return returnPromise;
    };
};
//HORIZON