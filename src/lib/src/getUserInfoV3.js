/* eslint-disable linebreak-style */
"use strict";

var utils = require("../utils");
var log = require("npmlog");


module.exports = function (defaultFuncs, api, ctx) {
    return function getUserInfoV3(id,full, callback) {
        if (utils.getType(full) !== "Boolean") {
            throw {error: "getUserInfoV3: full must be a boolean"};
        }
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

var form = {
    "av": ctx.userID,
    "fb_api_caller_class": "RelayModern",
    "fb_api_req_friendly_name": "ProfileCometTimelineFeedRefetchQuery",
    "variables": JSON.stringify({ 
        "id": String(id) 
    }),
    "doc_id": 5092283120862795
}
try {
        defaultFuncs
            .post("https://www.facebook.com/api/graphql/", ctx.jar, form)
            .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
            .then(function (resData) {
            if (resData.error) throw resData;
                switch (full) {
                    case true:
                        callback(null, resData[0].data.node.timeline_list_feed_units.edges[0].node);
                        break;
                    case false:
                        callback(null, resData[0].data.node.timeline_list_feed_units.edges[0].node.comet_sections.context_layout.story.comet_sections.actor_photo.story.actors[0]);
                        break;
                    default: 
                throw {error: "getUserInfoV3: full must be a boolean"};
                }
            })
            .catch(function (err) {
                log.error("getUserInfo", "Rate limit reached. (getUserInfo)");
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