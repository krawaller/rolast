rolapp.addView("VehicleView",{
	events: {
		"click button.calcweight": "calcWeight",
		"click button.coupling": "makeTrain"
	},
	calcWeight: function(){
		var result = rolast.calculate(rolast.calculations.maxVehicleLoadForAllRoads, this.initdata ),
			view = new rolapp.ResultView(result);
		this.stackView(view.render());
	},
	makeTrain: function(){
		var trains = _.map(this.initdata.trainmatches,function(v){ return rolast.buildTrain(this.initdata,v); },this),
			view = new rolapp.TrainSelectView(trains);
		this.stackView(view.render());

	},
	render: function(){
		this.setUIFromTemplate("drawing coupling");
		var drawing = new rolapp.VehicleListItemView(this.initdata);
		this.ui.drawing.publishSubView(drawing.render());
		if (!this.initdata.trainmatches.length){
			this.ui.coupling.attr("disabled","disabled");
		}
		return this;
	}
});