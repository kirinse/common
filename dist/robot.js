define("kirin/common/1.0.0/robot",["jquery/jquery/1.7.2/jquery","arale/templatable/0.9.2/templatable","$","gallery/handlebars/1.0.2/handlebars","./dropdown","arale/popup/1.1.6/popup","arale/overlay/1.1.4/overlay","arale/position/1.0.1/position","arale/iframe-shim/1.0.2/iframe-shim","arale/widget/1.1.1/widget","arale/base/1.1.1/base","arale/class/1.1.0/class","arale/events/1.1.0/events"],function(a,b,c){function d(a){var b=0;return a.isComplete&&(b+=20),a.isBindedMobile&&(b+=20),a.isCertified&&(b+=20),3==a.questions&&(b+=20),"T"==a.activedEmail&&(b+=20),b}var e=a("jquery/jquery/1.7.2/jquery"),f=a("arale/templatable/0.9.2/templatable"),g=a("./dropdown"),h=a("gallery/handlebars/1.0.2/handlebars"),i=!1,j=window.GLOBAL||{},k={roboturl:j.system.personalportal+"/portal/robot/getRobotData.json?_callback=?"},l=g.extend({Implements:f,templateHelpers:{securityContent:function(){return"LOW"===this.securityLevel?new h.SafeString('<span class="global-robot-red">低</span>'):"MEDIUM"===this.securityLevel?new h.SafeString('<span class="global-robot-red">中</span>'):"HIGH"===this.securityLevel?"高":"MAX"===this.securityLevel?"极高":void 0},securityPercent:function(){var a=0;return this.isBindedMobile&&(a+=40),("HIGH"===this.securityLevel||"MAX"===this.securityLevel)&&(a+=60),(a||"2")+"%"},convenientContent:function(){return this.fpCount>0?"快":new h.SafeString('<span class="global-robot-red">慢</span>')},convenientPercent:function(){return this.fpCount>0?"100%":"2%"},completeContent:function(){var a=d(this);return 40>=a?new h.SafeString('<span class="global-robot-red">'+a+"%</span>"):(a||"2")+"%"},completePercent:function(){return d(this)+"%"},robotPart:function(a){var b=a.split("-")[0],c="global-robot-"+a;switch(b){case"head":this.isComplete&&(c+=" global-robot-"+a+"-active");break;case"ear":this.isBindedMobile&&(c+=" global-robot-"+a+"-active");break;case"arm":case"leg":this.fpCount>0&&(c+=" global-robot-"+a+"-active");break;case"body":("HIGH"===this.securityLevel||"MAX"===this.securityLevel)&&(c+=" global-robot-"+a+"-active");break;case"heart":this.isCertified&&(c+=" global-robot-"+a+"-active")}return c}},model:{loading:!0},initAttrs:function(a){l.superclass.initAttrs.call(this,a),this.model.isLogin||(this.model.loading=!1,i=!0)},show:function(){var a=this;return i||(i=!0,e.ajax(k.roboturl,{dataType:"jsonp"}).success(function(b){return"ok"!=b.stat?(l.superclass.show.call(a),i=!1,void 0):(i=!0,e.extend(a.model,{isSuccess:!0},b),a.renderPartial(".global-robot"),void 0)}).error(function(){i=!1})),l.superclass.show.call(a),this}});c.exports=l}),define("kirin/common/1.0.0/dropdown",["arale/popup/1.1.6/popup","$","arale/overlay/1.1.4/overlay","arale/position/1.0.1/position","arale/iframe-shim/1.0.2/iframe-shim","arale/widget/1.1.1/widget","arale/base/1.1.1/base","arale/class/1.1.0/class","arale/events/1.1.0/events"],function(a,b,c){var d=a("arale/popup/1.1.6/popup"),e=d.extend({setup:function(){e.superclass.setup.call(this),this._tweakAlignDefaultValue()},_tweakAlignDefaultValue:function(){var a=this.get("align");a.baseXY.toString()===[0,0].toString()&&(a.baseXY=[0,"100%"]),"VIEWPORT"===a.baseElement._id&&(a.baseElement=this.get("trigger")),this.set("align",a)}});c.exports=e});
