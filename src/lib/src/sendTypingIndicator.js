"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
  async function makeTypingIndicator(typ, threadID, callback, isGroup) {
    var form = {
      typ: +typ,
      to: !isGroup ? threadID : "",
      source: "mercury-chat",
      thread: threadID
    };

    // Check if thread is a single person chat or a group chat
    // More info on this is in api.sendMessage
    await defaultFuncs
      .post("https://www.facebook.com/ajax/messaging/typ.php", ctx.jar, form)
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function (resData) {
        if (resData.error) throw resData;
        return callback();
      })
      .catch(function (err) {
        log.error("sendTypingIndicator", err);
        if (utils.getType(err) == "Object" && err.error === "Not logged in") {
          ctx.loggedIn = false;
        }
        return callback(err);
      });
  }

  return async function sendTypingIndicator(threadID, callback, isGroup) {
    if (
      utils.getType(callback) !== "Function" &&
      utils.getType(callback) !== "AsyncFunction"
    ) {
      callback = () => { };
    }

    await makeTypingIndicator(true, threadID, callback, isGroup);

    return async function end(cb) {
      if (
        utils.getType(cb) !== "Function" &&
        utils.getType(cb) !== "AsyncFunction"
      ) {
        cb = () => { };
      }

      await makeTypingIndicator(false, threadID, cb, isGroup);
    };
  };
};
