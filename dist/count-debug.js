define("kirin/common/1.0.0/count-debug", [ "jquery/jquery/1.7.2/jquery-debug" ], function(require, exports, module) {
    var $ = require("jquery/jquery/1.7.2/jquery-debug");
    var srcNode, messageTrigger = $("#global-header-msg .global-toplink-msg");
    var Count = {
        count: 0,
        setCount: function(count) {
            this.count = count;
            if (count > 99) {
                count = "99+";
            }
            if (count == 0) {
                messageTrigger.removeClass("global-toplink-msg-active");
            } else {
                messageTrigger.addClass("global-toplink-msg-active");
            }
            getCountNode().html(count).removeClass("fn-hide");
        },
        getCount: function() {
            return this.count;
        },
        hideCount: function() {
            messageTrigger.removeClass("global-toplink-msg-active");
            getCountNode().addClass("fn-hide");
        }
    };
    module.exports = Count;
    // Helper
    function getCountNode() {
        if (!srcNode) {
            srcNode = $('<span class="global-toplink-msgCount"></span>').addClass("fn-hide").appendTo(messageTrigger);
        }
        return srcNode;
    }
});
