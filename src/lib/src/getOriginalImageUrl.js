"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
  return function getOriginalImageUrl(attachmentID, messageID, threadID, callback) {
    var resolveFunc = function () { };
    var rejectFunc = function () { };
    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });
    if (!callback) {
      callback = function (err, data) {
        if (err) return rejectFunc(err);
        resolveFunc(data);
      };
    }

    var params = {
      attachment_id: attachmentID,
      message_id: messageID,
      thread_id: threadID,
    };
    
    const propertiesMedia = ctx.globalOptions.propertiesMedia;

    var additionalHeaders = {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "dpr": "1.125",
      "sec-ch-prefers-color-scheme": "dark",
      "sec-ch-ua": `"Chromium";v="${propertiesMedia.chromiumVersion.split('.')[0]}", "Google Chrome";v="${propertiesMedia.chromiumVersion.split('.')[0]}", "Not=A?Brand";v="${propertiesMedia.notABrand.split('.')[0]}"`,
      "sec-ch-ua-full-version-list": `"Chromium";v="${propertiesMedia.chromiumVersion}", "Google Chrome";v="${propertiesMedia.chromiumVersion}", "Not=A?Brand";v="${propertiesMedia.notABrand}"`,
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": "\"\"",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-ch-ua-platform-version": "\"10.0.0\"",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "viewport-width": `"${ctx.jar.getCookies("https://www.facebook.com").find(x => x.key == "wd").value.split("x")[0]}"`,
      "User-Agent": propertiesMedia.userAgent,
    };

    utils
      .get2("https://www.facebook.com/messenger_media/?" + new URLSearchParams(params), ctx.jar, additionalHeaders, ctx.globalOptions, ctx)
      .then(function (resData) {
        if (resData.error) throw resData;

        let downloadable_uri = utils.getFrom(resData.body, '"downloadable_uri":"', '&dl=1"}')?.replace(/\\/g, '');

        return callback(null, { url: downloadable_uri });
      })
      .catch(function (err) {
        log.error("getOriginalImageUrl", err);
        return callback(err);
      });

    return returnPromise;
  };
};
