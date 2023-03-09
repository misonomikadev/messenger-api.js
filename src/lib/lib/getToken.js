var utils = require('../utils');
var log = require('../logger');
var OTP = require('totp-generator');
//var FastConfig = require("./../../FastConfig");
//var { AuthString } = FastConfig

module.exports.getAccessToken = async function (jar, ctx, defaultFuncs) {
  if (global.data?.AccessToken) {
    return global.data.AccessToken;
  }
  else {
    var netURLS = "https://business.facebook.com/security/twofactor/reauth/enter/";
    return defaultFuncs.get('https://business.facebook.com/business_locations', jar, null, ctx.globalOptions).then(async function(data) {
      try {
        if (/"],\["(.*?)","/.exec(/LMBootstrapper(.*?){"__m":"LMBootstrapper"}/.exec(data.body)[1])[1])  {
          global.data.AccessToken = /"],\["(.*?)","/.exec(/LMBootstrapper(.*?){"__m":"LMBootstrapper"}/.exec(data.body)[1])[1];
          return global.data.AccessToken;
        }
      }
      catch (_) {
        var OPTCODE = AuthString.includes(" ") ? AuthString.replace(RegExp(" ", 'g'), "") : AuthString;
        var Form = { 
          approvals_code: OTP(String(OPTCODE)),
          save_device: true,
          lsd: utils.getFrom(data.body, "[\"LSD\",[],{\"token\":\"", "\"}")
        }
        return defaultFuncs.post(netURLS, jar, Form, ctx.globalOptions, { 
          referer: "https://business.facebook.com/security/twofactor/reauth/?twofac_next=https%3A%2F%2Fbusiness.facebook.com%2Fbusiness_locations&type=avoid_bypass&app_id=0&save_device=1",
            }).then(async function(data) {
          if (String(data.body).includes(false)) throw { Error: "Invaild OTP | FastConfig.json: AuthString" }
            return defaultFuncs.get('https://business.facebook.com/business_locations', jar, null, ctx.globalOptions,{ 
              referer: "https://business.facebook.com/security/twofactor/reauth/?twofac_next=https%3A%2F%2Fbusiness.facebook.com%2Fbusiness_locations&type=avoid_bypass&app_id=0&save_device=1",
            })
              .then(async function(data) {
                var Access_Token = /"],\["(.*?)","/.exec(/LMBootstrapper(.*?){"__m":"LMBootstrapper"}/.exec(data.body)[1])[1];
                global.data.AccessToken = Access_Token;
                return Access_Token;
              });
        });
      }
    })
  }
}