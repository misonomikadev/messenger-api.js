"use strict";

var utils = require("../utils");
var log = require("npmlog");

function formatAttachmentsGraphQLResponse(attachment) {
  switch (attachment.__typename) {
    case "MessageImage":
      return {
        type: "photo",
        ID: attachment.legacy_attachment_id,
        filename: attachment.filename,
        thumbnailUrl: attachment.thumbnail.uri,

        previewUrl: attachment.preview.uri,
        previewWidth: attachment.preview.width,
        previewHeight: attachment.preview.height,

        largePreviewUrl: attachment.large_preview.uri,
        largePreviewHeight: attachment.large_preview.height,
        largePreviewWidth: attachment.large_preview.width,

        // You have to query for the real image. See below.
        url: attachment.large_preview.uri, // @Legacy
        width: attachment.large_preview.width, // @Legacy
        height: attachment.large_preview.height, // @Legacy
        name: attachment.filename, // @Legacy

        // @Undocumented
        attributionApp: attachment.attribution_app
          ? {
            attributionAppID: attachment.attribution_app.id,
            name: attachment.attribution_app.name,
            logo: attachment.attribution_app.square_logo
          }
          : null

        // @TODO No idea what this is, should we expose it?
        //      Ben - July 15th 2017
        // renderAsSticker: attachment.render_as_sticker,

        // This is _not_ the real URI, this is still just a large preview.
        // To get the URL we'll need to support a POST query to
        //
        //    https://www.facebook.com/webgraphql/query/
        //
        // With the following query params:
        //
        //    query_id:728987990612546
        //    variables:{"id":"100009069356507","photoID":"10213724771692996"}
        //    dpr:1
        //
        // No special form though.
      };
    case "MessageAnimatedImage":
      return {
        type: "animated_image",
        ID: attachment.legacy_attachment_id,
        filename: attachment.filename,

        previewUrl: attachment.preview_image.uri,
        previewWidth: attachment.preview_image.width,
        previewHeight: attachment.preview_image.height,

        url: attachment.animated_image.uri,
        width: attachment.animated_image.width,
        height: attachment.animated_image.height,

        thumbnailUrl: attachment.preview_image.uri, // @Legacy
        name: attachment.filename, // @Legacy
        facebookUrl: attachment.animated_image.uri, // @Legacy
        rawGifImage: attachment.animated_image.uri, // @Legacy
        animatedGifUrl: attachment.animated_image.uri, // @Legacy
        animatedGifPreviewUrl: attachment.preview_image.uri, // @Legacy
        animatedWebpUrl: attachment.animated_image.uri, // @Legacy
        animatedWebpPreviewUrl: attachment.preview_image.uri, // @Legacy

        // @Undocumented
        attributionApp: attachment.attribution_app
          ? {
            attributionAppID: attachment.attribution_app.id,
            name: attachment.attribution_app.name,
            logo: attachment.attribution_app.square_logo
          }
          : null
      };
    case "MessageVideo":
      return {
        type: "video",
        filename: attachment.filename,
        ID: attachment.legacy_attachment_id,

        thumbnailUrl: attachment.large_image.uri, // @Legacy

        previewUrl: attachment.large_image.uri,
        previewWidth: attachment.large_image.width,
        previewHeight: attachment.large_image.height,

        url: attachment.playable_url,
        width: attachment.original_dimensions.x,
        height: attachment.original_dimensions.y,

        duration: attachment.playable_duration_in_ms,
        videoType: attachment.video_type.toLowerCase()
      };
    case "MessageFile":
      return {
        type: "file",
        filename: attachment.filename,
        ID: attachment.message_file_fbid,

        url: attachment.url,
        isMalicious: attachment.is_malicious,
        contentType: attachment.content_type,

        name: attachment.filename, // @Legacy
        mimeType: "", // @Legacy
        fileSize: -1 // @Legacy
      };
    case "MessageAudio":
      return {
        type: "audio",
        filename: attachment.filename,
        ID: attachment.url_shimhash, // Not fowardable

        audioType: attachment.audio_type,
        duration: attachment.playable_duration_in_ms,
        url: attachment.playable_url,

        isVoiceMail: attachment.is_voicemail
      };
    default:
      return {
        error: "Don't know about attachment type " + attachment.__typename
      };
  }
}

module.exports = function(defaultFuncs, api, ctx) {
    return function getMessage(threadID, messageID, callback) {
      if (!threadID || !messageID) {
        return callback({ error: "getMessage: need threadID and messageID" });
      }

      const form = {
        "av": ctx.globalOptions.pageID,
        "queries": JSON.stringify({
          "o0": {
            //This doc_id is valid as of ? (prob January 18, 2020)
            "doc_id": "1768656253222505",
            "query_params": {
              "thread_and_message_id": {
                "thread_id": threadID,
                "message_id": messageID,
              }
            }
          }
        })
      };

      return defaultFuncs
      .post("https://www.facebook.com/api/graphqlbatch/", ctx.jar, form)
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then((resData) => {
        if (resData[resData.length - 1].error_results > 0) {
          throw resData[0].o0.errors;
        }

        if (resData[resData.length - 1].successful_results === 0) {
          throw { error: "getMessage: there was no successful_results", res: resData };
        }

        var fetchData = resData[0].o0.data.message;
        if (fetchData.__typename !== 'UserMessage') return fetchData
        if (fetchData) {
          var output = {
            threadID: threadID,
            messageID: fetchData.message_id,
            senderID: fetchData.message_sender.id,
            attachments: fetchData.blob_attachments.map(att => {
                var x;
                try {
                    x = formatAttachmentsGraphQLResponse(att);
                } catch (ex) {
                    x = att;
                    x.error = ex;
                    x.type = "unknown";
                }
                return x;
            }),
            body: fetchData.message.text,
            reactions: fetchData.message_reactions,
            mentions: fetchData.message.ranges.reduce(
              (object, mention) => Object.assign(object, {
                [mention.entity.id]: fetchData.message.text.slice(mention.offset, mention.offset + mention.length)
              }
            ), {}),
            timestamp: fetchData.timestamp_precise,
            messageReply: fetchData.replied_to_message && {
              threadID: threadID,
              messageID: fetchData.replied_to_message.message.message_id,
              senderID: fetchData.replied_to_message.message.message_sender.id,
              body: fetchData.replied_to_message.message.message.text,
              attachments: fetchData.replied_to_message.message.blob_attachments.map(att => {
                var x;
                try {
                    x = formatAttachmentsGraphQLResponse(att);
                } catch (ex) {
                    x = att;
                    x.error = ex;
                    x.type = "unknown";
                }
                return x;
              }),
              mentions: fetchData.replied_to_message.message.message.ranges.reduce(
                (object, mention) => Object.assign(object, {
                  [mention.entity.id]: fetchData.message.text.slice(mention.offset, mention.offset + mention.length)
                }
              ), {}),
              reactions: fetchData.replied_to_message.message.message_reactions,
              timestamp: fetchData.replied_to_message.message.timestamp_precise
            },
          }

          callback && callback(null, output)
          return output
        }
    })
    .catch((err) => {
      log.error("getMessage", err);
      callback && callback(err);
    });
  };
}; 