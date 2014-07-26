rolapp.MainView = Backbone.View.extend({
	events: {
		"click #backone": "popView",
		"click #backall": "popAllViews"
	},
	stack: [],
	className: "mainview",
	template: $("#mainviewtemplate").html(),
	render: function(){
		this.$el.html(this.template);
		var list = new rolapp.VehicleListView();
		this.web(list);
		list.render();
		list.$el.appendTo(this.$el);
		return this;
	},
	updateBackButton: function(){
		console.log("update back button",this.stack)
		switch(Math.min(this.stack.length,2)){
			case 0: this.$el.removeClass("multiback singleback"); break;
			case 1: this.$el.addClass("singleback").removeClass("multiback"); break;
			case 2: this.$el.addClass("multiback").removeClass("singleback"); break;
		}
	},
	web: function(view){
		this.listenTo(view,"stack",this.stackView,this);
	},
	stackView: function(view){
		view.$el.addClass("stackedright");
		this.stack.push(view);
		this.updateBackButton();
		console.log("stacked!",this.stack.length);
		//view.$el.prepend("<div class='topbar'><button class='backbutton'>Tillbaka</button></div>");
		this.$el.append(view.el);
		_.delay(function(){
			view.$el.removeClass("stackedright");
		},10);
		this.web(view);
	},
	popView: function(e,all){
		var v = this.stack.pop();
		v.$el.addClass("stackedright");
		_.delay(function(){ v.kill(); },150);
		if (!all){
			this.updateBackButton();
		}
	},
	popAllViews: function(){
		while(this.stack.length){
			this.popView(0,true);
		}
		this.updateBackButton();
	}
});