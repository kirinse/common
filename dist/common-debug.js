define("kirin/common/1.0.0/common-debug", [ "./count-debug", "jquery/jquery/1.7.2/jquery-debug", "./message-debug", "arale/templatable/0.9.2/templatable-debug", "$-debug", "gallery/handlebars/1.0.2/handlebars-debug", "./dropdown-debug", "arale/popup/1.1.6/popup-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "./account-debug", "alipay/xbox/1.0.3/xbox-debug", "./birthday-debug", "gallery/swfobject/2.2.0/swfobject-debug", "arale/cookie/1.0.2/cookie-debug", "./robot-debug", "./balance-debug" ], function(require, exports, module) {
    module.exports.Count = require("./count-debug");
    module.exports.Message = require("./message-debug");
    module.exports.Account = require("./account-debug");
    module.exports.Birthday = require("./birthday-debug");
    module.exports.Robot = require("./robot-debug");
    module.exports.Dropdown = require("./dropdown-debug");
    module.exports.Balance = require("./balance-debug");
    module.exports.Popup = require("arale/popup/1.1.6/popup-debug");
    module.exports.Xbox = require("alipay/xbox/1.0.3/xbox-debug");
});

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

define("kirin/common/1.0.0/message-debug", [ "jquery/jquery/1.7.2/jquery-debug", "arale/templatable/0.9.2/templatable-debug", "$-debug", "gallery/handlebars/1.0.2/handlebars-debug", "kirin/common/1.0.0/dropdown-debug", "arale/popup/1.1.6/popup-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "kirin/common/1.0.0/count-debug" ], function(require, exports, module) {
    var $ = require("jquery/jquery/1.7.2/jquery-debug");
    var Templatable = require("arale/templatable/0.9.2/templatable-debug");
    var Dropdown = require("kirin/common/1.0.0/dropdown-debug");
    var Handlebars = require("gallery/handlebars/1.0.2/handlebars-debug");
    var Position = require("arale/position/1.0.1/position-debug");
    var Count = require("kirin/common/1.0.0/count-debug");
    var global = window.GLOBAL || {}, messageReady = false;
    var URLCONFIG = {
        redirecturl: /*global.system.personal + */ "/app/kirinResource/messageCenter/modifyStatusAndRedirect.html",
        getmessage: /*global.system.personal + */ "/app/kirinResource/messageCenter/getMsgInfosNew",
        popmessage: /*global.system.personal + */ "/app/kirinResource/messageCenter/popMsgInfos",
        readmessage: /*global.system.personal + */ "/app/kirinResource/messageCenter/readMsg?&historySource=I&msgIds="
    };
    var Message = Dropdown.extend({
        Implements: Templatable,
        Statics: {
            getMessageCount: getMessageCount
        },
        events: {
            "click #global-msg-isee": "markAllRead",
            "click #global-list-msg a.global-list-msg-content": function(e) {
                // 标记单条消息为已读
                setMsgRead.call(this, e.currentTarget);
            },
            "click #global-list-msg a.global-list-close": "markRead",
            "click #global-msg-confirm-ok": "confirmOk",
            "click #global-msg-confirm-cancel": "confirmCancel",
            "mouseenter .global-list li": function(e) {
                $(e.currentTarget).addClass("global-list-hover");
            },
            "mouseleave .global-list li": function(e) {
                $(e.currentTarget).removeClass("global-list-hover");
            }
        },
        show: function() {
            var that = this;
            if (!messageReady) {
                $.ajax(URLCONFIG.popmessage, {
                    dataType: "json"
                }).success(function(data) {
                    if (data.stat !== "ok") {
                        return;
                    }
                    Count.setCount(data.totalCount);
                    that.renderMsg(data);
                });
            }
            // 如果消息数为 0 则不显示浮层
            if (Count.getCount() > 0) {
                return Message.superclass.show.call(this);
            } else {
                return this;
            }
        },
        // 局部渲染消息列表，此方法只执行一次
        renderMsg: function(data) {
            if (!messageReady) {
                this.$(".global-toplink-msgCount").html(data.totalCount);
                this.$("#global-list-msg").html(renderMessage(data)).removeClass("global-loading");
                messageReady = true;
            }
            return this;
        },
        // 以下为事件回调方法
        // ------------------
        // 标记所有为已读
        markAllRead: function(e) {
            e.preventDefault();
            Count.setCount(0);
            var msgIds = this.$("#global-list-msg li").map(function() {
                return $(this).attr("data-id");
            }).get().join(",");
            this.hide();
            this.$("#global-list-msg").html();
            $.ajax(URLCONFIG.readmessage + msgIds, {
                dataType: "json"
            });
        },
        // 标记单条消息为已读
        markRead: function(e) {
            var ele = e.currentTarget, parentNode = $(ele).parent();
            var msgConfirm = this.$("#global-msg-confirm");
            var msgId = parentNode.attr("data-id");
            // `this.currentConfirmMsg` 储存了需要二次确认的消息的 DOM，每次显示二次确认浮层
            // 才会储存，点击取消或 level 小于3的消息时会清空
            if (this.currentConfirmMsg) {
                $(this.currentConfirmMsg).parent().css("height", "auto");
                this.currentConfirmMsg = null;
            }
            // level 为3会显示二次确认浮层
            if (parentNode.attr("data-level") == 3) {
                this.currentConfirmMsg = ele;
                parentNode.css("height", msgConfirm.height() - 16);
                msgConfirm.show();
                Position.pin(msgConfirm[0], parentNode[0]);
            } else {
                msgConfirm.hide();
                setMsgRead.call(this, ele);
                $.ajax(URLCONFIG.readmessage + msgId, {
                    dataType: "json"
                });
            }
        },
        // 二次确认浮层，确定按钮
        confirmOk: function(e) {
            e.preventDefault();
            var msgId = $(this.currentConfirmMsg).parent().attr("data-id");
            this.$("#global-msg-confirm").hide();
            setMsgRead.call(this, this.currentConfirmMsg);
            $.ajax(URLCONFIG.readmessage + msgId, {
                dataType: "json"
            });
        },
        // 二次确认浮层，取消按钮
        confirmCancel: function(e) {
            e.preventDefault();
            $(this.currentConfirmMsg).parent().css("height", "auto");
            this.currentConfirmMsg = null;
            this.$("#global-msg-confirm").hide();
        }
    });
    module.exports = Message;
    // Helper
    // ------
    // 获取消息数
    function getMessageCount(callback) {
        $.ajax(URLCONFIG.getmessage, {
            dataType: "json"
        }).success(function(data) {
            if (data.stat === "ok") {
                var totalCount = parseInt(data.totalCount, 10);
                Count.setCount(totalCount);
                callback(data);
            } else {
                Count.hideCount();
            }
        });
    }
    function sortMessage(list) {
        return list.sort(function(a, b) {
            // 消息级别高的排前
            return b.level - a.level;
        });
    }
    // 渲染消息模版
    function renderMessage(model) {
        var i = 0, infoModel = {
            infos: sortMessage(model.infos)
        };
        var template = Handlebars.compile('{{#infos}}<li class="{{messageClass}} global-list-level{{level}}" data-id="{{id}}" data-level="{{level}}">{{{messageContent this}}}<a href="javascript:void(0);" class="global-list-close" seed="global-msg-close">X</a></li>{{/infos}}');
        // 只显示最近三条消息
        Handlebars.registerHelper("messageClass", function() {
            if (i++ >= 3) {
                return "fn-hide";
            } else {
                return "";
            }
        });
        Handlebars.registerHelper("messageContent", function(context) {
            var url = context.url;
            var content = context.content.length > 46 ? context.content.replace(/^(.{43}).*$/, "$1...") : context.content;
            if (/^(http|https)/i.test(url)) {
                url = URLCONFIG.redirecturl + "?msgId=" + context.id + "&url=" + url;
                return '<a href="' + url + '" target="_blank" class="global-list-msg-content" seed="global-msg-item">' + content + "</a>";
            } else {
                return '<span class="global-list-msg-content">' + content + "</span>";
            }
        });
        return template(infoModel);
    }
    // 设置某条记录已读
    function setMsgRead(element) {
        var msgCount = this.$(".global-toplink-msgCount");
        var msgList = this.$("#global-list-msg");
        var count = msgList.children().length;
        msgCount.html(count - 1);
        Count.setCount(count - 1);
        if (count > 3) {
            msgList.children(".fn-hide:first").removeClass("fn-hide");
        }
        $(element).parent().hide(400, "swing", function() {
            $(this).remove();
        });
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

define("kirin/common/1.0.0/account-debug", [ "jquery/jquery/1.7.2/jquery-debug", "kirin/common/1.0.0/dropdown-debug", "arale/popup/1.1.6/popup-debug", "$-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "gallery/handlebars/1.0.2/handlebars-debug", "alipay/xbox/1.0.3/xbox-debug" ], function(require, exports, module) {
    var $ = require("jquery/jquery/1.7.2/jquery-debug");
    var Dropdown = require("kirin/common/1.0.0/dropdown-debug");
    var Handlebars = require("gallery/handlebars/1.0.2/handlebars-debug");
    var Xbox = require("alipay/xbox/1.0.3/xbox-debug");
    var accountReady = false;
    var global = window.GLOBAL || {};
    var URLCONFIG = {
        loginurl: "/login/xbox.htm?loginScene=x&change=true&logonId=",
        accounturl: "/home/statusbar/getRelativeAccounts.json?_callback=?"
    };
    var Account = Dropdown.extend({
        events: {
            "click .global-xbox-item": "changeLogin"
        },
        setup: function() {
            Account.superclass.setup.call(this);
            // 对过长的账号进行处理
            var email = this.$("#global-username");
            email.html(limitEmail(email.html()));
            limitName(this.get("trigger").find("#global-toplink-username"));
        },
        show: function() {
            var accountList = this.$("#global-users");
            // 浮层显示的时候才去请求关联账号，只请求一次
            if (accountList.attr("data-user") === "true" && !accountReady) {
                accountReady = true;
                $.ajax(URLCONFIG.accounturl, {
                    dataType: "json"
                }).success(function(data) {
                    if (data.stat != "ok") {
                        accountReady = false;
                        accountList.hide();
                        return;
                    }
                    accountReady = true;
                    renderAccount(data, accountList.find("#global-list-user"));
                }).error(function() {
                    accountReady = false;
                    accountList.hide();
                });
            }
            return Account.superclass.show.call(this);
        },
        changeLogin: function(e) {
            e.preventDefault();
            getXbox().set("content", e.currentTarget.href).show();
        }
    });
    module.exports = Account;
    // Helper
    // ------
    // 限制 email 的长度，整个字符最长为19，@ 字符左边最长11，右边7
    function limitEmail(text) {
        text = text.replace(/^\s*(.*?)\s*$/g, "$1");
        var defaults = {
            regxp: /(^.*)(.{3}$)/g,
            placeholder: "$1...",
            leftLimit: 11,
            rightLimit: 7,
            totalLimit: 19
        };
        var list = text.split("@");
        var left = list[0];
        var right = list[1];
        if (list.length > 1 && text.length > defaults.totalLimit) {
            if (left.length > defaults.leftLimit) {
                left = left.slice(0, defaults.leftLimit).replace(defaults.regxp, defaults.placeholder);
            }
            if (right.length > defaults.rightLimit) {
                right = right.slice(0, defaults.rightLimit).replace(defaults.regxp, defaults.placeholder);
            }
            return [ left, "@", right ].join("").toLowerCase();
        } else {
            return text.toLowerCase();
        }
    }
    function limitName(ele) {
        if (ele && ele.outerWidth() > 147) {
            var realText = ele.html();
            var userText = limitEmail(realText);
            if (userText.length === realText.length) {
                userText = userText.slice(0, 10) + "...";
            }
            ele.html(userText);
        }
    }
    var xbox;
    function getXbox() {
        if (!xbox) {
            xbox = new Xbox({
                width: 720
            }).render();
        }
        return xbox;
    }
    function renderAccount(data, parentNode) {
        var i = 0;
        Handlebars.registerHelper("accountContent", function() {
            var name = limitEmail(this);
            var url = URLCONFIG.loginurl + this;
            // 最多显示10个账户
            if (i++ < 10) {
                return '<li><a href="' + url + '" class="global-xbox-item" target="_blank" title="' + this + '">' + name + "</a></li>";
            }
        });
        var template = Handlebars.compile("{{#accts}}{{{accountContent}}}{{/accts}}");
        parentNode.html(template(data)).removeClass("global-loading");
    }
});

define("kirin/common/1.0.0/birthday-debug", [ "jquery/jquery/1.7.2/jquery-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "$-debug", "gallery/swfobject/2.2.0/swfobject-debug", "arale/cookie/1.0.2/cookie-debug" ], function(require, exports, module) {
    var $ = require("jquery/jquery/1.7.2/jquery-debug");
    var Widget = require("arale/widget/1.1.1/widget-debug");
    var swfobject = require("gallery/swfobject/2.2.0/swfobject-debug");
    var Cookie = require("arale/cookie/1.0.2/cookie-debug");
    var global = window.GLOBAL || {};
    var Birthday = Widget.extend({
        param: {
            param: getZodiacMonth(),
            // flash 飞出的方向，向左1/向右0
            mode: 1
        },
        Statics: {
            isBirthday: isBirthday
        },
        events: {
            "hover .global-birth-icon": "toggleTip",
            "click .global-birth-icon": function(e) {
                e.preventDefault();
                this.showFlash(1);
            }
        },
        setup: function() {
            this.firstShow();
        },
        toggleTip: function(e) {
            if (e.type == "mouseenter") {
                this.$(".global-birth-tip").show();
            } else {
                this.$(".global-birth-tip").hide();
            }
        },
        showFlash: function(mode) {
            var birthSwf = this.$("#global-birthSwf");
            if (birthSwf.hasClass("global-swfObj")) {
                return;
            }
            this.param.mode = mode;
            birthSwf.addClass("global-swfObj");
            var params = {
                wmode: "transparent",
                allowFullscreen: "true",
                allowScriptAccess: "always"
            };
            swfobject.embedSWF(global.BIRTHURL + "?t=" + new Date().getTime(), "global-swfObj", "350", "300", "9.0.0", "expressInstall.swf", {}, params);
        },
        hideFlash: function() {
            var birthSwf = this.$("#global-birthSwf");
            if (birthSwf.hasClass("global-swfObj")) {
                birthSwf.removeClass("global-swfObj").html('<div id="global-swfObj"></div>');
            }
        },
        firstShow: function() {
            var key = Cookie.get("global-birthshow");
            if (!key) {
                this.$(".global-birth-tip").show();
                Cookie.set("global-birthshow", "true", {
                    expires: 1,
                    path: "/"
                });
            }
        }
    });
    module.exports = Birthday;
    // Helper
    // 获取月份，用于显示星座，传给flash的参数为星座第一天所在的月份
    function getZodiacMonth() {
        var today = global.today;
        var zodiac = {
            "01": "20",
            "02": "19",
            "03": "21",
            "04": "21",
            "05": "21",
            "06": "22",
            "07": "23",
            "08": "23",
            "09": "23",
            "10": "23",
            "11": "22",
            "12": "22"
        };
        var month = today.slice(-4, -2), day = today.slice(-2);
        if (Number(day) < Number(zodiac[month])) {
            month = Number(month) - 1;
            if (month == 0) {
                month = 12;
            }
        }
        return /^\d{2}$/.test(month) ? month + "" : "0" + month;
    }
    // 检测当天是否是用户生日
    function isBirthday(birthday) {
        return birthday && global.today.slice(4) === birthday;
    }
});

define("kirin/common/1.0.0/robot-debug", [ "jquery/jquery/1.7.2/jquery-debug", "arale/templatable/0.9.2/templatable-debug", "$-debug", "gallery/handlebars/1.0.2/handlebars-debug", "kirin/common/1.0.0/dropdown-debug", "arale/popup/1.1.6/popup-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("jquery/jquery/1.7.2/jquery-debug");
    var Templatable = require("arale/templatable/0.9.2/templatable-debug");
    var Dropdown = require("kirin/common/1.0.0/dropdown-debug");
    var Handlebars = require("gallery/handlebars/1.0.2/handlebars-debug");
    var robotReady = false;
    var global = window.GLOBAL || {};
    var URLCONFIG = {
        roboturl: "/portal/robot/getRobotData.json?_callback=?"
    };
    var Robot = Dropdown.extend({
        Implements: Templatable,
        templateHelpers: {
            // 安全度的值和进度条
            securityContent: function() {
                if (this.securityLevel === "LOW") {
                    return new Handlebars.SafeString('<span class="global-robot-red">低</span>');
                } else if (this.securityLevel === "MEDIUM") {
                    return new Handlebars.SafeString('<span class="global-robot-red">中</span>');
                } else if (this.securityLevel === "HIGH") {
                    return "高";
                } else if (this.securityLevel === "MAX") {
                    return "极高";
                }
            },
            securityPercent: function() {
                var percent = 0;
                // 已绑定手机加 40%
                if (this.isBindedMobile) {
                    percent += 40;
                }
                // 安全等级为 HIGH, MAX 加 60%
                if (this.securityLevel === "HIGH" || this.securityLevel === "MAX") {
                    percent += 60;
                }
                return (percent || "2") + "%";
            },
            // 便捷度的值和进度条
            convenientContent: function() {
                if (this.fpCount > 0) {
                    return "快";
                } else {
                    return new Handlebars.SafeString('<span class="global-robot-red">慢</span>');
                }
            },
            convenientPercent: function() {
                if (this.fpCount > 0) {
                    return "100%";
                } else {
                    return "2%";
                }
            },
            // 完整度的值和进度条
            completeContent: function() {
                var percent = completePercent(this);
                if (percent <= 40) {
                    return new Handlebars.SafeString('<span class="global-robot-red">' + percent + "%</span>");
                } else {
                    return (percent || "2") + "%";
                }
            },
            completePercent: function() {
                return completePercent(this) + "%";
            },
            robotPart: function(part) {
                var p = part.split("-")[0];
                var className = "global-robot-" + part;
                switch (p) {
                  case "head":
                    if (this.isComplete) {
                        className += " global-robot-" + part + "-active";
                    }
                    break;

                  case "ear":
                    if (this.isBindedMobile) {
                        className += " global-robot-" + part + "-active";
                    }
                    break;

                  case "arm":
                  case "leg":
                    if (this.fpCount > 0) {
                        className += " global-robot-" + part + "-active";
                    }
                    break;

                  case "body":
                    if (this.securityLevel === "HIGH" || this.securityLevel === "MAX") {
                        className += " global-robot-" + part + "-active";
                    }
                    break;

                  case "heart":
                    if (this.isCertified) {
                        className += " global-robot-" + part + "-active";
                    }
                    break;
                }
                return className;
            }
        },
        model: {
            // 登录时且请求还未返回显示 loading 状态
            loading: true
        },
        initAttrs: function(config) {
            Robot.superclass.initAttrs.call(this, config);
            // 未登录的情况下不用再请求
            if (!this.model.isLogin) {
                this.model.loading = false;
                robotReady = true;
            }
        },
        show: function() {
            var that = this;
            if (!robotReady) {
                robotReady = true;
                $.ajax(URLCONFIG.roboturl, {
                    dataType: "json"
                }).success(function(data) {
                    if (data.stat != "ok") {
                        Robot.superclass.show.call(that);
                        robotReady = false;
                        return;
                    }
                    robotReady = true;
                    // this.model 的值
                    // ---------------
                    // isLogin 是否登录
                    // isComplete 补全信息(支付密码): true
                    // isBindedMobile 手机绑定: false
                    // isCertified 实名认证: true
                    // securityLevel 安全等级: LOW,MEDIUM,HIGH,MAX
                    // fpCount 快捷卡数量
                    // questions 安保问题: 0,1,3
                    // activedEmail 激活的邮箱：T,F
                    $.extend(that.model, {
                        isSuccess: true
                    }, data);
                    that.renderPartial(".global-robot");
                }).error(function() {
                    robotReady = false;
                });
            }
            Robot.superclass.show.call(that);
            return this;
        }
    });
    module.exports = Robot;
    // Helper
    // ------
    // 完整度的计算
    function completePercent(data) {
        var percent = 0;
        // 已补全信息加 20%
        if (data.isComplete) {
            percent += 20;
        }
        // 已绑定手机加 20%
        if (data.isBindedMobile) {
            percent += 20;
        }
        // 已实名认证加 20%
        if (data.isCertified) {
            percent += 20;
        }
        // 有3个安保问题加 20%
        if (data.questions == 3) {
            percent += 20;
        }
        // 已激活邮箱加 20%
        if (data.activedEmail == "T") {
            percent += 20;
        }
        return percent;
    }
});

define("kirin/common/1.0.0/balance-debug", [ "jquery/jquery/1.7.2/jquery-debug", "kirin/common/1.0.0/dropdown-debug", "arale/popup/1.1.6/popup-debug", "$-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "gallery/handlebars/1.0.2/handlebars-debug" ], function(require, exports, module) {
    var $ = require("jquery/jquery/1.7.2/jquery-debug");
    var Dropdown = require("kirin/common/1.0.0/dropdown-debug");
    var Handlebars = require("gallery/handlebars/1.0.2/handlebars-debug");
    var balanceReady = false;
    var global = window.GLOBAL || {};
    var URLCONFIG = {
        balanceurl: /*global.system.personal + */ "/app/kirinResource/funds/getBalance"
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
                    dataType: "json"
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
            balanceList.html("").addClass("global-loading");
            $.ajax(URLCONFIG.balanceurl, {
                dataType: "json"
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
        var template = Handlebars.compile('{{#infos}}<li><div><span class="app" title="{{{app}}}">{{{app}}}:</span><span class="amount"><i class="iconfont amount"></i>{{{balance}}}</span></div></li>{{/infos}}');
        parentNode.html(template(infoModel)).removeClass("global-loading");
    }
});
