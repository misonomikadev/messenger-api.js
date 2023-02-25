var utils = require('./../utils');
var logger = require('./../logger')
var OTP = require('totp-generator');

module.exports.getInfo = async function (id, jar, ctx, defaultFuncs) {
  var AccessToken = await require("./getToken").getAccessToken(jar, ctx, defaultFuncs);
  var { body:Data } = await utils.get(`https://graph.facebook.com/${id}?fields=name,first_name,email,about,birthday,gender,website,hometown,link,location,quotes,relationship_status,significant_other,username,subscribers.limite(0)&access_token=${AccessToken}`, jar, null, ctx.globalOptions);
  var Format = {
    id: JSON.parse(Data).id || "Không Có Dữ Liệu",
    name: JSON.parse(Data).name || "Không Có Dữ Liệu",
    first_name: JSON.parse(Data).first_name || "Không Có Dữ Liệu",
    username: JSON.parse(Data).username || "Không Có Dữ Liệu",
    link: JSON.parse(Data).link || "Không Có Dữ Liệu",
    verified: JSON.parse(Data).verified || "Không Có Dữ Liệu",
    about: JSON.parse(Data).about || "Không Có Dữ Liệu",
    avatar: `https://graph.facebook.com/${id}/picture?height=1500&width=1500&access_token=1449557605494892|aaf0a865c8bafc314ced5b7f18f3caa6` || "Không Có Dữ Liệu",
    birthday: JSON.parse(Data).birthday || "Không Có Dữ Liệu",
    follow: JSON.parse(Data).subscribers.summary.total_count || "Không Có Dữ Liệu",
    gender: JSON.parse(Data).gender || "Không Có Dữ Liệu",
    hometown: JSON.parse(Data).hometown || "Không Có Dữ Liệu",
    email: JSON.parse(Data).email || "Không Có Dữ Liệu",
    interested_in: JSON.parse(Data).interested_in || "Không Có Dữ Liệu",
    location: JSON.parse(Data).location || "Không Có Dữ Liệu",
    locale: JSON.parse(Data).locale || "Không Có Dữ Liệu",
    relationship_status: JSON.parse(Data).relationship_status || "Không Có Dữ Liệu",
    love: JSON.parse(Data).significant_other || "Không Có Dữ Liệu",
    website: JSON.parse(Data).website || "Không Có Dữ Liệu",
    quotes: JSON.parse(Data).quotes || "Không Có Dữ Liệu",
    timezone: JSON.parse(Data).timezone || "Không Có Dữ Liệu",
    updated_time: JSON.parse(Data).updated_time || "Không Có Dữ Liệu"
  };
  return Format;
}
//HORIZON