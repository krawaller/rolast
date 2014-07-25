rolapp.BaseView = Backbone.View.extend({
	initialize: function(o,flag){
		this.initdata = o;
		this.flag=flag;
		this.$el.addClass(flag?"withflag withflag"+flag:"noflag");
		if (this.setup){ this.setup(); }
	},
	fillFromTemplate: function(){
		this.$el.html(this.template);
	},
	setUI: function(str){
		_.each(str.split(" "),function(cls){
			var self = this;
			self.ui[cls] = self.$("."+cls);
			self.ui[cls].publishSubView = function(v){
				self.views.push(v);
				self.ui[cls].append(v.el);
			};
		},this);
	},
	setUIFromTemplate: function(str){
		this.fillFromTemplate();
		this.setUI(str);
	},
	kill: function(){
		_.each(this.views || [],function(v){ v.kill(); });
		this.remove();
	}
});