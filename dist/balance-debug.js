define("kirin/common/1.0.0/balance-debug", [ "jquery/jquery/1.7.2/jquery-debug", "./dropdown-debug", "arale/popup/1.1.6/popup-debug", "$-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "gallery/handlebars/1.0.2/handlebars-debug" ], function(require, exports, module) {
    var $ = require("jquery/jquery/1.7.2/jquery-debug");
    var Dropdown = require("./dropdown-debug");
    var Handlebars = require("gallery/handlebars/1.0.2/handlebars-debug");
    var balanceReady = false;
    var global = window.GLOBAL || {};
    var URLCONFIG = {
        balanceurl: global.system.personal + "/ajax/balance/getBalance.json?_callback=?"
    };
    var Balance = Dropdown.extend({
        events: {
            "click #global-refresh-balance": "refresh"
        },
        setup: function() {
            Balance.superclass.setup.call(this);
        },
        show: function() {
            var balanceList = this.$("#global-list-more");
            // 浮层显示的时候才去请求关联账号，只请求一次
            if (!balanceReady) {
                balanceReady = true;
                $.ajax(URLCONFIG.balanceurl, {
                    dataType: "jsonp"
                }).success(function(data) {
                    if (data.stat != "ok") {
                        balanceReady = false;
                        balanceList.hide();
                        return;
                    }
                    balanceReady = true;
                    renderBalance(data, balanceList);
                }).error(function() {
                    balanceReady = false;
                    balanceList.hide();
                });
            }
            return Balance.superclass.show.call(this);
        },
        refresh: function(e) {
            e.preventDefault();
            var balanceList = this.$("#global-list-more");
            balanceList.addClass("global-loading");
            $.ajax(URLCONFIG.balanceurl, {
                dataType: "jsonp"
            }).success(function(data) {
                if (data.stat != "ok") {
                    balanceReady = false;
                    balanceList.hide();
                    return;
                }
                balanceReady = true;
                renderBalance(data, balanceList);
            }).error(function() {
                balanceReady = false;
                balanceList.hide();
            });
        }
    });
    module.exports = Balance;
    // Helper
    // ------
    function renderBalance(model, parentNode) {
        var i = 0, infoModel = {
            infos: model.infos
        };
        var template = Handlebars.compile('{{#infos}}<li><div>\n                        <span class="app" title="{{{app}}}">\n                          {{{app}}}: \n                        </span>\n                        <span class="amount">\n                          <i class="iconfont amount"></i>\n                          {{{balance}}}\n                        </span>\n                      </div></li>{{/infos}}');
        parentNode.html(template(infoModel)).removeClass("global-loading");
    }
});

define("kirin/common/1.0.0/dropdown-debug", [ "arale/popup/1.1.6/popup-debug", "$-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var Popup = require("arale/popup/1.1.6/popup-debug");
    var Dropdown = Popup.extend({
        setup: function() {
            Dropdown.superclass.setup.call(this);
            this._tweakAlignDefaultValue();
        },
        // 调整 align 属性的默认值
        _tweakAlignDefaultValue: function() {
            var align = this.get("align");
            // 默认坐标在目标元素左下角
            if (align.baseXY.toString() === [ 0, 0 ].toString()) {
                align.baseXY = [ 0, "100%" ];
            }
            // 默认基准定位元素为 trigger
            if (align.baseElement._id === "VIEWPORT") {
                align.baseElement = this.get("trigger");
            }
            this.set("align", align);
        }
    });
    module.exports = Dropdown;
});
