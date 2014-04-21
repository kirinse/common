define(["popup", "jquery", "overlay", "position", "iframe-shim", "widget", "base","./count", "./message", "templatable", "handlebars", "./account", "xbox", "mask", "./birthday", "swfobject", "cookie", "./robot"], function(require, exports, module) {
  module.exports.Count = require("./count");
  module.exports.Message = require("./message");
  module.exports.Account = require("./account");
  module.exports.Birthday = require("./birthday");
  module.exports.Robot = require("./robot");
  module.exports.Dropdown = require("./dropdown");
});
