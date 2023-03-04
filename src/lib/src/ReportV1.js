"use strict";

var utils = require("../utils");

module.exports = function (defaultFuncs, api, ctx) {
    return function ReportV1(args,callback) {
        if (!args.Link && !args.RealName && !args.Content && !args.Gmail) throw new Error("Link,RealName,Content,Gmail are required");
        if (!args.Link) throw new Error("Missing args.Link, api.Premium.ReportV1(Link,RealName,Content,Gmail,Time,callback)");
        if (!args.RealName) throw new Error("Missing RealName, api.Premium.ReportV1(Link,RealName,Content,Time,Gmail,callback)");
        if (!args.Gmail) throw new Error("Missing Gmail, api.Premium.ReportV1(Link,RealName,Content,Gmail,Time,callback)");
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
        let RealForm;
        utils.get('https://www.facebook.com/help/contact/209046679279097?locale2=en_US', ctx.jar, null, ctx.globalOptions)
        .then(function(data) {
            RealForm = {
                crt_url: args.Link,
                crt_name: args.RealName,
                cf_age: "9 years",
                Field255260417881843: args.Content ? utils.getType(args.Content)=="String"? args.Content : "This timeline is impersonating me and my friends. It harass people on Facebook. I think this is a time line of baby, parents are not allowed. Please let Facebook account deactivated for Facebook is increasingly safer. Thank you!" : "This timeline is impersonating me and my friends. It harass people on Facebook. I think this is a time line of baby, parents are not allowed. Please let Facebook account deactivated for Facebook is increasingly safer. Thank you!",
                Field166040066844792: args.Gmail,
                source: '',
                support_form_id: 209046679279097,
                support_form_hidden_fields: JSON.stringify({}),
                support_form_fact_false_fields: [],
                lsd: utils.getFrom(data.body, "[\"LSD\",[],{\"token\":\"", "\"}")
            };
        }).then(function() {
            defaultFuncs.postFormData('https://www.facebook.com/ajax/help/contact/submit/page', ctx.jar, RealForm, {}) 
            .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
            .then(async function(dt) {
                if (dt.__ar == 1) {
                    callback(null, "success");
                }
                else {
                    callback(null, "error");
                }
            });
        })
        return returnPromise;
    }
};
//HORIZON