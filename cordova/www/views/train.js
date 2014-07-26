rolapp.addView("TrainSelectView",{
	events: {
		"click .vehiclelistitemview": "clickedTrain"
	},
	render: function(){
		this.setUIFromTemplate("trainlist");
		_.each(this.initdata,function(v,n){
			var view = new rolapp.VehicleListItemView(v);
			view.$el.attr("data-listindex",n);
			this.ui.trainlist.publishSubView(view.render());
		},this);
		return this;
	},
	clickedTrain: function(e){
		var el = $(e.currentTarget),
			index = parseInt(el.attr("data-listindex")),
			train = this.initdata[index],
			result = rolast.calculate(rolast.calculations.maxTrainLoadForAllRoads, train ),
			view = new rolapp.ResultView(result);
		this.stackView(view.render());
	}
});