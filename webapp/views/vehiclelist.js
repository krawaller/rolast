rolapp.addView("VehicleListView",{
	events: {
		"click .vehiclelistitemview": "clickedVehicle"
	},
	render: function(){
		this.setUIFromTemplate("vehiclelist");
		_.each(rolapp.getVehicles(),function(v){
			var view = new rolapp.VehicleListItemView(v);
			console.log("U AM PUBVLISHING",this.cid);
			this.ui.vehiclelist.publishSubView(view.render());
		},this);
		return this;
	},
	clickedVehicle: function(e){
		var el = $(e.currentTarget),
			id = el.attr("data-vehicleid"),
			vehicle = rolapp.getVehicle(id),
			view = new rolapp.VehicleView(vehicle);
		this.stackView( view.render() );
	}
});