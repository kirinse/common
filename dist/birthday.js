define("kirin/common/1.0.0/birthday",["jquery","widget","base","swfobject","cookie"],function(a,b,c){function d(){var a=i.today,b={"01":"20","02":"19","03":"21","04":"21","05":"21","06":"22","07":"23","08":"23","09":"23",10:"23",11:"22",12:"22"},c=a.slice(-4,-2),d=a.slice(-2);return Number(d)<Number(b[c])&&(c=Number(c)-1,0==c&&(c=12)),/^\d{2}$/.test(c)?c+"":"0"+c}function e(){return i.birthday&&i.today.slice(4)===i.birthday}a("jquery");var f=a("widget"),g=a("swfobject"),h=a("cookie"),i=window.GLOBAL||{},j=f.extend({param:{param:d(),mode:1},Statics:{isBirthday:e()},events:{"hover .global-birth-icon":"toggleTip","click .global-birth-icon":function(a){a.preventDefault(),this.showFlash(1)}},setup:function(){this.firstShow()},toggleTip:function(a){"mouseenter"==a.type?this.$(".global-birth-tip").show():this.$(".global-birth-tip").hide()},showFlash:function(a){var b=this.$("#global-birthSwf");if(!b.hasClass("global-swfObj")){this.param.mode=a,b.addClass("global-swfObj");var c={wmode:"transparent",allowFullscreen:"true",allowScriptAccess:"always"};g.embedSWF(i.BIRTHURL+"?t="+(new Date).getTime(),"global-swfObj","350","300","9.0.0","expressInstall.swf",{},c)}},hideFlash:function(){var a=this.$("#global-birthSwf");a.hasClass("global-swfObj")&&a.removeClass("global-swfObj").html('<div id="global-swfObj"></div>')},firstShow:function(){var a=h.get("global-birthshow");a||(this.$(".global-birth-tip").show(),h.set("global-birthshow","true",{expires:1,path:"/"}))}});c.exports=j});
