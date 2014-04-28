define(function(require, exports, module) {
  var $ = require("$");
  var Dropdown = require("./dropdown");
  var Handlebars = require("handlebars");
  var balanceReady = false;
  var global = window.GLOBAL || {};
  var URLCONFIG = {
    balanceurl: global.system.personal + '/ajax/balance/getBalance.json?_callback=?'
  };
  var Balance = Dropdown.extend({
    events: {
      'click #global-refresh-balance': 'refresh'
    },
    setup: function() {
      Balance.superclass.setup.call(this);
    },
    show: function() {
      var balanceList = this.$('#global-list-more');
      // 浮层显示的时候才去请求关联账号，只请求一次
      if (!balanceReady) {
        balanceReady = true;
        $.ajax(URLCONFIG.balanceurl, {
          dataType: 'jsonp'
        }).success(function(data) {
          if (data.stat != 'ok') {
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
      var balanceList = this.$('#global-list-more');
      balanceList.html('').addClass('global-loading');
      $.ajax(URLCONFIG.balanceurl, {
        dataType: 'jsonp'
      }).success(function(data) {
        if (data.stat != 'ok') {
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
    var i = 0, infoModel = {infos: model.infos};
    var template = Handlebars.compile('{{#infos}}<li><div>
                        <span class="app" title="{{{app}}}">
                          {{{app}}}: 
                        </span>
                        <span class="amount">
                          <i class="iconfont amount"></i>
                          {{{balance}}}
                        </span>
                      </div></li>{{/infos}}');
    parentNode.html(template(infoModel)).removeClass('global-loading');
  }
});
