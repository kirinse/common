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
